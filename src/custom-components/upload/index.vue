<template>
  <div>
    <h1>文件上传</h1>
    <input id="file" type="file" />
  </div>
</template>

<script>
import axios from 'axios';
import request from '@/api/request';

const validFile = file => {
  if (!file) return false;
  let isPass = true;
  // 预检测文件大小
  const fileSizeLimit = 10 * 1024 * 1024; // 10 MB
  if (file.size > fileSizeLimit) {
    isPass = false;
    alert('File size exceeds the limit (10MB).');
    return isPass;
  }

  // 预检测文件类型
  const allowedFileTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  if (!allowedFileTypes.includes(file.type)) {
    alert('Invalid file type. Allowed types: JPEG, PNG, PDF.');
    isPass = false;
    return isPass;
  }
  return isPass;
};

const uploadFile = async file => {
  try {
    console.log('file.name ===', file.name);
    const formData = new FormData();
    formData.append('file', file);
    // const response = await axios.post('/upload', formData, {
    //   headers: {
    //     'Content-Type': 'multipart/form-data'
    //   },
    //   onUploadProgress: progressEvent => {
    //     const percentage = (progressEvent.loaded / progressEvent.total) * 100;
    //     console.log(`Uploading: ${percentage.toFixed(2)}%`);
    //     // 更新进度条
    //   }
    // });

    // 使用 FormData 对象构建包含 Blob 数据的表单
    // let blobData = new Blob(['Hello, World!'], { type: 'text/plain' });
    // formData.append('file', blobData, '1.txt');
    // blobData = new Blob([file], { type: file.type });
    // formData.append('file', blobData, file.name);
    const response = await request({
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      method: 'post',
      url: '/upload',
      data: formData,
      onUploadProgress: progressEvent => {
        const percentage = (progressEvent.loaded / progressEvent.total) * 100;
        console.log(`Uploading: ${percentage.toFixed(2)}%`);
        // 更新进度条
      }
    });

    console.log('uploadFile complete', response);
  } catch (error) {
    console.error('uploadFile failed', error);
  }
};

// 通用的二进制数据流格式上传文件
// 请求头需要指定 Content-Type 为 application/octet-stream，Content-Disposition 添加文件名方便服务端获取文件类型，例如：'Content-Disposition': `attachment; filename=${fileName}`
// 请求体可以 可以是 ArrayBuffer Blob
const uploadStreamData = async file => {
  const reader = new FileReader();
  reader.onload = async function (event) {
    try {
      console.log('event ===', event.target.result);
      const fileData = event.target.result;
      // TypeError: Failed to execute 'setRequestHeader' on 'XMLHttpRequest': String contains non ISO-8859-1 code point. 类型错误：未能在“XMLHttpRequest”上执行“setRequestHeader”字符串包含非ISO-8859-1代码点。前端返回信息是放在请求头 header 中的，由于 header 中放入了中文所以就会出现编码格式问题。如何解决？前端进行编码，后端接收到后进行解码。
      const fileName = encodeURIComponent(file.name);
      const blobData = new Blob([fileData], { type: file.type });
      console.log('FormData ===', blobData instanceof FormData);
      console.log('Blob ===', blobData instanceof Blob);
      console.log('ArrayBuffer ===', fileData instanceof ArrayBuffer);

      const response = await request({
        // Content-Disposition: form-data; name="file"; filename="1.png"
        headers: {
          'Content-Type': 'application/octet-stream',
          'Content-Disposition': `attachment; filename=${fileName}`
        },
        method: 'post',
        url: '/upload',
        data: fileData, // 可以是 ArrayBuffer Blob
        onUploadProgress: progressEvent => {
          const percentage = (progressEvent.loaded / progressEvent.total) * 100;
          console.log(`Uploading: ${percentage.toFixed(2)}%`);
          // 更新进度条
        }
      });
      console.log('uploadStreamData complete', response);
    } catch (error) {
      console.error('uploadStreamData failed', error);
    }
  };
  reader.readAsArrayBuffer(file);
};

export default {
  name: 'Upload',
  data() {
    return {};
  },
  mounted() {
    const fileInput = document.getElementById('file');
    fileInput.addEventListener('change', event => {
      // 获取选中的文件
      const file = event.target.files[0];
      console.log('file ===', file);
      const isVerified = validFile(file);
      if (!isVerified) {
        fileInput.value = '';
        return;
      }
      uploadFile(file);
      uploadStreamData(file);
    });
  },
  methods: {}
};
</script>
<style scoped lang="scss"></style>
