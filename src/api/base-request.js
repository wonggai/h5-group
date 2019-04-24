/**
 * ajax请求
 * @module
 * @requires whatwg-fetch
 */
import 'whatwg-fetch';

/**
 * 发送ajax请求
 */
class Request {
    constructor () {
        this.addFilter(res => res.json());
    }

    getHeaders () {
        return {};
    }

    addFilter (callback) {
        (this.filterList = this.filterList || []).push(callback);
    }
    filter (promise) {
        return this.filterList.reduce((promise, callback) => {
            return promise.then(data => callback(data));
        }, promise);
    }

    fetch (...args) {
        return this.filter(fetch(...args));
    }

    /**
     * get请求
     * @param {String} url 请求地址
     * @returns {Promise.<Response>}
     */
    get (url) {
        return this.fetch(url, {
            credentials: 'include',
            method: 'GET',
            headers: {
                ...this.getHeaders(),
                // 'Authorization': 'Bearer' + ' ' + token
            },
        });
    }

    /**
     * post请求
     * @param {String} url 请求地址
     * @param {Object} data 请求参数
     * @returns {Promise.<Response>}
     */
    post (url, data) {
        return this.fetch(url, {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...this.getHeaders(),
            },
            body: JSON.stringify(data),
        });
    }
};

/**
 * @member default
 * @static
 * @type {Class}
 */
export default Request;
