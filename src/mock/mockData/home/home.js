export default [
  {
    url: '',
    name: 'home',
    data: {
      msg: '操作成功',
      code: 200,
      data: {
        'resutl|10': {
          number: '@float(10000,999999,2,4)'
        }
      }
    },
    filter: function (data, response, config) {
      let params = JSON.parse(config.body);
      let { pageNumber, pageSize } = params;
      let res = data.data.result;
      res.forEach(item => {
        item.bizType = item.businessSmallType;
      });
      let end = pageNumber * pageSize;
      response.data = {
        ...data.data,
        result: res.slice(end - pageSize, end),
        total: res.length
      };
    }
  }
];
