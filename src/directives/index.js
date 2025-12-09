import Vue from 'vue';

import resizeFont from './resize-font';
import autoFont from './auto-font';
import dict from './dict';

const directives = {
  resizeFont,
  autoFont
  // dict
};

// resizeFont 使用方法 <div v-resize-font class="full-w nowrap">
// autoFont 使用方法 <div v-auto-font class="full-w nowrap">
// autoFont 使用方法 <div v-auto-font="{ minSize: 10 }" class="full-w nowrap">
// 字典转义 使用方法 <span v-dict:currency>{{ a }}</span>

Object.keys(directives).forEach(key => {
  if (typeof directives[key] === 'object') {
    Vue.directive(key, directives[key]);
  }
});
