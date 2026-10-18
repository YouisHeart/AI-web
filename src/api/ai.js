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

    const { message, conversationId } = data

    const response = await fetch(`${apiBase}/ai/chat/stream`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'text/event-stream',
            ...(token ? { Authorization: token } : {})
        },
        body: JSON.stringify({
            message,
            conversationId: conversationId || null
        }),
        signal: options.signal
    })

    if (!response.ok) {
        throw new Error(`请求失败: ${response.status}`)
    }

    // 🔑 关键：把后端返回的会话 id 回传给组件
    const newConversationId = response.headers.get('X-Conversation-Id')
    if (newConversationId) {
        localStorage.setItem('conversationId', newConversationId)
        options.onConversationId?.(newConversationId)   // 回调给组件
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let buffer = ''

    try {
        while (true) {
            const { value, done } = await reader.read()
            buffer += decoder.decode(value || new Uint8Array(), { stream: !done })

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

                if (chunk) onChunk(chunk)
            }

            if (done) {
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

export function getUsageDashboard(params = {}) {
    return axios.get('/ai/dashboard', {
        params: {
            model: 'all',
            dimension: 'hour',
            ...params
        }
    })
}

// 创建会话（用户在首页输入问题，相当于一次新对话）
export function createConversation(data) {
    return axios.post('/ai/conversations', data)
}

// 查询当前登录用户的最近对话
export function getRecentConversations() {
    return axios.get('/ai/conversations')
}

// 获取指定会话的历史消息
export function getConversationMessages(conversationId) {
    return axios.get(`/ai/conversations/${conversationId}/messages`)
}

// 删除指定会话
export function deleteConversation(conversationId) {
    return axios.delete(`/ai/conversations/${conversationId}`)
}
