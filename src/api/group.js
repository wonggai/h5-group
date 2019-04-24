import request from './request';

export default {
    /**
     * 获取拼团活动详情
     * @param  {Object} topicId 活动id
     * @return {[type]}         [description]
     */
    getGroupDetail (payload) {
        return request.post('/api/mp/topic/detail', payload);
    },
    /**
     * 获取开团列表
     * @param  {Object} topicId 活动id
     * @return {[type]}         [description]
     */
    getGroupTeamList (payload) {
        return request.post('/api/mp/team/list', payload);
    },
    /**
     * 开团
     * @param  {Object} topicId 活动id
     * @return {[type]}         [description]
     */
    openGroup (payload) {
        return request.post('/api/mp/team/add', payload);
    },
    /**
     * 参团
     * @param  {Object} topicId 活动id，teamId 成员id
     * @return {[type]}         [description]
     */
    joinGroup (payload) {
        return request.post('/api/mp/team/join', payload);
    },
    /**
     * 支付前
     * @param  {Object} orderId 订单id
     * @return {[type]}         [description]
     */
    prePay (payload) {
        return request.post('/api/mp/pay/prepayOrder', payload);
    },
    /**
     * 支付前
     * @param  {Object} orderId 订单id
     * @return {[type]}         [description]
     */
    getTeamDetail (payload) {
        return request.post('/api/mp/team/detail', payload);
    },
    /**
     * 支付前
     * @param  {Object} orderId 订单id
     * @return {[type]}         [description]
     */
    getQueryPay (payload) {
        return request.post('/api/mp/pay/query', payload);
    },
}
