<template>
    <aside class="sidebar">
        <!-- 开启新对话 -->
        <el-button class="new-chat-btn" @click="handleNewChat">
            <el-icon>
                <Plus />
            </el-icon>
            <span>开启新对话</span>
        </el-button>

        <!-- 工作空间 -->
        <div class="sidebar-heading">工作空间</div>

        <!-- AI问答 -->
        <div class="nav-item" :class="{ active: route.path === '/' }" @click="router.push('/')">
            <el-icon>
                <ChatDotRound />
            </el-icon>
            <span>AI 智能问答</span>
            <span class="nav-count">AI</span>
        </div>

        <!-- 用户管理 -->
        <div class="nav-item" :class="{ active: route.path === '/user/manage' }" @click="router.push('/user/manage')">
            <el-icon>
                <User />
            </el-icon>
            <span>用户管理</span>
            <span class="nav-count">SYS</span>
        </div>

        <!-- 用量信息 -->
        <div class="nav-item" :class="{ active: route.path === '/user/usage' }" @click="router.push('/user/usage')">
            <el-icon>
                <Cpu />
            </el-icon>
            <span>用量信息</span>
            <span class="nav-count">USAGE</span>
        </div>

        <!-- 最近对话 -->
        <div class="sidebar-heading history-heading">
            <span>最近对话</span>
            <el-button class="clear-history-btn" text :disabled="!conversations.length" @click="emit('clear-history')">
                清空
            </el-button>
        </div>

        <!-- 历史记录列表 -->
        <div class="history-list">
            <div v-for="item in conversations" :key="item.id" class="history-item"
                :class="{ selected: conversationId === item.id }" @click="handleSelectConversation(item)">
                <el-icon class="history-icon">
                    <ChatLineRound />
                </el-icon>

                <span class="history-title" :title="item.title">
                    {{ item.title }}
                </span>

                <el-button text class="delete-history" aria-label="删除历史对话" title="删除对话"
                    @click.stop="handleDeleteConversation(item)">
                    <el-icon>
                        <Close />
                    </el-icon>
                </el-button>
            </div>

            <el-empty v-if="!conversations.length" description="暂无历史对话" :image-size="56" />
        </div>

        <!-- 底部用户信息 -->
        <div class="sidebar-bottom">
            <div class="system-card">
                <div class="system-orb">
                    <el-icon>
                        <Cpu />
                    </el-icon>
                </div>

                <div class="system-info">
                    <div class="system-title">NEXUS CORE</div>
                    <div class="system-desc" :title="username">
                        {{ username }}
                    </div>
                </div>

                <span class="system-status"></span>
            </div>

            <div class="sidebar-version">NEXUS AI · v1.0.0</div>
        </div>
    </aside>
</template>

<script setup>
import { onMounted,ref } from 'vue'
import {
    Plus,
    ChatDotRound,
    ChatLineRound,
    Close,
    Cpu,
    User
} from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAiConversationStore } from '@/store/aiConversationStore'

const aiConversationStore = useAiConversationStore()

const router = useRouter()
const route = useRoute()


const {
    conversations,
    conversationId
} = storeToRefs(aiConversationStore)

defineProps({
    username: {
        type: String,
        default: ''
    }
})

const emit = defineEmits([
    'clear-history',
    'switch-conversation',
])

// 加载最近对话
onMounted(() => {
    aiConversationStore.loadConversations()
})

// 开启新对话
function handleNewChat() {
    aiConversationStore.startNewChat()
    emit('new-chat')
}

// 点击历史会话
function handleSelectConversation(item) {
    console.log('点击的历史会话：', item)
    console.log('点击前 conversationId：', conversationId.value)

    aiConversationStore.switchConversation(item.id)
}

// 删除单条会话
function handleDeleteConversation(item) {
    console.log(item)
    aiConversationStore.removeConversation(item.id)
    emit('delete-conversation', item)
}
</script>

<style scoped lang="scss">
.sidebar {
    display: flex;
    flex: 0 0 248px;
    flex-direction: column;
    min-width: 0;
    height: 100%;
    padding: 24px 16px 12px;
    overflow: hidden;
    border-right: 1px solid rgba(89, 142, 220, 0.17);
    background: rgba(8, 16, 33, 0.78);
    color: #e4edff;
}

.new-chat-btn {
    display: flex;
    width: 100%;
    height: 44px;
    flex-shrink: 0;
    gap: 8px;
    border: 1px solid rgba(86, 150, 255, 0.4);
    color: #cde2ff;
    background: linear-gradient(110deg,
            rgba(31, 103, 211, 0.26),
            rgba(45, 66, 140, 0.12));
}

.new-chat-btn:hover {
    border-color: #579bff;
    color: #fff;
    background: rgba(41, 107, 222, 0.28);
}

.sidebar-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
    margin: 28px 8px 12px;
    color: #6980a5;
    font-size: 11px;
    letter-spacing: 1px;
}

.history-heading {
    margin-top: 30px;
}

.clear-history-btn {
    padding: 4px 6px;
    border: none !important;
    color: #7daeff !important;
    background: transparent !important;
    box-shadow: none !important;
}

.clear-history-btn:hover,
.clear-history-btn:focus,
.clear-history-btn:active {
    border: none !important;
    color: #7daeff !important;
    background: transparent !important;
    box-shadow: none !important;
}

.clear-history-btn:deep(.el-button.is-disabled) {
    color: #4c6082 !important;
}

.nav-item,
.history-item {
    display: flex;
    align-items: center;
    gap: 11px;
    min-width: 0;
    height: 42px;
    padding: 0 12px;
    margin-bottom: 15px;
    border-radius: 8px;
    color: #9bb0d2;
    font-size: 13px;
    cursor: pointer;
}

.nav-item {
    flex-shrink: 0;
}

.nav-item.active {
    border: 1px solid rgba(80, 149, 255, 0.19);
    color: #8bc0ff;
    background: linear-gradient(100deg,
            rgba(41, 110, 218, 0.23),
            rgba(29, 69, 135, 0.1));
}

.nav-count {
    margin-left: auto;
    color: #6eaaff;
    font-size: 10px;
}

.history-list {
    flex: 1;
    min-height: 0;
    overflow-x: hidden;
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

.history-icon {
    flex-shrink: 0;
}

.history-title {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.delete-history {
    display: none;
    flex-shrink: 0;
    padding: 5px;
    color: #8198bd;
    background: transparent !important;
}

.history-item:hover .delete-history,
.history-item.selected .delete-history {
    display: inline-flex;
}

.delete-history:hover {
    color: #ff8585 !important;
}

.sidebar-bottom {
    flex-shrink: 0;
    padding-top: 16px;
}

.system-card {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
    padding: 13px 10px;
    border: 1px solid rgba(89, 142, 220, 0.17);
    border-radius: 10px;
    background: linear-gradient(135deg,
            rgba(25, 56, 101, 0.32),
            rgba(9, 19, 37, 0.6));
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

.system-info {
    flex: 1;
    min-width: 0;
}

.system-title {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1px;
}

.system-desc {
    margin-top: 5px;
    overflow: hidden;
    color: #6f88ad;
    font-size: 10px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.system-status {
    width: 7px;
    height: 7px;
    flex-shrink: 0;
    margin-left: auto;
    border-radius: 50%;
    background: #46e2b0;
    box-shadow: 0 0 10px rgba(70, 226, 176, 0.7);
}

.sidebar-version {
    padding-top: 14px;
    color: #4c6082;
    font-size: 10px;
    text-align: center;
}

.history-list::-webkit-scrollbar {
    width: 5px;
}

.history-list::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: rgba(87, 132, 193, 0.25);
}

@media (min-width: 1600px) {
    .sidebar {
        flex-basis: 270px;
        padding-right: 20px;
        padding-left: 20px;
    }
}

@media (max-width: 900px) {
    .sidebar {
        flex-basis: 205px;
        padding-right: 12px;
        padding-left: 12px;
    }
}

@media (max-width: 640px) {
    .sidebar {
        display: none;
    }
}
</style>
