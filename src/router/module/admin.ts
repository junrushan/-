import { RouteRecordRaw } from 'vue-router';
const AdminRouter: Array<RouteRecordRaw> = [
    {
        path: '/LoginAdmin',
        name: 'LoginAdmin',
        meta: {
            title: '后台登录',
            keepAlive: true,
            requireAuth: false
        },
        component: () => import('@/pages/admin/LoginAdmin.vue')
    }
];
export default AdminRouter;
