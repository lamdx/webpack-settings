# webpack5

```shell
# 1 git init
# 2 npm init -y

npm i webpack webpack-cli -D

npm i html-webpack-plugin -D

npm i webpack-dev-server -D

npm i eslint-webpack-plugin -D

```

- [eslint] No ESLint configuration found in D:\AllProject\web\src.
  此时需要配置文件 .eslintrc.js

```js
module.exports = {
  // 以当前目录为根目录，不再向上查找 .eslintrc.js
  root: true,
  // 指定环境，环境不是互斥的，可以定义多个环境
  // 环境定义了预定义的全局变量，设置运行环境为 浏览器 + node + es2021，否则 eslint 在遇到 Promise，window 等全局对象时会报错
  env: {
    browser: true, // 启用浏览器中全局变量
    node: true, // 启用 node 中全局变量
    es2021: true
  },
  // 继承 eslint 推荐的规则集，vue 基本的规则集，prettier 推荐的规则集
  extends: ['eslint:recommended'],
  // 指定解析器选项
  parserOptions: {
    ecmaVersion: 6, // es6
    sourceType: 'module', // es module
    allowImportExportEverywhere: true
  },
  // 忽略文件 相当于 .eslintignore 文件
  ignorePatterns: ['node_moudules', 'dist', 'src/**/**.test.ts'],
  rules: {
    // https://eslint.org/docs/rules/
    // eslint校验不成功后，error 或 2 则报错，warn 或 1 则警告，off 或 0 则无提示
    strict: 'error',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // 禁止未使用的变量
    // 'no-unused-vars': ['error', { vars: 'all', args: 'after-used', ignoreRestSiblings: false }]
    'no-unused-vars': 0,
    'no-var': 2, // 需要 let 或 const 而不是 var
    'no-eq-null': 2, // 不允许在没有类型检查运算符的情况下进行 null 比较 即不允许对 null 用 == 或者 !=
    eqeqeq: ['error', 'always'],
    'no-eval': 2, // 禁止 eval()
    'no-empty': 2, // 禁止空块语句
    // 要求 return 语句始终或从不指定值(一致返回)
    // 'consistent-return': 0,
    'generator-star-spacing': 'off', // 在生成器函数中在 * 周围强制间距
    // 强制一致使用反引号、双引号或单引号
    quotes: ['error', 'single'],
    // 要求或禁止使用分号代替 ASI
    // JavaScript 不需要在每个语句的末尾使用分号；在许多情况下，JavaScript 引擎可以确定分号应该在某个位置并自动添加它，此功能称为自动分号插入 (ASI)，被认为是 JavaScript 中最具争议的功能之一
    semi: ['error', 'always'],
    // 强制执行一致的换行样式(linebreak-style)
    // 当很多人都拥有不同的编辑器、VCS 应用程序和操作系统时，可能会出现不同的行尾由上述任何一个编写(尤其是在同时使用 Windows 和 mac 版本的 SourceTree 时发生)。
    // Windows 操作系统中使用的换行符(新行)通常是回车(CR) 后跟换行(LF)，使其成为回车换行(CRLF)，而 Linux 和 Unix 使用简单换行(LF)。对应的控制序列是"\n"(对于LF)和"\r\n"对于(CRLF)。
    // 'linebreak-style': ['error', 'unix'],

    // 在函数括号前要求或不允许有空格
    // anonymous 用于匿名函数表达式 例如 function () {}
    // named 用于命名函数表达式 例如 function foo () {}
    // asyncArrow 用于异步箭头函数表达式 例如 async () => {}
    'space-before-function-paren': ['error', { anonymous: 'never', named: 'never', asyncArrow: 'always' }],
    'brace-style': ['error', '1tbs'], // 大括号样式
    // 禁止或强制计算属性内的空格 obj[a]; // computed property in object member expression
    'computed-property-spacing': ['error', 'never'],
    'no-useless-computed-key': 'error' // 不允许不必要地使用计算的属性键
  }
};
```

```shell
npm i style-loader css-loader less-loader sass sass-loader stylus-loader -D
```

## css 性能优化处理&兼容性处理

- css 文件目前被打包到 js 文件中，当 js 文件加载时，会创建一个 style 标签来生成样式，这样对于网站来说，会出现闪屏现象，用户体验不好，应该是单独的 css 文件，通过 link 标签加载性能才好

```shell
npm i mini-css-extract-plugin css-minimizer-webpack-plugin -D
```

- **css 兼容性处理**

```shell
npm i postcss-loader postcss-preset-env -D
```

- 在 package.json 文件中添加 browserslist 来控制样式的兼容性做到什么程度

```json
{
  "browserslist": ["> 1%", "last 10 versions", "not ie <= 8", "Safari >= 6", "ios >= 7.0"]
}
```

```json
{
  "browserslist": {
    "development": ["last 1 chrome version", "last 1 firefox version", "last 1 safari version"],
    "production": ["> 1%", "last 10 versions", "not ie <= 8", "Safari >= 6", "ios >= 7.0"]
  }
}
```

## js 兼容性处理

- 过去我们使用 babel 对 js 代码进行了兼容性处理，其中使用 @babel/preset-env 智能预设来处理兼容性问题，它能将 ES6 的一些语法进行编译转换，比如箭头函数、点点点运算符等，但是如果是 async 函数、promise 对象、数组的一些方法(includes)等，它没办法处理，所以此时我们 js 代码仍然存在兼容性问题，一旦遇到低版本浏览器会直接报错，所以我们想要将 js 兼容性问题彻底解决
- **core-js 是专门用来做 ES6 以及以上 API 的 polyfill**
- polyfill 翻译过来叫做垫片/补丁，就是用社区上提供的一段代码，让我们在不兼容某些新特性的浏览器上，使用该新特性

```shell
npm i babel-loader @babel/preset-env -D
npm i core-js
```

- .babelrc.js

```js
module.exports = {
  // 语法转换插件 preset-env
  // 因为默认 @babel/preset-env 只会转换语法，也就是我们看到的箭头函数、const 一类，如果进一步需要转换内置对象、实例方法，那就得用 polyfill，这就需要你做一点配置了
  // 这里有一个至关重要的参数 "useBuiltIns"，他是控制 @babel/preset-env 使用何种方式帮我们导入 polyfill 的核心，它有三个值可以选

  // entry
  // 这是一种入口导入方式，只要我们在打包配置入口 或者 文件入口写入 import "core-js" 这样一串代码，babel 就会替我们根据当前你所配置的目标浏览器(browserslist)来引入所需要的 polyfill
  // 像这样， 在 index.js 文件中加入 core-js
  // // src/index.js
  // import "core-js";
  // function test() {
  //   new Promise()
  // }
  // 当 useBuiltIns 的值 entry 时， @babel/preset-env 会按照你所设置的目标浏览器在入口处来引入所需的 polyfill，不管你需不需要，如此，我们可以知道，useBuiltIns 的值 entry 的优点是覆盖面积就比较广，一股脑全部搞定，但是缺点就是打出来的包就大了多了很多没有用到的 polyfill，并且还会污染全局

  // useage
  // useBuiltIns 的值 useage 时，会参考目标浏览器(browserslist)和 代码中所使用到的特性来按需加入 polyfill，当然，使用 useBuiltIns 的值 useage，还需要填写另一个参数 corejs 的版本号

  // false
  // useBuiltIns 的值 false 时，这也是默认值 ，使用这个值时不引入 polyfill
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: ['last 10 versions', 'Safari >= 6', 'Android >= 4.0', 'ie > 8', 'chrome >= 39', 'not dead']
        },
        useBuiltIns: 'usage',
        // core-js 支持两个版本，2 或 3，很多新特性已经不会加入到 2 里面了，比如: flat 等等最新的方法，2 这个版本里面都是没有的，所以建议大家用 3
        corejs: 3
      }
    ]
    // 'stage-2'
    // '@babel/preset-react'
  ]
};
```

- Babel 为编译的每个文件都插入了辅助代码，使代码体积过大
- Babel 对一些公共方法使用了非常小的辅助代码，比如 `_extend`，默认情况下会被添加到每一个需要它的文件中，可以将这些辅助代码作为一个独立模块，来避免重复引入
- @babel/plugin-transform-runtime: 禁用了 Babel 自动对每个文件的 runtime 注入，而是引入 @babel/plugin-transform-runtime 并且使所有辅助代码从这里引用

```shell
npm i @babel/plugin-transform-runtime -D # 待确认
npm i @babel/eslint-parser eslint-plugin-import -D
```

## js 压缩

```shell
npm i terser-webpack-plugin -D
```

- 避免在生产环境下才会用到的工具
  某些 utility, plugin 和 loader 都只用于生产环境。例如，在开发环境下使用 TerserPlugin 来 minify(压缩) 和 mangle(混淆破坏) 代码是没有意义的，通常在开发环境下，应该排除以下这些工具：
  TerserPlugin
  [fullhash]/[chunkhash]/[contenthash]
  AggressiveSplittingPlugin
  AggressiveMergingPlugin
  ModuleConcatenationPlugin

## 图片压缩

- 如果项目中图片都是在线链接，那么就不需要了，本地项目静态图片才需要进行压缩

```shell
npm i image-minimizer-webpack-plugin imagemin -D
# 无损压缩
npm i imagemin-gifsicle imagemin-jpegtran imagemin-optipng imagemin-svgo -D

# imagemin-gifsicle imagemin-jpegtran imagemin-optipng imagemin-svgo 这几个插件有时候下载不下来，改 hosts 配置以及科学上网有时候都没用，这个时候可以采用 cnpm，亲试有效
cnpm i imagemin-gifsicle imagemin-jpegtran imagemin-optipng imagemin-svgo -D
```

```js
const ImageMinimizerWebpackPlugin = require('image-minimizer-webpack-plugin');

module.exports = {
  optimization: {
    minimizer: [
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
    ]
  }
};
```

- 说实话，如果做简单的页面应用，webpack 自动压缩图片还是可以的，如果本地图片非常多且非常大，就并不合适让其自动压缩，因为太耗时了！

## 高级配置总结

- 从 4 个角度对 webpack 和代码进行了优化：

1. 提升开发体验

- 使用 `Source Map` 让开发或上线时代码报错能有更加准确的错误提示

2. 提升 webpack 提升打包构建速度

- 使用 `HotModuleReplacement` 让开发时只重新编译打包更新变化了的代码，不变的代码使用缓存，从而使更新速度更快
- 使用 `OneOf` 让资源文件一旦被某个 loader 处理了，就不会继续遍历了，打包速度更快
- 使用 `Include/Exclude` 排除或只检测某些文件，处理的文件更少，速度更快
- 使用 `Cache` 对 eslint 和 babel 处理的结果进行缓存，让第二次打包速度更快
- 使用 `Thread` 多进程处理 eslint 和 babel 任务，速度更快(需要注意的是，进程启动通信都有开销的，要在比较多代码处理时使用才有效果)

3. 减少代码体积

- 使用 `Tree Shaking` 剔除了没有使用的多余代码，让代码体积更小
  在 package.json 中配置
  `"sideEffects": false` 所有代码都没有副作用(都可以进行 tree shaking)
  问题：可能会把 css、@babel/polyfill (副作用)文件干掉
  `"sideEffects": ["*.css", "*.less"]`
  使用 purgecss-webpack-plugin 对 CSS Tree Shaking
- 使用 `@babel/plugin-transform-runtime` 插件对 babel 进行处理，让辅助代码从中引入，而不是每个文件都生成辅助代码，从而体积更小
- 使用 `Image Minimizer` 对项目中图片进行压缩，体积更小，请求速度更快(需要注意的是，如果项目中图片都是在线链接，那么就不需要了，本地项目静态图片才需要进行压缩)

4. 优化代码运行性能

- 使用 `Code Split` 对代码进行分割成多个 js 文件，从而使单个文件体积更小，并行加载 js 速度更快，并通过 import 动态导入语法进行按需加载，从而达到需要使用时才加载该资源，不用时不加载资源
  页面组件拆分，优先加载首屏内容所需资源，组件按需加载
  splitchunks 有效拆分公共依赖，提高缓存利用率
- 使用 `Preload / Prefetch` 对代码进行提前加载，等未来需要使用时就能直接使用，从而用户体验更好
  ```js
  // import from { mul } from './test'
  document.getElementById('btn').onclick = function () {
    // lazy loading 懒加载：当文件需要使用时才加载
    // 预加载 prefetch：会在使用之前，提前加载js文件
    // 正常加载可以认为是并行加载(同一时间加载多个文件)
    // 预加载 prefetch：等其他资源加载完毕，浏览器空闲了，再偷偷加载资源
    // 通过 js 代码，让某个文件被单独打包成一个 chunk
    // import 动态导入语法：能将某个文件单独打包
    import(/* webpackChunkName: 'test', webpackPrefetch: true */ './test').then(({ mul }) => {
      console.log(mul(4, 5));
    });
  };
  ```
- 使用 `Network Cache` 能对输出资源文件进行更好的命名，将来好做缓存，从而用户体验更好
- 使用 `Core-js` 对 js 进行兼容性处理，让代码能运行在低版本浏览器
- 使用 `PWA` 能让代码离线也能访问，从而提升用户体验

## webpack 分包 externals & cdn

- 主要是减少入口依赖文件包的体积，如果不进行拆包，那么根据 entry 的文件打包就很大，会影响首页加载的性能。
  - 利用 entry 进行分包，多入口
  - splitChunks
  - externals 外部扩展 & cdn 优化静态资源
    - 公司有 cdn，且静态资源有部署到 cdn
    - 这样我们可以将⼀些 js 文件存储在 CDN 上(减少 webpack 打包出来的 js 体积)，在 index.html 中通过标签引入
    - webpack 提供了一个外部扩展 externals，将输出的 bundle.js 排除第三方的依赖，不会对其进行打包
    - 还需在 HtmlWebpackPlugin 中加入引入的 cdn 地址，即修改 index.html 模板，自动通过标签引入

- plugins

```js
module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      // 模板：以 public/index.html 文件创建新的 html 文件
      // 新的 html 文件特点：1. 结构和原来一致 2. 自动引入打包输出的资源
      template: path.resolve(__dirname, '../public/index.html'),
      filename: 'index.html',
      env: process.env.NODE_ENV, // 传入模版中的环境
      inject: 'body',
      cdn: {
        // https://cdn.bootcdn.net/ajax/libs/vue/2.6.9/vue.js
        // https://cdn.bootcdn.net/ajax/libs/vue-router/3.6.5/vue-router.js
        // https://cdn.bootcdn.net/ajax/libs/vuex/3.6.2/vuex.js
        // https://cdn.bootcdn.net/ajax/libs/axios/1.2.2/axios.js
        // https://cdn.bootcdn.net/ajax/libs/echarts/5.3.3/echarts.js
        basePath: 'https://cdn.bootcdn.net/ajax/libs',
        js: ['/vue/2.6.9/vue.js', '/vue-router/3.6.5/vue-router.js', '/vuex/3.6.2/vuex.js', '/axios/1.2.2/axios.js', '/echarts/5.3.3/echarts.js']
      }
    })
  ]
};
```

- externals

```js
module.exports = {
  externals: {
    // jquery 通过 script 引入之后，全局中即有了 jQuery 变量
    jquery: 'jQuery',
    // 格式为："资源名":"外部引入名" （注意：外部引入名由模块自身决定，不可更改。）
    // key 是我们 import 的包名，value 是 CDN 为我们提供的全局变量名
    // 所以最后 webpack 会把一个静态资源编译成：module.export.react = window.React
    react: 'React',
    'react-dom': 'ReactDOM',
    redux: 'Redux',
    'react-router-dom': 'ReactRouterDOM',
    loadsh: '_',
    vue: 'Vue',
    vuex: 'Vuex',
    'vue-router': 'VueRouter',
    axios: 'axios',
    echarts: 'echarts' // 如果采用 cdn，echart 只能全量引入使用，因为 echart 按需引入后，externals 无法识别 echart，所以不会忽略打包，还是会把 echart 打包进去
  }
};
```

- index.html
  开发环境不需要引入 externals，仍然可以通过 import 的方式去引用(如 import $ from 'jquery')，模版 html 中可以根据环境判断是否需要插入 cdn

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- index.html 加上版本号 -->
    <meta name="version" content="<%=new Date().toLocaleString()%>" />
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <!-- <link rel="shortcut icon" href="./favicon.ico" type="image/x-icon"> -->
    <link rel="icon" href="icon_192x192.png" />
    <title>webpack</title>
    <% if (htmlWebpackPlugin.options.env === 'production') { %> <% for (var i in htmlWebpackPlugin.options.cdn && htmlWebpackPlugin.options.cdn.js) { %>
    <script src="<%= htmlWebpackPlugin.options.cdn.basePath %><%= htmlWebpackPlugin.options.cdn.js[i] %>"></script>
    <% } %> <% } %>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
```

## vue2

```shell
# vue2 全家桶相关版本
npm i vue@2 vue-router@3 vuex@3

# vue 相关 eslint
npm i eslint-plugin-vue eslint-plugin-prettier prettier eslint-config-prettier -D

# cross-env 定义的环境变量给 webpack 打包工具使用
npm i cross-env -D

# vue-loader
# vue-style-loader 基于 style-loader 支持 SSR 渲染
npm i vue-loader@15 vue-style-loader@4 -D
# vue vue-template-compiler 版本保持一致
npm i vue-template-compiler@2 -D
```

- vue-loader 版本有问题跟 vue2 和 vue3 有关系，试试 npm i vue-loader@15 -D

```shell
[webpack-cli] Error: Compiling RuleSet failed: Properties generator are unknown (at ruleSet[0].rules[0]: [object Object])
```

- element-ui **自定义主题**需要留意一下 sass 的版本

```shell
Deprecation Warning: $weight: Passing a number without unit % (0) is deprecated.

To preserve current behavior: $weight * 1%

More info: https://sass-lang.com/d/function-units

Deprecation Using / for division outside of calc() is deprecated and will be removed in Dart Sass 2.0.0.

# sass 废弃了某些内容
```

```shell
npm i sass@1.5 sass
```

- 在本地启动一个静态文件服务器，可以使用 serve 工具

```shell
npm i serve -g
```

```shell
serve dist
```
