import CONST_REQUEST from '../../constants/request';
import api from '../../api/group';
import apiTools from '../../util/store'

const types = Object.assign(
    apiTools.getTypes(['groupDetail', 'groupTeamList', 'teamDetail', 'queryPay']),
    )

const getDefaultState = () => {
    return Object.assign(
        apiTools.getStates(['groupDetail', 'groupTeamList', 'teamDetail', 'queryPay']),
    )
}

const getters = Object.assign(
    apiTools.getGetters(['groupDetail', 'groupTeamList', 'teamDetail', 'queryPay'])
    )

const buildAction = (apiName) => {
    return ({ commit }, params) => {
        return api[apiName](params).then((res) => {
            if (res.code == CONST_REQUEST.CODE_SUCCESS) {
                return res
            } else {
                throw new Error(res.msg)
            }
        })
    }
}

const actions = Object.assign(
    apiTools.getActions(['getGroupDetail', 'getGroupTeamList', 'getTeamDetail', 'getQueryPay'], { types, api, CONST_REQUEST }),
    {
        openGroup: buildAction('openGroup'),
        joinGroup: buildAction('joinGroup'),
        prePay: buildAction('prePay'),
    }
    )

const mutations = Object.assign(
    apiTools.getMutations(['groupDetail', 'groupTeamList', 'teamDetail', 'queryPay'], { types, CONST_REQUEST })
)

export default {
    namespaced: true,
    state: getDefaultState(),
    getters,
    actions,
    mutations
}
