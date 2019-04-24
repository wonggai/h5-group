import browser from "./browser";
import wx from "../wx/util/sdk";

export default {
    getOgPropertyName (name) {
        return `og:${name}`;
    },
    createOgMeta (name) {
        const meta = document.createElement('meta');
        meta.setAttribute('property', this.getOgPropertyName(name));
        document.head.appendChild(meta);

        return meta;
    },
    getOgMeta (name) {
        return document.querySelector(`meta[property="og:${name}"]`) || this.createOgMeta(name);
    },
    setOgMeta (name, val) {
        val !== undefined && this.getOgMeta(name).setAttribute('content', val);
    },
    setTitle (title) {
        title && (document.title = title);
    },
    setInfo (info) {
        const {
            title,
            description,
            url,
            image,
        } = info;
        this.setTitle(title);

        Object.entries(info).forEach(([key, val]) => {
            this.setOgMeta(key, val);
        });

        if (browser.weixin) {
            const shareApiList = 'onMenuShareTimeline,onMenuShareAppMessage,onMenuShareQQ,onMenuShareWeibo,onMenuShareQZone'.split(',');
            shareApiList.forEach((method) => {
                wx[method]({
                    title, // 分享标题
                    desc: description, // 分享描述
                    link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: image, // 分享图标
                    success () {
                        // 用户确认分享后执行的回调函数
                    },
                    cancel () {
                        // 用户取消分享后执行的回调函数
                    },
                });
            });
        }
    },
};
