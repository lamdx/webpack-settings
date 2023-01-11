import request from './request';

export const getList = data =>
  request({ url: '/api/list', data, method: 'get' });

export const getOptions = data =>
  request({ url: '/api/options', data, method: 'get' });
