export default {
  data() {
    return {
      before: {
        accountpercent: 56,
        age: 18
      },
      after: {
        accountpercent: 78,
        age: 18
      },
      updateKeys: []
    };
  },
  created() {
    this.compareObj();
    console.log(this.after);
    console.log(
      this.compareArr([{ id: 1 }, { id: 2 }], [{ id: 2 }, { id: 3 }])
    );
  },
  methods: {
    compareObj() {
      const _keysbefore = Object.keys(this.before);
      const _keysafter = Object.keys(this.after);
      const _temp = _keysbefore.concat(_keysafter);
      const _keys = _temp.filter((item, i, arr) => arr.indexOf(item) === i);
      console.log(_keys);
      _keys.forEach(key => {
        if (key === 'accountList') return;
        if (this.after[key] !== this.before[key]) {
          this.updateKeys[key] = true;
          switch (key) {
            case 'accountpercent':
              this.after[key] = `${this.$options.filters.toPercent(
                this.after[key]
              )}(修改前:${this.$options.filters.toPercent(this.before[key])})`;
              break;
            default:
              this.after[key] = `${this.after[key] || '-'}(修改前:${
                this.before[key] || '-'
              })`;
          }
        }
      });
    },
    compareArr(before, after) {
      function deepClone(source) {
        if (!source && typeof source !== 'object') {
          throw new Error('error arguments', 'deepClone');
        }
        const targetObj = source.constructor === Array ? [] : {};
        Object.keys(source).forEach(key => {
          if (source[key] && typeof source[key] === 'object') {
            targetObj[key] = deepClone(targetObj[key]);
          } else {
            targetObj[key] = source[key];
          }
        });
        return targetObj;
      }
      after.forEach(item => {
        let isSame = true;
        before.forEach(item2 => {
          if (item.id === item2.id) {
            isSame = false;
          }
        });
        if (isSame) {
          item.actionType = 'new';
        }
      });
      before.forEach(item => {
        let isSame = true;
        after.forEach(item2 => {
          if (item.id === item2.id) {
            isSame = false;
          }
        });
        if (isSame) {
          const tempObj = deepClone(item);
          tempObj.actionType = 'old';
          after.push(tempObj);
        }
      });
      return after;
    }
  }
};
