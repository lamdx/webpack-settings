function getStorageType(type) {
  switch (type) {
    case 'local':
      return localStorage;
    case 'session':
      return sessionStorage;
    default:
      return sessionStorage;
  }
}

// 获取原始数据
export function getRawItem(key, type = 'session') {
  if (!key) return;
  const raw = getStorageType(type).getItem(key);
  return raw || '';
}

// 获取数据
export function getItem(key, type = 'session') {
  if (!key || typeof key !== 'string') {
    console.error(`参数${key}错误`);
    return;
  }
  const data = getStorageType(type).getItem(key);
  try {
    if (data !== '' && data !== undefined) {
      return JSON.parse(data);
    } else {
      return '';
    }
  } catch (err) {
    console.log(err);
    console.error(`转换JSON失败，key：${key}`);
  }
}

// 保存数据
export function setItem(key, value, type = 'session') {
  // key 必须为字符串
  if (!key || typeof key !== 'string') {
    console.error(`参数${key}错误`);
    return;
  }
  let data;
  // 统一将数据转换为 json 格式进行存储
  if (value === undefined) {
    data = JSON.stringify('');
  } else if (typeof value === 'object') {
    data = JSON.stringify(value);
  } else {
    data = value;
  }
  getStorageType(type).setItem(key, data);
}

// 删除数据
export function removeItem(key, type = 'session') {
  getStorageType(type).removeItem(key);
}
