import { ref } from 'vue';
import { createRouter, createWebHashHistory } from "vue-router";
import { getToken } from "@/composables/auth";


// 动态导入模块
const modules = import.meta.glob("./modules/**/*.js", { eager: true });
const routes = [];
Object.keys(modules).forEach((key) => {
    const module = modules[key].default;
    routes.push(module);
});

// 不需要状态页
const noStatusPage = ["/login", "/register"];

// 创建路由
const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

// 设置路由守卫
router.beforeEach(async (to, from, next) => {
    const token = getToken();

    // 设置页面标题
    document.title = (to.meta.title || "") + "-AI智能体";

    // 1. 未登录，且访问的不是免登录页面，跳转登录页
    if (!token && !noStatusPage.includes(to.path)) {
        return next("/login");
    }

    // 2. 已登录，访问登录页或注册页，跳转首页
    if (token && noStatusPage.includes(to.path)) {
        return next("/");
    }

    // 3. 其他情况正常放行
    next();
});


router.afterEach((to, from) => {
    
});

export { router };
