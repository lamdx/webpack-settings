// javaScript 中所有的数字，无论是整数还是小数，其类型均为 Number。在程序内部，Number 类型的实质是一个 64 位的浮点数，这与 Java中 double 类型的浮点数是一致的；因此，JavaScript中所有的数都是浮点数。
// 由于内存的限制，ECMAScript并不能保存世界上所有的数值，ES 能够表示的最小数值保存在 Number.MIN_VALUE中，在大多数浏览器中，这个值是 5e-324；表示的最大数值保存在 Number.MAX_VALUE中，在大多数浏览器中，这个值是 1.7976931348623157e308。如果计算结果超出了这个数值范围，则会被自动转成特殊的 Infinity 值，具体来说，如果是负数，则被转为 -Infinity (负无穷)；如果是正数，则被转为 Infinity (正无穷)。

// Math.pow(2, 53);
// 9007199254740992;

export function currency(value, currency = '¥', decimals = 2) {
  const digitsRE = /(\d{3})(?=\d)/g;
  value = parseFloat(value);
  if (!isFinite(value) || (!value && value !== 0)) return '';
  let stringified = Math.abs(value).toFixed(decimals);
  let _int = decimals ? stringified.slice(0, -1 - decimals) : stringified;
  let i = _int.length % 3;
  let head = i > 0 ? _int.slice(0, i) + (_int.length > 3 ? ',' : '') : '';
  let _float = decimals ? stringified.slice(-1 - decimals) : '';
  let sign = value < 0 ? '-' : '';
  return (
    sign + currency + head + _int.slice(i).replace(digitsRE, '$1,') + _float
  );
}

/**
 * Get the first item that pass the test
 * by second argument function
 *
 * @param {Array} list
 * @param {Function} f
 * @return {*}
 */
export function find(list, f) {
  return list.filter(f)[0];
}

/**
 * Deep copy the given object considering circular structure.
 * This function caches all nested objects and its copies.
 * If it detects circular structure, use cached copy to avoid infinite loop.
 *
 * @param {*} obj
 * @param {Array<Object>} cache
 * @return {*}
 */
export function deepCopy(obj, cache = []) {
  // just return if obj is immutable value
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // if obj is hit, it is in circular structure
  const hit = find(cache, c => c.original === obj);
  if (hit) {
    return hit.copy;
  }

  const copy = Array.isArray(obj) ? [] : {};
  // put the copy into cache at first
  // because we want to refer it in recursive deepCopy
  cache.push({
    original: obj,
    copy
  });

  Object.keys(obj).forEach(key => {
    copy[key] = deepCopy(obj[key], cache);
  });

  return copy;
}

export function isObject(obj) {
  return obj !== null && typeof obj === 'object';
}

export function isPromise(val) {
  return val && typeof val.then === 'function';
}
