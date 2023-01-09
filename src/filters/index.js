import Vue from 'vue';

let filterList = {};

filterList.YorN = {
  Y: '是',
  N: '否'
};

filterList.setThousand = (val = '', Fix = 2) => {
  let _num = Number(val);
  if (!isNaN(_num)) {
    _num = Number.parseFloat(_num).toFixed(Fix) + '';
    return (
      _num.split('.')[0].replace(/(\d)(?=(\d{3})+(\.|$))/g, '$1,') +
      '.' +
      _num.split('.')[1]
    );
  } else {
    return val;
  }
};

filterList.toPercent = val => {
  if (val || val === 0) {
    let _num = Number(val);
    if (!isNaN(_num)) {
      let _temp = (_num * 100).toFixed(2);
      return _temp + '%';
    } else {
      return '-';
    }
  }
};

export default filterList;

// export default {
//   YorN: {
//     Y: '是',
//     N: '否'
//   },

//   setThousand: (val = '', Fix = 2) => {
//     let _num = Number(val);
//     if (!isNaN(_num)) {
//       if (_num >= 0) {
//         _num = Number.parseFloat(_num).toFixed(Fix) + '';
//         return (
//           _num.split('.')[0].replace(/(\d)(?=(\d{3})+(\.|$))/g, '$1,') +
//           '.' +
//           _num.split('.')[1]
//         );
//       } else {
//         return '-';
//       }
//     } else {
//       return val;
//     }
//   },

//   toPercent: val => {
//     if (val || val === 0) {
//       let _num = Number(val);
//       if (!isNaN(_num)) {
//         let _temp = (_num * 100).toFixed(2);
//         return _temp + '%';
//       } else {
//         return '-';
//       }
//     }
//   }
// };

Object.keys(filterList).map(key => {
  if (typeof filterList[key] === 'function') {
    Vue.filter(key, filterList[key]);
  } else {
    Vue.filter(key, val => {
      if (val) {
        if (!filterList[key][val]) return val;
        return filterList[key][val] || '-';
      } else {
        return '-';
      }
    });
  }
});
