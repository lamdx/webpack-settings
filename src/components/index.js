import Vue from 'vue';

const modulesFiles = require.context('../components', true, /\.vue$/);

modulesFiles.keys().forEach(modulePath => {
  const component = modulesFiles(modulePath).default;
  const componentName =
    component.name || modulePath.replace(/^\.\/(.*)\/\w+\.vue$/, '$1');
  Vue.component(componentName, component);
});
