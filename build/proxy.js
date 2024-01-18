const proxyHost = 'http://localhost:3000';

module.exports = {
  // 上面的 url 优先级更高
  '/star-api': {
    target: proxyHost,
    changeOrigin: true,
    logLevel: 'debug',
    pathRewrite: {
      '^/star-api': '/star-api'
    },
    // 修改代理的请求头，也要调整 http 的请求头
    headers: {
      Referer: `${proxyHost}/star-web`
    }
  },
  '/api': {
    target: proxyHost,
    changeOrigin: true,
    logLevel: 'debug',
    headers: {
      Referer: `${proxyHost}/star-web`
    }
  },
  '/upload': {
    target: proxyHost,
    changeOrigin: true,
    logLevel: 'debug'
  }
};
