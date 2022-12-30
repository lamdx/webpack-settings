const os = require('os');
const path = require('path'); // nodejs 核心模块，专门用来处理路径问题
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintWebpackPlugin = require('eslint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const ImageMinimizerWebpackPlugin = require('image-minimizer-webpack-plugin');
// const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
// const PreloadWebpackPlugin = require('@vue/preload-webpack-plugin');

const threads = os.cpus().length; // cpu 核数，多进程

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
  // 多入口
  // entry: {
  //   // key 为输出文件名，可重命名
  //   index: './src/index.js',
  //   app: './src/main.js'
  // },
  // 输出
  output: {
    // 所有文件的输出路径
    // __dirname nodejs 的变量，代表当前文件的文件夹目录
    path: path.resolve(__dirname, '../dist'), // 绝对路径
    // 入口文件打包输出文件名
    filename: 'static/js/[name].[chunkhash:8].js', // 入口文件打包后的输出文件名
    chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js', // 非入口文件，代码分割(超过设置的大小) 或者 文件懒加载 的文件名
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
            // exclude: /node_modules/, // 排除 node_modules 下的文件，其他文件都处理
            include: path.resolve(__dirname, '../src'), // 也可以用包含
            // loader: 'babel-loader',
            // options: {
            //   cacheDirectory: true, // 开启 babel 编译缓存
            //   cacheCompression: false, // 缓存文件不要压缩
            //   plugins: ['@babel/plugin-transform-runtime'] // 减少代码体积 ？
            // },
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
    }),
    // 提取 css 成单独文件
    new MiniCssExtractPlugin({
      // 对输出的 css 文件进行重命名
      filename: 'static/css/[name]-[contenthash:8].css',
      chunkFilename: 'static/css/[name].[contenthash:8].chunk.css'
    })
    // css 压缩
    // new CssMinimizerPlugin()

    // new PreloadWebpackPlugin({
    //   // rel: 'preload', // preload 兼容性更好
    //   rel: 'prefetch' // prefetch 兼容性更差
    // }),
    // new WorkboxWebpackPlugin.GenerateSW({
    //   // 这些选项帮助快速启用 ServiceWorkers
    //   // 不允许遗留任何旧的 ServiceWorkers
    //   clientsClaim: true,
    //   skipWaiting: true
    // })
  ],
  optimization: {
    minimize: true,
    // 压缩的操作
    minimizer: [
      // css 压缩 也可以写到 optimization.minimizer里面，效果一样的
      // 压缩 css
      new CssMinimizerWebpackPlugin({
        // { test?, include?, exclude?, minimizerOptions?, parallel?, warningsFilter?, minify? }
      }),
      // 压缩 js 生产模式会默认开启 TerserPlugin，但是需要进行其他配置，就重写了
      new TerserWebpackPlugin({
        parallel: threads // 开启多进程和设置进程数量
      }),
      // 压缩图片 无损压缩配置
      new ImageMinimizerWebpackPlugin({
        minimizer: {
          implementation: ImageMinimizerWebpackPlugin.imageminGenerate,
          options: {
            plugins: [
              ['gifsicle', { interlaced: true }],
              ['jpegtran', { progressive: true }],
              ['optipng', { optimizationLevel: 5 }],
              [
                'svgo',
                {
                  plugins: [
                    'preset-default',
                    'prefixIds',
                    {
                      name: 'sortAttrs',
                      params: {
                        xmlnsOrder: 'alphabetical'
                      }
                    }
                  ]
                }
              ]
            ]
          }
        }
      })
    ],
    // 代码分割配置
    splitChunks: {
      chunks: 'all', // 对所有模块都进行分割
      // 其他都用默认值，以下是默认值
      // minSize: 20000, // 分割代码最小的大小
      // minRemainingSize: 0, // 类似于 minSize，最后确保提取的文件大小不能为 0
      // minChunks: 1, // 至少被引用的次数，满足条件才会代码分割
      // maxAsyncRequests: 30, // 按需加载时并行加载的文件的最大数量
      // maxInitialRequests: 30, // 入口 js 文件最大并行请求数量
      // enforceSizeThreshold: 50000, // 超过 50kb 一定会单独打包(此时会忽略 minRemainingSize、maxAsyncRequests、maxInitialRequests)
      // // 当 webpack 处理文件路径时，它们始终包含 Unix 系统中的 / 和 Windows 系统中的 \，这就是为什么在 {cacheGroup}.test 字段中使用 [\\/] 来表示路径分隔符的原因，{cacheGroup}.test 中的 / 或 \ 会在跨平台使用时产生问题
      // // 一个模块可以属于多个缓存组，优化将优先考虑具有更高 priority(优先级)的缓存组，默认组的优先级为负，以允许自定义组获得更高的优先级(自定义组的默认值为 0)
      // cacheGroups: {
      //   // 组名，哪些模块要打包到一个组
      //   defaultVendors: {
      //     test: /[\\/]node_modules[\\/]/, // 需要打包到一起的模块
      //     priority: -10, // 权重(越大越高)
      //     reuseExistingChunk: true // 如果当前 chunk 包含已从主 bundle 中拆分出的模块，则它将被重用，而不是生成新的模块
      //   },
      //   default: {
      //     // 其他没有写的配置会使用上面的默认值
      //     minChunks: 2, // 这里的 minChunks 权重更大
      //     priority: -20,
      //     reuseExistingChunk: true
      //   }
      // },
      // 修改配置
      cacheGroups: {
        default: {
          minSize: 0, // 我们定义的文件体积太小了，所以要改打包的最小文件体积
          minChunks: 2,
          priority: 20,
          name: 'commons', // chunkName
          reuseExistingChunk: true
        }
      }
    },
    // 提取 runtime 文件，即将主文件依赖文件的 hash 值单独保管在一个 runtime 文件中，从主文件中分离出来单独请求，runtime 这个文件体积比较小，所以变化重新请求的代价也小
    runtimeChunk: {
      name: entrypoint => `runtime~${entrypoint.name}.js`
    }
  },
  // 模式
  mode: 'production',
  devtool: 'source-map'
};
