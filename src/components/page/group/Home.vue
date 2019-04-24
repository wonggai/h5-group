<template>
    <div class="wrap">
        <div v-if="active == 'detail'">
            <div class="banner">
                <img
                    :src="detail.coverUrl"
                    style="width: 100%;"/>
            </div>
            <div class="section">
                <div class="content">
                    <div>
                        <div class="fl">
                            <div class="group-num">
                                {{ detail.limit }}人团
                            </div>
                            <span class="main-color discount-price">¥{{ detail.price }}</span>
                            <span class="gray-color original-price">¥{{ detail.originalPrice }}</span>
                        </div>
                        <div
                            v-if="timeData"
                            class="fr">
                            <span class="left-time main-color">{{ timeData.days }}</span>天
                            <span class="left-time main-color">{{ timeData.hours }}</span>时
                            <span class="left-time main-color">{{ timeData.minutes }}</span>分
                        </div>
                    </div>
                    <div class="clear-fix"></div>
                    <div class="project">
                        <p class="project-name">{{ detail.topicTitle }}</p>
                        <p class="project-num">
                            <span class="gray-color">共参与：{{ detail.userNum }}</span>
                            <span class="gray-color">新生参与：{{ detail.newNum }}</span>
                            <span class="gray-color">已开团：{{ detail.teamNum }}</span>
                        </p>
                    </div>
                </div>
            </div>
            <div class="line"/>
            <div class="section">
                <div class="header">
                    <span class="header-icon"></span>
                    <span class="header-title">拼团优惠</span>
                </div>
                <div class="content">
                    <div>
                        <v-range-price :list="detail.extra" />
                    </div>
                </div>
            </div>
            <div class="line"/>

            <div class="section">
                <div class="header">
                    <span class="header-icon"></span>
                    <span class="header-title">拼团玩法</span>
                    <span
                        class="right-arrow"
                        @click="show = true;"></span>
                </div>
                <div class="content">
                    <div>
                        <img src="../../../assets/play.png" class="playing-method"/>
                    </div>
                    <div class="partner">
                        <div v-if="groupList && groupList.length">
                            <p class="text fl">以下小伙伴已开团，可直接参与</p>
                            <span
                                class="gray-color check"
                                @click="checkAll">查看全部</span>
                            <div class="clear-fix" />
                        </div>
                        <div v-else>
                            <p class="text">暂无开团</p>
                        </div>
                    </div>
                    <div class="text-line" />
                    <div
                        v-if="groupList && groupList.length"
                        class="partner">
                        <div
                            v-for="item in (groupList || []).slice(0, 6)"
                            class="member">
                            <span class="avatar">
                                <img :src="item.headerImg" style="width: 100%; height: 100%; border-radius: 50%;" />
                            </span>
                            <span class="user-name ellipsis-1">{{ item.headerName }}的团</span>
                            <span class="gray-color left-member">差<span class="main-color">{{ item.teamLeft }}</span>人成<span class="main-color">{{ item.teamLimit }}</span>人团</span>
                            <span
                                class="join-btn"
                                @click="joinGroup(item)">加入此团</span>
                            <div class="clear-fix" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="line"/>

            <!-- <div class="section">
                <div class="header">
                    <span class="header-icon"></span>
                    <span class="header-title">机构介绍</span>
                </div>
                <div class="content">
                    <div class="company">
                        <p class="text">活动主办方：跆拳报备</p>
                        <p class="text">主办方电话：13212341234</p>
                        <p class="text">最大召集：100</p>
                        <p class="text">每批次人数：10</p>
                        <p class="text">活动时间：1018-12-31 10:00</p>
                        <p class="text">活动地址：北京市昌平区微微街道永丰南路用友软件园西区128号</p>
                    </div>
                </div>
            </div> -->
            <div class="line" />

            <div class="section">
                <div class="header">
                    <span class="header-icon"></span>
                    <span class="header-title">商品介绍</span>
                </div>
                <div class="content">
                    <div class="company" style="padding-bottom: 45px;" v-html="detail.content">
                    </div>
                </div>
            </div>
            <div
                v-if="!show"
                class="bar-bottom"
                @click="openGroup">
                <span>¥{{ detail.price }}立即开团</span>
            </div>
            <van-actionsheet
                v-model="show"
                title="玩法介绍"
                class="action-sheet">
                <p class="gray-color introduce">1、一个团只许一个老学员参与</p>
                <p class="gray-color introduce">2、老生只能开团当团长，新生当团长与团员均可</p>
                <p class="gray-color introduce">3、老生只能开团当团长，新生当团长与团员均可</p>
                <p class="gray-color introduce">4、老生只能开团当团长，新生当团长与团员均可</p>
                <p class="gray-color introduce">5、老生只能开团当团长，新生当团长与团员均可</p>
                <p class="gray-color introduce">6、老生只能开团当团长，新生当团长与团员均可</p>
            </van-actionsheet>
            <div
                class="back-top"
                v-show="showTop"
                @click="toTop"></div>
        </div>
        <div
            v-if="active == 'loading'"
            class="loading-box">
            <van-loading color="black" />
        </div>
    </div>
</template>
<script>
    import vRangePrice from '../../common/group/PriceRange';
    import { mapActions, mapGetters } from 'vuex';
    import { Toast } from 'vant';
    import moment from 'moment';
    import share from '../../../util/share';
    export default {
        components: {
            vRangePrice,
        },
        data () {
            return {
                moment,
                idFieldName: 'companyId',
                show: false,
                scrollTop: 0,
                time: 0,
                dParams: 20,
                scrollState: 0,
                active: 'loading',
                form: {
                    pageNum: 1,
                    pageSize: 10,
                },
                leftTime: null,
            }
        },
        computed: {
            ...mapGetters('group', [
                'groupDetail',
                'groupDetailStatus',
                'groupTeamList',
                'groupTeamListStatus',
            ]),
            showTop () {
                let value = this.scrollTop > 200;
                return value;
            },
            detail () {
                return this.groupDetail || {};
            },
            groupList () {
                return (this.groupTeamList && this.groupTeamList.rows) || [];
            },
            topicId () {
                return this.$route.query.id;
            },
            timeData () {
                return this.leftTime && this.transLeftTime(this.leftTime);
            },
        },
        mounted () {
            window.addEventListener('scroll', this.getScrollTop);
            this.topicId && this.loadPage().then(res => {
                this.active = 'detail';
                const data = res && res[0].data;
                this.leftTime = data && data.leftTime;
                const interval = setInterval(() => {
                    this.leftTime -= (1000 * 60);
                    !this.leftTime && clearInterval(interval);
                }, 1000 * 60);
                this.setShareInfo();
            }).catch(e => {
                e.message && Toast(e.message);
            })
        },
        methods: {
            ...mapActions('group', [
                'getGroupDetail',
                'getGroupTeamList',
            ]),
            toTop(e) {
                if(!!this.scrollState){
                    return;
                }
                this.scrollState = 1;
                e.preventDefault();
                let distance = document.documentElement.scrollTop || document.body.scrollTop;
                this.time = setInterval(() => { this.gotoTop(this.scrollTop - this.dParams) }, 10);
            },
            gotoTop(distance){
                this.dParams += 20;
                distance = distance > 0 ? distance : 0;
                document.documentElement.scrollTop = document.body.scrollTop = window.pageYOffset = distance;
                if(this.scrollTop < 10){
                    clearInterval(this.time);
                    this.dParams = 20;
                    this.scrollState = 0;
                }
            },
            getScrollTop() {
                this.scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
            },

            transLeftTime (ms) {
                return moment.duration(ms)._data
            },

            joinGroup (data) {
                let { topicId } = this;
                let coverUrl = this.detail.coverUrl;
                let topicTitle = this.detail.topicTitle;

                this.$router.push({
                    name: 'userForm',
                    query: {
                        id: topicId,
                        teamId: data.teamId,
                        coverUrl,
                        title: topicTitle,
                    }
                })
            },

            openGroup () {
                let { topicId } = this;
                let coverUrl = this.detail.coverUrl;
                let topicTitle = this.detail.topicTitle;
                this.$router.push({
                    name: 'userForm',
                    query: {
                        id: topicId,
                        coverUrl,
                        title: topicTitle,
                    }
                })
            },

            checkAll () {
                let { topicId } = this;
                let coverUrl = this.detail.coverUrl;
                let topicTitle = this.detail.topicTitle;
                this.$router.push({
                    name: 'teamList',
                    query: {
                        id: topicId,
                        coverUrl,
                        title: topicTitle,
                    }
                })
            },

            setShareInfo () {
                let { topicId } = this;
                let coverUrl = this.detail.coverUrl;
                let topicTitle = this.detail.topicTitle;
                const url = new URL(`http://pintuan.sheyu.xin/home?id=${topicId}`);
                share.setInfo({
                    title: topicTitle,
                    description: topicTitle,
                    image: coverUrl,
                    url: url.toString(),
                });
            },

            loadPage () {
                let { topicId, form } = this;
                return Promise.all([
                    this.getGroupDetail({ topicId }),
                    this.getGroupTeamList({ topicId, ...form }),
                ])
            },
        },
    }
</script>
<style lang="less" scoped>
    .loading-box {
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -15px;
        margin-top: -15px;
    }

    .wrap {
        // padding-bottom: 55px;
        font-size: 14px;
        background: #fff;

        .line {
            height: 10px;
            background: #eaeaea;
        }

        .gray-color {
            color: #989898;
        }

        .text {
            font-size: 16px;
            line-height: 1.5;
        }

        .text-line {
            height: 1px;
            background: #eaeaea;
            border-bottom: 1px solid #eaeaea;
        }

        .middle-element {
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
        }

        .right-arrow {
            display: inline-block;
            float: right;
            width: 15px;
            height: 15px;
            background: url('../../../assets/right-icon.png') no-repeat;
            background-size: 100%;
        }

        .section {
            padding: 10px 0;
            overflow: hidden;

            .group-num {
                display: inline-block;
                width: 65px;
                height: 30px;
                margin-right: 10px;
                line-height: 30px;
                background: #ff7d37;
                color: #fff;
                border-radius: 15px 5px;
                vertical-align: middle;
                text-align: center;
            }

            .discount-price {
                font-size: 18px;
                margin-right: 10px;
                vertical-align: middle;
            }

            .original-price {
                font-size: 12px;
                text-decoration: line-through;
                vertical-align: -3px;
            }

            .left-time {
                display: inline-block;
                width: 25px;
                height: 25px;
                line-height: 25px;
                border-radius: 3px;
                background: #fff2e8;
                text-align: center;
                vertical-align: middle;
            }

            .project {
                .project-name {
                    margin: 10px 0;
                    line-height: 24px;
                    font-size: 16px;
                }

                .project-num {
                    span {
                        display: inline-block;
                        width: 33%;
                    }

                    span:nth-child(1) {
                        text-align: left;
                    }

                    span:nth-child(2) {
                        text-align: center;
                    }

                    span:nth-child(3) {
                        text-align: right;
                    }
                }
            }

            .playing-method {
                padding-bottom: 15px;
                width: 100%;
                border-bottom: 1px solid #eaeaea;
            }

            .check {
                float: right;
                padding-right: 20px;
                text-align: left;
                background: url('../../../assets/right-icon.png') no-repeat;
                background-size: 14px;
                background-position: 70px 4px;
            }

            .partner {
                padding: 10px 0;
                font-size: 16px;
                line-height: 1.5;


                .member {
                    position: relative;
                    height: 50px;
                    line-height: 50px;
                    border-bottom: 1px solid #eaeaea;

                    .avatar {
                        display: inline-block;
                        margin-right: 15px;
                        width: 30px;
                        height: 30px;
                        border-radius: 50%;
                        vertical-align: middle;
                    }

                    .user-name {
                        display: inline-block;
                        margin-right: 15px;
                        width: 20%;
                        font-size: 16px;
                        font-weight: 600;
                        vertical-align: middle;
                    }

                    .left-member {
                        vertical-align: middle;
                    }

                    .join-btn {
                        display: inline-block;
                        padding: 0 5px;
                        float: right;
                        height: 30px;
                        line-height: 30px;
                        color: #fff;
                        background: #ff7d37;
                        border-radius: 8px;
                        margin-top: 10px;
                    }
                }
            }

            
            .header {
                padding: 0 20px;

                .header-icon {
                    display: inline-block;
                    margin-right: 5px;
                    width: 6px;
                    height: 21px;
                    background: url('../../../assets/rectangle.png') no-repeat;
                    background-size: 100%;
                    vertical-align: middle;
                }

                .header-title {
                    font-size: 20px;
                    vertical-align: -4px;
                }

            }

            .content {
                padding: 15px 20px 0 20px;

                .company {
                    font-size: 16px;
                    line-height: 1.5;
                }
            }
        }

        .action-sheet {
            text-align: left;
            line-height: 24px;

            .introduce {
                font-size: 14px;
                width: 85%;
                margin: 3px auto;
            }
        }

        .bar-bottom {
            position: fixed;
            width: 100%;
            height: 40px;
            line-height: 40px;
            bottom: 0;
            background-color: #ff7d37;
            z-index: 10001;
            color: #fff;
            text-align: center;

            span {
                font-size: 16px;
            }
        }

        .back-top {
            position: fixed;
            bottom: 60px;
            right: 20px;
            width: 38px;
            height: 38px;
            background: url('../../../assets/back-top.png') no-repeat;
            background-size: 100%;
        }
    }
</style>
<style lang="less">
    .media-wrap {
        width: 100%;
        text-align: center;

        img,
        video {
            width: 100%;
        }
    }
    .action-sheet {
        .van-icon-close:before {
            content: "\F041";
        }

        .van-hairline--top-bottom::after {
            border: none;
        }
    }
</style>
