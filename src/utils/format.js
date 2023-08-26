export const setThousand = (val = '', Fix = 2) => {
  let _num = Number(val);
  if (!isNaN(_num)) {
    _num = Number.parseFloat(_num).toFixed(Fix);
    return (
      _num.split('.')[0].replace(/(\d)(?=(\d{3})+(\.|$))/g, '$1,') +
      '.' +
      _num.split('.')[1]
    );
  } else {
    return val;
  }
};
