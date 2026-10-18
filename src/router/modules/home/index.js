export default {
    path: "/",
    name: "Layout", // 布局容器
    component: () => import("@/layout/index.vue"),
    meta: {
        container: true, // 仅作为容器，菜单栏取它的子路由
        title: "首页",
    },
    children: [
        {
            path: "/", // 空路径：作为默认主页，地址为 /
            name: "HomePage",
            component: () => import("@/views/ai-chat/index.vue"),
            meta: {
                title: "AI 对话",
                icon: "ChatDotRound", // 菜单图标（Element Plus 图标名）
                isShow: true, // 显示在菜单栏
                fullBleed: true, // 内容铺满 main 区域（不需要额外内边距）
            },
        },
        {
            path: "/user/manage", 
            name: "UserManage",
            component: () => import("@/views/userManager/index.vue"),
            meta: {
                title: "用户管理",
                icon: "User", 
                isShow: true, 
                fullBleed: true, 
            },
        },
        {
            path: "/user/usage",
            name: "UserUsage",
            component: () => import("@/views/usage/index.vue"),
            meta: {
                title: "用量信息",
                icon: "Cpu",
                isShow: true,
                fullBleed: true,
            },
        },
    ],
};