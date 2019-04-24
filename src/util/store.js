import _ from 'lodash';
const requestArr = ['_REQUEST', '_SUCCESS', '_FAILURE'];

export default {
    /**
     * 获取types
     * @param {string} name 驼峰名称
     * @param {number} key 方式
     */
    getTypesObj (name, key) {
        const hump = name && name.replace(/([A-Z])/g, "_$1").toUpperCase();
        const method = key && key + '_';
        const obj = requestArr.reduce((item, val) => {
            const key = method + hump + val;
            item[key] = key;
            return item
        }, {})
        return obj;
    },
    getTypes (types, key = 'GET') {
        const arr = types.map(item => {
            return this.getTypesObj(item, key)
        })
        const obj = arr.reduce((item, val) => {
            item = Object.assign(item, val);
            return item
        }, {})
        return obj;
    },
    /**
     * 创建store的state
     * @param  {Array} data  state子节点名称数组集合
     * @param  {String} key  state子节点后缀
     * @return {Object}      子节点对象集合
     * @example
     * // returns { shipListStatus: { data: null,msg: null,code: null,req: null }, ... }
     * getStates (['shipList'])
     */
    getStates (data, key = 'Status') {
        // const hump = data && data.map(item => {
        //     return item.replace(/([A-Z])/g,"_$1");
        // });
        const stateObj = data && data.reduce((item, val) => {
            const _key = val + key
            item = Object.assign(item, {
                [_key]: {
                    data: null,
                    msg: null,
                    code: null,
                    req: null,
                }
            })
            return item
        }, {})
        return stateObj
    },
    getGetters (data, key = 'Status') {
        const getterObj = data && data.reduce((item, val) => {
            let _key = val + key
            let _req = val + 'Req'
            item = Object.assign(item, {
                [_key] (state) {
                    return state[_key]
                },
                [val] (state) {
                    return state[_key].data
                },
                [_req] (state) {
                    return state[_key].req
                },
            })
            return item
        }, {})
        return getterObj
    },
    getMutations (apiName, { types, CONST_REQUEST }) {
        const mutationObj = apiName && apiName.reduce((item, val) => {
            const key = val && val.replace(/([A-Z])/g, "_$1").toUpperCase();
            const request = 'GET_' + key + '_REQUEST';
            const success = 'GET_' + key + '_SUCCESS';
            const failure = 'GET_' + key + '_FAILURE';
            const statusName = val + 'Status'
            item = Object.assign(item, {
                [types[request]] (state, req) {
                    state[statusName] = {
                        code: CONST_REQUEST.LOADING,
                        msg: null,
                        req,
                    }
                },
                [types[success]] (state, res) {
                    state[statusName] = {
                        ...state[statusName],
                        code: CONST_REQUEST.SUCCESS,
                        data: res || null,
                    }
                },
                [types[failure]] (state, e) {
                    state[statusName] = {
                        ...state[statusName],
                        code: CONST_REQUEST.FAILURE,
                        msg: e && typeof e === 'string' ? e : '服务异常，请稍后再试~'
                    }
                },
            })
            return item
        }, {})
        return mutationObj
    },
    getActions (apiName, { types, api, CONST_REQUEST }) {
        const actionObj = apiName && apiName.reduce((item, val) => {
            const key = val && val.replace(/([A-Z])/g, "_$1").toUpperCase();
            const request = key + '_REQUEST';
            const success = key + '_SUCCESS';
            const failure = key + '_FAILURE';
            item = Object.assign(item, {
                [val] ({ commit }, data) {
                    commit(types[request], data);
                    return api[val](data).then((res) => {
                        if (res.code === CONST_REQUEST.CODE_SUCCESS) {
                            commit(types[success], res.data);
                        } else {
                            throw new Error(res.msg)
                        }
                        return res
                    }).catch((e) => {
                        commit(types[failure], e.message)
                        throw e.message;
                    })
                },
            })
            return item;
        }, {})
        return actionObj
    },
    /**
     * 清除空值
     * @param  {Object} data
     * @return {Object}
     */
    filterParams (data) {
        let obj = { ...data };
        for (let key in obj) {
            if (_.isEmpty(obj[key]) && (typeof obj[key] != 'number' && typeof obj[key] != 'boolean')) {
                delete obj[key];
            }
        }
        return obj;
    },
}
