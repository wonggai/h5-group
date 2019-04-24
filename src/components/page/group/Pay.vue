<template>
    <div>
        <div
            v-if="active = 'detail'"
            class="insure-form">
            <div class="top-header" @click="back">
                <div
                    class="back"
                    @click="back"></div>
                <div class="title">支付</div>
            </div>
            <div class="pay-box">
                <div
                    class="result"
                    v-if="result == 0">
                    <p class="order">订单金额：</p>
                    <p class="amount">¥{{ price }}</p>
                </div>
                <div
                    class="result"
                    v-if="result == 1">
                    <div style="line-height: 30px; margin-bottom: 25px;">
                        <span class="success"></span>
                        <span class="order-status">{{ CONST_RESULT[result] }}</span>
                    </div>
                    <p class="status">恭喜您开团成功，立即邀请小伙伴参团吧</p>
                </div>
                <div
                    class="result"
                    v-if="result == 2">
                    <div style="line-height: 30px; margin-bottom: 25px;">
                        <span class="error"></span>
                        <span class="order-status">{{ CONST_RESULT[result] }}</span>
                    </div>
                    <p class="status">支付遇到问题，请尝试重新支付</p>
                </div>
            </div>
            <div
                v-if="result == 0"
                class="pay-methods">
                <div
                    class="wechat"></div>
                <span class="title">微信支付</span>
                <van-checkbox
                    class="check"
                    v-model="checked"
                    checked-color="#ff7d37"></van-checkbox>
            </div>
            <div class="submit-box">
                <van-button
                    v-if="result != 1"
                    class="submit-btn"
                    @click="pay">{{ CONST_RESULT_BTN[result] }}</van-button>
                <!-- <van-button
                    v-if="result == 1"
                    class="submit-btn"
                    @click="shareToFriend">{{ CONST_RESULT_BTN[result] }}</van-button> -->
            </div>
        </div>
        <div
            v-if="active == 'loading'"
            class="loading-box">
            <van-loading color="black" />
        </div>
    </div>
</template>
<script>
    import { Toast } from 'vant';
    import { mapActions, mapGetters } from 'vuex';
    import weChatPay from '../../../util/weChatPay';
    import share from '../../../util/share';
    export default {
        data () {
            return {
                active: 'loading',
                CONST_RESULT: {
                    '0': '未支付',
                    '1': '支付成功',
                    '2': '支付失败',
                },
                CONST_RESULT_BTN: {
                    '0': '立即支付',
                    '1': '已开团，邀请好友参加',
                    '2': '重新支付',
                },
                checked: true,
            }
        },
        computed: {
            ...mapGetters('group', [
                'teamDetail',
                'queryPay',
            ]),
            topicId () {
                return this.$route.query.id;
            },
            teamId () {
                return this.$route.query.teamId;
            },
            price () {
                return this.$route.query.price;
            },
            orderId () {
                return this.$route.query.orderId;
            },
            result () {
                return (this.queryPay && this.queryPay.result) || 0;
            }
        },
        created () {
            this.loadPage();
            this.setShareInfo();
        },
        methods: {
            ...mapActions('group', [
                'prePay',
                'getQueryPay',
            ]),
            openLoading () {
                this.active = 'loading';
            },
            closeLoading () {
                this.active = 'detail';
            },
            back () {
                if (window.history.length <= 1) {
                    this.$router.push({ name: 'home', query: { id: this.topicId} });
                    return false
                } else {
                    this.$router.back(-1)
                }
            },
            loadPage () {
                let { orderId } = this;
                this.openLoading();
                this.getQueryPay({ orderId }).then(res => {
                    this.closeLoading()
                }).catch(e => {
                    this.closeLoading();
                    e.message && Toast(e.message);
                })
            },
            setShareInfo () {
                let { title, coverUrl, id } = this.$route.query;
                const url = new URL(`http://pintuan.sheyu.xin/home?id=${id}`);
                share.setInfo({
                    title,
                    description: title,
                    image: coverUrl,
                    url: url.toString(),
                });
            },
            pay () {
                let { orderId } = this;
                if (this.result == 0 && !this.checked) {
                    Toast('请选择支付方式')
                } else {
                    this.prePay({ orderId }).then(res => {
                        const data = res && res.data;
                        const option = {
                            'appid': data.appid,
                            "timeStamp": data.timeStamp, //时间戳，自1970年以来的秒数     
                            "nonceStr": data.nonceStr, //随机串     
                            "package": data.packageValue,     
                            "signType": data.signType, //微信签名方式：     
                            "paySign": data.paySign //微信签名 
                        }
                        weChatPay.pay(option, (res) => {
                            this.loadPage();
                        });
                    })
                }
            }
        }
    }
</script>
<style lang="less" scoped>
    .top-header {
        position: relative;
        width: 100%;
        height: 50px;
        background: #fff;
        text-align: center;

        .back {
            position: absolute;
            top: 50%;
            left: 10px;
            margin-top: -10px;
            width: 22px;
            height: 20px;
            background: url('../../../assets/back.png') no-repeat;
            background-size: 100%;
        }

        .title {
            line-height: 50px;
        }
    }

    .pay-box {
        margin-top: 3px;
        position: relative;
        width: 100%;
        height: 155px;
        background: #fff;
        text-align: center;
    }

    .result {
        position: relative;
        transform: translateY(50%);

        .success {
            display: inline-block;
            width: 30px;
            height: 30px;
            background: url('../../../assets/success.png') no-repeat;
            background-size: 100%;
            vertical-align: top;
        }

        .error {
            display: inline-block;
            width: 30px;
            height: 30px;
            background: url('../../../assets/error.png') no-repeat;
            background-size: 100%;
            vertical-align: top;
        }
    }

    .order {
        font-size: 14px;
        color: #a9a9a9;
    }

    .amount {
        margin-top: 20px;
        font-size: 28px;
        color: #333;
    }

    .status {
        font-size: 14px;
        color: #333;
    }

    .order-status {
        font-size: 16px;
        color: #333;
        margin-left: 10px;
    }

    .pay-methods {
        position: relative;
        margin-top: 5px;
        width: 100%;
        height: 60px;
        line-height: 60px;
        background: #fff;

        .wechat {
            position: absolute;
            top: 50%;
            left: 10px;
            margin-top: -18px;
            width: 35px;
            height: 35px;
            background: url('../../../assets/wechat.png') no-repeat;
            background-size: 100%;
        }

        .title {
            font-size: 16px;
            margin-left: 60px;
        }

        .check {
            float: right;
            margin-right: 10px;
        }
    }

    .submit-box {
        margin: 35px 0;
        width: 100%;
        text-align: center;

        .submit-btn {
            width: 320px;
            height: 50px;
            line-height: 50px;
            color: #fff;
            font-size: 16px;
            background: #ff7d37;
            border-radius: 24.5px;
        }
    }
</style>
