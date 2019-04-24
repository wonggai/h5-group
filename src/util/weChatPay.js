import mainInfo from '../constants/login';
const appid = mainInfo.appid;
export default {
    onBridgeReady (option, callback) {
        // let promise = new Promise((resolve, reject) => {
            WeixinJSBridge.invoke(
                'getBrandWCPayRequest', {
                    "appId": appid,     //公众号名称，由商户传入
                    ...option,
                    // "timeStamp":"1395712654",         //时间戳，自1970年以来的秒数     
                    // "nonceStr":"e61463f8efa94090b1f366cccfbbb444", //随机串     
                    // "package":"prepay_id=u802345jgfjsdfgsdg888",     
                    // "signType":"MD5",         //微信签名方式：     
                    // "paySign":"70EA570631E4BB79628FBCA90534C63FF7FADD89" //微信签名 
                },
                function (res) {
                    if(res.err_msg == "get_brand_wcpay_request:ok" ){
                        // 使用以上方式判断前端返回,微信团队郑重提示：
                        callback(res)
                    }
                }
            ); 
        // })
        // return promise;
    },

    pay (option, callback) {
        if (typeof WeixinJSBridge == "undefined"){
           if( document.addEventListener ){
               document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
           }else if (document.attachEvent){
               document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
               document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
           }
        }else{
           this.onBridgeReady(option, callback);
        }
    }
}