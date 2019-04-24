/**
 * ajax请求
 * @module
 * @requires vue-cookie
 */
import cookie from 'vue-cookie';
import cookieUtil from '../util/cookie';
import BaseRequest from './base-request';
import CODE_REQUEST from '../constants/request';
import redirectUri from '../constants/login';

/**
 * 发送ajax请求
 */
class Request extends BaseRequest {
    constructor (...args) {
        super(...args);

        this.addFilter(this.checkLogin.bind(this));
    }
    getHeaders () {
        const { projectVersion, api } = process.env;

        return Object.assign(super.getHeaders(), {
            token: this.getToken(),

            ...(api && api.headers),
        });
    }
    getToken () {
        return cookie.get('token');
    }
    checkLogin (res) {
        if (res.code == CODE_REQUEST.CODE_UNLOGIN) {
            cookieUtil.delete('token');
            const id = this.getQueryString('id');
            window.location.href = redirectUri.locationHref + `&redirect_uri=${redirectUri.redirect_uri + encodeURIComponent('?id=' + id)}#wechat_redirect`;
        }

        return res;
    }
    getQueryString (name) { 
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
        let r = window.location.search.substr(1).match(reg); 
        if (r != null) {
            return unescape(r[2]); 
        }
        return null;
    }
};

/**
 * @member Request
 * @static
 * @type {Function}
 */
export { Request };

/**
 * @member default
 * @static
 * @see {@link Request}
 * @type {Request}
 */
export default new Request();
