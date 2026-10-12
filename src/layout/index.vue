<template>
    <div class="layout">
        <!-- 顶部 header -->
        <Header class="layout__header" />

        <div class="layout__body">
            <!-- 侧边 menu（可展开 / 收起） -->
            <aside class="layout__aside" :style="{ width: asideStore.asideWidth }">
                <Menu />
            </aside>

            <!-- 主内容区 -->
            <section class="layout__main">

                <div class="layout__view" :class="{ 'is-full': isFullBleed }">
                    <router-view v-slot="{ Component }">
                        <transition name="view-fade" mode="out-in">
                            <component :is="Component" />
                        </transition>
                    </router-view>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useWindowSize } from '@vueuse/core'
import Header from './components/Header.vue'
import Menu from './components/Menu.vue'
import { useAsideStore } from '@/store/aside'

const route = useRoute()
const asideStore = useAsideStore()

// 内容是否铺满（不额外留内边距），由路由 meta.fullBleed 控制
const isFullBleed = computed(() => !!route.meta?.fullBleed)

// 小屏幕自动收起侧边栏，回到大屏幕再还原
const { width } = useWindowSize()
let autoCollapsed = false

watch(width, (value) => {
    if (value < 1024) {
        if (!asideStore.isCollapse) {
            asideStore.setAsideCollapse(true)
            autoCollapsed = true
        }
        return
    }

    if (autoCollapsed) {
        asideStore.setAsideCollapse(false)
        autoCollapsed = false
    }
})
</script>

<style scoped>
.layout {
    display: flex;
    flex-direction: column;
    height: 100vh;
    height: 100dvh;
    overflow: hidden;
    color: #e4edff;
    background:
        radial-gradient(ellipse at 55% -20%, rgba(27, 82, 166, 0.18), transparent 55%),
        #050b16;
}

.layout__header {
    flex-shrink: 0;
}

.layout__body {
    display: flex;
    flex: 1;
    min-height: 0;
}

/* 侧边栏：展开 220px / 收起 64px */
.layout__aside {
    flex-shrink: 0;
    overflow: hidden;
    border-right: 1px solid rgba(89, 142, 220, 0.17);
    background: rgba(8, 16, 33, 0.86);
    transition: width 0.22s ease;
}

.layout__main {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
}

.layout__view {
    flex: 1;
    min-height: 0;
    padding: 16px;
    overflow: auto;
}

.layout__view.is-full {
    padding: 0;
    overflow: hidden;
}

.view-fade-enter-active,
.view-fade-leave-active {
    transition: opacity 0.16s ease;
}

.view-fade-enter-from,
.view-fade-leave-to {
    opacity: 0;
}

/* 手机端 */
@media (max-width: 640px) {
    .layout__view {
        padding: 10px;
    }
}
</style>