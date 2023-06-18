<template>
  <!-- 流程图 -->
  <div class="box">
    <div class="process">
      <div class="start">开始</div>
      <div v-for="(item, i) in stepsList" :key="i" class="step">
        <span
          :class="item.status === 'Y' ? 'step line_done' : 'step line_todo'"
        ></span>
        <div :class="item.status === 'Y' ? 'step done_step' : 'step todo_step'">
          <div class="top">{{ item.nodeName }}</div>
          <div class="bottom">
            <span>
              {{ item.nodeName.indexOf('经办') > -1 ? '经办人' : '审批人' }}
            </span>
            <span>{{ item.userInfoCode }}</span>
          </div>
        </div>
      </div>
      <div class="end">
        <span
          :class="status === 'Y' ? 'step line_done' : 'step line_todo'"
        ></span>
        <div :class="status === 'Y' ? 'end done_step' : 'end todo_step'">
          结束
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'FlowChart',
  data() {
    return {
      stepsList: [
        {
          nodeName: '流程-经办',
          status: 'Y',
          spTime: '2021-02-03',
          userInfoCode: 'OBEN002007_zdl101',
          userInfo: 'zdl101',
          roleInfoCode: '',
          roleInfo: 'null'
        },
        {
          nodeName: '流程-审批',
          status: 'Y',
          spTime: '2021-02-03',
          userInfoCode: 'OBEN002007_zdl101,OBEN002007_zdl102,OBEN002007_zdl103',
          userInfo: 'zdl101,zdl102,zdl103',
          roleInfoCode: '',
          roleInfo: 'null'
        },
        {
          nodeName: '流程-审批2',
          status: 'N',
          spTime: '2021-02-03',
          userInfoCode: 'OBEN002007_zdl101',
          userInfo: 'zdl101',
          roleInfoCode: 'OBEN002007_zdl101,OBEN002007_zdl102,OBEN002007_zdl103',
          roleInfo: 'zdl101,zdl102,zdl103'
        }
      ]
    };
  },
  computed: {
    status() {
      return this.stepsList[this.stepsList.length - 1].status === 'Y'
        ? 'Y'
        : '';
    }
  }
};
</script>
<style scoped lang="less">
.box {
  width: 100%;
  .process {
    width: auto;
    // min-width: 100%;
    padding: 50px;
    white-space: nowrap;
    overflow-x: auto;
    background: #f5f5f5;
    .start {
      width: 48px;
      height: 48px;
      display: inline-block;
      vertical-align: middle;
      border: 1px solid #ff710e;
      border-radius: 50%;
      line-height: 48px;
      color: #ff710e;
      text-align: center;
    }
    .end {
      display: inline-block;
      margin-left: -4px;
      vertical-align: middle;
      color: #ccc;
      .line_todo {
        width: 60px;
        float: left;
        margin-top: 24px;
        border-top: 1px solid #ccc;
      }
      .line_done {
        width: 60px;
        float: left;
        margin-top: 24px;
        border-top: 1px solid #ff710e;
      }
      .todo_step {
        width: 48px;
        height: 48px;
        float: left;
        margin-left: 0;
        border: 1px solid #ccc;
        border-radius: 50%;
        line-height: 48px;
        text-align: center;
      }
      .done_step {
        width: 48px;
        height: 48px;
        float: left;
        margin-left: 0;
        border: 1px solid #ff710e;
        border-radius: 50%;
        line-height: 48px;
        text-align: center;
      }
    }
    .step {
      display: inline-block;
      overflow: hidden;
      vertical-align: middle;
      &:nth-child(2) {
        margin-left: -4px;
      }
      .line_todo {
        width: 60px;
        float: left;
        margin-top: 24px;
        border-top: 1px solid #ccc;
      }
      .line_done {
        width: 60px;
        float: left;
        margin-top: 24px;
        border-top: 1px solid #ff710e;
      }
      .todo_step {
        width: 300px;
        height: 48px;
        float: left;
        margin-left: 0;
        border: 1px solid #ccc;
        border-radius: 8px;
        color: #ccc;
        .top {
          height: 24px;
          padding-left: 20px;
          background: #ccc;
          line-height: 24px;
          color: #fff;
        }
        .bottom {
          height: 24px;
          padding-left: 20px;
          line-height: 24px;
        }
      }
      .done_step {
        width: 300px;
        height: 48px;
        float: left;
        margin-left: 0;
        border: 1px solid #ff710e;
        border-radius: 8px;
        color: #ff710e;
        .top {
          height: 24px;
          padding-left: 20px;
          background: #ff710e;
          line-height: 24px;
          color: #fff;
        }
        .bottom {
          height: 24px;
          padding-left: 20px;
          line-height: 24px;
        }
      }
    }
  }
}
</style>
