import request from './request';


export default {
    // 获取用户信息
    getUserInfo (payload = {}) {
        return request.post('/api/mp/loginByCode', payload);
    },

    logout () {
        return Promise.resolve({
            code: 1000,
        });
    },
};
