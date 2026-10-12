export default {
    path: '/register',
    name: 'register',
    component: () => import('@/views/register/index.vue'),
    meta: {
        title: "注册页面"
    },
    children: []
}