<template>
    <div class="user-manage-page">
        <!-- 顶部标题 -->
        <div class="page-header">
            <div class="page-title">
                <div class="title-icon">
                    <el-icon>
                        <UserFilled />
                    </el-icon>
                </div>

                <div>
                    <h1>用户管理中心</h1>
                    <p>USER MANAGEMENT SYSTEM · 用户数据管理与监控</p>
                </div>
            </div>

            <div class="header-actions">
                <el-button class="common-btn" :loading="loading" @click="getUserList">
                    <el-icon>
                        <Refresh />
                    </el-icon>
                    刷新数据
                </el-button>
            </div>
        </div>

        <!-- 用户列表面板 -->
        <div class="user-panel">
            <div class="panel-header">
                <div class="panel-heading">
                    <span class="heading-line"></span>
                    <h2>注册用户列表</h2>
                    <span class="panel-tag">USER LIST</span>
                </div>

                <div class="online-status">
                    <span class="status-dot"></span>
                    数据连接正常
                </div>
            </div>

            <!-- 搜索区域 -->
            <div class="search-toolbar">
                <el-input v-model="searchKeyword" class="common-input" placeholder="搜索用户名或昵称" clearable
                    @keyup.enter="handleSearch">
                    <template #prefix>
                        <el-icon>
                            <Search />
                        </el-icon>
                    </template>
                </el-input>

                <el-button class="common-btn" @click="handleSearch">
                    <el-icon>
                        <Search />
                    </el-icon>
                    查询
                </el-button>

                <el-button class="reset-button" @click="handleReset">
                    重置
                </el-button>
            </div>

            <!-- 已选择用户的操作栏 -->
            <div v-if="selectedUsers.length" class="selection-toolbar">
                <span>
                    已选择
                    <strong>{{ selectedUsers.length }}</strong>
                    位用户
                </span>

                <el-button class="common-btn" :loading="deleting" :disabled="!selectedUsers.length" @click="handleBatchDelete">
                    <el-icon>
                        <Delete />
                    </el-icon>
                    批量删除
                </el-button>
            </div>

            <!-- 用户表格 -->
            <el-table 
            ref="userTableRef"
            v-loading="loading"
            element-loading-background="rgba(8, 19, 33, 0.75)"
            element-loading-text="加载中..."
            :data="allUsersList" 
            class="user-table" 
            height="100%"
            row-key="id" 
            empty-text="暂无注册用户数据" 
            @selection-change="handleSelectionChange"
            >
                <!-- 勾选列 -->
                <el-table-column type="selection" width="52" align="center" reserve-selection />

                <!-- 用户 ID -->
                <el-table-column prop="id" label="用户 ID" width="100" align="center">
                    <template #default="{ row }">
                        <span class="user-id">{{ row.id }}</span>
                    </template>
                </el-table-column>

                <!-- 用户信息 -->
                <el-table-column label="用户信息" min-width="220">
                    <template #default="{ row }">
                        <div class="user-profile">

                            <div class="user-profile-info">
                                <span class="user-username">
                                    {{ row.username }}
                                </span>
                            </div>
                        </div>
                    </template>
                </el-table-column>

                <!-- 邮箱 -->
                <el-table-column prop="email" label="邮箱" min-width="180" show-overflow-tooltip>
                    <template #default="{ row }">
                        <span class="account-text">
                            {{ row.email || '未绑定邮箱' }}
                        </span>
                    </template>
                </el-table-column>

                <!-- 注册时间 -->
                <el-table-column label="注册时间" min-width="180">
                    <template #default="{ row }">
                        <span class="time-text">
                            {{ formatDate(row.createTime) }}
                        </span>
                    </template>
                </el-table-column>

                <!-- 操作列 -->
                <el-table-column label="操作" width="160" fixed="right" align="center">
                    <template #default="{ row }">
                        <div class="row-actions">
                            <el-button class="view-button" link @click="handleView(row)">
                                <el-icon>
                                    <View />
                                </el-icon>
                                查看
                            </el-button>

                            <el-button class="delete-button" link :loading="deletingIds.includes(row.id)"
                                @click="handleDelete(row)">
                                <el-icon>
                                    <Delete />
                                </el-icon>
                                删除
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 封装后的分页组件 -->
            <Pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :total="total"
                :disabled="loading" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>

        <div class="page-footer">
            <span>AI MANAGEMENT PLATFORM</span>
            <span>SECURE · INTELLIGENT · EFFICIENT</span>
        </div>

        <!-- 用户详情弹窗 -->
        <el-dialog v-model="detailVisible" title="用户详细信息" width="480px" class="user-detail-dialog" append-to-body>
            <template v-if="currentUser">
                <div class="detail-profile">
                    <el-avatar :size="64" :src="currentUser.userPic || ''">
                        {{
                            (
                                currentUser.nickname ||
                                currentUser.username ||
                                'U'
                            ).slice(0, 1)
                        }}
                    </el-avatar>

                    <div class="detail-profile__info">
                        <h3>{{ currentUser.nickname || '未设置昵称' }}</h3>
                        <span>@{{ currentUser.username || '未知用户' }}</span>
                    </div>
                </div>

                <el-descriptions :column="1" border>
                    <el-descriptions-item label="用户 ID">
                        {{ currentUser.id }}
                    </el-descriptions-item>

                    <el-descriptions-item label="用户名">
                        {{ currentUser.username || '-' }}
                    </el-descriptions-item>

                    <el-descriptions-item label="昵称">
                        {{ currentUser.nickname || '-' }}
                    </el-descriptions-item>

                    <el-descriptions-item label="邮箱">
                        {{ currentUser.email || '未绑定邮箱' }}
                    </el-descriptions-item>

                    <el-descriptions-item label="注册时间">
                        {{ formatDate(currentUser.createTime) }}
                    </el-descriptions-item>
                </el-descriptions>
            </template>

            <template #footer>
                <el-button @click="detailVisible = false">
                    关闭
                </el-button>
            </template>
        </el-dialog>
    </div>
</template>


<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
    UserFilled,
    Refresh,
    Search,
    View,
    Delete
} from '@element-plus/icons-vue'

import Pagination from '@/components/Pagination.vue'
import {
    userList as fetchUserList,
    deleteUser
} from '@/api/userManage.js'

const loading = ref(false)
const deleting = ref(false)
const deletingIds = ref([])

const userTableRef = ref()
const allUsersList = ref([])
const selectedUsers = ref([])

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const searchKeyword = ref('')

const detailVisible = ref(false)
const currentUser = ref(null)

/**
 * 获取用户列表
 */
async function getUserList() {
    loading.value = true

    try {
        const response = await fetchUserList({
            pageNum: currentPage.value,
            pageSize: pageSize.value,
            username: searchKeyword.value.trim() || undefined
        })

        // 兼容 Axios 响应和直接返回业务数据的情况
        const result = response?.data ?? response

        // 兼容 Result<PageBean<User>> 以及直接返回 PageBean
        const pageData = result?.data ?? result

        allUsersList.value = pageData?.items ?? []
        total.value = Number(pageData?.total ?? 0)

        // 删除最后一条数据后，如果当前页已超出范围，自动返回上一页
        if (
            allUsersList.value.length === 0 &&
            currentPage.value > 1 &&
            total.value > 0
        ) {
            currentPage.value = Math.min(
                currentPage.value,
                Math.ceil(total.value / pageSize.value)
            )

            await getUserList()
            return
        }
    } catch (error) {
        console.error('获取用户列表失败：', error)
        ElMessage.error('获取用户列表失败')
    } finally {
        loading.value = false
    }
}

/**
 * 表格勾选变化
 */
function handleSelectionChange(rows) {
    selectedUsers.value = rows
}

/**
 * 查看用户详情
 */
function handleView(row) {
    currentUser.value = { ...row }
    detailVisible.value = true
}

/**
 * 删除单个用户
 */
async function handleDelete(row) {
    try {
        await ElMessageBox.confirm(
            `确定要删除用户「${row.username || row.id}」吗？删除后请确认后端数据是否可恢复。`,
            '删除确认',
            {
                confirmButtonText: '确认删除',
                cancelButtonText: '取消',
                type: 'warning',
                confirmButtonClass: 'danger-confirm-button',
                distinguishCancelAndClose: true
            }
        )

        deletingIds.value = [...deletingIds.value, row.id]

        await deleteUser([row.id])

        ElMessage.success('用户删除成功')

        // 清理当前选中状态
        selectedUsers.value = selectedUsers.value.filter(
            user => user.id !== row.id
        )

        await getUserList()
    } catch (error) {
        if (error !== 'cancel' && error !== 'close') {
            console.error('删除用户失败：', error)
            ElMessage.error('删除用户失败，请检查接口配置')
        }
    } finally {
        deletingIds.value = deletingIds.value.filter(
            id => id !== row.id
        )
    }
}

/**
 * 批量删除已选用户
 */
async function handleBatchDelete() {
    if (!selectedUsers.value.length || deleting.value) return

    const users = [...selectedUsers.value]
    const ids = users.map(user => user.id)

    try {
        await ElMessageBox.confirm(
            `确定要删除已选择的 ${ ids.length } 位用户吗？此操作不可轻易撤销。`,
            '批量删除确认',
            {
                confirmButtonText: '确认删除',
                cancelButtonText: '取消',
                type: 'warning',
                confirmButtonClass: 'danger-confirm-button'
            }
        )

        deleting.value = true

        // 一次请求删除全部选中的用户
        await deleteUser(ids)

        ElMessage.success(`成功删除 ${ ids.length } 位用户`)

        // 清除表格勾选
        userTableRef.value?.clearSelection()
        selectedUsers.value = []

        // 重新获取用户列表
        await getUserList()
    } catch (error) {
        if (error !== 'cancel' && error !== 'close') {
            console.error('批量删除失败：', error)
            ElMessage.error('批量删除失败，请检查接口配置')
        }
    } finally {
        deleting.value = false
    }
}

/**
 * 格式化注册时间
 */
function formatDate(value) {
    if (!value) return '-'

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
        return String(value)
    }

    const pad = value => String(value).padStart(2, '0')

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

/**
 * 查询
 */
function handleSearch() {
    currentPage.value = 1
    userTableRef.value?.clearSelection()
    selectedUsers.value = []
    getUserList()
}

/**
 * 重置
 */
function handleReset() {
    searchKeyword.value = ''
    currentPage.value = 1
    userTableRef.value?.clearSelection()
    selectedUsers.value = []
    getUserList()
}

/**
 * 每页条数变化
 */
function handleSizeChange(size) {
    pageSize.value = size
    currentPage.value = 1
    userTableRef.value?.clearSelection()
    selectedUsers.value = []
    getUserList()
}

/**
 * 当前页变化
 */
function handleCurrentChange(page) {
    currentPage.value = page
    userTableRef.value?.clearSelection()
    selectedUsers.value = []
    getUserList()
}

onMounted(() => {
    getUserList()
})
</script>


<style scoped lang="scss">
.user-manage-page {
    min-height: 100%;
    padding: 28px;
    box-sizing: border-box;
    color: #d9f3ff;
    background:
        radial-gradient(ellipse at 10% 0%, rgba(0, 190, 255, 0.09), transparent 36%),
        radial-gradient(ellipse at 90% 100%, rgba(80, 70, 255, 0.08), transparent 36%),
        #081321;
}

.page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 28px;
}

.page-title {
    display: flex;
    align-items: center;
    gap: 16px;

    h1 {
        margin: 0;
        color: #e8f8ff;
        font-size: 26px;
        font-weight: 700;
        letter-spacing: 1px;
    }

    p {
        margin: 9px 0 0;
        color: #64869f;
        font-size: 11px;
        letter-spacing: 1.2px;
    }
}

.title-icon {
    display: grid;
    width: 54px;
    height: 54px;
    place-items: center;
    border: 1px solid rgba(0, 220, 255, 0.35);
    border-radius: 14px;
    color: #26dfff;
    background: rgba(0, 198, 255, 0.08);
    box-shadow: inset 0 0 18px rgba(0, 198, 255, 0.06);

    .el-icon {
        font-size: 27px;
    }
}

.statistics-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 20px;
    margin-bottom: 26px;
}

.statistics-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 142px;
    padding: 24px;
    border: 1px solid rgba(72, 152, 192, 0.2);
    border-radius: 12px;
    background: linear-gradient(135deg,
            rgba(16, 39, 59, 0.96),
            rgba(10, 26, 43, 0.96));
    box-shadow: inset 0 1px rgba(255, 255, 255, 0.025);
    transition: border-color 0.25s, transform 0.25s;

    &:hover {
        transform: translateY(-3px);
        border-color: rgba(0, 220, 255, 0.42);
    }
}

.statistics-label {
    color: #85a7bd;
    font-size: 14px;
}

.statistics-value {
    margin: 14px 0 8px;
    color: #e9faff;
    font-size: 32px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
}

.statistics-unit {
    margin-left: 5px;
    color: #7194ab;
    font-size: 13px;
    font-weight: 400;
}

.statistics-description {
    color: #587a91;
    font-size: 12px;
}

.statistics-icon {
    display: grid;
    width: 52px;
    height: 52px;
    place-items: center;
    border-radius: 13px;
    font-size: 24px;

    &.cyan {
        color: #20e2ed;
        background: rgba(32, 226, 237, 0.1);
    }

    &.blue {
        color: #52aaff;
        background: rgba(82, 170, 255, 0.1);
    }

    &.purple {
        color: #ad8cff;
        background: rgba(173, 140, 255, 0.1);
    }
}

.user-panel {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 220px);
    overflow: hidden;
    border: 1px solid rgba(72, 152, 192, 0.23);
    border-radius: 12px;
    background: rgba(10, 26, 43, 0.92);
}

.panel-header {
    display: flex;
    min-height: 64px;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    border-bottom: 1px solid rgba(72, 152, 192, 0.17);
}

.panel-heading {
    display: flex;
    align-items: center;
    gap: 12px;

    h2 {
        margin: 0;
        color: #e3f5ff;
        font-size: 16px;
        font-weight: 600;
    }
}

.heading-line {
    width: 3px;
    height: 18px;
    border-radius: 3px;
    background: #25dfff;
    box-shadow: 0 0 10px rgba(37, 223, 255, 0.5);
}

.panel-tag {
    padding: 4px 7px;
    border: 1px solid rgba(0, 206, 255, 0.2);
    border-radius: 4px;
    color: #40c8e7;
    background: rgba(0, 206, 255, 0.06);
    font-size: 10px;
    letter-spacing: 1px;
}

.online-status {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #7094a9;
    font-size: 12px;
}

.status-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #39e6a1;
    box-shadow: 0 0 8px rgba(57, 230, 161, 0.7);
}

.search-toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
    padding: 20px 24px;
}

.search-button,
.reset-button {
    height: 36px;
}

.search-button {
    color: #061c2b;
    border-color: #38d7ee;
    background: #38d7ee;

    &:hover {
        color: #061c2b;
        border-color: #76edff;
        background: #76edff;
    }
}

.reset-button {
    color: #a3bfd0;
    border-color: #29485e;
    background: #10283c;

    &:hover {
        color: #fff;
        border-color: #36cde8;
        background: #15374b;
    }
}

.user-table {
    width: 100%;
    --el-table-bg-color: transparent;
    --el-table-tr-bg-color: transparent;
    --el-table-header-bg-color: #10283d;
    --el-table-row-hover-bg-color: rgba(28, 161, 203, 0.09);
    --el-table-border-color: rgba(72, 152, 192, 0.14);
    --el-table-text-color: #b8d0df;
    --el-table-header-text-color: #7fa5bb;
    --el-fill-color-blank: transparent;

    :deep(.el-table__inner-wrapper::before) {
        display: none;
    }

    :deep(th.el-table__cell) {
        height: 48px;
        font-weight: 500;
        letter-spacing: 0.4px;
    }

    :deep(td.el-table__cell) {
        height: 66px;
    }

    :deep(.el-table__row:hover > td.el-table__cell) {
        background: rgba(28, 161, 203, 0.09);
    }

    :deep(.el-table__empty-text) {
        color: #64869f;
    }
}

.user-id {
    color: #43cce8;
    font-size: 13px;
    font-variant-numeric: tabular-nums;
}

.user-profile {
    display: flex;
    align-items: center;
    gap: 12px;
}

.user-avatar {
    display: grid;
    flex-shrink: 0;
    width: 38px;
    height: 38px;
    place-items: center;
    border: 1px solid rgba(0, 210, 255, 0.28);
    border-radius: 10px;
    color: #61e6ff;
    background: linear-gradient(135deg,
            rgba(0, 210, 255, 0.18),
            rgba(72, 95, 255, 0.12));
    font-size: 16px;
    font-weight: 600;
}

.user-profile-info {
    display: flex;
    flex-direction: column;
    gap: 5px;
    min-width: 0;
}

.user-nickname {
    overflow: hidden;
    color: #dceef8;
    font-size: 13px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.user-username {
    overflow: hidden;
    color: #64869f;
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.account-text {
    color: #9cb8cb;
    font-size: 13px;
}

.time-text {
    color: #8ca9bc;
    font-size: 12px;
    font-variant-numeric: tabular-nums;
}

.status-tag {
    color: #43e7a1;
    border-color: rgba(67, 231, 161, 0.3);
    background: rgba(67, 231, 161, 0.07);
}

.role-tag {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    color: #7cb8e7;
    font-size: 11px;
}

.pagination-footer {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 20px 24px;
    border-top: 1px solid rgba(72, 152, 192, 0.15);
}

.pagination-summary {
    color: #7094a9;
    font-size: 12px;

    strong {
        color: #48d7ef;
        font-weight: 600;
    }
}

.pagination-footer :deep(.el-pagination) {
    --el-pagination-bg-color: #10283c;
    --el-pagination-button-color: #9dbed1;
    --el-pagination-hover-color: #35d7ed;
    --el-pagination-text-color: #a5c0d1;
    --el-pagination-button-disabled-bg-color: #0c1b2b;
}

.pagination-footer :deep(.el-pagination.is-background .el-pager li.is-active) {
    color: #06212d;
    background: #36d5eb;
}

.page-footer {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    margin-top: 24px;
    color: #38566b;
    font-size: 10px;
    letter-spacing: 1.5px;
}

@media (max-width: 900px) {
    .user-manage-page {
        padding: 18px;
    }

    .statistics-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
    }

    .statistics-card {
        min-height: 120px;
        padding: 16px;
    }

    .statistics-value {
        font-size: 26px;
    }

    .search-toolbar {
        padding: 16px;
    }

    .panel-header {
        padding: 0 16px;
    }

    .pagination-footer {
        padding: 16px;
    }
}

@media (max-width: 520px) {
    .page-header {
        align-items: flex-start;
    }

    .page-title {
        gap: 10px;

        h1 {
            font-size: 19px;
        }

        p {
            max-width: 220px;
            font-size: 9px;
            line-height: 1.6;
        }
    }

    .title-icon {
        width: 42px;
        height: 42px;
    }

    .refresh-button {
        padding: 8px;
    }

    .statistics-grid {
        grid-template-columns: 1fr;
    }

    .online-status,
    .panel-tag {
        display: none;
    }

    .panel-heading h2 {
        font-size: 14px;
    }

    .page-footer {
        flex-direction: column;
    }
}
</style>
