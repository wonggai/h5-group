<template>
    <van-loading
        type="spinner"
        color="white"
        class="loading-box"/>
</template>
<script>
    import cookie from '../../util/cookie';
    import { Toast } from 'vant';
    export default {
        mounted () {
            let token = cookie.get('token');
            window.xx = this;
            const { code, id } = this.$route.query;
            if (token) {
                this.$router.push({
                    name: 'home',
                    query: {
                        id,
                    }
                });
            } else {
                if (!code) {
                    this.show = false;
                    this.noQuietLogin(id);
                } else {
                    this.getUserInfo({ code }).then(res => {
                        let newToken = res.data && res.data.token;
                        this.addUserInfo(res.data);
                        cookie.set('token', newToken);
                        this.show = false;
                        this.$router.push({
                            name: 'home',
                            query: {
                                id,
                            }
                        });
                    }).catch(e => {
                        Toast(e.message || '系统繁忙');
                    });
                }
            }
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
</style>
