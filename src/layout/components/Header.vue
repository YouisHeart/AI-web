<template>
    <header class="header">
        <!-- 左侧：折叠按钮 + 品牌 + 面包屑 -->
        <div class="header__left">
            <button class="header__toggle" type="button" :title="isCollapse ? '展开菜单' : '收起菜单'"
                @click="asideStore.toggleAside()">
                <el-icon :size="18">
                    <Expand v-if="isCollapse" />
                    <Fold v-else />
                </el-icon>
            </button>

            <div class="header__brand">
                <div class="header__logo">
                    <el-icon :size="19">
                        <Monitor />
                    </el-icon>
                </div>
                <div class="header__brand-text">
                    <div class="header__title">NEXUS AI</div>
                    <div class="header__subtitle">INTELLIGENCE SYSTEM</div>
                </div>
            </div>

            <span class="header__divider"></span>

            <el-breadcrumb class="header__breadcrumb" separator="/">
                <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="index">
                    {{ item.title }}
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <!-- 右侧：运行状态 + 用户信息 -->
        <div class="header__right">
            <div class="header__status">
                <span class="header__dot"></span>
                AI 系统运行中
            </div>

            <el-dropdown trigger="click" placement="bottom-end" :show-arrow="false"
                popper-class="ai-user-dropdown-popper" @command="handleCommand">
                <div class="header__user" tabindex="0">
                    <div class="header__avatar-wrap">
                        <el-avatar :size="34" class="header__avatar">
                            {{ avatarText }}
                        </el-avatar>
                        <span class="header__avatar-online"></span>
                    </div>

                    <div class="header__user-info">
                        <span class="header__username">
                            {{ username || '未登录' }}
                        </span>
                    </div>

                    <el-icon class="header__arrow">
                        <ArrowDown />
                    </el-icon>
                </div>

                <template #dropdown>
                    <div class="ai-user-dropdown">
                        <!-- 用户信息 -->
                        <div class="ai-dropdown-profile">
                            <div class="ai-dropdown-avatar">
                                <el-avatar :size="42" class="ai-dropdown-avatar__image">
                                    {{ avatarText }}
                                </el-avatar>
                                <span class="ai-dropdown-avatar__status"></span>
                            </div>

                            <div class="ai-dropdown-profile__info">
                                <div class="ai-dropdown-profile__name">
                                    {{ username || '未登录' }}
                                </div>
                                <div class="ai-dropdown-profile__desc">
                                    NEXUS INTELLIGENCE
                                </div>
                            </div>

                            <div class="ai-dropdown-profile__badge">
                                <el-icon>
                                    <Monitor />
                                </el-icon>
                            </div>
                        </div>

                        <div class="ai-dropdown-divider">
                            <span>ACCOUNT CONTROL</span>
                        </div>

                        <!-- 修改密码 -->
                        <div class="ai-dropdown-action" @click="handleCommand('changePassword')">
                            <div class="ai-dropdown-action__icon">
                                <el-icon :size="18" color="#e84134">
                                    <Password />
                                </el-icon>
                            </div>

                            <div class="ai-dropdown-action__content">
                                <span class="ai-dropdown-action__title">
                                    修改密码
                                </span>
                                <span class="ai-dropdown-action__desc">
                                    修改当前用户密码
                                </span>
                            </div>

                            <el-icon class="ai-dropdown-action__arrow">
                                <ArrowDown />
                            </el-icon>
                        </div>

                        <!-- 退出登录 -->
                        <div class="ai-dropdown-action" @click="handleCommand('logout')">
                            <div class="ai-dropdown-action__icon">
                                <el-icon :size="18">
                                    <SwitchButton />
                                </el-icon>
                            </div>

                            <div class="ai-dropdown-action__content">
                                <span class="ai-dropdown-action__title">
                                    退出登录
                                </span>
                                <span class="ai-dropdown-action__desc">
                                    安全退出当前账号
                                </span>
                            </div>

                            <el-icon class="ai-dropdown-action__arrow">
                                <ArrowDown />
                            </el-icon>
                        </div>

                      
                    </div>
                </template>
            </el-dropdown>
        </div>
        
    </header>

    <!-- 退出登录 -->
     <ConfirmDialog ref="confirmDialogRef">
        <template #content>
            <div class="password-form">
                <div class="password-form__field">
                    <label class="password-form__label">
                        <span>01</span>
                        原始密码
                    </label>
                    <el-input v-model="passwordForm.old_pwd" type="password" placeholder="请输入当前密码" show-password
                        autocomplete="current-password" size="large" clearable />
                </div>

                <div class="password-form__field">
                    <label class="password-form__label">
                        <span>02</span>
                        新密码
                    </label>
                    <el-input v-model="passwordForm.new_pwd" type="password" placeholder="请输入新密码" show-password
                        autocomplete="new-password" size="large" clearable />
                </div>

                <div class="password-form__field">
                    <label class="password-form__label">
                        <span>03</span>
                        确认新密码
                    </label>
                    <el-input v-model="passwordForm.re_pwd" type="password" placeholder="请再次输入新密码" show-password
                        autocomplete="new-password" size="large" clearable />
                </div>

                <div class="password-form__security">
                    <el-icon>
                        <Lock />
                    </el-icon>
                    <span>密码更新成功后，当前登录凭证将失效，需要重新登录。</span>
                </div>
            </div>
        </template>
    </ConfirmDialog>
    

</template>

<script setup>
import { ref,reactive,computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
    ArrowDown,
    ChatDotRound,
    Expand,
    Fold,
    Monitor,
    SwitchButton,
} from '@element-plus/icons-vue'
import Password from "@/assets/icon/password.svg?component";
import { useAsideStore } from '@/store/aside'
import { useUserStoreHook } from '@/store/userInfoStore'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import { updatepassword } from '@/api/login'

const confirmDialogRef = ref(null)

const route = useRoute()
const router = useRouter()
const asideStore = useAsideStore()
const userStore = useUserStoreHook()

const { username } = storeToRefs(userStore)

const passwordForm = reactive({
    old_pwd: '',
    new_pwd: '',
    re_pwd: '',
})

// 侧边栏是否收起
const isCollapse = computed(() => asideStore.isCollapse)

// 当前页面位置（面包屑）
const breadcrumbs = computed(() =>
    route.matched
        .filter((item) => item.meta && item.meta.title)
        .map((item) => ({ path: item.path, title: item.meta.title })),
)

// 头像文字
const avatarText = computed(() =>
    username.value ? username.value.slice(0, 1).toUpperCase() : 'AI',
)



onMounted(() => {
    // 刷新页面后补一次用户信息
    if (!username.value) {
        userStore.storeUserInfo()
    }
})



async function handleCommand(command) {
    if (command === 'chat') {
        router.push('/')
        return
    }

    if (command === 'changePassword') {
        // 每次打开都清空上次输入的内容
        passwordForm.old_pwd = ''
        passwordForm.new_pwd = ''
        passwordForm.re_pwd = ''

        const confirmed = await confirmDialogRef.value.open({
            title: '修改登录密码',
            description: '更新你的身份验证凭证，保障 NEXUS AI 账户安全。',
            confirmText: '确认修改',
            cancelText: '取消操作',
            type: 'primary',
            icon: 'Password',
            width: '660px',
            customContent: true,
            showClose: true,
            closeOnClickModal: false,
            closeOnPressEscape: true,
            systemLabel: 'NEXUS ACCOUNT SECURITY',
            footerText: 'PASSWORD UPDATE · ENCRYPTED',

            // 公共弹窗会等待这个异步方法完成
            onConfirm: async () => {
                const { old_pwd, new_pwd, re_pwd } = passwordForm

                if (!old_pwd.trim() || !new_pwd.trim() || !re_pwd.trim()) {
                    ElMessage.warning('请完整填写三个密码字段')
                    return false
                }

                if (new_pwd !== re_pwd) {
                    ElMessage.warning('两次输入的新密码不一致')
                    return false
                }

                if (old_pwd === new_pwd) {
                    ElMessage.warning('新密码不能与原密码相同')
                    return false
                }

                try {
                    const res = await updatepassword({
                        old_pwd,
                        new_pwd,
                        re_pwd,
                    })

                    console.log('修改密码结果：', res)
                    ElMessage.success(res.message)
                    return true
                } catch (error) {
                    console.error('修改密码失败：', error)
                    ElMessage.error('密码修改失败，请稍后重试')
                    return false
                }
            },
        })

        if (!confirmed) return

        // 后端已经删除当前 Token，清理前端登录状态并跳转
        await userStore.storeLogout()
        await router.replace('/login')
        return
    }

    if (command !== 'logout') return

    const confirmed = await confirmDialogRef.value.open({
        title: '确认退出登录？',
        description: '即将断开当前账号与 NEXUS AI 智能系统的连接。',
        tip: '退出后需要重新登录才能继续访问系统。',
        confirmText: '确认退出',
        cancelText: '暂不退出',
        type: 'danger',
        icon: 'logout',
        width: '440px',
        showClose: true,
        closeOnClickModal: false,
        systemLabel: 'NEXUS SECURITY CENTER',
        footerText: 'SECURE LOGOUT · AI SYSTEM',
    })

    if (!confirmed) return

    try {
        await userStore.storeLogout()
        ElMessage.success('已退出登录')
        await router.replace('/login')
    } catch (error) {
        console.error('退出登录失败：', error)
        ElMessage.error('退出登录失败，请稍后重试')
    }
}


</script>

<style scoped>
.header {
    position: relative;
    z-index: 10;
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    padding: 0 18px 0 12px;
    border-bottom: 1px solid rgba(89, 142, 220, 0.17);
    color: #e4edff;
    background: rgba(5, 12, 27, 0.94);
    backdrop-filter: blur(10px);
}

.header__left,
.header__right,
.header__brand,
.header__status,
.header__user {
    display: flex;
    align-items: center;
}

.header__left {
    gap: 14px;
    min-width: 0;
}

.header__right {
    gap: 16px;
    flex-shrink: 0;
}

/* 收起 / 展开按钮 */
.header__toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    padding: 0;
    border: 1px solid rgba(89, 142, 220, 0.25);
    border-radius: 9px;
    color: #9bb8e6;
    background: rgba(16, 29, 52, 0.85);
    cursor: pointer;
    transition: all 0.2s ease;
}

.header__toggle:hover {
    border-color: rgba(96, 164, 255, 0.55);
    color: #d8ecff;
    background: rgba(35, 82, 160, 0.45);
    box-shadow: 0 0 16px rgba(43, 127, 255, 0.25);
}

.header__toggle:active {
    transform: scale(0.94);
}

/* 品牌 */
.header__brand {
    gap: 10px;
}

.header__logo {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border: 1px solid rgba(92, 159, 255, 0.45);
    border-radius: 10px;
    color: #70baff;
    background: linear-gradient(145deg, #14376b, #0a1832);
    box-shadow: 0 0 18px rgba(43, 127, 255, 0.15);
}

.header__title {
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 1px;
}

.header__subtitle {
    margin-top: 2px;
    color: #6583b3;
    font-size: 8px;
    letter-spacing: 1.6px;
}

.header__divider {
    width: 1px;
    height: 20px;
    background: rgba(89, 142, 220, 0.22);
}

/* 面包屑 */
.header__breadcrumb {
    display: flex;
    align-items: center;
    font-size: 13px;
}

.header__breadcrumb :deep(.el-breadcrumb__inner) {
    color: #7d93b8;
    font-weight: 400;
}

.header__breadcrumb :deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
    color: #cfe3ff;
    font-weight: 600;
}

.header__breadcrumb :deep(.el-breadcrumb__separator) {
    color: #45597c;
}

/* 运行状态 */
.header__status {
    gap: 7px;
    padding: 5px 12px;
    border: 1px solid rgba(70, 226, 176, 0.25);
    border-radius: 999px;
    color: #89a3c9;
    font-size: 12px;
    background: rgba(70, 226, 176, 0.06);
}

.header__dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #46e2b0;
    box-shadow: 0 0 10px rgba(70, 226, 176, 0.75);
}

/* 用户信息 */
.header__user {
    gap: 8px;
    padding: 4px 10px 4px 4px;
    border: 1px solid transparent;
    border-radius: 999px;
    color: #c8dcff;
    cursor: pointer;
    transition: all 0.2s ease;
    outline: none;
}

.header__user:hover {
    border-color: rgba(96, 164, 255, 0.4);
    background: rgba(35, 82, 160, 0.28);
}

.header__avatar {
    color: #eaf5ff;
    font-size: 13px;
    font-weight: 700;
    background: linear-gradient(135deg, #2f6bff, #12b7d6);
}

.header__username {
    max-width: 120px;
    overflow: hidden;
    font-size: 13px;
    white-space: nowrap;
    text-overflow: ellipsis;
}

/* ================================
   AI 科技风用户入口
================================ */
.header__user {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 5px 10px 5px 6px;
    border: 1px solid rgba(75, 151, 255, 0.2);
    border-radius: 12px;
    color: #d7eaff;
    background: linear-gradient(135deg,
            rgba(15, 34, 66, 0.88),
            rgba(8, 19, 39, 0.95));
    cursor: pointer;
    outline: none;
    transition: all 0.25s ease;
}

.header__user:hover,
.header__user:focus-visible {
    border-color: rgba(61, 177, 255, 0.65);
    background: linear-gradient(135deg,
            rgba(21, 51, 96, 0.95),
            rgba(9, 30, 58, 0.98));
    box-shadow:
        0 0 16px rgba(32, 137, 255, 0.15),
        inset 0 0 12px rgba(32, 137, 255, 0.05);
}

.header__avatar-wrap {
    position: relative;
    flex-shrink: 0;
}

.header__avatar {
    color: #ffffff;
    font-size: 14px;
    font-weight: 700;
    background: linear-gradient(135deg, #397bff, #12c7d9);
    box-shadow: 0 0 12px rgba(36, 146, 255, 0.3);
}

.header__avatar-online {
    position: absolute;
    right: -1px;
    bottom: 0;
    width: 9px;
    height: 9px;
    border: 2px solid #0a1830;
    border-radius: 50%;
    background: #35edb1;
    box-shadow: 0 0 8px rgba(53, 237, 177, 0.65);
}

.header__user-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
}

.header__username {
    max-width: 120px;
    overflow: hidden;
    color: #e3efff;
    font-size: 13px;
    font-weight: 600;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.header__arrow {
    margin-left: 2px;
    color: #7198ce;
    font-size: 12px;
    transition: transform 0.25s ease;
}

.header__user:focus-visible {
    outline: 2px solid rgba(65, 170, 255, 0.6);
    outline-offset: 3px;
}


:global(.ai-user-dropdown-popper) {
    padding: 0 !important;
    overflow: hidden;
    border: 1px solid rgba(63, 145, 255, 0.4) !important;
    border-radius: 14px !important;
    background: #09162c !important;
    box-shadow:
        0 12px 36px rgba(0, 0, 0, 0.4),
        0 0 24px rgba(35, 116, 255, 0.13),
        inset 0 0 20px rgba(40, 112, 255, 0.04) !important;
}

:global(.ai-user-dropdown-popper .el-popper__arrow) {
    display: none !important;
}

:global(.ai-user-dropdown-popper .el-dropdown__list) {
    padding: 0 !important;
}

/* 下拉框主体 */
:global(.ai-user-dropdown) {
    width: 260px;
    padding: 10px;
    box-sizing: border-box;
    color: #d8e8ff;
    background:
        radial-gradient(ellipse at top right,
            rgba(24, 91, 175, 0.16),
            transparent 65%),
        #09162c;
}

/* 用户信息卡片 */
:global(.ai-dropdown-profile) {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 13px 10px;
    border: 1px solid rgba(74, 142, 237, 0.14);
    border-radius: 10px;
    background: linear-gradient(135deg,
            rgba(24, 54, 98, 0.55),
            rgba(12, 29, 55, 0.45));
}

:global(.ai-dropdown-avatar) {
    position: relative;
    flex-shrink: 0;
}

:global(.ai-dropdown-avatar__image) {
    color: #ffffff;
    font-size: 17px;
    font-weight: 700;
    background: linear-gradient(135deg, #377cff, #0dcbd4);
    box-shadow: 0 0 18px rgba(42, 133, 255, 0.28);
}

:global(.ai-dropdown-avatar__status) {
    position: absolute;
    right: -2px;
    bottom: 1px;
    width: 10px;
    height: 10px;
    border: 2px solid #0d1d38;
    border-radius: 50%;
    background: #42e5b2;
}

:global(.ai-dropdown-profile__info) {
    flex: 1;
    min-width: 0;
}

:global(.ai-dropdown-profile__name) {
    overflow: hidden;
    color: #e6f1ff;
    font-size: 14px;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
}

:global(.ai-dropdown-profile__desc) {
    margin-top: 6px;
    color: #6c91c4;
    font-size: 9px;
    letter-spacing: 1px;
}

:global(.ai-dropdown-profile__badge) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    flex-shrink: 0;
    border: 1px solid rgba(54, 157, 255, 0.22);
    border-radius: 8px;
    color: #5cbaff;
    background: rgba(34, 112, 219, 0.12);
}

/* 分隔标题 */
:global(.ai-dropdown-divider) {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 16px 2px 10px;
    color: #57769f;
    font-size: 9px;
    letter-spacing: 1.3px;
}

:global(.ai-dropdown-divider::after) {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg,
            rgba(77, 139, 219, 0.35),
            transparent);
    content: "";
}

/* 退出登录按钮 */
:global(.ai-dropdown-action) {
    display: flex;
    align-items: center;
    gap: 11px;
    padding: 11px 10px;
    border: 1px solid transparent;
    border-radius: 9px;
    cursor: pointer;
    transition:
        background 0.2s ease,
        border-color 0.2s ease,
        box-shadow 0.2s ease;
}

:global(.ai-dropdown-action__icon) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    flex-shrink: 0;
    border: 1px solid rgba(255, 103, 125, 0.22);
    border-radius: 9px;
    color: #ff8298;
    background: rgba(255, 74, 107, 0.09);
    transition: all 0.2s ease;
}

:global(.ai-dropdown-action__content) {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 5px;
}

:global(.ai-dropdown-action__title) {
    color: #d8e7fc;
    font-size: 13px;
    font-weight: 600;
}

:global(.ai-dropdown-action__desc) {
    color: #7187a7;
    font-size: 11px;
}

:global(.ai-dropdown-action__arrow) {
    color: #637b9e;
    font-size: 12px;
    transform: rotate(-90deg);
    transition: all 0.2s ease;
}

:global(.ai-dropdown-action:hover) {
    border-color: rgba(255, 92, 119, 0.28);
    background: linear-gradient(90deg,
            rgba(255, 72, 104, 0.12),
            rgba(29, 47, 79, 0.25));
    box-shadow: inset 0 0 16px rgba(255, 72, 104, 0.035);
}

:global(.ai-dropdown-action:hover .ai-dropdown-action__icon) {
    border-color: rgba(255, 101, 127, 0.5);
    color: #ffffff;
    box-shadow: 0 0 14px rgba(244, 81, 112, 0.22);
}

:global(.ai-dropdown-action:hover .ai-dropdown-action__title) {
    color: #ff9aab;
}

:global(.ai-dropdown-action:hover .ai-dropdown-action__arrow) {
    color: #ff8298;
    transform: rotate(-90deg) translateX(2px);
}

/* 底部安全标识 */
:global(.ai-dropdown-footer) {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    margin-top: 10px;
    padding-top: 11px;
    border-top: 1px solid rgba(75, 128, 192, 0.12);
    color: #526b8d;
    font-size: 9px;
    letter-spacing: 1px;
}

:global(.ai-dropdown-footer__dot) {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #3edeb0;
    box-shadow: 0 0 7px rgba(62, 222, 176, 0.65);
}

/* 修改密码表单 */
.password-form {
    display: flex;
    flex-direction: column;
    gap: 18px;
}

.password-form__field {
    display: flex;
    flex-direction: column;
    gap: 9px;
}

.password-form__label {
    display: flex;
    align-items: center;
    gap: 9px;
    color: #c9dcf7;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.4px;
}

.password-form__label>span {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 23px;
    height: 21px;
    border: 1px solid rgba(68, 173, 255, 0.32);
    border-radius: 5px;
    color: #55c4ff;
    background: rgba(35, 115, 202, 0.12);
    font-size: 10px;
    font-weight: 500;
}

.password-form :deep(.el-input__wrapper) {
    min-height: 42px;
    padding: 0 13px;
    border: 1px solid rgba(80, 133, 202, 0.25);
    border-radius: 9px;
    background: rgba(5, 17, 36, 0.78);
    box-shadow: inset 0 0 12px rgba(39, 109, 191, 0.04);
    transition: all 0.2s ease;
}

.password-form :deep(.el-input__wrapper:hover) {
    border-color: rgba(70, 162, 255, 0.5);
}

.password-form :deep(.el-input__wrapper.is-focus) {
    border-color: #3d9fff;
    box-shadow:
        0 0 0 1px rgba(61, 159, 255, 0.12),
        0 0 16px rgba(37, 126, 255, 0.1);
}

.password-form :deep(.el-input__inner) {
    color: #e0edff;
    font-size: 13px;
    letter-spacing: 0.5px;
}

.password-form :deep(.el-input__inner::placeholder) {
    color: #526b8d;
}

.password-form :deep(.el-input__password) {
    color: #7396c4;
}

.password-form__security {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 11px 12px;
    border: 1px solid rgba(58, 161, 226, 0.17);
    border-radius: 8px;
    color: #7899c2;
    background: rgba(21, 71, 116, 0.12);
    font-size: 11px;
    line-height: 1.7;
}

.password-form__security .el-icon {
    flex-shrink: 0;
    margin-top: 2px;
    color: #48c6f5;
    font-size: 15px;
}

/* 手机端适配 */
@media (max-width: 640px) {
    .header__user {
        gap: 0;
        padding: 4px;
        border-radius: 10px;
    }

    .header__user-info,
    .header__arrow {
        display: none;
    }
}



/* 中等屏幕 */
@media (max-width: 900px) {
    .header__breadcrumb {
        display: none;
    }

    .header__divider {
        display: none;
    }
}

/* 手机端 */
@media (max-width: 640px) {
    .header {
        height: 54px;
        padding: 0 10px;
    }

    .header__left {
        gap: 10px;
    }

    .header__subtitle,
    .header__status,
    .header__username {
        display: none;
    }
}
</style>