/**
 * 微信接口
 * @module
 * @requires ../../common/api/request
 * @requires ../../common/constants/request
 */
import request from '../../api/request.js';
import CONST_REQUEST from '../../constants/request.js';

export default {
    /**
     * 获取签名信息
     * {@ http://wiki.chuantest.com:8888/pages/viewpage.action?pageId=2164750 接口文档}
     * @param {String} url 需要签名的url
     * @returns {Promise.<Response>}
     */
    sign (url) {
        return request.post('/api/mp/getJsSign', {
            url,
        }).then((data) => {
            if (data.code === CONST_REQUEST.CODE_SUCCESS) {
                return data;
            }
        });
    },
};
