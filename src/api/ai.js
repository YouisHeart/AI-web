import axios from '@/http/request.js'
import { getToken } from '@/composables/auth'

// AI 普通问答：保留原有接口
export function chatWithAI(data) {
    return axios.post('/ai/chat', data)
}

// AI 流式问答
export async function chatWithAIStream(data, onChunk, options = {}) {
    const apiBase = (import.meta.env.VITE_APP_BASE_API || '/api').replace(/\/$/, '')
    const token = getToken()

    const response = await fetch(`${apiBase}/ai/chat/stream`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'text/event-stream',
            ...(token ? { Authorization: token } : {})
        },
        body: JSON.stringify(data),
        signal: options.signal
    })

    if (!response.ok) {
        throw new Error(`AI 请求失败：HTTP ${response.status}`)
    }

    if (!response.body) {
        throw new Error('浏览器不支持流式响应')
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')

    let buffer = ''

    try {
        while (true) {
            const { value, done } = await reader.read()

            buffer += decoder.decode(value || new Uint8Array(), {
                stream: !done
            })

            // SSE 以空行分隔事件
            const events = buffer.split(/\r?\n\r?\n/)
            buffer = events.pop() || ''

            for (const eventText of events) {
                let eventName = 'message'
                const dataLines = []

                for (const line of eventText.split(/\r?\n/)) {
                    if (line.startsWith('event:')) {
                        eventName = line.slice(6).trim()
                    } else if (line.startsWith('data:')) {
                        dataLines.push(line.slice(5).replace(/^ /, ''))
                    }
                }

                const chunk = dataLines.join('\n')

                if (eventName === 'app-error') {
                    throw new Error(chunk || 'AI 服务调用失败')
                }

                if (chunk) {
                    onChunk(chunk)
                }
            }

            if (done) {
                // 处理最后一个没有以空行结尾的事件
                if (buffer.trim()) {
                    const data = buffer
                        .split(/\r?\n/)
                        .filter(line => line.startsWith('data:'))
                        .map(line => line.slice(5).replace(/^ /, ''))
                        .join('\n')

                    if (data) onChunk(data)
                }

                break
            }
        }
    } finally {
        reader.releaseLock()
    }
}
