const redirect_uri = encodeURIComponent('http://pintuan.sheyu.xin/return');
const appid = 'wxc66be6adbe3d6641';
const loginConfig = {
    'appid': 'wxc66be6adbe3d6641',
    'redirect_uri': redirect_uri,
    'response_type': 'code',
    'scope': 'snsapi_userinfo', // 非静默登陆
}
let locationHref = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${loginConfig.appid}&response_type=${loginConfig.response_type}&scope=${loginConfig.scope}`;
export default {
    locationHref,
    redirect_uri,
    appid,
}
