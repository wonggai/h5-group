/**
 * ajax请求状态
 * @module
 */

/**
 * @enum {number}
 */
export default {
    /**
     * 状态码-成功
     */
    CODE_SUCCESS: 1000,
    /**
     * 状态码-未登录
     */
    CODE_UNLOGIN: -1001,
    /**
     * 状态码-权限不足
     */
    CODE_PERMISSION_DENIED: -1002,
    /**
     * 加载中
     * @type {Symbol}
     */
    LOADING: Symbol('LOADING'),
    /**
     * 加载成功
     * @type {Symbol}
     */
    SUCCESS: Symbol('SUCCESS'),
    /**
     * 加载失败
     * @type {Symbol}
     */
    FAILURE: Symbol('FAILURE'),
};
