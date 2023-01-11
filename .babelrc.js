module.exports = {
  // 语法转换插件 preset-env
  // 因为默认 @babel/preset-env 只会转换语法，也就是我们看到的箭头函数、const 一类，如果进一步需要转换内置对象、实例方法，那就得用 polyfill，这就需要你做一点配置了
  // 这里有一个至关重要的参数 "useBuiltIns"，他是控制 @babel/preset-env 使用何种方式帮我们导入 polyfill 的核心，它有三个值可以选

  // entry
  // 这是一种入口导入方式，只要我们在打包配置入口 或者 文件入口写入 import "core-js" 这样一串代码，babel 就会替我们根据当前你所配置的目标浏览器(browserslist)来引入所需要的 polyfill
  // 像这样， 在 index.js 文件中加入 core-js
  // // src/index.js
  // import "core-js";
  // Promise.resolve().then(() => {
  //   console.log('hello promise');
  // });
  // 当 useBuiltIns 的值 entry 时， @babel/preset-env 会按照你所设置的目标浏览器在入口处来引入所需的 polyfill，不管你需不需要，如此，我们可以知道，useBuiltIns 的值 entry 的优点是覆盖面积就比较广，一股脑全部搞定，但是缺点就是打出来的包就大了多了很多没有用到的 polyfill，并且还会污染全局

  // usage
  // useBuiltIns 的值 usage 时，会参考目标浏览器(browserslist)和 代码中所使用到的特性来按需加入 polyfill，当然，使用 useBuiltIns 的值 usage，还需要填写另一个参数 corejs 的版本号

  // false
  // useBuiltIns 的值 false 时，这也是默认值 ，使用这个值时不引入 polyfill
  presets: [
    [
      '@babel/preset-env',
      // 按需加载 core-js 的 polyfill
      {
        // package.json 已经有 browserslist 了
        // targets: {
        //   browsers: [
        //     'last 10 versions',
        //     'Safari >= 6',
        //     'Android >= 4.0',
        //     'ie > 8',
        //     'chrome >= 39',
        //     'not dead'
        //   ]
        // },
        useBuiltIns: 'usage',
        // core-js 支持两个版本，2 或 3，很多新特性已经不会加入到 2 里面了，比如: flat 等等最新的方法，2 这个版本里面都是没有的，所以建议大家用 3
        corejs: 3
      }
      // { useBuiltIns: 'usage', corejs: { version: '3', proposals: true } }
    ]
    // 'stage-2'
    // '@babel/preset-react'
  ],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ]
  ]
};
