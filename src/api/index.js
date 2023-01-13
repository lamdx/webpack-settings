import request from './request';

export const getList = data =>
  request({ url: '/api/list', data, method: 'post', NO_GLOBAL_MSG: true });

export const getOptions = paramas =>
  request({ url: '/api/options', paramas, method: 'get' });
