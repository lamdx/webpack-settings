const os = require('os');
const path = require('path'); // nodejs 核心模块，专门用来处理路径问题
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintWebpackPlugin = require('eslint-webpack-plugin');

const threads = os.cpus().length; // cpu 核数，多进程

module.exports = {
  // 入口
  entry: './src/index.js', // 相对路径
  // 输出 开发模式没有输出，即 devServer 下可以不配置输出
  output: {},
  // 加载器
  module: {
    rules: [
      // loader 的配置
      {
        // 每个文件只能被其中一个 loader 配置处理
        oneOf: [
          {
            test: /\.css$/, // 只检测.css文件
            use: [
              // 执行顺序：从右到左(从下到上)
              'style-loader', // 将 js 中 css 通过创建 style 标签添加 html 文件中生效
              'css-loader' // 将 css 资源编译成 commonjs 的模块到 js 中
            ]
          },
          {
            test: /\.less$/,
            // loader: 'xxx', // 只能使用 1 个 loader
            use: [
              // 使用多个 loader
              'style-loader',
              'css-loader',
              'less-loader' // 将 less 编译成 css 文件
            ]
          },
          {
            test: /\.s[ac]ss$/,
            use: [
              'style-loader',
              'css-loader',
              'sass-loader' // 将 sass 编译成 css 文件
            ]
          },
          {
            test: /\.styl$/,
            use: [
              'style-loader',
              'css-loader',
              'stylus-loader' // 将 stylus 编译成 css 文件
            ]
          },
          // 在 webpack4，图片资源处理是通过 file-loader 和 url-loader，现在 webpack5 已经将这两个 loader 功能内置到 webpack 里了，只需要简单配置即可处理图片资源
          // type: 'asset/resource' 和 type: 'asset' 的区别
          // type: 'asset/resource' 相当于 file-loader，将文件转化成 webpack 能识别的资源，其他不做处理
          // type: 'asset' 相当于 url-loader，将文件转化成 webpack 能识别的资源，同时小于某个大小的资源会处理成 data URL 形式
          {
            test: /\.(png|jpe?g|gif|webp|svg)$/,
            type: 'asset',
            parser: {
              dataUrlCondition: {
                // 小于 10 kb 的图片转 base64 优点：减少请求数量 缺点：体积会更大
                maxSize: 10 * 1024 // 10 kb
              }
            },
            generator: {
              // 将图片文件输出到 static/images 目录中，并将图片文件命名 [hash:8][ext][query]
              // [hash:8]: hash 值取 8 位
              // [ext]: 使用之前的文件扩展名
              // [query]: 添加之前的 query 参数
              filename: 'static/images/[hash:8][ext][query]'
            }
          },
          {
            test: /\.(ttf|woff2?|map3|map4|avi)$/,
            type: 'asset/resource',
            generator: {
              // 输出名称
              filename: 'static/media/[hash:8][ext][query]'
            }
          },
          {
            test: /\.js$/,
            // exclude: /node_modules/, // 排除 node_modules 下的文件，其他文件都处理
            include: path.resolve(__dirname, '../src'), // 也可以用包含
            // loader: 'babel-loader',
            // options: {
            //   cacheDirectory: true, // 开启 babel 编译缓存
            //   cacheCompression: false // 缓存文件不要压缩
            // }
            use: [
              {
                loader: 'thread-loader', // 开启多进程
                options: {
                  workers: threads // 数量
                }
              },
              {
                loader: 'babel-loader',
                options: {
                  cacheDirectory: true, // 开启 babel 编译缓存
                  cacheCompression: false, // 缓存文件不要压缩
                  plugins: ['@babel/plugin-transform-runtime'] // 减少代码体积 ？
                }
              }
            ]
          }
        ]
      }
    ]
  },
  // 插件
  plugins: [
    // plugin 的配置
    new ESLintWebpackPlugin({
      // 检测哪些文件
      context: path.resolve(__dirname, '../src'),
      exclude: 'node_modules', // 默认值
      cache: true, // 开启缓存
      // 缓存目录
      cacheLocation: path.resolve(__dirname, '../node_modules/.cache/.eslintcache'),
      threads // 开启多进程
    }),
    new HtmlWebpackPlugin({
      // 模板：以 public/index.html 文件创建新的 html 文件
      // 新的 html 文件特点：1. 结构和原来一致 2. 自动引入打包输出的资源
      template: path.resolve(__dirname, '../public/index.html')
    })
  ],
  optimization: {
    // 开发模式下不需要压缩
    // 代码分割配置
    splitChunks: {
      chunks: 'all'
      // 其他都用默认值
    }
  },
  // 开发服务器: 不会输出资源，在内存中编译打包的
  devServer: {
    host: 'localhost', // 启动服务器域名
    port: '3000', // 启动服务器端口号
    open: true, // 是否自动打开浏览器
    hot: true // 默认开启了 HMR 功能(只能用于开发环境，生产环境不需要了)
  },
  // 模式
  mode: 'development',
  devtool: 'cheap-module-source-map'
};
