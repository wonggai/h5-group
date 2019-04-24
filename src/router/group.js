export default [
    {
        path: '/user',
        name: 'user',
        meta: {
            title: '拼团详情',
        },
        component: resolve => require(['../components/page/group/UserForm.vue'], resolve),
    },
]