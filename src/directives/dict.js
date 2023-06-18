import request from '../api/request';

const prefix = 'dict_'; // 添加前缀防止业务代码缓存名称相同导致冲突(不能100%防止)

function initDicts(codes) {
  const promises = [];
  codes.forEach(code => {
    promises.push(getDictCodeValues(code));
  });
  Promise.race(promises).then(res => {
    console.log(res);
  });
}

function getDictCodeValues(code) {
  return new Promise(resolve => {
    if (hasSessionStorage(code)) {
      const list = JSON.parse(getSessionStorage(code));
      resolve(list);
    }
    const url = '/api/dict';

    request({
      url,
      method: 'post',
      data: {
        dictCode: code
      }
    }).then(res => {
      setSessionStorage(code, res.data);
      resolve(res.data);
    });
  });
}

function hasSessionStorage(code) {
  const cache = getSessionStorage(code);
  if (cache && cache.length > 0) {
    return true;
  } else {
    return false;
  }
}

function getSessionStorage(code) {
  return sessionStorage.getItem('' + prefix + code);
}

function setSessionStorage(code, list) {
  if (code && list && list.length > 0) {
    sessionStorage.setItem('' + prefix + code, JSON.stringify(list));
  }
  return list;
}

function getDictText(code, value) {
  return new Promise(resolve => {
    setTimeout(() => {
      getDictCodeValues(code).then(list => {
        let text = '';
        list.forEach(item => {
          if (item.value === value) {
            text = item.name;
          }
        });
        resolve(text);
      });
    });
  });
}

function getDictTextFn(el, binding) {
  if (typeof binding.value === 'string') {
    const code = binding.value;
    const value = el.innerText;
    getDictText(code, value).then(text => {
      if (text) {
        el.innerText = text;
      }
    });
  }
  if (typeof binding.value === 'object') {
    const dictObj = binding.value;
    getDictText(dictObj.code, dictObj.value).then(text => {
      if (text) {
        el.innerText = text;
      }
    });
  }
}

export default {
  inserted: getDictTextFn,
  componentUpdated: getDictTextFn
};
