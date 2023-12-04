// 可以使用 Node 非常轻松的构建一个 Web 服务器
// 1. 加载 http 核心模块
const http = require('http');

// 2. 创建 Server，使用 http.createServer() 方法创建一个 Web 服务器，返回一个 Server 实例
const server = http.createServer();

const responseMap = {
  '/api/list': {
    total: 100,
    list: [
      {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
        hobby: '1',
        num: 1236,
        id: '1001'
      },
      {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄',
        hobby: '2',
        num: 12350,
        id: '1002'
      },
      {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄',
        hobby: '3',
        num: 12340,
        id: '1003'
      },
      {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄',
        hobby: '4',
        num: 1230,
        id: '1004'
      }
    ]
  },
  '/api/options': {
    data: [
      {
        value: '1',
        label: '篮球'
      },
      {
        value: '2',
        label: '足球',
        disabled: true
      },
      {
        value: '3',
        label: '台球'
      }
    ]
  }
};

/**
 * 监听 request 请求事件，设置请求处理函数
 * 3. 服务器要干嘛？
 * 提供服务：对数据的服务
 * 发请求，接收请求，处理请求，给反馈(发送响应)
 * 当客户端请求过来，就会自动触发服务器的 request 请求事件，然后执行第二个参数：回调处理函数
 * request 请求事件处理函数，需要接收两个参数
 * Request 请求对象，可以用来获取客户端的一些请求信息，例如请求路径
 * Response 响应对象，可以用来给客户端发送响应消息
 */
server.on('request', (request, res) => {
  // http://127.0.0.1:3000/foo/b /foo/b
  console.log('收到客户端的请求了，请求路径是：' + request.url, request.method);
  // response 对象有一个方法：write 可以用来给客户端发送响应数据
  // write 可以使用多次，但是最后一定要使用 end 来结束响应，否则客户端会一直等待
  // response.write('hello');
  // response.write(' nodejs');
  // // 告诉客户端，我的话说完了，你可以呈递给用户了
  // response.end();

  // 上面的方式比较麻烦，推荐使用更简单的方式，直接 end 的同时发送响应数据
  // res.end('hello nodejs');
  // 由于现在服务器的能力还非常的弱，无论是什么请求，都只能响应 hello nodejs
  // 思考: 希望当请求不同的路径的时候响应不同的结果

  // 根据不同的请求路径发送不同的响应结果
  // 1. 获取请求路径
  // req.url 获取到的是端口号之后的那一部分路径，也就是说所有的 url 都是以 / 开头的
  // 2. 根据路径处理响应
  const url = request.url;
  let response = responseMap[url];
  let delay = 4000;
  delay = 0;
  if (response) {
    response.errorCode = '0000';
  } else {
    response = {
      message: '404 Not Found.',
      error: '404 Not Found',
      path: '*',
      status: 404,
      timestamp: new Date().toLocaleDateString()
    };
    res.writeHead(404, { 'Content-Type': 'application/json' });
  }

  // 简单粗暴
  // res.setHeader('Access-Control-Allow-Origin', '*');
  // res.setHeader('Access-Control-Allow-Headers', '*');
  // res.setHeader('Access-Control-Allow-Methods', '*');
  // res.setHeader('Access-Control-Allow-Credentials', 'true');

  // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
  // 设置多个 Access-Control-Allow-Origin 头来允许多个不同的域访问你的资源
  // 错误的写法，注意不是以 , 逗号隔开
  // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080,http://127.0.0.1:5500');
  const allowedOrigins = ['http://localhost:8080', 'http://127.0.0.1:5500'];
  const origin = request.headers.origin;
  console.log('origin ===', origin);
  // 检查请求的域是否在允许的列表中
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  // 响应首部 Access-Control-Allow-Headers 用于 preflight request（预检请求）中，列出了将会在正式请求的 Access-Control-Request-Headers 字段中出现的首部信息。
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin,Content-Type,Accept,token,X-Requested-With'
  );

  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');

  if (request.method === 'OPTIONS') {
    res.end('OPTIONS returns OK');
    return;
  }

  // 响应内容只能是二进制数据或者字符串
  setTimeout(() => {
    res.end(JSON.stringify(response));
  }, delay);
});

// 4. 绑定端口号，启动服务器
server.listen(3000, () => {
  console.log('服务器启动成功了，可以通过 http://localhost:3000/ 来进行访问');
});
