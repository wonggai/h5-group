import group from './group';
export default [
    {
        path: '/',
        name: 'layout',
        component: resolve => require(['../components/page/layout.vue'], resolve),
        children: [
            {
                path: '/return',
                name: 'return',
                meta: {
                    title: 'loading',
                },
                component: resolve => require(['../components/page/return.vue'], resolve),
            },
            {
                path: '/home',
                name: 'home',
                meta: {
                    title: '拼团',
                },
                component: resolve => require(['../components/page/group/Home.vue'], resolve),
            },
            {
                path: '/user',
                name: 'userForm',
                meta: {
                    title: '拼团详情',
                },
                component: resolve => require(['../components/page/group/UserForm.vue'], resolve),
            },
            {
                path: '/pay',
                name: 'pay',
                meta: {
                    title: '支付',
                },
                component: resolve => require(['../components/page/group/Pay.vue'], resolve),
            },
            {
                path: '/teamList',
                name: 'teamList',
                meta: {
                    title: '拼团列表',
                },
                component: resolve => require(['../components/page/group/List.vue'], resolve),
            },
        ],
    },
]