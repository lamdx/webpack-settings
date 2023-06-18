<template>
  <!-- 折叠面板 -->
  <ul class="roles_list">
    <!-- <li v-for="(role, roleIndex) in roleInfoList" :key="roleIndex">
      <div class="role">
        <div>
          <span>{{ role.roleInfo }}</span>
          <span>{{ role.roleInfoCode }}</span>
        </div>
        <div @click="handle(role)">
          {{ role.userCount && role.userCount + "个用户" }}
          <i
            :class="{
              arrow: role.userCount,
              right: !find(role),
              down: find(role)
            }"
          ></i>
        </div>
      </div>
      <div class="role_users_list" v-show="find(role)">
        <div
          v-for="(user, userIndex) in role.userInfoList"
          :key="userIndex"
          class="user"
        >
          <div class="left">
            <span>{{ user.userInfo }}</span>
            <span>{{ user.userInfoCode }}</span>
          </div>
          <div class="right">{{ user.enterpriseName }}</div>
        </div>
      </div>
    </li> -->
    <li v-for="(role, roleIndex) in roleInfoList" :key="roleIndex">
      <div class="role">
        <div>
          <span>{{ role.roleInfo }}</span>
          <span>{{ role.roleInfoCode }}</span>
        </div>
        <div @click="changeContent(roleIndex)">
          {{ role.userCount && role.userCount + '个用户' }}
          <i
            :class="{
              arrow: role.userCount,
              right: true,
              down: role.showContent
            }"
          ></i>
        </div>
      </div>
      <div v-show="role.showContent" class="role_users_list">
        <div
          v-for="(user, userIndex) in role.userInfoList"
          :key="userIndex"
          class="user"
        >
          <div class="left">
            <span>{{ user.userInfo }}</span>
            <span>{{ user.userInfoCode }}</span>
          </div>
          <div class="right">{{ user.enterpriseName }}</div>
        </div>
      </div>
    </li>
  </ul>
</template>
<script>
export default {
  name: 'FoldingPanel',
  data() {
    return {
      showList: [],
      roleInfoList: [
        {
          roleInfo: '折叠面板1',
          roleInfoCode: '006',
          userInfoList: [
            {
              userInfo: 'lamd001',
              userInfoCode: '000001',
              enterpriseName: '中软'
            },
            {
              userInfo: 'lamd002',
              userInfoCode: '000002',
              enterpriseName: '中软'
            },
            {
              userInfo: 'lamd003',
              userInfoCode: '000003',
              enterpriseName: '中软'
            }
          ],
          userCount: 3
        },
        {
          roleInfo: '折叠面板2',
          roleInfoCode: '007',
          userInfoList: [],
          userCount: 0
        }
      ]
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.roleInfoList = this.roleInfoList.map((item, i) => {
        // 需要先设置响应式的属性
        this.$set(this.roleInfoList[i], 'showContent', false);
        return item;
      });
    },
    changeContent(roleIndex) {
      // 无效 $set
      // this.$set(
      //   this.roleInfoList[roleIndex],
      //   "showContent",
      //   !this.roleInfoList[roleIndex].showContent
      // );
      this.roleInfoList[roleIndex].showContent =
        !this.roleInfoList[roleIndex].showContent;
    },
    // 点击选项触发的函数
    handle(item) {
      if (item.userCount === 0) return;
      console.log(this.showList);
      // 如果当前点击选项不在已选中数组内，则添加进去，否则就清除出去
      if (!this.find(item)) {
        this.showList.push(item);
      } else {
        let i = this.find(item, true).index;
        this.showList.splice(i, 1);
      }
      this.$emit('handle', this.showList); // 传值父组件
    },
    // 去重操作
    /*
      参数说明：
        item 当前选项 (必传)
        isremove 是否删除 (可选)
     */
    find(item, isremove) {
      let flag = false;
      let index;
      for (let i = 0; i < this.showList.length; i++) {
        if (item === this.showList[i]) {
          flag = true;
          index = i;
        }
      }
      if (isremove) {
        return { flag, index };
      } else {
        return flag;
      }
    }
  }
};
</script>
<style scoped lang="less">
.roles_list {
  white-space: nowrap;
  > li {
    flex-wrap: wrap;
    margin-bottom: 12px;
    .role {
      display: flex;
      justify-content: space-between;
      > div {
        display: flex;
        line-height: 22px;
        font-size: 14px;
        word-wrap: break-word;
        word-break: break-all;
        color: rgba(0, 0, 0, 0.85);
        > span {
          &:nth-child(2) {
            margin-left: 8px;
            color: rgba(0, 0, 0, 0.45);
          }
        }
        &:last-of-type {
          display: inline-block;
          padding: 0 2px 0 8px;
          text-align: right;
        }
      }
    }
  }
}
.role_users_list {
  padding: 8px 16px 1px 8px;
  background: #fafafa;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.85);
  > .user {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    .left {
      display: flex;
      white-space: normal;
      word-break: break-all;
      word-wrap: break-word;
      > span {
        &:nth-child(2) {
          margin-left: 8px;
          color: rgba(0, 0, 0, 0.45);
        }
      }
    }
    .right {
      padding-left: 8px;
      text-align: right;
    }
  }
}
.arrow {
  padding: 4px;
  border: solid rgba(0, 0, 0, 0.45);
  border-width: 0 1px 1px 0;
  display: inline-block;
  &.right {
    transform: rotate(-45deg);
    -webkit-transform: rotate(-45deg);
  }
  &.down {
    transform: rotate(45deg);
    -webkit-transform: rotate(45deg);
  }
}
</style>
