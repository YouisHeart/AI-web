<template>
    <div class="ai-page">
        <div class="main-layout">

            <!-- 主聊天区域 -->
            <main class="chat-main">
                <div class="chat-header">
                    <div class="chat-header-left">
                        <div class="assistant-avatar">
                            <el-icon>
                                <Cpu />
                            </el-icon>
                        </div>
                        <div>
                            <div class="assistant-name">Nexus 智能助手</div>
                            <div class="assistant-desc">
                                <span class="mini-dot"></span>
                                多模态智能引擎 · 随时为你服务
                            </div>
                        </div>
                    </div>
                    <el-tag class="model-tag" effect="plain">
                        <el-icon>
                            <MagicStick />
                        </el-icon>
                        AI ASSISTANT
                    </el-tag>
                </div>

                <div ref="messageContainer" class="message-container">
                    <!-- 欢迎页 -->
                    <div v-if="!messages.length" class="welcome-panel">
                        <div class="welcome-eyebrow">
                            <span class="eyebrow-line"></span>
                            YOUR AI COMPANION
                            <span class="eyebrow-line"></span>
                        </div>

                        <div class="welcome-visual">
                            <div class="orbit orbit-one"></div>
                            <div class="orbit orbit-two"></div>
                            <div class="orbit orbit-three"></div>
                            <div class="welcome-core">
                                <el-icon>
                                    <Cpu />
                                </el-icon>
                            </div>
                            <span class="orbit-point point-one"></span>
                            <span class="orbit-point point-two"></span>
                            <span class="orbit-point point-three"></span>
                        </div>

                        <h1>让思考，<span>突破边界</span></h1>
                        <p class="welcome-description">
                            你好，我是 Nexus，你的专属 AI 助手。
                            <br />
                            从技术探索到创意构思，让我们一起发现更多可能。
                        </p>

                        <div class="suggestion-heading">
                            <span>为你推荐</span>
                            <span class="suggestion-caption">CHOOSE A DIRECTION</span>
                        </div>

                        <div class="suggestion-grid">
                            <div v-for="item in suggestions" :key="item.title" class="suggestion-card"
                                @click="sendMessage(item.prompt)">
                                <div class="suggestion-icon" :class="item.color">
                                    <el-icon>
                                        <component :is="item.icon" />
                                    </el-icon>
                                </div>
                                <div class="suggestion-title">{{ item.title }}</div>
                                <div class="suggestion-desc">{{ item.description }}</div>
                                <el-icon class="suggestion-arrow">
                                    <ArrowUp />
                                </el-icon>
                            </div>
                        </div>
                    </div>

                    <!-- 对话消息 -->
                    <div v-else class="message-list">
                        <div v-for="(item, index) in messages" :key="item.id" class="message-row" :class="item.role">
                            <div v-if="item.role === 'assistant'" class="message-avatar">
                                <el-icon>
                                    <Cpu />
                                </el-icon>
                            </div>

                            <div class="message-content">
                                <div class="message-meta">
                                    <span>{{ item.role === 'user' ? 'YOU' : 'NEXUS AI' }}</span>
                                    <span class="message-time">{{ item.time }}</span>
                                </div>

                                <div class="message-bubble">
                                    <div v-if="item.role === 'assistant' && item.content" class="markdown-body"
                                        v-html="renderMarkdown(item.content)"></div>
                                    <div v-else-if="item.content" class="user-text">
                                        {{ item.content }}
                                    </div>

                                    <div v-if="item.loading" class="thinking">
                                        <span class="thinking-dot"></span>
                                        <span class="thinking-dot"></span>
                                        <span class="thinking-dot"></span>
                                        <span class="thinking-text">AI 正在思考...</span>
                                    </div>

                                    <div v-if="item.error" class="error-tip">
                                        <el-icon>
                                            <Warning />
                                        </el-icon>
                                        {{ item.error }}
                                        <el-button link type="primary" @click="retryMessage(index)">
                                            重试
                                        </el-button>
                                    </div>
                                </div>

                                <div v-if="item.role === 'assistant' && item.content" class="message-actions">
                                    <el-tooltip content="复制回答">
                                        <el-button text @click="copyMessage(item.content)">
                                            <el-icon>
                                                <CopyDocument />
                                            </el-icon>
                                        </el-button>
                                    </el-tooltip>
                                </div>
                            </div>

                            <div v-if="item.role === 'user'" class="user-avatar">
                                <el-icon>
                                    <User />
                                </el-icon>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 底部输入框 -->
                <div class="composer-wrapper">
                    <div class="composer">
                        <div class="composer-top">
                            <span class="composer-label">
                                <span class="mini-dot"></span>
                                MESSAGE TO NEXUS
                            </span>
                            <span class="composer-hint">Enter 发送 · Shift + Enter 换行</span>
                        </div>

                        <el-input v-model="inputText" type="textarea" resize="none"
                            :autosize="{ minRows: 2, maxRows: 5 }" placeholder="向 AI 提问，探索你感兴趣的任何话题..."
                            :disabled="loading" @keydown="handleKeydown" />

                        <div class="composer-bottom">
                            <div class="composer-tools">
                                <el-tooltip content="清空输入">
                                    <el-button circle text :disabled="!inputText || loading" @click="inputText = ''">
                                        <el-icon>
                                            <Delete />
                                        </el-icon>
                                    </el-button>
                                </el-tooltip>
                                <span class="input-counter">{{ inputText.length }} / 4000</span>
                            </div>

                            <el-button class="common-btn" :disabled="!inputText.trim() || loading"
                                @click="sendMessage()">
                                <span>发送消息</span>
                                <el-icon>
                                    <Promotion />
                                </el-icon>
                            </el-button>
                        </div>
                    </div>
                    <div class="disclaimer">
                        AI 生成的内容仅供参考，请注意核实重要信息。
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>

<script setup>
import { ref, nextTick, computed, onBeforeUnmount, reactive, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
    Plus,
    ChatDotRound,
    ChatLineRound,
    Close,
    Cpu,
    MagicStick,
    ArrowUp,
    User,
    CopyDocument,
    Promotion,
    Delete,
    Warning,
    Connection,
    Document,
    EditPen,
    Search,
} from '@element-plus/icons-vue'
import { renderMarkdown } from '@/utils/utils'
import 'highlight.js/styles/github-dark.css'
import {
    chatWithAIStream,
    createConversation,
    getConversationMessages,
    deleteConversation
} from '@/api/ai'
import { useUserStoreHook } from '@/store/userInfoStore'
import { storeToRefs } from 'pinia'
import { useAiConversationStore } from '@/store/aiConversationStore'

const aiConversationStore = useAiConversationStore()

const { conversationId, switchVersion } = storeToRefs(aiConversationStore)



const suggestions = [
    {
        title: '探索前端技术',
        description: '了解 Vue、React 与前沿开发趋势',
        prompt: '请介绍当前前端开发的主流技术栈，以及它们各自的适用场景。',
        icon: Connection,
        color: 'blue',
    },
    {
        title: '编写高质量代码',
        description: '解决开发难题，提升代码质量',
        prompt: '请分享 5 条实用的 JavaScript 编码规范，并给出代码示例。',
        icon: EditPen,
        color: 'purple',
    },
    {
        title: '知识深度解析',
        description: '把复杂概念讲得简单易懂',
        prompt: '请用通俗易懂的方式解释大语言模型的工作原理。',
        icon: Search,
        color: 'cyan',
    },
    {
        title: '创意灵感生成',
        description: '从灵感出发，探索更多可能',
        prompt: '请帮我设计一个具有未来科技感的 Web 应用创意，并列出核心功能。',
        icon: Document,
        color: 'orange',
    },
]

const messages = ref([])
const inputText = ref('')
const loading = ref(false)
const messageContainer = ref(null)


let requestController = null
let requestVersion = 0

// 防止sse新建会话时触发历史消息加载，覆盖正在显示的回答
let syncingConversationFromStream = false

// 获取用户信息
const userStore = useUserStoreHook();

function scrollToBottom() {
    nextTick(() => {
        if (messageContainer.value) {
            messageContainer.value.scrollTop =
                messageContainer.value.scrollHeight
        }
    })
}

function cancelRequest() {
    requestVersion++
    requestController?.abort()
    requestController = null
    loading.value = false
}


async function sendMessage(text) {
    const question = (text ?? inputText.value).trim()

    if (!question || loading.value) return

    if (question.length > 4000) {
        ElMessage.warning('问题不能超过 4000 个字符')
        return
    }

    inputText.value = ''

    messages.value.push({
        role: 'user',
        content: question,
    })

    const answer = reactive({
        role: 'assistant',
        content: '',
        loading: true,
        error: ''
    })

    messages.value.push(answer)

    loading.value = true

    const version = ++requestVersion
    requestController = new AbortController()

    // 浏览器可能一次收到多个 SSE 事件，这里通过字符队列强制按打字机节奏渲染
    let typingQueue = []
    let typingIndex = 0
    let typingPromise = null
    const typingInterval = 18

    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))

    async function runTypewriter() {
        while (typingIndex < typingQueue.length) {
            if (version !== requestVersion) {
                typingQueue = []
                typingIndex = 0
                return
            }

            const char = typingQueue[typingIndex]
            typingIndex += 1

            answer.content += char
            answer.loading = false
            scrollToBottom()

            await wait(typingInterval)
        }

        typingQueue = []
        typingIndex = 0
    }

    function enqueueTypingChunk(chunk) {
        for (const char of chunk) {
            typingQueue.push(char)
        }

        if (!typingPromise) {
            typingPromise = runTypewriter().finally(() => {
                typingPromise = null
            })
        }
    }

    async function waitForTypingComplete() {
        while (typingQueue.length > typingIndex || typingPromise) {
            if (version !== requestVersion) return

            if (!typingPromise && typingQueue.length > typingIndex) {
                typingPromise = runTypewriter().finally(() => {
                    typingPromise = null
                })
            }

            await typingPromise
        }
    }

    scrollToBottom()

    try {
        await chatWithAIStream(
            {
                message: question,
                conversationId: conversationId.value,
            },
            (chunk) => {
                // 新对话或切换历史后，不再更新旧消息
                if (version !== requestVersion) return

                // 先进入前端字符队列，再逐字显示
                enqueueTypingChunk(chunk)
            },
            {
                signal: requestController.signal,
                onConversationId: async (id) => {
                    if (version !== requestVersion) return
                    // 先同步pinia，避免当前会话ID只保存在localStorage中，导致刷新后无法获取历史消息
                    syncingConversationFromStream = true
                    aiConversationStore.setConversationId(id)

                    try {
                        await aiConversationStore.loadConversations()
                    } catch (error) {
                        console.error('加载历史会话失败:', error)
                    } finally {
                        await nextTick()
                        syncingConversationFromStream = false
                    }
                }
            }
        )

        if (version !== requestVersion) return

        // 等后端响应结束并且字符队列全部渲染完成
        await waitForTypingComplete()

        if (version !== requestVersion) return

        if (!answer.content) {
            throw new Error('AI 没有返回有效回答')
        }

        answer.loading = false
    } catch (error) {
        if (version !== requestVersion) return

        if (
            error?.name === 'AbortError' ||
            error?.name === 'CanceledError'
        ) {
            return
        }

        await waitForTypingComplete()
        if (version !== requestVersion) return

        answer.loading = false
        answer.error = error?.message || '请求失败，请稍后重试'
    } finally {
        if (version === requestVersion) {
            loading.value = false
            requestController = null
            scrollToBottom()
        }
    }
}

function retryMessage(index) {
    const item = messages.value[index]
    if (!item || item.role !== 'assistant') return

    let userIndex = index - 1
    while (userIndex >= 0 && messages.value[userIndex].role !== 'user') {
        userIndex--
    }

    if (userIndex < 0) return

    const question = messages.value[userIndex].content
    messages.value.splice(index)
    sendMessage(question)
}

// 加载历史对话
async function loadConversationMessages(id) {
    // 切换会话前取消上一条 SSE 请求
    cancelRequest()

    inputText.value = ''
    messages.value = []

    if (id == null || id === '') {
        return
    }

    const currentId = String(id)

    try {
        const res = await getConversationMessages(id)

        // 请求期间如果切换到了其他会话，丢弃旧结果
        if (
            String(conversationId.value) !== currentId ||
            syncingConversationFromStream
        ) {
            return
        }

        // 根据接口返回结构提取消息数组
        const list = res?.data?? []
        messages.value = list.map((item) => ({
            id: item.id,
            role: item.role,
            content: item.content,
            loading: false,
            error: ''
        }))

        scrollToBottom()
    } catch (error) {
        console.error('加载历史消息失败：', error)
        ElMessage.error('历史消息加载失败，请重试')
    }
}


// 每次点击历史记录都会触发
watch(switchVersion, async () => {
    const id = conversationId.value
    if (!id) return
    messages.value = []
    await loadConversationMessages(id)
})

async function copyMessage(content) {
    await navigator.clipboard.writeText(content)
    ElMessage.success('复制成功')
}

function handleKeydown(event) {
    if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
        event.preventDefault()
        sendMessage()
    }
}

onMounted(async () => {
    await userStore.storeUserInfo()
    await aiConversationStore.loadConversations();

})

onBeforeUnmount(() => {
    cancelRequest()
})
</script>

<style scoped lang="scss">
.clear-history-btn {
    background-color: transparent !important;
    border-color: transparent !important;
    color: #7daeff !important;
    box-shadow: none !important;
}

.clear-history-btn:hover,
.clear-history-btn:focus,
.clear-history-btn:active {
    background-color: transparent !important;
    border-color: transparent !important;
    color: #7daeff !important;
    box-shadow: none !important;
}

.ai-page {
    --bg: #050b18;
    --panel: #0a1428;
    --panel-light: #0e1d37;
    --line: rgba(89, 142, 220, 0.17);
    --primary: #579bff;
    --text: #e4edff;
    --muted: #7185a8;

    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    min-height: 0;
    overflow: hidden;
    color: var(--text);
    background:
        radial-gradient(ellipse at 55% -20%, rgba(27, 82, 166, 0.23), transparent 55%),
        var(--bg);
    font-family: Inter, "PingFang SC", "Microsoft YaHei", sans-serif;
}

.chat-header-left,
.system-card {
    display: flex;
    align-items: center;
}

.assistant-avatar,
.message-avatar,
.user-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.mini-dot,
.system-status {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #46e2b0;
    box-shadow: 0 0 10px rgba(70, 226, 176, 0.7);
}

.main-layout {
    display: flex;
    flex: 1;
    min-height: 0;
}

.sidebar {
    display: flex;
    flex: 0 0 248px;
    flex-direction: column;
    padding: 24px 16px 12px;
    border-right: 1px solid var(--line);
    background: rgba(8, 16, 33, 0.78);
}

.new-chat-btn {
    width: 100%;
    height: 44px;
    gap: 8px;
    border: 1px solid rgba(86, 150, 255, 0.4);
    color: #cde2ff;
    background: linear-gradient(110deg, rgba(31, 103, 211, 0.26), rgba(45, 66, 140, 0.12));
}

.new-chat-btn:hover {
    border-color: #579bff;
    color: white;
    background: rgba(41, 107, 222, 0.28);
}

.sidebar-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 28px 8px 12px;
    color: #6980a5;
    font-size: 11px;
    letter-spacing: 1px;
}

.sidebar-heading :deep(.el-button) {
    color: #6980a5;
    font-size: 11px;
}

.nav-item,
.history-item {
    display: flex;
    align-items: center;
    gap: 11px;
    min-width: 0;
    height: 42px;
    padding: 0 12px;
    border-radius: 8px;
    color: #9bb0d2;
    font-size: 13px;
}

.nav-item.active {
    border: 1px solid rgba(80, 149, 255, 0.19);
    color: #8bc0ff;
    background: linear-gradient(100deg, rgba(41, 110, 218, 0.23), rgba(29, 69, 135, 0.1));
}

.nav-count {
    margin-left: auto;
    color: #6eaaff;
    font-size: 10px;
}

.history-heading {
    margin-top: 30px;
}

.history-list {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
}

.history-item {
    margin-bottom: 5px;
    cursor: pointer;
    transition: background 0.2s;
}

.history-item:hover,
.history-item.selected {
    color: #d4e4ff;
    background: rgba(55, 95, 157, 0.19);
}

.history-title {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.delete-history {
    display: none;
    color: #8198bd;
}

.history-item:hover .delete-history {
    display: inline-flex;
}

.sidebar-bottom {
    padding-top: 16px;
}

.system-card {
    gap: 10px;
    padding: 13px 10px;
    border: 1px solid var(--line);
    border-radius: 10px;
    background: linear-gradient(135deg, rgba(25, 56, 101, 0.32), rgba(9, 19, 37, 0.6));
}

.system-orb {
    display: grid;
    width: 34px;
    height: 34px;
    flex-shrink: 0;
    place-items: center;
    border-radius: 9px;
    color: #6bb5ff;
    background: #122e55;
    font-size: 19px;
}

.system-title {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1px;
}

.system-desc {
    margin-top: 5px;
    color: #6f88ad;
    font-size: 10px;
}

.system-status {
    margin-left: auto;
}

.sidebar-version {
    padding-top: 14px;
    color: #4c6082;
    font-size: 10px;
    text-align: center;
}

.chat-main {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
}

.chat-header {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: space-between;
    min-height: 76px;
    padding: 0 32px;
    border-bottom: 1px solid var(--line);
}

.chat-header-left {
    gap: 12px;
}

.assistant-avatar {
    width: 42px;
    height: 42px;
    border: 1px solid rgba(94, 167, 255, 0.43);
    border-radius: 13px;
    color: #83c7ff;
    background: linear-gradient(145deg, #153b70, #0b1832);
    box-shadow: 0 0 20px rgba(47, 120, 255, 0.14);
    font-size: 22px;
}

.assistant-name {
    font-size: 14px;
    font-weight: 600;
}

.assistant-desc {
    display: flex;
    align-items: center;
    gap: 7px;
    margin-top: 6px;
    color: #7189ad;
    font-size: 11px;
}

.mini-dot {
    width: 5px;
    height: 5px;
}

.model-tag {
    gap: 5px;
    border-color: rgba(81, 149, 255, 0.27);
    color: #83baff;
    background: rgba(28, 73, 135, 0.13);
    font-size: 10px;
    letter-spacing: 0.6px;
}

.message-container {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    scroll-behavior: smooth;
}

.message-container::-webkit-scrollbar,
.history-list::-webkit-scrollbar {
    width: 5px;
}

.message-container::-webkit-scrollbar-thumb,
.history-list::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: rgba(87, 132, 193, 0.25);
}

.welcome-panel {
    display: flex;
    min-height: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 30px 24px;
    animation: appear 0.5s ease both;
}

.welcome-eyebrow {
    display: flex;
    align-items: center;
    gap: 12px;
    color: #7294c5;
    font-size: 10px;
    letter-spacing: 3px;
}

.eyebrow-line {
    width: 28px;
    height: 1px;
    background: linear-gradient(90deg, transparent, #4b9cff);
}

.eyebrow-line:last-child {
    transform: rotate(180deg);
}

.welcome-visual {
    position: relative;
    display: grid;
    width: 150px;
    height: 150px;
    flex-shrink: 0;
    margin: 15px 0 10px;
    place-items: center;
}

.welcome-core {
    z-index: 1;
    display: grid;
    width: 72px;
    height: 72px;
    place-items: center;
    border: 1px solid rgba(114, 188, 255, 0.7);
    border-radius: 22px;
    color: #9edbff;
    background: radial-gradient(circle at 35% 25%, #275b9a, #0b1a38 70%);
    box-shadow:
        0 0 32px rgba(49, 137, 255, 0.22),
        inset 0 0 18px rgba(78, 164, 255, 0.13);
    font-size: 37px;
    animation: float 4s ease-in-out infinite;
}

.orbit {
    position: absolute;
    border: 1px solid rgba(72, 145, 255, 0.2);
    border-radius: 50%;
}

.orbit-one {
    width: 102px;
    height: 102px;
}

.orbit-two {
    width: 130px;
    height: 130px;
    border-style: dashed;
    animation: rotate 20s linear infinite;
}

.orbit-three {
    width: 148px;
    height: 148px;
    border-color: rgba(68, 121, 209, 0.12);
}

.orbit-point {
    position: absolute;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #66c7ff;
    box-shadow: 0 0 12px #398cff;
}

.point-one {
    top: 17px;
    right: 29px;
}

.point-two {
    bottom: 27px;
    left: 14px;
    width: 5px;
    height: 5px;
}

.point-three {
    top: 66px;
    right: 0;
    width: 4px;
    height: 4px;
}

.welcome-panel h1 {
    margin: 6px 0 0;
    color: #e8f1ff;
    font-size: clamp(24px, 2.5vw, 32px);
    font-weight: 650;
    letter-spacing: 1px;
}

.welcome-panel h1 span {
    color: #74b6ff;
    text-shadow: 0 0 26px rgba(61, 142, 255, 0.28);
}

.welcome-description {
    margin: 13px 0 27px;
    color: #8198bb;
    font-size: 12px;
    line-height: 2;
    text-align: center;
}

.suggestion-heading {
    display: flex;
    width: min(100%, 760px);
    align-items: center;
    justify-content: space-between;
    margin-bottom: 13px;
    color: #b4c9e8;
    font-size: 12px;
}

.suggestion-caption {
    color: #506b93;
    font-size: 9px;
    letter-spacing: 1.5px;
}

.suggestion-grid {
    display: grid;
    width: min(100%, 760px);
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
}

.suggestion-card {
    position: relative;
    min-width: 0;
    padding: 16px;
    border: 1px solid rgba(94, 143, 207, 0.17);
    border-radius: 12px;
    background: linear-gradient(135deg, rgba(19, 37, 67, 0.73), rgba(10, 20, 39, 0.72));
    cursor: pointer;
    transition: 0.25s ease;
}

.suggestion-card:hover {
    transform: translateY(-3px);
    border-color: rgba(90, 161, 255, 0.55);
    background: linear-gradient(135deg, rgba(29, 62, 111, 0.65), rgba(12, 25, 48, 0.9));
    box-shadow: 0 8px 30px rgba(20, 78, 160, 0.12);
}

.suggestion-icon {
    display: grid;
    width: 32px;
    height: 32px;
    margin-bottom: 12px;
    place-items: center;
    border-radius: 9px;
    font-size: 17px;
}

.suggestion-icon.blue {
    color: #7bb8ff;
    background: rgba(47, 122, 232, 0.17);
}

.suggestion-icon.purple {
    color: #c2a1ff;
    background: rgba(130, 83, 230, 0.17);
}

.suggestion-icon.cyan {
    color: #70e1e8;
    background: rgba(39, 175, 190, 0.15);
}

.suggestion-icon.orange {
    color: #ffbe80;
    background: rgba(230, 133, 49, 0.15);
}

.suggestion-title {
    margin-bottom: 7px;
    color: #d8e7ff;
    font-size: 13px;
    font-weight: 600;
}

.suggestion-desc {
    padding-right: 10px;
    color: #7188ad;
    font-size: 11px;
    line-height: 1.7;
}

.suggestion-arrow {
    position: absolute;
    top: 16px;
    right: 15px;
    color: #5e7fae;
}

.message-list {
    display: flex;
    max-width: 950px;
    flex-direction: column;
    gap: 25px;
    margin: 0 auto;
    padding: 28px 32px;
}

.message-row {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    animation: appear 0.25s ease both;
}

.message-row.user {
    justify-content: flex-end;
}

.message-avatar,
.user-avatar {
    width: 34px;
    height: 34px;
    border-radius: 11px;
    font-size: 18px;
}

.message-avatar {
    flex-shrink: 0;
    border: 1px solid rgba(83, 158, 255, 0.3);
    color: #85c6ff;
    background: #10294c;
}

.user-avatar {
    flex-shrink: 0;
    color: #b9d6ff;
    background: linear-gradient(145deg, #315c9a, #172b4c);
}

.message-content {
    min-width: 0;
    max-width: min(82%, 760px);
}

.message-meta {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
    color: #85a5d3;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 1px;
}

.message-time {
    color: #50688c;
    font-weight: 400;
    letter-spacing: 0;
}

.user .message-meta {
    justify-content: flex-end;
}

.message-bubble {
    padding: 15px 17px;
    border: 1px solid rgba(87, 144, 214, 0.2);
    border-radius: 4px 14px 14px 14px;
    color: #d1def3;
    background: linear-gradient(135deg, rgba(17, 34, 61, 0.94), rgba(10, 22, 42, 0.96));
    font-size: 13px;
    line-height: 1.85;
    overflow-wrap: anywhere;
}

.user .message-bubble {
    border-color: rgba(69, 143, 255, 0.27);
    border-radius: 14px 4px 14px 14px;
    color: #e5f0ff;
    background: linear-gradient(135deg, rgba(35, 91, 177, 0.46), rgba(19, 47, 91, 0.6));
}

.markdown-body {
    overflow-x: auto;
    overflow-wrap: anywhere;
}

.markdown-body :deep(p) {
    margin: 0 0 12px;
}

.markdown-body :deep(p:last-child) {
    margin-bottom: 0;
}

.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3),
.markdown-body :deep(h4) {
    margin: 18px 0 10px;
    color: #e1edff;
    font-weight: 600;
    line-height: 1.5;
}

.markdown-body :deep(h1) {
    font-size: 20px;
}

.markdown-body :deep(h2) {
    font-size: 17px;
}

.markdown-body :deep(h3),
.markdown-body :deep(h4) {
    font-size: 14px;
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
    padding-left: 24px;
    margin: 8px 0 14px;
}

.markdown-body :deep(li) {
    padding-left: 3px;
    margin: 4px 0;
}

.markdown-body :deep(a) {
    color: #79b8ff;
}

.markdown-body :deep(blockquote) {
    margin: 12px 0;
    padding: 8px 13px;
    border-left: 3px solid #478eea;
    color: #9cb4d8;
    background: rgba(61, 119, 202, 0.09);
}

.markdown-body :deep(:not(pre) > code) {
    padding: 2px 5px;
    border-radius: 4px;
    color: #9ed5ff;
    background: rgba(68, 130, 213, 0.15);
    font-size: 12px;
}

.markdown-body :deep(pre) {
    overflow-x: auto;
    margin: 12px 0;
    padding: 14px;
    border: 1px solid rgba(100, 151, 211, 0.16);
    border-radius: 8px;
    background: #080f1e;
}

.markdown-body :deep(pre code) {
    font-family: Consolas, Monaco, monospace;
    font-size: 12px;
    line-height: 1.7;
}

.markdown-body :deep(table) {
    width: 100%;
    margin: 12px 0;
    border-collapse: collapse;
}

.markdown-body :deep(th),
.markdown-body :deep(td) {
    padding: 8px;
    border: 1px solid rgba(100, 151, 211, 0.2);
    text-align: left;
}

.markdown-body :deep(th) {
    background: rgba(64, 115, 184, 0.15);
}

.message-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 5px;
}

.message-actions :deep(.el-button) {
    color: #7795bd;
}

.thinking {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 3px 0;
}

.thinking-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #71b7ff;
    animation: pulse 1s infinite ease-in-out;
}

.thinking-dot:nth-child(2) {
    animation-delay: 0.15s;
}

.thinking-dot:nth-child(3) {
    animation-delay: 0.3s;
}

.thinking-text {
    margin-left: 6px;
    color: #7796bf;
    font-size: 11px;
}

.error-tip {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 7px;
    margin-top: 5px;
    color: #f49b9b;
    font-size: 12px;
}

.composer-wrapper {
    flex-shrink: 0;
    padding: 12px 32px 18px;
    border-top: 1px solid rgba(89, 142, 220, 0.12);
    background: linear-gradient(180deg, rgba(5, 11, 24, 0.15), rgba(5, 11, 24, 0.9));
}

.composer {
    max-width: 950px;
    margin: 0 auto;
    padding: 12px 15px 10px;
    border: 1px solid rgba(82, 143, 218, 0.29);
    border-radius: 13px;
    background: rgba(12, 25, 47, 0.96);
    box-shadow: 0 0 35px rgba(24, 76, 148, 0.08);
    transition: border-color 0.2s;
}

.composer:focus-within {
    border-color: rgba(89, 159, 255, 0.63);
    box-shadow: 0 0 0 3px rgba(54, 121, 223, 0.06);
}

.composer-top,
.composer-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.composer-label {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #83a4d1;
    font-size: 9px;
    letter-spacing: 1.4px;
}

.composer-hint,
.input-counter {
    color: #5b7397;
    font-size: 10px;
}

.composer :deep(.el-textarea) {
    margin: 10px 0 8px;
}

.composer :deep(.el-textarea__inner) {
    padding: 5px 0;
    border: none;
    border-radius: 0;
    color: #d9e8ff;
    background: transparent;
    box-shadow: none;
    font-size: 13px;
    line-height: 1.8;
}

.composer :deep(.el-textarea__inner::placeholder) {
    color: #62799d;
}

.composer-tools {
    display: flex;
    align-items: center;
    gap: 8px;
}

.composer-tools :deep(.el-button) {
    color: #819ec7;
}

.send-button {
    height: 36px;
    gap: 7px;
    padding: 0 17px;
    border: 1px solid rgba(110, 180, 255, 0.36);
    color: white;
    background: linear-gradient(110deg, #2877e4, #4c91f5);
    box-shadow: 0 4px 16px rgba(40, 119, 228, 0.18);
}

.send-button:hover {
    border-color: #9acbff;
    color: white;
    background: linear-gradient(110deg, #3888f5, #5ba3ff);
}

.send-button.is-disabled {
    color: #8498b8;
    background: #182d4c;
    box-shadow: none;
}

.disclaimer {
    margin-top: 9px;
    color: #536987;
    font-size: 10px;
    text-align: center;
}

@keyframes rotate {
    to {
        transform: rotate(360deg);
    }
}

@keyframes float {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-5px);
    }
}

@keyframes pulse {

    0%,
    80%,
    100% {
        opacity: 0.3;
        transform: scale(0.8);
    }

    40% {
        opacity: 1;
        transform: scale(1.15);
    }
}

@keyframes appear {
    from {
        opacity: 0;
        transform: translateY(8px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (min-width: 1600px) {
    .sidebar {
        flex-basis: 270px;
        padding-right: 20px;
        padding-left: 20px;
    }

    .welcome-panel {
        padding-top: 45px;
        padding-bottom: 45px;
    }

    .welcome-visual {
        transform: scale(1.08);
        margin-top: 22px;
        margin-bottom: 22px;
    }
}

@media (max-width: 900px) {
    .sidebar {
        flex-basis: 205px;
        padding-right: 12px;
        padding-left: 12px;
    }

    .chat-header {
        padding-right: 20px;
        padding-left: 20px;
    }

    .composer-wrapper {
        padding-right: 18px;
        padding-left: 18px;
    }

    .message-list {
        padding-right: 20px;
        padding-left: 20px;
    }
}

@media (max-width: 640px) {
    .ai-page {
        min-height: 0;
    }

    .sidebar,
    .model-tag {
        display: none;
    }

    .main-layout {
        min-height: 0;
    }

    .chat-header {
        min-height: 65px;
        padding: 0 15px;
    }

    .assistant-avatar {
        width: 36px;
        height: 36px;
    }

    .welcome-panel {
        justify-content: flex-start;
        padding: 35px 16px 24px;
    }

    .welcome-visual {
        transform: scale(0.85);
        margin: 4px 0;
    }

    .welcome-panel h1 {
        font-size: 25px;
    }

    .welcome-description {
        margin-bottom: 22px;
        font-size: 11px;
    }

    .suggestion-grid {
        grid-template-columns: 1fr;
        gap: 9px;
    }

    .suggestion-card {
        padding: 12px 13px;
    }

    .suggestion-icon {
        float: left;
        margin-right: 10px;
        margin-bottom: 0;
    }

    .suggestion-title {
        padding-top: 1px;
        margin-bottom: 5px;
    }

    .suggestion-desc {
        font-size: 10px;
    }

    .message-list {
        gap: 18px;
        padding: 20px 12px;
    }

    .message-content {
        max-width: 88%;
    }

    .message-bubble {
        padding: 12px;
        font-size: 12px;
    }

    .composer-wrapper {
        padding: 10px 10px 12px;
    }

    .composer {
        padding: 10px 11px;
    }

    .composer-hint {
        font-size: 9px;
    }

    .send-button {
        padding: 0 12px;
    }
}
</style>
