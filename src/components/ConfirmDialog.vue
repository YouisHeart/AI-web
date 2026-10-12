<template>
  <el-dialog v-model="visible" :width="config.width" :show-close="false"
    :close-on-click-modal="config.closeOnClickModal" :close-on-press-escape="config.closeOnPressEscape"
    :append-to-body="true" :destroy-on-close="false" :modal-class="'ai-confirm-overlay'" class="ai-confirm-dialog"
    @closed="handleClosed">
    <div class="confirm-panel">
      <!-- 顶部装饰线 -->
      <div class="confirm-panel__scanline"></div>

      <!-- 标题区域 -->
      <div class="confirm-header">
        <div class="confirm-header__tag">
          <span class="status-dot"></span>
          {{ config.systemLabel }}
        </div>

        <button v-if="config.showClose" class="confirm-close" type="button" aria-label="关闭弹窗" @click="handleCancel">
          <el-icon>
            <Close />
          </el-icon>
        </button>
      </div>

      <!-- 图标区域 -->
      <div class="confirm-icon" :class="`confirm-icon--${config.type}`">
        <div class="confirm-icon__halo"></div>
        <el-icon :size="32">
          <component :is="currentIcon" />
        </el-icon>
      </div>

      <!-- 文案区域 -->
      <div class="confirm-content">
        <h3 class="confirm-title">{{ config.title }}</h3>

        <p class="confirm-description">
          {{ config.description }}
        </p>

        <div v-if="config.customContent" class="confirm-custom-content">
          <slot name="content" />
        </div>

        <div v-if="config.tip" class="confirm-tip" :class="`confirm-tip--${config.type}`">
          <el-icon>
            <InfoFilled />
          </el-icon>
          <span>{{ config.tip }}</span>
        </div>
      </div>

      <!-- 底部按钮 -->
      <div class="confirm-actions">
        <el-button class="confirm-button confirm-button--cancel" :disabled="loading" @click="handleCancel">
          {{ config.cancelText }}
        </el-button>

        <el-button class="confirm-button confirm-button--confirm" :class="`confirm-button--${config.type}`"
          :loading="loading" @click="handleConfirm">
          <el-icon v-if="!loading">
            <component :is="currentButtonIcon" />
          </el-icon>
          {{ config.confirmText }}
        </el-button>
      </div>

      <!-- 底部系统标识 -->
      <div class="confirm-footer">
        <span class="confirm-footer__line"></span>
        <span>{{ config.footerText }}</span>
        <span class="confirm-footer__line"></span>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { computed, ref } from 'vue'
import {
  Close,
  InfoFilled,
  WarningFilled,
  CircleCheckFilled,
  Delete,
  SwitchButton,
  Refresh,
} from '@element-plus/icons-vue'

const visible = ref(false)
const loading = ref(false)

const defaultConfig = {
  title: '确认执行此操作？',
  description: '请确认是否继续执行当前操作。',
  tip: '',
  confirmText: '确认执行',
  cancelText: '取消',
  type: 'primary',
  icon: '',
  width: '440px',
  showClose: true,
  closeOnClickModal: false,
  closeOnPressEscape: true,
  systemLabel: 'NEXUS SECURITY CENTER',
  footerText: 'SECURE OPERATION · AI SYSTEM',
  customContent: false,
}

const config = ref({ ...defaultConfig })

let resolvePromise = null
let settled = false

const iconMap = {
  primary: CircleCheckFilled,
  warning: WarningFilled,
  danger: WarningFilled,
  success: CircleCheckFilled,
  logout: SwitchButton,
  delete: Delete,
  refresh: Refresh,
}

const currentIcon = computed(() => {
  return iconMap[config.value.icon]
    ? iconMap[config.value.icon]
    : iconMap[config.value.type] || CircleCheckFilled
})

const currentButtonIcon = computed(() => {
  if (config.value.icon && iconMap[config.value.icon]) {
    return iconMap[config.value.icon]
  }

  return iconMap[config.value.type] || CircleCheckFilled
})

/**
 * 打开弹窗。
 * 返回 Promise<boolean>：
 * 确认返回 true，取消或关闭返回 false。
 */
function open(options = {}) {
  if (visible.value) {
    return Promise.resolve(false)
  }

  config.value = {
    ...defaultConfig,
    ...options,
  }

  loading.value = false
  settled = false
  visible.value = true

  return new Promise((resolve) => {
    resolvePromise = resolve
  })
}

function settle(result) {
  if (settled) return

  settled = true

  if (resolvePromise) {
    resolvePromise(result)
    resolvePromise = null
  }

  visible.value = false
}

function handleCancel() {
  if (loading.value) return
  settle(false)
}

function handleClosed() {
  // 处理按 ESC 或其他方式关闭的情况
  if (!settled) {
    settle(false)
  }
}

/**
 * 确认前允许执行异步校验。
 * 如果 onConfirm 返回 false，则保持弹窗打开。
 * 如果 onConfirm 抛出异常，则停止确认并保留弹窗。
 */
async function handleConfirm() {
  if (loading.value || settled) return

  loading.value = true

  try {
    if (typeof config.value.onConfirm === 'function') {
      const result = await config.value.onConfirm()

      if (result === false) return
    }

    settle(true)
  } catch (error) {
    console.error('确认操作执行失败：', error)
  } finally {
    loading.value = false
  }
}

defineExpose({
  open,
  close: handleCancel,
})
</script>

<style>
/* Dialog 挂载到 body，因此遮罩样式使用全局选择器 */
.ai-confirm-overlay {
  background: rgba(2, 8, 22, 0.76) !important;
  backdrop-filter: blur(8px);
}

.ai-confirm-overlay+.el-overlay-dialog {
  overflow-y: auto;
}

.ai-confirm-dialog {
  overflow: hidden;
  padding: 0 !important;
  border: 1px solid rgba(68, 153, 255, 0.42);
  border-radius: 16px;
  background: #08152b !important;
  box-shadow:
    0 24px 80px rgba(0, 0, 0, 0.48),
    0 0 38px rgba(37, 127, 255, 0.14),
    inset 0 0 30px rgba(28, 98, 190, 0.06);
}

.ai-confirm-dialog .el-dialog__header {
  display: none;
}

.ai-confirm-dialog .el-dialog__body {
  padding: 0 !important;
  color: #dceaff;
}

.ai-confirm-dialog .el-dialog__footer {
  padding: 0;
}

.confirm-panel {
  position: relative;
  overflow: hidden;
  padding: 25px 28px 20px;
  color: #dceaff;
  background:
    radial-gradient(ellipse at 50% 28%,
      rgba(24, 93, 183, 0.2),
      transparent 55%),
    linear-gradient(145deg, #0b1c38, #071226 72%);
}

.confirm-panel__scanline {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg,
      transparent,
      #39cfff,
      #537dff,
      transparent);
  box-shadow: 0 0 14px rgba(57, 207, 255, 0.7);
}

.confirm-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.confirm-header__tag {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #7da5d9;
  font-size: 10px;
  letter-spacing: 1.5px;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #41e8ba;
  box-shadow: 0 0 10px rgba(65, 232, 186, 0.8);
}

.confirm-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  padding: 0;
  border: 1px solid rgba(108, 151, 211, 0.2);
  border-radius: 8px;
  color: #809abd;
  background: rgba(30, 58, 95, 0.25);
  cursor: pointer;
  transition: all 0.2s ease;
}

.confirm-close:hover {
  border-color: rgba(70, 176, 255, 0.6);
  color: #e2f4ff;
  background: rgba(42, 114, 200, 0.2);
}

.confirm-icon {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 76px;
  height: 76px;
  margin: 27px auto 20px;
  border: 1px solid rgba(70, 157, 255, 0.5);
  border-radius: 22px;
  color: #65caff;
  background: linear-gradient(145deg,
      rgba(36, 104, 190, 0.28),
      rgba(10, 37, 75, 0.4));
  box-shadow:
    0 0 28px rgba(40, 131, 255, 0.12),
    inset 0 0 20px rgba(40, 131, 255, 0.08);
}

.confirm-icon__halo {
  position: absolute;
  inset: -7px;
  border: 1px solid rgba(66, 159, 255, 0.12);
  border-radius: 27px;
}

.confirm-icon--warning {
  border-color: rgba(255, 190, 74, 0.5);
  color: #ffc75e;
  background: rgba(255, 170, 42, 0.08);
  box-shadow: 0 0 24px rgba(255, 170, 42, 0.1);
}

.confirm-icon--danger {
  border-color: rgba(255, 94, 126, 0.48);
  color: #ff809b;
  background: rgba(255, 61, 98, 0.09);
  box-shadow: 0 0 24px rgba(255, 61, 98, 0.1);
}

.confirm-icon--success {
  border-color: rgba(60, 226, 179, 0.48);
  color: #54e6bd;
  background: rgba(60, 226, 179, 0.08);
}

.confirm-content {
  text-align: center;
}

.confirm-title {
  margin: 0;
  color: #e7f1ff;
  font-size: 20px;
  font-weight: 650;
  letter-spacing: 0.5px;
}

.confirm-description {
  margin: 12px 0 0;
  color: #8ca4c8;
  font-size: 13px;
  line-height: 1.9;
  overflow-wrap: anywhere;
}

.confirm-tip {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 18px;
  padding: 11px 12px;
  border: 1px solid rgba(91, 148, 219, 0.2);
  border-radius: 8px;
  color: #91b9e8;
  background: rgba(25, 70, 125, 0.16);
  font-size: 12px;
  line-height: 1.7;
  text-align: left;
}

.confirm-tip--danger {
  border-color: rgba(255, 91, 122, 0.22);
  color: #f59aaa;
  background: rgba(133, 30, 55, 0.12);
}

.confirm-tip--warning {
  border-color: rgba(255, 190, 74, 0.22);
  color: #f3c878;
  background: rgba(133, 91, 20, 0.1);
}

.confirm-tip .el-icon {
  margin-top: 3px;
  flex-shrink: 0;
}

.confirm-actions {
  display: flex;
  gap: 12px;
  margin-top: 27px;
}

.confirm-button.el-button {
  display: inline-flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 7px;
  height: 42px;
  margin: 0;
  border-radius: 9px;
  font-size: 13px;
  transition: all 0.2s ease;
}

.confirm-button--cancel.el-button {
  border: 1px solid rgba(107, 147, 203, 0.25);
  color: #9cb4d8;
  background: rgba(22, 42, 73, 0.65);
}

.confirm-button--cancel.el-button:hover {
  border-color: rgba(87, 171, 255, 0.55);
  color: #e2f2ff;
  background: rgba(39, 83, 139, 0.35);
}

.confirm-button--confirm.el-button {
  border: 1px solid rgba(60, 164, 255, 0.65);
  color: #f0f8ff;
  background: linear-gradient(110deg, #246ee7, #168bbd);
  box-shadow: 0 0 16px rgba(31, 126, 238, 0.16);
}

.confirm-button--confirm.el-button:hover {
  border-color: #70caff;
  background: linear-gradient(110deg, #347ff6, #16a7d3);
  box-shadow: 0 0 22px rgba(31, 126, 238, 0.3);
}

.confirm-button--danger.el-button {
  border-color: rgba(255, 91, 123, 0.6);
  background: linear-gradient(110deg, #c9365c, #e84f66);
  box-shadow: 0 0 16px rgba(232, 79, 102, 0.12);
}

.confirm-button--danger.el-button:hover {
  border-color: #ff9bab;
  background: linear-gradient(110deg, #e04467, #f35c74);
}

.confirm-button--warning.el-button {
  border-color: rgba(255, 183, 61, 0.65);
  color: #fff8e9;
  background: linear-gradient(110deg, #a96b18, #c18a24);
}

.confirm-button--success.el-button {
  border-color: rgba(60, 226, 179, 0.55);
  background: linear-gradient(110deg, #087c79, #119f9b);
}

.confirm-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 23px;
  color: #4e6c94;
  font-size: 9px;
  letter-spacing: 1.2px;
}

.confirm-custom-content {
  margin-top: 20px;
  text-align: left;
}

.confirm-footer__line {
  width: 28px;
  height: 1px;
  background: linear-gradient(90deg, transparent, #294b78);
}

.confirm-footer__line:last-child {
  transform: rotate(180deg);
}

/* 弹窗打开动画 */
.ai-confirm-dialog {
  animation: confirm-dialog-enter 0.24s ease-out;
}

@keyframes confirm-dialog-enter {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (max-width: 480px) {
  .ai-confirm-dialog {
    width: calc(100% - 32px) !important;
    margin-top: 20vh;
  }

  .confirm-panel {
    padding: 20px 18px 17px;
  }

  .confirm-title {
    font-size: 18px;
  }

  .confirm-description {
    font-size: 12px;
  }

  .confirm-button.el-button {
    height: 40px;
    font-size: 12px;
  }
}
</style>
