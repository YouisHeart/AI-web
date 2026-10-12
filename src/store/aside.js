import { defineStore } from "pinia";

// 侧边栏展开 / 收起时的宽度
export const ASIDE_WIDTH = 220;
export const ASIDE_COLLAPSE_WIDTH = 0;

/**
 * 侧边栏（menu）状态
 * - isCollapse：是否收起
 * - asideWidth：当前宽度（layout 直接绑定使用）
 */
export const useAsideStore = defineStore("aside", {
    state: () => ({
        isCollapse: false,
    }),
    getters: {
        asideWidth: (state) =>
            `${state.isCollapse ? ASIDE_COLLAPSE_WIDTH : ASIDE_WIDTH}px`,
    },
    actions: {
        // 展开 / 收起切换
        toggleAside() {
            this.isCollapse = !this.isCollapse;
        },
        // 指定收起状态
        setAsideCollapse(value) {
            this.isCollapse = !!value;
        },
    },
    // 刷新页面后保持上次的展开状态
    persist: {
        key: "aside",
        paths: ["isCollapse"],
    },
});