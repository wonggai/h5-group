<template>
    <div>
        <div
            v-if="active = 'detail'"
            class="insure-form">
            <div class="top-header">
                <div
                    class="back"
                    @click="back"></div>
                <div class="title">拼团详情</div>
            </div>
            <div v-if="$route.query.teamId && teamDetail">
                <div class="tips">
                    <p>还差<span class="main-color">{{ teamDetail.leftNum }}</span>位好朋友，快喊小伙伴一起拼团吧</p>
                </div>
                <div class="avatar-box">
                    <ul>
                        <li v-for="item in membersList">
                            <div class="avatar">
                                <img :src="item.headImg" style="width: 100%;">
                            </div>
                            <div v-if="item.leadType == 1" class="active">团长</div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="line"/>
            <div class="insure-item">
                <van-cell-group>
                    <van-row class="form-border">
                        <van-col
                            :span="24"
                            class="form-label">
                            完善资料
                        </van-col>
                    </van-row>
                    <van-row class="form-border">
                        <van-col
                            :span="7"
                            class="form-label">
                            姓名
                        </van-col>
                        <van-col
                            :span="17">
                            <van-field
                                v-model="basicForm.contactName"
                                input-align="right"
                                placeholder="请输入姓名"
                            />
                        </van-col>
                    </van-row>
                    <!-- <v-select 
                        v-model="basicForm.sex"
                        :defaultList="['男', '女']"
                        title="性别"
                    /> -->
                    <!-- <van-row class="form-border">
                        <van-col
                            :span="7"
                            class="form-label">
                            年龄
                        </van-col>
                        <van-col
                            :span="17">
                            <van-field
                                v-model="basicForm.insureName"
                                input-align="right"
                                placeholder="请输入姓名"
                            />
                        </van-col>
                    </van-row> -->
                    <van-row class="form-border">
                        <van-col
                            :span="7"
                            class="form-label">
                            电话
                        </van-col>
                        <van-col
                            :span="17">
                            <van-field
                                v-model="basicForm.contactPhone"
                                type="tel"
                                input-align="right"
                                placeholder="请填写联系人手机号"
                            />
                        </van-col>
                    </van-row>
                    <v-select
                        v-model="basicForm.type"
                        :default-list="type"
                        value-key="code"
                        label-key="name"
                        title="类型"/>
                    <!-- <van-row class="form-border">
                        <van-col
                            :span="7"
                            class="form-label">
                            类型
                        </van-col>
                        <van-col
                            :span="17">
                            <span class="types">新生<span class="main-color">（注：只有新生能参团）</span></span>
                        </van-col>
                    </van-row> -->
                    <v-select
                        v-model="basicForm.schoolId"
                        :default-list="school"
                        value-key="code"
                        label-key="name"
                        title="校区"/>
                </van-cell-group>
            </div>
            <div class="submit-box">
                <van-button
                    class="submit-btn"
                    @click="validate">{{ teamId ? '确定参团' : '确定开团' }}</van-button>
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
    import vSelect from '../../common/Select';
    import validaConfig from '../../../util/validate';
    import { mapActions, mapGetters } from 'vuex';
    import weChatPay from '.././../../util/weChatPay';
    import wenhao from '../../../assets/wenhao.png';
    import share from '../../../util/share';
    export default {
        components: {
            vSelect
        },
        data () {
            return {
                active: 'loading',
                basicForm: {
                     contactName: null,                   
                     contactPhone: null,                   
                     type: null,
                     schoolId: null,             
                },
                school: [
                    {
                        code: '1',
                        name: '昌平校区',
                    }
                ],
                type: [
                    {
                        code: '0',
                        name: '新生',
                    },
                    {
                        code: '1',
                        name: '老生',
                    },
                ],
                visible: false,
                rules: {
                    contactName: [
                        { required: true, message: '请填写联系人姓名' },
                    ],
                    contactPhone: [
                        { required: true, message: '请填写联系人手机号' },
                        { pattern: /^(1[3|4|5|6|7|8|9][0-9]\d{8})$/, message: '请规范填写联系人手机号' },
                    ],
                    type: [
                        { required: true, message: '请选择类型' },
                    ],
                    schoolId: [
                        { required: true, message: '请选择校区' },
                    ],
                },
                allowSavedPage: ['shipGoodsForm'],
                active: 'loading',
            }
        },
        computed: {
            ...mapGetters('group', [
                'teamDetail',
            ]),
            topicId () {
                return this.$route.query.id;
            },
            teamId () {
                return this.$route.query.teamId;
            },
            membersList () {
                let members = (this.teamDetail && this.teamDetail.members) || [];
                return this.buildMemberArr(6, members);
            }
        },
        created () {
            if (this.$route.query.teamId) {
                this.loadPage().then(() => {
                    this.closeLoading();
                }).catch(e => {
                    Toast(e.message);
                })
            } else {
                this.closeLoading();
            }
            this.setShareInfo();
        },
        methods: {
            ...mapActions('group', [
                'getTeamDetail',
                'openGroup',
                'joinGroup',
            ]),
            openLoading () {
                this.active = 'loading';
            },
            closeLoading () {
                this.active = 'detail';
            },
            buildMemberArr (max, data) {
                const arr = Array.from({ length: max || 0 }, (v, i) => {
                    return {
                        headImg: wenhao,
                        leadType: 0,
                    }
                });
                (data || []).forEach((item, index) => {
                    arr.splice(index, 1, item);
                });
                return arr;
            },
            getSubmitForm () {
                return {
                    ...this.basicForm,
                    topicId: this.topicId,
                }
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
                let { teamId } = this.$route.query;
                return this.getTeamDetail({ teamId })
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
            validate () {
                let { teamId, topicId } = this;
                let { title, coverUrl } = this.$route.query;
                validaConfig.validate(this.basicForm, this.rules).then(() => {
                    this.openLoading();
                    if (this.teamId) {
                        const form = {
                            ...this.getSubmitForm(),
                            teamId,
                            topicId,
                            title,
                            coverUrl,
                        }
                        return this.joinGroup(form).then(res => {
                            const orderId = res.data && res.data.orderId;
                            const price = res.data && res.data.price;
                            this.$router.push({
                                name: 'pay',
                                query: {
                                    id: topicId,
                                    orderId,
                                    price,
                                    teamId,
                                    title,
                                    coverUrl,
                                }
                            })
                        })
                    } else {
                        return this.openGroup(this.getSubmitForm()).then(res => {
                            const orderId = res.data && res.data.orderId;
                            const price = res.data && res.data.price;
                            this.$router.push({
                                name: 'pay',
                                query: {
                                    id: topicId,
                                    orderId,
                                    price,
                                    title,
                                    coverUrl,
                                }
                            })
                        })
                    }
                }).catch(e => {
                    Toast(e.message || '系统繁忙');
                });
            },
        }
    }
</script>
<style lang="less">
    @import "../../style/insurance.less";
    .loading-box {
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -15px;
        margin-top: -15px;
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

    .types {
        display: inline-block;
        height: 44px;
        line-height: 44px;
        width: 100%;
        text-align: right;
    }

    .line {
        height: 10px;
        background: #eaeaea;
    }

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

    .tips {
        height: 50px;
        background: #f5f5f5;
        line-height: 50px;
        text-align: center;
    }

    .avatar-box {
        padding: 10px 20px 20px;
        background: #fff;

        ul {
            width: 100%;
            text-align: center;

            li {
                display: inline-block;
                position: relative;
                margin-right: 10px;
                width: 40px;
                height: 40px;

                .avatar {
                    width: 100%;
                    height: 100%;

                    img {
                        border-radius: 50%;
                    }
                }

                .active {
                    position: absolute;
                    width: 40px;
                    height: 20px;
                    bottom: -10px;
                    left: 0;
                    border-radius: 10px;
                    background: #ff7d37;
                    color: #fff;
                    line-height: 20px;
                    font-size: 12px;
                    text-align: center;
                }
            }
        }
    }
</style>
