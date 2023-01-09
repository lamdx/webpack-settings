const os = require('os');
const path = require('path'); // nodejs 核心模块，专门用来处理路径问题
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintWebpackPlugin = require('eslint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
// const ImageMinimizerWebpackPlugin = require('image-minimizer-webpack-plugin');
// const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
// const PreloadWebpackPlugin = require('@vue/preload-webpack-plugin');
const { DefinePlugin } = require('webpack');
// vue-loader 允许你以一种名为单文件组件(SFC)的格式撰写 VueTemplate 组件，vue-loader 版本有问题跟 vue2 和 vue3 有关系
const { VueLoaderPlugin } = require('vue-loader');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const threads = os.cpus().length; // cpu 核数，多进程
// cross-env 定义的环境变量给 webpack 打包工具使用
const isProduction = process.env.NODE_ENV === 'production';

// 用来获取处理样式的 loader
function getStyleLoader(pre) {
  return [
    isProduction ? MiniCssExtractPlugin.loader : 'vue-style-loader',
    'css-loader', // 将 css 资源编译成 commonjs 的模块到 js 中
    {
      // 处理 css 兼容性问题，配合 package.json 中 browserslist 来指定兼容性适配的程度
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
                  // 同时继承了 .babelrc.js 配置
                  // presets: [...]
                }
              }
            ]
          }
        ]
      },
      // vue-loader 不支持 oneof
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader',
            options: {
              // 开启缓存
              cacheDirectory: path.resolve(
                __dirname,
                '../node_modules/.cache/vue-loader'
              ),
              compilerOptions: {
                preserveWhitespace: false
              }
            }
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
      cacheLocation: path.resolve(
        __dirname,
        '../node_modules/.cache/.eslintcache'
      ),
      threads // 开启多进程
    }),
    new HtmlWebpackPlugin({
      // 模板：以 public/index.html 文件创建新的 html 文件
      // 新的 html 文件特点：1. 结构和原来一致 2. 自动引入打包输出的资源
      template: path.resolve(__dirname, '../public/index.html')
    }),
    // 提取 css 成单独文件
    isProduction &&
      new MiniCssExtractPlugin({
        // 对输出的 css 文件进行重命名
        filename: 'static/css/[name]-[contenthash:8].css',
        chunkFilename: 'static/css/[name].[contenthash:8].chunk.css'
      }),
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
    new VueLoaderPlugin(),
    // DefinePlugin 定义环境变量给源代码使用，即定义的变量可以在 webpack 打包范围内任意 javascript 环境内访问，甚至在项目根目录之外的 js 里也可以使用(前提是这个 js 被项目引用)!
    // __VUE_OPTIONS_API__ __VUE_PROD_DEVTOOLS__ 是为了解决 vue3 页面警告的问题
    new DefinePlugin({
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
      'process.env': {
        NODE_ENV: `"${process.env.NODE_ENV}"`
        // NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    }),
    // CopyWebpackPlugin 这个插件需要源文件夹 from 有排除选项 ignore 之外的文件
    isProduction &&
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, '../public'),
            to: path.resolve(__dirname, '../dist'),
            globOptions: {
              // 忽略 index.html 文件，因为 HtmlWebpackPlugin 有生成模板文件 index.html
              ignore: ['**/index.html']
            }
          }
        ]
      }),
    isProduction && new BundleAnalyzerPlugin()
  ].filter(Boolean),
  optimization: {
    minimize: isProduction,
    // 压缩的操作
    minimizer: [
      // css 压缩 也可以写到 optimization.minimizer里面，效果一样的
      // 压缩 css
      new CssMinimizerWebpackPlugin({
        // { test?, include?, exclude?, minimizerOptions?, parallel?, warningsFilter?, minify? }
      }),
      // 压缩 js 生产模式会默认开启 TerserPlugin，但是需要进行其他配置，就重写了
      new TerserWebpackPlugin({
        // { test?, include?, exclude?, terserOptions?, extractComments?, parallel?, minify? }
        parallel: threads // 开启多进程和设置进程数量
      }),
      // 压缩图片 无损压缩配置
      // new ImageMinimizerWebpackPlugin({
      //   minimizer: {
      //     implementation: ImageMinimizerWebpackPlugin.imageminGenerate,
      //     options: {
      //       plugins: [
      //         ['gifsicle', { interlaced: true }],
      //         ['jpegtran', { progressive: true }],
      //         ['optipng', { optimizationLevel: 5 }],
      //         [
      //           'svgo',
      //           {
      //             plugins: [
      //               'preset-default',
      //               'prefixIds',
      //               {
      //                 name: 'sortAttrs',
      //                 params: {
      //                   xmlnsOrder: 'alphabetical'
      //                 }
      //               }
      //             ]
      //           }
      //         ]
      //       ]
      //     }
      //   }
      // }),
      new VueLoaderPlugin()
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
        vue: {
          test: /[\\/]node_modules[\\/]vue(.*)?[\\/]/,
          name: 'vue',
          priority: 40
        },
        elementPlus: {
          test: /[\\/]node_modules[\\/]element-plus[\\/]/,
          name: 'elementPlus',
          priority: 30
        },
        echarts: {
          test: /[\\/]node_modules[\\/](echarts|zrender)[\\/]/,
          name: 'echarts',
          priority: 30
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 20
        },
        common: {
          minChunks: 2,
          name: 'common',
          priority: 10,
          reuseExistingChunk: true
        }
      }
    },
    // 提取 runtime 文件，即将主文件依赖文件的 hash 值单独保管在一个 runtime 文件中，从主文件中分离出来单独请求，runtime 这个文件体积比较小，所以变化重新请求的代价也小
    runtimeChunk: {
      name: entrypoint => `runtime~${entrypoint.name}.js`
    }
  },
  // webpack 解析模块加载选项
  resolve: {
    // 自动补全文件扩展名
    extensions: ['.vue', '.js', '.json'],
    // 配置解析模块路径别名: 优点简写路径，缺点路径没有提示
    alias: {
      // 起别名，减少查找过程
      // 别名: 对应的路径
      // 给定对象的键后的末尾添加 $，以表示精准匹配
      // vue$: 'vue/dist/vue.js', // 177 kb
      // vue$: 'vue/dist/vue.esm.js', // 142 kb
      vue$: 'vue/dist/vue.runtime.js', // 136 kb
      '@': path.resolve(__dirname, '../src')
    }
  },
  // 开发服务器: 不会输出资源，在内存中编译打包的
  devServer: {
    host: 'localhost', // 启动服务器域名
    port: 'auto', // 启动服务器端口号
    open: true, // 是否自动打开浏览器
    hot: true, // 默认开启了 HMR 功能(只能用于开发环境，生产环境不需要了)
    historyApiFallback: true // 解决前端路由刷新 404 问题
  },
  // 模式
  mode: isProduction ? 'production' : 'development',
  devtool: isProduction ? 'source-map' : 'cheap-module-source-map',
  performance: false // ?
};
