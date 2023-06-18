<template>
  <div>
    <Form
      ref="formValidate"
      :model="formValidate"
      :rules="ruleValidate"
      :label-width="80"
    >
      <!-- <FormItem label="Name" prop="name">
        <Input
          v-model="formValidate.name"
          placeholder="Enter your name"
        ></Input>
      </FormItem> -->
      <FormItem label="Name" prop="name">
        <RmbInput v-model="formValidate.name"></RmbInput>
      </FormItem>
      <FormItem label="E-mail" prop="mail">
        <Input
          v-model="formValidate.mail"
          placeholder="Enter your e-mail"
        ></Input>
      </FormItem>
      <FormItem label="City" prop="city">
        <Select v-model="formValidate.city" placeholder="Select your city">
          <Option value="beijing">New York</Option>
          <Option value="shanghai">London</Option>
          <Option value="shenzhen">Sydney</Option>
        </Select>
      </FormItem>
      <FormItem label="Date">
        <Row>
          <Col span="11">
            <FormItem prop="date">
              <DatePicker
                v-model="formValidate.date"
                type="date"
                placeholder="Select date"
              ></DatePicker>
            </FormItem>
          </Col>
          <Col span="2" style="text-align: center">-</Col>
          <Col span="11">
            <FormItem prop="time">
              <TimePicker
                v-model="formValidate.time"
                type="time"
                placeholder="Select time"
              ></TimePicker>
            </FormItem>
          </Col>
        </Row>
      </FormItem>
      <FormItem label="Gender" prop="gender">
        <RadioGroup v-model="formValidate.gender">
          <Radio label="male">Male</Radio>
          <Radio label="female">Female</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="Hobby" prop="interest">
        <CheckboxGroup v-model="formValidate.interest">
          <Checkbox label="Eat"></Checkbox>
          <Checkbox label="Sleep"></Checkbox>
          <Checkbox label="Run"></Checkbox>
          <Checkbox label="Movie"></Checkbox>
        </CheckboxGroup>
      </FormItem>
      <FormItem label="Desc" prop="desc">
        <Input
          v-model="formValidate.desc"
          :autosize="{ minRows: 2, maxRows: 5 }"
          type="textarea"
          placeholder="Enter something..."
        ></Input>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSubmit('formValidate')">
          Submit
        </Button>
        <Button style="margin-left: 8px" @click="handleReset('formValidate')">
          Reset
        </Button>
        {{ formValidate.name }}
      </FormItem>
    </Form>
  </div>
</template>
<script>
import localMixins from './local-mixins';
export default {
  name: 'DynamicStore',
  mixins: [localMixins],
  data() {
    return {
      formValidate: {
        name: '',
        mail: '',
        city: '',
        gender: '',
        interest: [],
        date: '',
        time: '',
        desc: ''
      },
      ruleValidate: {
        name: [
          {
            required: true,
            message: 'The name cannot be empty',
            trigger: 'change'
          },
          {
            pattern: /^[\u4E00-\u9FA5A-Za-z0-9_]+$/,
            message: '中文、英文、数字包括下划线',
            trigger: ['change', 'blur']
          },
          { validator: this.validateName, trigger: 'change' }
        ],
        mail: [
          {
            required: true,
            message: 'Mailbox cannot be empty',
            trigger: 'blur'
          },
          { type: 'email', message: 'Incorrect email format', trigger: 'blur' }
        ],
        city: [
          {
            required: true,
            message: 'Please select the city',
            trigger: 'change'
          }
        ],
        gender: [
          { required: true, message: 'Please select gender', trigger: 'change' }
        ],
        interest: [
          {
            required: true,
            type: 'array',
            min: 1,
            message: 'Choose at least one hobby',
            trigger: 'change'
          },
          {
            type: 'array',
            max: 2,
            message: 'Choose two hobbies at best',
            trigger: 'change'
          }
        ],
        date: [
          {
            required: true,
            type: 'date',
            message: 'Please select the date',
            trigger: 'change'
          }
        ],
        time: [
          {
            required: true,
            type: 'string',
            message: 'Please select time',
            trigger: 'change'
          }
        ],
        desc: [
          {
            required: true,
            message: 'Please enter a personal introduction',
            trigger: 'blur'
          },
          {
            type: 'string',
            min: 20,
            message: 'Introduce no less than 20 words',
            trigger: 'blur'
          }
        ]
      }
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.updateFormInstance(this.$refs['formValidate']);
      console.log('this.formInstance ===', this.formInstance);
    });
  },
  methods: {
    validateName(rule, value, callback) {
      // console.log(rule);
      if (!value) {
        return callback(new Error('Name cannot be empty'));
      }
      callback();
    },
    async handleSubmit(name) {
      let validFlag = await this.$refs[name].validate();
      if (validFlag) {
        this.$Message.success('Success!');
      } else {
        this.$Message.error('Fail!');
      }
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    }
  }
};
</script>
<style lang="less"></style>
