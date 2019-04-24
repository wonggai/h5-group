import { mapActions, mapGetters } from 'vuex';
import redirectUri from '../../constants/login';

export default {
    computed: {
        ...mapGetters('user', [
            'getUserInfoStatus',
            'userInfo',
            'tempUserInfo',
        ]),

    },
    methods: {
        ...mapActions('user', {
            _getUserInfo: 'getUserInfo',
            _logout: 'logout',
            _addUserInfo: 'addUserInfo',
            _clearUserInfo: 'clearUserInfo',
        }),

        noQuietLogin (id) {
            window.location.href = redirectUri.locationHref + `&redirect_uri=${redirectUri.redirect_uri + encodeURIComponent('?id=' + id)}#wechat_redirect`;
        },

        getUserInfo (payload) {
            const { userInfo } = this;
            return userInfo ? Promise.resolve(userInfo) : this._getUserInfo(payload);
        },

        addUserInfo (data) {
            this._addUserInfo();
        },

        clearUserInfo (data) {
            this._clearUserInfo();
        },

        getToken () {
            return this.$cookie.get('token');
        },
        setToken (token) {
            token && this.$cookie.set('token', token);
        },
        deleteToken () {
            this.$cookie.delete('token');
        },

        logout () {
            this._logout().then(() => {
                this.deleteToken();
                this._setLocationHref(this.ENV.wwwHost, true);
            });
        },

        _setLocationHref (href, force = false) {
            if (href && (force || window.location.href !== href)) {
                window.location.href = href;
            }
        },
    },
};
