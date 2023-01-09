import request from './request';

export const getData = data =>
  request({ url: '/api/test', data, method: 'get' });
