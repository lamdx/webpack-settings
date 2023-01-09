import Vue from 'vue';
const banksMap = {};
const req = require.context('./bank', false, /[a-zA-Z]\.png$/);
const requireAll = requireContext => {
  const banks = requireContext.keys();
  banks.forEach(bank => {
    const lastIndex = bank.lastIndexOf('.');
    const bankName = bank.substring(2, lastIndex);
    banksMap[bankName] = `${bankName}.png`;
  });
  Vue.prototype.$banksMap = banksMap;
  // return requireContext.keys().map(requireContext);
};
requireAll(req);
