import CONST_REQUEST from '../../constants/request'
import api from '../../api/user';
const CACHE_KEY = 'userInfo';

const types = {
    GET_USER_INFO_REQUEST: 'GET_USER_INFO_REQUEST',
    GET_USER_INFO_SUCCESS: 'GET_USER_INFO_SUCCESS',
    GET_USER_INFO_FAILURE: 'GET_USER_INFO_FAILURE',
};

const getDefaultState = () => {
    return {
        getUserInfoStatus: {
            code: null,
            msg: null,
            data: undefined,
        },
    };
};

const getters = {
    getUserInfoStatus (state) {
        return state.getUserInfoStatus;
    },
    userInfo (state) {
        return state.getUserInfoStatus.data;
    },
    tempUserInfo (state) {
        return state.tempUserInfo;
    }
};

const actions = {
    // 获取用户信息
    getUserInfo ({ commit }, data) {
        commit(types.GET_USER_INFO_REQUEST);
        return api.getUserInfo(data).then((res) => {
            if (res.code == CONST_REQUEST.CODE_SUCCESS) {
                commit(types.GET_USER_INFO_SUCCESS, res.data);
            } else {
                throw new Error(res.msg);
            }

            return res;
        }).catch((e) => {
            commit(types.GET_USER_INFO_FAILURE, e);

            throw e;
        });
    },
    // 退出登录
    logout ({ commit }) {
        return api.logout().then((res) => {
            if (res.code == CONST_REQUEST.CODE_SUCCESS) {
                return res;
            } else {
                throw new Error(res.msg);
            }
        });
    },
    // 增加临时保险表单
    addUserInfo (params, data) {
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    },
    // 清除临时保险表单
    clearUserInfo (params) {
        localStorage.removeItem(CACHE_KEY);
    },
};

const mutations = {
    [types.GET_USER_INFO_REQUEST] (state) {
        state.getUserInfoStatus = {
            code: CONST_REQUEST.LOADING,
            msg: null,
            data: undefined,
        };
    },
    [types.GET_USER_INFO_SUCCESS] (state, data) {
        state.getUserInfoStatus = {
            code: CONST_REQUEST.SUCCESS,
            msg: null,
            data,
        };
    },
    [types.GET_USER_INFO_FAILURE] (state, e) {
        state.getUserInfoStatus = {
            code: CONST_REQUEST.FAILURE,
            msg: e.message,
            data: undefined,
        };
    },
};

export default {
    namespaced: true,
    state: getDefaultState(),
    getters,
    actions,
    mutations,
};
