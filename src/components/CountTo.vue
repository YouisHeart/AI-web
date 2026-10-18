<template>
    {{ displayValue }}
</template>

<script setup>
import { reactive, computed, watch, onBeforeUnmount } from 'vue'
import gsap from 'gsap'

const props = defineProps({
    // 目标数值
    value: {
        type: Number,
        default: 0
    },
    // 保留的小数位数
    decimals: {
        type: Number,
        default: 0
    },
    // 动画持续时间，单位秒
    duration: {
        type: Number,
        default: 5
    }
})

const d = reactive({
    num: 0
})

let animation

// 格式化动画中的数字
const displayValue = computed(() => {
    return d.num.toLocaleString('zh-CN', {
        minimumFractionDigits: props.decimals,
        maximumFractionDigits: props.decimals
    })
})

// 执行数字滚动动画
function animateToValue() {
    // 停止上一次动画，避免筛选时多个动画冲突
    animation?.kill()

    const target = Number(props.value)

    if (!Number.isFinite(target)) {
        d.num = 0
        return
    }

    animation = gsap.to(d, {
        duration: props.duration,
        num: target,
        ease: 'power2.out',
        overwrite: true
    })
}

// 监听后端数据或筛选结果变化
watch(
    () => props.value,
    () => {
        animateToValue()
    }
)

// 监听小数位数变化，更新显示
watch(
    () => props.decimals,
    () => {
        // decimals 变化时，displayValue 会自动重新计算
    }
)

// 首次加载时执行动画
animateToValue()

// 组件销毁时清理动画
onBeforeUnmount(() => {
    animation?.kill()
})
</script>
