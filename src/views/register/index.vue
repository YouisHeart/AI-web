```vue
<template>
    <div class="register-page">
        <!-- 科幻背景 -->
        <div class="cyber-background">
            <div class="grid-layer"></div>
            <div class="ambient ambient-left"></div>
            <div class="ambient ambient-right"></div>
            <div class="scan-line"></div>

            <div class="star-field">
                <i v-for="item in 35" :key="item" class="star" :style="getStarStyle(item)"></i>
            </div>
        </div>

        <!-- 顶部导航 -->
        <header class="top-header">
            <div class="brand">
                <div class="brand-icon">
                    <el-icon>
                        <Cpu />
                    </el-icon>
                </div>

                <div class="brand-info">
                    <span class="brand-name">
                        NEXUS<span> AI</span>
                    </span>
                    <span class="brand-subtitle">
                        INTELLIGENT SYSTEM
                    </span>
                </div>
            </div>

            <div class="header-status">
                <span class="status-dot"></span>
                <span>系统运行正常</span>
                <span class="header-divider"></span>
                <span class="version">SYSTEM V2.0.26</span>
            </div>
        </header>

        <!-- 注册主体 -->
        <main class="register-main">
            <!-- 左侧科技展示 -->
            <section class="hero-section">
                <div class="hero-tag">
                    <span class="tag-line"></span>
                    JOIN THE INTELLIGENCE
                </div>

                <h1 class="hero-title">
                    开启智能<br />
                    <span>连接未来</span><span class="title-dot">.</span>
                </h1>

                <p class="hero-description">
                    创建您的专属智能账户。<br />
                    让每一次探索，都成为通往未来的起点。
                </p>

                <!-- AI 核心视觉 -->
                <div class="ai-visual">
                    <div class="orbit orbit-outer"></div>
                    <div class="orbit orbit-middle"></div>
                    <div class="orbit orbit-inner"></div>

                    <div class="orbit-ring orbit-ring-one"></div>
                    <div class="orbit-ring orbit-ring-two"></div>

                    <div class="core-glow"></div>

                    <div class="core">
                        <div class="core-inner">
                            <el-icon>
                                <Cpu />
                            </el-icon>
                        </div>
                    </div>

                    <div class="orbit-node node-one"></div>
                    <div class="orbit-node node-two"></div>
                    <div class="orbit-node node-three"></div>
                    <div class="orbit-node node-four"></div>

                    <div class="visual-label label-top">
                        <span>USER NETWORK</span>
                        <b>CONNECTED</b>
                    </div>

                    <div class="visual-label label-bottom">
                        <span>AI COMPUTING</span>
                        <b>READY</b>
                    </div>
                </div>

                <div class="feature-list">
                    <div class="feature-item">
                        <div class="feature-icon">
                            <el-icon>
                                <Monitor />
                            </el-icon>
                        </div>
                        <div class="feature-text">
                            <span class="feature-title">智能决策</span>
                            <span class="feature-desc">INTELLIGENT DECISION</span>
                        </div>
                    </div>

                    <div class="feature-separator"></div>

                    <div class="feature-item">
                        <div class="feature-icon">
                            <el-icon>
                                <DataAnalysis />
                            </el-icon>
                        </div>
                        <div class="feature-text">
                            <span class="feature-title">数据驱动</span>
                            <span class="feature-desc">DATA INTELLIGENCE</span>
                        </div>
                    </div>

                    <div class="feature-separator"></div>

                    <div class="feature-item">
                        <div class="feature-icon">
                            <el-icon>
                                <Lock />
                            </el-icon>
                        </div>
                        <div class="feature-text">
                            <span class="feature-title">安全可信</span>
                            <span class="feature-desc">SECURE ACCESS</span>
                        </div>
                    </div>
                </div>
            </section>

            <!-- 右侧注册卡片 -->
            <section class="register-section">
                <div class="register-card">
                    <!-- 卡片装饰 -->
                    <div class="card-corner corner-tl"></div>
                    <div class="card-corner corner-tr"></div>
                    <div class="card-corner corner-bl"></div>
                    <div class="card-corner corner-br"></div>

                    <div class="card-header">
                        <div class="register-icon">
                            <el-icon>
                                <UserFilled />
                            </el-icon>
                        </div>

                        <div class="card-overline">
                            CREATE YOUR ACCOUNT
                        </div>

                        <h2>创建账户</h2>
                        <p>加入 NEXUS AI 智能管理平台</p>
                    </div>

                    <!-- 注册表单 -->
                    <el-form ref="formRef" :model="registerInfo" :rules="rules" class="register-form"
                        @submit.prevent="handleRegister">
                        <!-- 用户名 -->
                        <el-form-item prop="username">
                            <label class="field-label">
                                <span>用户账号</span>
                                <span class="field-en">USERNAME</span>
                            </label>

                            <el-input v-model.trim="registerInfo.username" placeholder="请设置用户名" size="large"
                                autocomplete="username" clearable class="cyber-input">
                                <template #prefix>
                                    <el-icon>
                                        <User />
                                    </el-icon>
                                </template>
                            </el-input>
                        </el-form-item>

                        <!-- 密码 -->
                        <el-form-item prop="password">
                            <label class="field-label">
                                <span>登录密码</span>
                                <span class="field-en">PASSWORD</span>
                            </label>

                            <el-input v-model.trim="registerInfo.password" type="password" placeholder="请设置 6-20 位密码"
                                size="large" autocomplete="new-password" show-password class="cyber-input">
                                <template #prefix>
                                    <el-icon>
                                        <Lock />
                                    </el-icon>
                                </template>
                            </el-input>
                        </el-form-item>

                        <!-- 确认密码 -->
                        <el-form-item prop="confirmPassword">
                            <label class="field-label">
                                <span>确认密码</span>
                                <span class="field-en">CONFIRM PASSWORD</span>
                            </label>

                            <el-input v-model.trim="registerInfo.confirmPassword" type="password" placeholder="请再次输入登录密码"
                                size="large" autocomplete="new-password" show-password class="cyber-input"
                                @keyup.enter="handleRegister">
                                <template #prefix>
                                    <el-icon>
                                        <CircleCheck />
                                    </el-icon>
                                </template>
                            </el-input>
                        </el-form-item>

                        <!-- 安全提示 -->
                        <div class="security-notice">
                            <el-icon>
                                <Lock />
                            </el-icon>
                            <span>请妥善保管您的账户密码</span>
                            <span class="security-status">SECURE</span>
                        </div>

                        <!-- 注册按钮 -->
                        <el-button native-type="submit" class="register-button" :loading="loading" :disabled="loading">
                            <span>
                                {{ loading ? '正在创建账户...' : '立 即 注 册' }}
                            </span>
                            <el-icon v-if="!loading">
                                <Right />
                            </el-icon>
                        </el-button>
                    </el-form>

                    <!-- 登录入口 -->
                    <div class="login-entry">
                        <span>已经拥有账户？</span>
                        <el-button text class="login-link" @click="goToLogin">
                            立即登录
                            <el-icon>
                                <Right />
                            </el-icon>
                        </el-button>
                    </div>

                    <div class="card-footer">
                        <span class="footer-line"></span>
                        <span>SECURE REGISTRATION PORTAL</span>
                        <span class="footer-line"></span>
                    </div>
                </div>

                <div class="register-bottom">
                    <span class="bottom-dot"></span>
                    YOUR JOURNEY STARTS HERE
                </div>
            </section>
        </main>

        <!-- 页面底部 -->
        <footer class="page-footer">
            <span>© 2026 NEXUS AI INTELLIGENCE PLATFORM</span>
            <div class="footer-right">
                <span>ALL SYSTEMS OPERATIONAL</span>
                <span class="footer-status"></span>
            </div>
        </footer>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {register} from '@/api/login.js'

import {
    Cpu,
    User,
    UserFilled,
    Lock,
    Monitor,
    DataAnalysis,
    Right,
    CircleCheck
} from '@element-plus/icons-vue'

const router = useRouter()

const formRef = ref(null)
const loading = ref(false)

// 注册信息
const registerInfo = reactive({
    username: '',
    password: '',
    confirmPassword: ''
})

// 确认密码校验
const validateConfirmPassword = (rule, value, callback) => {
    if (!value) {
        callback(new Error('请再次输入密码'))
    } else if (value !== registerInfo.password) {
        callback(new Error('两次输入的密码不一致'))
    } else {
        callback()
    }
}

// 表单校验规则
const rules = reactive({
    username: [
        {
            required: true,
            message: '用户名不能为空',
            trigger: 'blur'
        },
        {
            min: 3,
            max: 12,
            message: '用户名长度必须是 3-12 个字符',
            trigger: 'blur'
        },
        {
            pattern: /^[a-zA-Z0-9_]+$/,
            message: '用户名只能包含字母、数字和下划线',
            trigger: 'blur'
        }
    ],
    password: [
        {
            required: true,
            message: '密码不能为空',
            trigger: 'blur'
        },
        {
            min: 6,
            max: 20,
            message: '密码长度必须是 6-20 个字符',
            trigger: 'blur'
        }
    ],
    confirmPassword: [
        {
            required: true,
            validator: validateConfirmPassword,
            trigger: ['blur', 'change']
        }
    ]
})

// 生成固定位置的装饰星点
const getStarStyle = (index) => {
    const x = (index * 37 + 13) % 100
    const y = (index * 61 + 7) % 100
    const delay = (index % 7) * 0.4
    const size = index % 4 === 0 ? 3 : 2

    return {
        left: `${x}%`,
        top: `${y}%`,
        width: `${size}px`,
        height: `${size}px`,
        animationDelay: `${delay}s`
    }
}

const handleRegister = async () => {
    if (loading.value) return

    try {
        await formRef.value.validate()
    } catch {
        return
    }

    loading.value = true

    try {
        const res = await register({
            username: registerInfo.username,
            password: registerInfo.password
        })

        if (res.code === 0 || res.code === 200) {
            ElMessage.success('注册成功，请登录')
            router.push('/login')
        } else {
            ElMessage.error(res.msg || '注册失败')
        }
    } catch (error) {
        console.error('注册失败：', error)
        ElMessage.error(error?.message || '注册失败，请稍后重试')
    } finally {
        loading.value = false
    }
}

// 返回登录页
const goToLogin = () => {
    router.push('/login')
}
</script>

<style scoped>
/* 页面基础 */
.register-page {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 100vh;
    min-height: 100dvh;
    overflow: hidden;
    isolation: isolate;
    color: #e6f6ff;
    background: #050b16;
    font-family: Inter, "PingFang SC", "Microsoft YaHei", sans-serif;
}

/* 科幻背景 */
.cyber-background {
    position: absolute;
    inset: 0;
    z-index: -1;
    overflow: hidden;
    pointer-events: none;
    background:
        radial-gradient(ellipse at 22% 45%,
            rgba(0, 117, 174, 0.14),
            transparent 44%),
        radial-gradient(ellipse at 83% 46%,
            rgba(0, 220, 255, 0.08),
            transparent 35%),
        linear-gradient(135deg, #050b16 0%, #071423 50%, #050b16 100%);
}

.grid-layer {
    position: absolute;
    inset: 0;
    opacity: 0.23;
    background-image:
        linear-gradient(rgba(55, 173, 220, 0.12) 1px, transparent 1px),
        linear-gradient(90deg, rgba(55, 173, 220, 0.12) 1px, transparent 1px);
    background-size: 52px 52px;
    mask-image: linear-gradient(to bottom,
            transparent,
            #000 20%,
            #000 80%,
            transparent);
}

.ambient {
    position: absolute;
    width: 450px;
    height: 450px;
    border-radius: 50%;
    filter: blur(100px);
    opacity: 0.15;
    animation: ambient-float 9s ease-in-out infinite alternate;
}

.ambient-left {
    top: 20%;
    left: -220px;
    background: #008cff;
}

.ambient-right {
    right: -200px;
    bottom: 5%;
    background: #00eaff;
    animation-delay: -4s;
}

.scan-line {
    position: absolute;
    top: -30%;
    left: 0;
    width: 100%;
    height: 100px;
    opacity: 0.12;
    background: linear-gradient(180deg,
            transparent,
            rgba(39, 220, 255, 0.5),
            transparent);
    animation: scan 12s linear infinite;
}

.star-field {
    position: absolute;
    inset: 0;
}

.star {
    position: absolute;
    display: block;
    border-radius: 50%;
    background: #81eaff;
    box-shadow: 0 0 8px rgba(52, 223, 255, 0.8);
    opacity: 0.25;
    animation: twinkle 3s ease-in-out infinite alternate;
}

/* 顶部导航 */
.top-header {
    position: relative;
    z-index: 2;
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: space-between;
    min-height: 84px;
    padding: 0 6.5%;
    border-bottom: 1px solid rgba(99, 192, 228, 0.12);
    background: rgba(4, 12, 24, 0.42);
    backdrop-filter: blur(12px);
}

.brand {
    display: flex;
    align-items: center;
    gap: 13px;
}

.brand-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 43px;
    height: 43px;
    color: #45e6ff;
    font-size: 25px;
    border: 1px solid rgba(55, 220, 255, 0.45);
    border-radius: 11px;
    background: linear-gradient(135deg,
            rgba(0, 211, 255, 0.16),
            rgba(0, 95, 180, 0.05));
    box-shadow: inset 0 0 16px rgba(0, 199, 255, 0.1);
}

.brand-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.brand-name {
    color: #ecfaff;
    font-size: 20px;
    font-weight: 800;
    letter-spacing: 2px;
}

.brand-name>span {
    color: #43dff8;
}

.brand-subtitle {
    color: #638da8;
    font-size: 9px;
    letter-spacing: 2px;
}

.header-status,
.footer-right {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #81a5b9;
    font-size: 11px;
    letter-spacing: 1px;
}

.status-dot,
.footer-status,
.bottom-dot {
    width: 7px;
    height: 7px;
    flex-shrink: 0;
    border-radius: 50%;
    background: #36f0bb;
    box-shadow: 0 0 10px rgba(54, 240, 187, 0.75);
}

.header-divider {
    width: 1px;
    height: 15px;
    margin: 0 5px;
    background: rgba(119, 176, 205, 0.25);
}

.version {
    color: #4d7791;
    font-size: 10px;
}

/* 主体布局 */
.register-main {
    display: grid;
    grid-template-columns: minmax(0, 1.15fr) minmax(390px, 0.85fr);
    align-items: center;
    gap: clamp(35px, 7vw, 110px);
    width: min(1240px, 88%);
    flex: 1;
    margin: 0 auto;
    padding: 36px 0;
}

/* 左侧介绍 */
.hero-section {
    position: relative;
    min-width: 0;
}

.hero-tag {
    display: flex;
    align-items: center;
    gap: 12px;
    color: #52dff6;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 3px;
}

.tag-line {
    width: 30px;
    height: 2px;
    background: #35d9f5;
    box-shadow: 0 0 12px rgba(53, 217, 245, 0.8);
}

.hero-title {
    margin: 24px 0 20px;
    color: #edf9ff;
    font-size: clamp(43px, 4.6vw, 67px);
    font-weight: 800;
    line-height: 1.3;
    letter-spacing: 4px;
}

.hero-title>span:first-of-type {
    color: transparent;
    background: linear-gradient(100deg, #47e7ff, #4caeff 65%, #7e91ff);
    background-clip: text;
    -webkit-background-clip: text;
}

.title-dot {
    color: #43e5ff;
    text-shadow: 0 0 24px rgba(67, 229, 255, 0.7);
}

.hero-description {
    margin: 0;
    color: #85a6ba;
    font-size: 13px;
    line-height: 2.1;
    letter-spacing: 0.5px;
}

/* AI 核心球体 */
.ai-visual {
    position: relative;
    width: min(100%, 440px);
    height: 310px;
    margin: 8px auto 0;
}

.core-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 185px;
    height: 185px;
    border-radius: 50%;
    background: rgba(0, 176, 255, 0.18);
    filter: blur(38px);
    transform: translate(-50%, -50%);
    animation: core-pulse 4s ease-in-out infinite;
}

.core {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 118px;
    height: 118px;
    border: 1px solid rgba(71, 221, 255, 0.8);
    border-radius: 50%;
    background: radial-gradient(circle at 35% 30%,
            rgba(56, 223, 255, 0.32),
            rgba(5, 30, 61, 0.92) 68%);
    box-shadow:
        0 0 22px rgba(36, 205, 255, 0.35),
        inset 0 0 24px rgba(36, 205, 255, 0.24);
    transform: translate(-50%, -50%);
}

.core-inner {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 72px;
    height: 72px;
    color: #62efff;
    font-size: 41px;
    border: 1px solid rgba(100, 228, 255, 0.4);
    border-radius: 50%;
    box-shadow: 0 0 22px rgba(34, 207, 255, 0.16);
    animation: core-pulse 3s ease-in-out infinite;
}

.orbit,
.orbit-ring {
    position: absolute;
    top: 50%;
    left: 50%;
    border: 1px solid rgba(54, 195, 240, 0.24);
    border-radius: 50%;
    transform: translate(-50%, -50%);
}

.orbit-outer {
    width: 285px;
    height: 285px;
    border-style: dashed;
    animation: rotate 38s linear infinite;
}

.orbit-middle {
    width: 225px;
    height: 225px;
    border-color: rgba(60, 225, 255, 0.4);
    animation: rotate-reverse 24s linear infinite;
}

.orbit-inner {
    width: 163px;
    height: 163px;
    border-style: dashed;
    animation: rotate 17s linear infinite;
}

.orbit-ring-one {
    width: 280px;
    height: 110px;
    border-color: rgba(65, 177, 255, 0.65);
    transform: translate(-50%, -50%) rotate(-35deg);
    animation: orbit-breathe 5s ease-in-out infinite;
}

.orbit-ring-two {
    width: 280px;
    height: 110px;
    border-color: rgba(38, 229, 255, 0.4);
    transform: translate(-50%, -50%) rotate(35deg);
}

.orbit-node {
    position: absolute;
    z-index: 3;
    width: 8px;
    height: 8px;
    border: 1px solid #c3f9ff;
    border-radius: 50%;
    background: #3be7ff;
    box-shadow: 0 0 14px #25cfff;
}

.node-one {
    top: 36px;
    left: calc(50% + 100px);
}

.node-two {
    top: 194px;
    left: calc(50% - 135px);
}

.node-three {
    top: 52px;
    left: calc(50% - 86px);
    width: 5px;
    height: 5px;
}

.node-four {
    top: 222px;
    left: calc(50% + 87px);
    width: 5px;
    height: 5px;
}

.visual-label {
    position: absolute;
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 9px 12px;
    border-left: 2px solid #36dff6;
    background: linear-gradient(90deg, rgba(12, 55, 82, 0.45), transparent);
}

.visual-label>span {
    color: #648ba7;
    font-size: 8px;
    letter-spacing: 1px;
}

.visual-label>b {
    color: #7cecff;
    font-size: 12px;
    font-weight: 600;
}

.label-top {
    top: 28px;
    left: 0;
}

.label-bottom {
    right: 0;
    bottom: 25px;
}

/* 底部功能 */
.feature-list {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding-top: 20px;
    border-top: 1px solid rgba(102, 182, 214, 0.15);
}

.feature-item {
    display: flex;
    align-items: center;
    gap: 10px;
}

.feature-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    flex-shrink: 0;
    color: #50dff5;
    font-size: 18px;
    border: 1px solid rgba(64, 195, 235, 0.2);
    border-radius: 8px;
    background: rgba(25, 117, 158, 0.1);
}

.feature-text {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.feature-title {
    color: #cde7f4;
    font-size: 12px;
}

.feature-desc {
    color: #537b94;
    font-size: 8px;
    letter-spacing: 0.4px;
}

.feature-separator {
    width: 1px;
    height: 28px;
    flex-shrink: 0;
    background: rgba(110, 175, 206, 0.16);
}

/* 注册卡片 */
.register-section {
    width: 100%;
    max-width: 430px;
    justify-self: end;
}

.register-card {
    position: relative;
    padding: 34px 36px 25px;
    overflow: hidden;
    border: 1px solid rgba(77, 190, 228, 0.28);
    border-radius: 15px;
    background: linear-gradient(145deg,
            rgba(13, 34, 54, 0.93),
            rgba(6, 17, 31, 0.97));
    box-shadow:
        0 25px 80px rgba(0, 0, 0, 0.28),
        0 0 40px rgba(0, 154, 220, 0.06),
        inset 0 1px 0 rgba(126, 220, 255, 0.06);
    backdrop-filter: blur(20px);
}

.register-card::before {
    position: absolute;
    top: 0;
    left: 15%;
    width: 70%;
    height: 1px;
    content: "";
    background: linear-gradient(90deg, transparent, #4ae7ff, transparent);
    box-shadow: 0 0 15px rgba(74, 231, 255, 0.65);
}

.card-corner {
    position: absolute;
    width: 13px;
    height: 13px;
    border-color: rgba(68, 222, 255, 0.75);
    border-style: solid;
}

.corner-tl {
    top: 8px;
    left: 8px;
    border-width: 1px 0 0 1px;
}

.corner-tr {
    top: 8px;
    right: 8px;
    border-width: 1px 1px 0 0;
}

.corner-bl {
    bottom: 8px;
    left: 8px;
    border-width: 0 0 1px 1px;
}

.corner-br {
    right: 8px;
    bottom: 8px;
    border-width: 0 1px 1px 0;
}

.card-header {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.register-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 46px;
    height: 46px;
    margin-bottom: 15px;
    color: #54e8ff;
    font-size: 23px;
    border: 1px solid rgba(73, 222, 255, 0.38);
    border-radius: 12px;
    background: linear-gradient(135deg,
            rgba(22, 181, 224, 0.18),
            rgba(17, 77, 135, 0.1));
    box-shadow: 0 0 25px rgba(28, 193, 255, 0.08);
}

.card-overline {
    margin-bottom: 8px;
    color: #4bbbd9;
    font-size: 9px;
    letter-spacing: 2px;
}

.card-header h2 {
    margin: 0;
    color: #f0faff;
    font-size: 27px;
    font-weight: 700;
    letter-spacing: 1px;
}

.card-header p {
    margin: 10px 0 0;
    color: #7f9eb2;
    font-size: 12px;
    letter-spacing: 0.5px;
}

/* 注册表单 */
.register-form {
    margin-top: 25px;
}

.register-form :deep(.el-form-item) {
    display: block;
    margin-bottom: 19px;
}

.field-label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 9px;
    color: #c3dfec;
    font-size: 12px;
}

.field-en {
    color: #537990;
    font-size: 9px;
    letter-spacing: 1.2px;
}

.register-form :deep(.el-input__wrapper) {
    min-height: 45px;
    padding: 0 14px;
    border: 1px solid rgba(92, 167, 200, 0.2);
    border-radius: 8px;
    background: rgba(3, 14, 27, 0.72);
    box-shadow: none;
    transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
}

.register-form :deep(.el-input__wrapper:hover) {
    border-color: rgba(65, 205, 242, 0.5);
}

.register-form :deep(.el-input__wrapper.is-focus) {
    border-color: #36c8ed;
    background: rgba(6, 26, 43, 0.95);
    box-shadow: 0 0 0 3px rgba(45, 200, 237, 0.08);
}

.register-form :deep(.el-input__inner) {
    color: #e1f6ff;
    font-size: 13px;
    letter-spacing: 0.5px;
}

.register-form :deep(.el-input__inner::placeholder) {
    color: #52738a;
    font-size: 12px;
}

.register-form :deep(.el-input__prefix-inner > .el-icon) {
    color: #51b6d5;
    font-size: 17px;
}

.register-form :deep(.el-input__suffix-inner > .el-icon) {
    color: #7099ae;
}

.register-form :deep(.el-form-item__error) {
    padding-top: 4px;
    color: #ff7b91;
    font-size: 11px;
}

/* 安全提示 */
.security-notice {
    display: flex;
    align-items: center;
    gap: 7px;
    margin: -1px 0 19px;
    color: #7094a9;
    font-size: 10px;
}

.security-notice>.el-icon {
    color: #42d9bd;
    font-size: 13px;
}

.security-status {
    margin-left: auto;
    color: #43cba9;
    font-size: 9px;
    letter-spacing: 1px;
}

/* 注册按钮 */
.register-button.el-button {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 48px;
    margin: 0;
    overflow: hidden;
    color: #041522;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 2px;
    border: 1px solid #61efff;
    border-radius: 8px;
    background: linear-gradient(100deg, #37dff3, #4db7ff);
    box-shadow:
        0 0 22px rgba(43, 205, 244, 0.16),
        inset 0 1px 0 rgba(255, 255, 255, 0.32);
    transition: transform 0.25s, box-shadow 0.25s, filter 0.25s;
}

.register-button.el-button::before {
    position: absolute;
    top: 0;
    left: -100%;
    width: 65%;
    height: 100%;
    content: "";
    background: linear-gradient(100deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent);
    transform: skewX(-20deg);
    transition: left 0.55s ease;
}

.register-button.el-button:hover {
    color: #041522;
    border-color: #9bf6ff;
    background: linear-gradient(100deg, #67ecfb, #80c9ff);
    box-shadow: 0 0 32px rgba(43, 205, 244, 0.3);
    transform: translateY(-1px);
}

.register-button.el-button:hover::before {
    left: 150%;
}

.register-button.el-button:active {
    transform: translateY(0);
}

.register-button.el-button.is-disabled {
    color: #163747;
    border-color: #31899f;
    background: #31899f;
    box-shadow: none;
}

.register-button .el-icon {
    position: absolute;
    right: 18px;
    font-size: 17px;
}

/* 登录入口 */
.login-entry {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 4px;
    margin-top: 18px;
    color: #7f9eb2;
    font-size: 12px;
}

.login-link.el-button {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    height: auto;
    padding: 4px 5px;
    color: #49dcf5;
    font-size: 12px;
    font-weight: 600;
    background: transparent;
    border: none;
    transition: color 0.25s, text-shadow 0.25s;
}

.login-link.el-button:hover,
.login-link.el-button:focus-visible {
    color: #a1f4ff;
    background: transparent;
    text-shadow: 0 0 12px rgba(73, 220, 245, 0.55);
}

.login-link .el-icon {
    font-size: 14px;
    transition: transform 0.25s;
}

.login-link.el-button:hover .el-icon {
    transform: translateX(3px);
}

/* 卡片底部 */
.card-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-top: 20px;
    color: #496d83;
    font-size: 8px;
    letter-spacing: 1.4px;
}

.footer-line {
    width: 20px;
    height: 1px;
    flex-shrink: 0;
    background: rgba(94, 159, 188, 0.3);
}

.register-bottom {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 18px;
    color: #55758a;
    font-size: 9px;
    letter-spacing: 2px;
}

.bottom-dot {
    width: 5px;
    height: 5px;
}

/* 页面底部 */
.page-footer {
    position: relative;
    z-index: 2;
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: space-between;
    min-height: 49px;
    padding: 0 6.5%;
    border-top: 1px solid rgba(99, 192, 228, 0.1);
    color: #4f7187;
    font-size: 9px;
    letter-spacing: 0.8px;
    background: rgba(4, 12, 24, 0.3);
}

.footer-status {
    width: 5px;
    height: 5px;
}

/* 动画 */
@keyframes rotate {
    to {
        transform: translate(-50%, -50%) rotate(360deg);
    }
}

@keyframes rotate-reverse {
    to {
        transform: translate(-50%, -50%) rotate(-360deg);
    }
}

@keyframes twinkle {
    from {
        opacity: 0.12;
        transform: scale(0.8);
    }

    to {
        opacity: 0.8;
        transform: scale(1.2);
    }
}

@keyframes ambient-float {
    from {
        transform: translate3d(0, 0, 0);
    }

    to {
        transform: translate3d(30px, -25px, 0);
    }
}

@keyframes core-pulse {

    0%,
    100% {
        opacity: 0.8;
        filter: brightness(1);
    }

    50% {
        opacity: 1;
        filter: brightness(1.25);
    }
}

@keyframes orbit-breathe {

    0%,
    100% {
        opacity: 0.45;
    }

    50% {
        opacity: 1;
    }
}

@keyframes scan {
    from {
        transform: translateY(0);
    }

    to {
        transform: translateY(130vh);
    }
}

/* 中等屏幕 */
@media (max-width: 1050px) {
    .register-main {
        grid-template-columns: minmax(0, 1fr) minmax(350px, 0.9fr);
        gap: 30px;
        width: 92%;
    }

    .hero-title {
        font-size: 48px;
    }

    .ai-visual {
        width: 100%;
        margin-top: 0;
        margin-bottom: -25px;
        transform: scale(0.9);
        transform-origin: center center;
    }

    .feature-list {
        gap: 7px;
    }

    .feature-item {
        gap: 7px;
    }

    .feature-desc {
        font-size: 7px;
    }

    .register-card {
        padding-right: 27px;
        padding-left: 27px;
    }
}

/* 手机端 */
@media (max-width: 760px) {
    .top-header {
        min-height: 70px;
        padding: 0 20px;
    }

    .brand-icon {
        width: 38px;
        height: 38px;
    }

    .brand-name {
        font-size: 18px;
    }

    .header-status {
        font-size: 10px;
    }

    .header-divider,
    .version {
        display: none;
    }

    .register-main {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 15px;
        width: 100%;
        padding: 30px 20px;
    }

    .hero-section {
        width: 100%;
        text-align: center;
    }

    .hero-tag {
        justify-content: center;
        font-size: 9px;
        letter-spacing: 2px;
    }

    .hero-title {
        margin: 16px 0 12px;
        font-size: clamp(36px, 9vw, 49px);
        letter-spacing: 2px;
    }

    .hero-description {
        font-size: 11px;
        line-height: 1.9;
    }

    .ai-visual {
        width: min(100%, 360px);
        height: 200px;
        margin: 0 auto -8px;
        transform: scale(0.8);
        transform-origin: top center;
    }

    .feature-list {
        display: none;
    }

    .register-section {
        width: 100%;
        max-width: 430px;
        margin: 0 auto;
    }

    .register-card {
        padding: 28px 25px 22px;
    }

    .register-form {
        margin-top: 22px;
    }

    .register-form :deep(.el-form-item) {
        margin-bottom: 17px;
    }

    .page-footer {
        min-height: 42px;
        justify-content: center;
        padding: 0 12px;
        font-size: 8px;
    }

    .footer-right {
        display: none;
    }

    .register-bottom {
        margin-top: 14px;
    }
}

/* 小屏手机 */
@media (max-width: 380px) {
    .top-header {
        padding: 0 14px;
    }

    .header-status {
        font-size: 9px;
    }

    .register-main {
        padding-right: 14px;
        padding-left: 14px;
    }

    .register-card {
        padding-right: 20px;
        padding-left: 20px;
    }

    .hero-title {
        font-size: 35px;
    }

    .ai-visual {
        margin-bottom: -20px;
        transform: scale(0.7);
        transform-origin: top center;
    }
}

/* 减少动态效果偏好 */
@media (prefers-reduced-motion: reduce) {

    .ambient,
    .scan-line,
    .star,
    .orbit,
    .orbit-ring,
    .core-inner,
    .core-glow {
        animation: none !important;
    }

    *,
    *::before,
    *::after {
        scroll-behavior: auto !important;
        transition-duration: 0.01ms !important;
    }
}
</style>
```