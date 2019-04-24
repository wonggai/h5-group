<template>
    <div>
        <div v-if="active == 'detail'">
            <div class="section">
                <div class="content">
                    <div class="partner">
                        <div v-if="list && list.length">
                            <p class="text fl">以下小伙伴已开团，可直接参与</p>
                            <div class="clear-fix" />
                        </div>
                    </div>
                    <div class="text-line" />
                    <div
                        v-if="list && list.length"
                        v-infinite-scroll="loadMore"
                        infinite-scroll-disabled="loading"
                        infinite-scroll-distance="10"
                        class="partner">
                        <div
                            v-for="item in (list || [])"
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
        </div>
        <div
            v-if="active == 'loading'"
            class="loading-box">
            <van-loading color="black" />
        </div>
    </div>
</template>
<script>
    import { mapActions, mapGetters } from 'vuex';
    import { Toast } from 'vant';
    import { InfiniteScroll } from 'mint-ui';
    import Vue from 'vue';
    import share from '../../../util/share';
    Vue.use(InfiniteScroll);
    export default {
        data () {
            return {
                active: 'loading',
                form: {
                    pageNum: 1,
                    pageSize: 10,
                },
                loading: false,
                list: [],
                hasData: true,
            }
        },
        computed: {
            ...mapGetters('group', [
                'groupTeamList',
                'groupTeamListStatus',
            ]),
            groupList () {
                return (this.groupTeamList && this.groupTeamList.rows) || [];
            },
        },
        created () {
            window.xxx = this;
            this.closeLoading();
            this.loadPage(this.form).then(res => {
                this.closeLoading();
                const data = (res && res.data && res.data.rows) || [];
                data.length < 10 && (this.hasData = false);
                this.list.push(...data);
            }).catch(e => {
                e.message && Toast(e.message);
            })
            this.setShareInfo();
        },
        methods: {
            ...mapActions('group', [
                'getGroupDetail',
                'getGroupTeamList',
            ]),
            openLoading () {
                this.active = 'loading';
            },
            closeLoading () {
                this.active = 'detail';
            },
            loadMore() {
                this.form.pageNum += 1;
                const req = { ...this.form };
                console.log(2222, req.pageNum, this.hasData)
                this.loading = true;
                this.hasData && this.loadPage(req).then(res => {
                    const currentList = (res && res.data && res.data.rows) || [];
                    console.log(req, currentList)
                    if (currentList.length < this.form.pageSize) {
                        this.hasData = false;
                    } else {
                        this.hasData = true;
                    }
                    this.list.push(...currentList);
                    this.closeLoading();
                }).catch(e => {
                    this.closeLoading();
                    this.loading = false;
                    e.message && Toast(e.message);
                });
            },
            joinGroup (data) {
                let { id, coverUrl, title } = this.$route.query;
                this.$router.push({
                    name: 'userForm',
                    query: {
                        id,
                        teamId: data.teamId,
                        coverUrl,
                        title,
                    }
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
            loadPage (req) {
                let { id } = this.$route.query;
                return this.getGroupTeamList({ topicId: id, ...req });
            },
        }
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

    .section {
        padding: 10px 0;
        overflow: hidden;

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
</style>
