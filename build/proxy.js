const proxyHost = 'http://localhost:3000';

let cookie = '';
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
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log('proxyReq ===', typeof proxyReq);
      console.log('req ===', typeof req);
      console.log('res ===', typeof res);

      // req.headers['Cookie'] = req.cookie; // 无效
      // proxyReq.setHeader('Cookie', cookie);
    },
    onProxyRes: (proxyRes, req, res) => {
      console.log('proxyRes ===', typeof proxyRes);
      console.log('req ===', typeof req);
      console.log('res ===', typeof res);
      // let body = [];
      // proxyRes.on('data', chunk => {
      //   body.push(chunk);
      // });
      // proxyRes.on('end', () => {
      //   body = Buffer.concat(body).toString();
      //   // 修改响应内容
      //   body = body.replace('original text', 'modified text');
      //   res.send(body);
      // });
    }
  },
  '/upload': {
    target: proxyHost,
    changeOrigin: true,
    logLevel: 'debug'
  }
};
