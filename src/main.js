import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store'
import titleUtil from './util/title';
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import cookie from './util/cookie';
import Vant from 'vant';
import 'vant/lib/index.css';
import userMixin from './components/common/user-mixin';

Vue.config.productionTip = false;

[
    Vant,
    MintUI,
].forEach(plugin => Vue.use(plugin));

[
    userMixin,
].forEach(mixin => Vue.mixin(mixin));

// 设置token
// router.beforeEach((to, from, next) => {
//     const { token } = cookie.get('token');

//     if (!token) {
//         cookie.set('token', token);
//         delete to.query.token;

//         next({ ...to });
//     } else {
//         next();
//     }
// });

// 设置页面标题
router.afterEach(route => {
    const { title } = route.meta || {};
    titleUtil.setTitle(title || '拼团');
});

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app')
