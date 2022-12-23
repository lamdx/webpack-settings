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
