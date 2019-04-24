const ua = navigator.userAgent;

export default {
    weixin: ua.toLowerCase().match(/MicroMessenger/i) == "micromessenger",
    android: ua.indexOf('Android') >= 0 || ua.indexOf('Adr') >= 0,
    ios: !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
    sca: ua.indexOf('SCAWebKit') >= 0,
};
