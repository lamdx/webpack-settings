const path = require('path'); // nodejs 核心模块，专门用来处理路径问题
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

// 用来获取处理样式的 loader
function getStyleLoader(pre) {
  return [
    MiniCssExtractPlugin.loader, // 提取 css 成单独文件
    'css-loader', // 将 css 资源编译成 commonjs 的模块到 js 中
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: [
            'postcss-preset-env' // 能解决大多数样式兼容性问题
          ]
        }
      }
    },
    pre
  ].filter(Boolean);
}

module.exports = {
  // 入口
  entry: './src/index.js', // 相对路径
  // 输出
  output: {
    // 所有文件的输出路径
    // __dirname nodejs 的变量，代表当前文件的文件夹目录
    path: path.resolve(__dirname, '../dist'), // 绝对路径
    // 入口文件打包输出文件名
    filename: 'static/js/main.js',
    clean: true // 输出前先清空输出目录
  },
  // 加载器
  module: {
    rules: [
      // loader 的配置
      {
        // 每个文件只能被其中一个 loader 配置处理
        oneOf: [
          {
            test: /\.css$/, // 只检测.css文件
            use: getStyleLoader()
          },
          {
            test: /\.less$/,
            // loader: 'xxx', // 只能使用 1 个 loader
            use: getStyleLoader('less-loader')
          },
          {
            test: /\.s[ac]ss$/,
            use: getStyleLoader('sass-loader')
          },
          {
            test: /\.styl$/,
            use: getStyleLoader('stylus-loader')
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
            exclude: /node_modules/, // 排除 node_modules 下的文件，其他文件都处理
            loader: 'babel-loader'
          }
        ]
      }
    ]
  },
  // 插件
  plugins: [
    // plugin 的配置
    new ESLintPlugin({
      // 检测哪些文件
      context: path.resolve(__dirname, '../src')
    }),
    new HtmlWebpackPlugin({
      // 模板：以 public/index.html 文件创建新的 html 文件
      // 新的 html 文件特点：1. 结构和原来一致 2. 自动引入打包输出的资源
      template: path.resolve(__dirname, '../public/index.html')
    }),
    new MiniCssExtractPlugin({
      // 对输出的 css 文件进行重命名
      filename: 'static/css/[name]-[contenthash:8].css'
    }),
    new CssMinimizerPlugin()
  ],
  // 模式
  mode: 'production',
  devtool: 'source-map'
};
