import cookie from 'vue-cookie';

const domain = window.location.hostname.split('.').splice(1).join('.');

export default {
    ...cookie,

    set (key, value, options) {
        return cookie.set(key, value, {
            expires: 15,
            domain,

            ...options,
        });
    },
    get (key, options) {
        return cookie.get(key, {
            domain,

            ...options,
        });
    },
    delete (key, options) {
        cookie.delete(key, {
            ...options,
        });
        
        return cookie.delete(key, {
            domain,

            ...options,
        });
    },
};
