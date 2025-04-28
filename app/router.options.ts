import type { RouterConfig } from "nuxt/schema";

export default <RouterConfig>{
    routes: (_routes) => [
        {
            name: 'login',
            path: '/login',
            component: () => import('~/pages/auth/Login.vue'),
        },
        {
            name: 'index',
            path: '/',
            component: () => import('~/pages/dashboard/Dashboard.vue'),
            meta: { middleware: 'admin' },
        },
        {
            name: 'profile',
            path: '/profile',
            component: () => import('~/pages/auth/Profile.vue'),
            meta: { middleware: 'admin' },
        },
        {
            name: 'user-management',
            path: '/user-management',
            component: () => import('~/pages/SysAuth/UserManagement/List.vue'),
            meta: { middleware: 'admin' },
        },
        {
            name: 'user-management-create',
            path: '/user-management/create',
            component: () => import('~/pages/SysAuth/UserManagement/Create.vue'),
            meta: { middleware: 'admin' },
        },
        {
            name: 'user-management-id',
            path: '/user-management/:id',
            component: () => import('~/pages/SysAuth/UserManagement/[id].vue'),
            meta: { middleware: 'admin' },
        },
    ]
};