import Vue from 'vue';
import Vuex from 'vuex';
import group from './modules/group';
import user from './modules/user';
Vue.use(Vuex);
export default new Vuex.Store({
    modules: {
        group,
        user,
    },
});
