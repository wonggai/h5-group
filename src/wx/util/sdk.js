import wxService from "../api/wx.js";
import browser from "../../util/browser.js";

class Loader {
    loadScript (src) {
        return new Promise((resolve, reject) => {
            var head = document.getElementsByTagName('head')[0];
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.onreadystatechange = function () {
                this.readyState == 'complete' && resolve();
            };
            script.onload = function () {
                resolve();
            };
            script.onerror = function (err) {
                reject(err);
            };
            script.src = src;
            head.appendChild(script);
        });
    }
}

const jsApiList = "onMenuShareTimeline,onMenuShareAppMessage,onMenuShareQQ,onMenuShareWeibo,onMenuShareQZone,startRecord,stopRecord,onVoiceRecordEnd,playVoice,pauseVoice,stopVoice,onVoicePlayEnd,uploadVoice,downloadVoice,chooseImage,previewImage,uploadImage,downloadImage,translateVoice,getNetworkType,openLocation,getLocation,hideOptionMenu,showOptionMenu,hideMenuItems,showMenuItems,hideAllNonBaseMenuItem,showAllNonBaseMenuItem,closeWindow,scanQRCode,chooseWXPay,openProductSpecificView,addCard,chooseCard,openCard".split(',');

class WxSdk extends Loader {
    constructor () {
        super();

        this._promise = null;
        this.href = location.href;
    }
    getWX () {
        return window.wx;
    }
    init () {
        if (this._promise) return this._promise;
        
        const wx = this.getWX();
        this._promise = Promise.all([
            !wx ? this.loadScript('//res.wx.qq.com/open/js/jweixin-1.2.0.js').then(() => this.getWX()) : Promise.resolve(wx),
            wxService.sign(this.href).then(res => res && res.data)
        ]).then(([wx, sign]) => {
            this.setConfig(sign);

            return new Promise((resolve, reject) => {
                wx.ready(() => resolve(wx));
            });
        });

        this.startAutoClear();

        return this._promise;
    }
    startAutoClear () {
        this.stopAutoClear();
        this._autoClearTimer = setTimeout(() => {
            this.clear();
        }, 60 * 60 * 1000);
    }
    stopAutoClear () {
        this._autoClearTimer && clearTimeout(this._autoClearTimer);
        this._autoClearTimer = null;
    }
    clear () {
        this.stopAutoClear();
        this._promise = null;
        this.href = location.href;
    }
    autoClear () {
        this.href != location.href && this.clear();
    }
    setConfig (config) {
        this.getWX().config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            // appId, // 必填，公众号的唯一标识
            // timestamp, // 必填，生成签名的时间戳
            // nonceStr, // 必填，生成签名的随机串
            // signature, // 必填，签名，见附录1
            jsApiList, // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            ...config,
        });
    }
    call (method, ...args) {
        // 只有在微信中才会执行
        if (!browser.weixin) return;

        // 安卓下扫码api如果签名的url和当前url不一致，会报权限问题
        if (browser.android && method == 'scanQRCode') this.autoClear();

        // this.autoClear();

        this.init().then((wx) => {
            wx[method](...args);
        });
    }
}

jsApiList.forEach((method) => {
    WxSdk.prototype[method] = function (...args) {
        return this.call(method, ...args);
    };
});

export default new WxSdk();
