const year = new Date().getFullYear();
// 日期
export const data = `@date(${year}-MM-dd)`;
export const time = `@date(${year}-MM-dd hh:mm:ss)`;
// 随机自然数
export const natural = '@natural(10000,999999)';
// 随机浮点数 参数 整数最小值 整数最大值 小数位数 min 小数位数 max
export const float = '@float(10000,999999,2,4)';
export const guid = '@guid';
export const id = '@id';
// 去掉 c 就是英文相关
// 中文姓
export const cfirst = '@cfirst';
// 中文名
export const clast = '@clast';
// 中文姓名
export const cname = '@cname';
// 中文单词
export const cword = '@cword(6)';
// 中文标题
export const ctitle = '@ctitle';
// 中文句子
export const csentence = '@csentence';
// 中文文本
export const cparagraph = '@cparagraph';
// 邮政编码
export const zip = '@zip';
// IP
export const ip = '@ip';
// 邮箱
export const email = '@email("pingan.com.cn")';
// 中国 省
export const province = '@province';
// 中国 市
export const city = '@city';
// 随机生成一个中国县 prefix 布尔值，表示是否显示所属的省市
export const county = '@county(true)';
// 从数组中随机挑选一个
export const randomPick = '@pick(["Y","N"])';
export function randomLists(lists) {
  const obj = {};
  const keys = Object.keys(lists[0]);
  keys.forEach(key => {
    const arr = lists.map(list => list[key]);
    obj[key] = `@pick(${arr})`;
  });
  return obj;
}
