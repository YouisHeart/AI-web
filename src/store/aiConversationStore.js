
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getRecentConversations,deleteConversation } from '@/api/ai'

export const useAiConversationStore = defineStore('aiConversation', () => {
    // 最近会话列表
    const conversations = ref([])

    // 历史会话切换版本号
    const switchVersion = ref(0)

    // 当前选中的会话 ID
    const selectedConversationId = ref(
        localStorage.getItem('conversationId') || null
    )

    // 兼容原有聊天页面
    const conversationId = computed(
        () => selectedConversationId.value
    )

    // 防止重复加载
    const conversationsLoading = ref(false)

    // 统一设置当前会话 ID
    function setConversationId(id) {
        selectedConversationId.value =
            id === null || id === undefined || id === ''
                ? null
                : String(id)

        if (selectedConversationId.value === null) {
            localStorage.removeItem('conversationId')
        } else {
            localStorage.setItem(
                'conversationId',
                selectedConversationId.value
            )
        }
    }

    // 获取最近会话
    async function loadConversations() {
        if (conversationsLoading.value) return

        conversationsLoading.value = true

        try {
            const res = await getRecentConversations()

            // 兼容 Result.data 为数组的常见结构
            const data = res?.data
            conversations.value = Array.isArray(data)
                ? data
                : Array.isArray(data?.data)
                    ? data.data
                    : []
        } catch (error) {
            console.error('获取最近对话失败：', error)
            throw error
        } finally {
            conversationsLoading.value = false
        }
    }

    // 新建一个尚未产生后端记录的对话
    function startNewChat() {
        setConversationId(null)
    }

    // 更新会话列表中的标题
    function updateConversationTitle(id, title) {
        const item = conversations.value.find(
            item => String(item.id) === String(id)
        )

        if (item && title) {
            item.title = title
        }
    }

    // 触发历史会话切换
    function switchConversation(id) {
        if (id === null || id === undefined || id === '') {
            return
        }

        // 更新当前会话 ID
        setConversationId(id)

        // 每次点击都递增，即使 ID 相同也会触发监听
        switchVersion.value++
    }

    // 删除会话成功后，从前端列表移除
    async function removeConversation(id) {
        console.log(id)
        await deleteConversation(id)

        conversations.value = conversations.value.filter(
            item => String(item.id) !== String(id)
        )

        if (
            String(selectedConversationId.value) === String(id)
        ) {
            startNewChat()
        }

        console.log("会话删除成功",id)
    }

    // 清空前端会话列表
    function clearConversations() {
        conversations.value = []
        startNewChat()
    }

    return {
        conversations,
        conversationId,
        selectedConversationId,
        conversationsLoading,
        switchVersion,
        switchConversation,
        loadConversations,
        setConversationId,
        startNewChat,
        updateConversationTitle,
        removeConversation,
        clearConversations
    }
})
