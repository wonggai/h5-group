module.exports = {
    publicPath: '/',
    devServer: {
        proxy: {
            '/api/mp/': {
                'target': 'http://39.97.238.48',
                'changeOrigin': true
            }
        }
    }
}