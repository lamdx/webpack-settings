/**
 * 检测设备支持最小的字体
 * @returns
 */
export const checkMinFontSupport = () => {
  return new Promise(resolve => {
    // 1. 创建测试元素
    const testElem = document.createElement('div');
    testElem.style.cssText = `
      position: absolute;
      opacity: 0;
      font-size: 1px; // 从最小单位开始测试
      font-family: sans-serif;
    `;
    testElem.textContent = '最小字体';

    // 2. 添加到 DOM 并等待渲染
    document.body.appendChild(testElem);
    requestAnimationFrame(() => {
      // 3. 获取实际渲染尺寸
      const renderedSize = parseFloat(getComputedStyle(testElem).fontSize);

      // 4. 清理 DOM
      document.body.removeChild(testElem);
      // console.log(renderedSize, '实际字体的最小数值')
      resolve(renderedSize);
    });
  });
};

let SUPPORT_MIN_SIZE = 10; // 兼容安卓机型显示不了小的字体
checkMinFontSupport().then(minSize => {
  SUPPORT_MIN_SIZE = minSize;
  // console.log(`本设备支持的最小字体: ${minSize}px`)
});

/**
 * 使用这个指令需要给元素 设置样式 定宽，且 whiteSpace: nowrap
 * 不能设置 overflow: hidden; 不然子元素若有边框会被隐藏掉
 * 根据容器宽度自适应字号大小 公式: 对应容器宽度字号大小 = 字号原大小 / (文案原长度 / 容器宽度)
 * @param {*} el
 * @param {*} binding
 */
const autoFont = (el, binding) => {
  // 如果没有给需要自适应的元素设置样式 whiteSpace: nowrap，在这里设置元素 whiteSpace 为 nowrap 会卡顿
  // el.style.whiteSpace = 'nowrap'
  // el.style.fontSize = ''
  const scrollWidth = el.scrollWidth;
  const clientWidth = el.clientWidth;
  const height = el.clientHeight;
  const {
    minSize = 0,
    transformOrigin = '0% 50%',
    vconsole = false
  } = binding.value || {};
  const elStyle = window.getComputedStyle(el);
  const sourceFontSize = parseFloat(elStyle.fontSize) || 16;
  if (scrollWidth > clientWidth) {
    let newSize = sourceFontSize / (scrollWidth / clientWidth) - 1;
    newSize = Math.max(newSize, minSize);

    if (vconsole)
      console.log(
        '文本',
        el.innerText,
        '原本字体大小',
        elStyle.fontSize,
        '计算后字体',
        newSize,
        'scrollWidth',
        scrollWidth,
        'clientWidth',
        clientWidth
      );
    // 保证文字始终垂直居中
    el.style.lineHeight = `${height}px`;

    if (Number(newSize) <= SUPPORT_MIN_SIZE) {
      el.style.fontSize = Math.ceil(SUPPORT_MIN_SIZE) + 'px';
      el.style.transformOrigin = transformOrigin;
      const scaleX = Math.max(clientWidth / scrollWidth, 0.4);
      // console.log(scaleX , '字体缩放的计算比例')
      el.style.transform = `scale(${scaleX}, ${scaleX})`;
      el.style.paddingRight = '4px';
    } else {
      el.style.fontSize = `${newSize}px`;
      el.style.transformOrigin = '';
      el.style.transform = '';
    }
  } else {
    // 列表不断刷新的时候，重置样式
    el.style.fontSize = '';
    el.style.transformOrigin = '';
    el.style.transform = '';
  }
};

/**
 * 使用方式：
 * 设置宽度 div(v-auto-font)
 * v-auto-font="{ minSize: 10 }"
 */
export default {
  inserted(el, binding) {
    autoFont(el, binding);
    // Vue.prototype.$nextTick(() => {
    //   autoFont(el, binding)
    // })
  },
  componentUpdated(el, binding) {
    autoFont(el, binding);
  },
  update(el, binding) {
    autoFont(el, binding);
  }
};
