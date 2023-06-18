import Vue from 'vue';

import resizeFont from './resize-font';
import dict from './dict';

const directives = {
  resizeFont
  // dict
};

// resizeFont 使用方法 <div v-resize-font class="nowrap">
// 字典转义 使用方法 <span v-dict:currency>{{ a }}</span>

Object.keys(directives).forEach(key => {
  if (typeof directives[key] === 'object') {
    Vue.directive(key, directives[key]);
  }
});
