<template>
  <div class="image-file-upload-example">
    <h1>移动端文件上传示例</h1>
    <div style="padding: 20px">
      <button @click="login">模拟登陆</button>
    </div>
    <div style="text-align:center;">
      <div>上传地址：{{fileUploadTarget}}</div>
      <br><br><br>
      <file-upload
        :target="fileUploadTarget"
        :max-size="-1" :max-width="1000" :quality="92"
        :max-length="10"
        :default="defaultList"
        :data="postData"
        :multiple="true"
        width="188" height="118"
        @on-success="fileUploadSuccess"
        @on-error="fileUploadError"
        @on-finish="fileUploadFinish"
        @on-delete="fileUploadDelete"
        @on-change="fileUploadChange"
        ></file-upload>
    </div>
  </div>
</template>

<script>
  import FileUpload from '@/components/mobile-image-file-upload/MobileImageFileUpload'
  import Service from './service'
  export default {
    components: { FileUpload },
    data () {
      return {
        defaultList: [{url: 'http://wlightning.oss-cn-shenzhen.aliyuncs.com/imagefile/55a3f2322ee020171107161100949.png', uuid: '55a3f2322ee020171107161100949'}],
        fileUploadTarget: '/wallet/oss/upload',
        postData: { version: 'v1', channel: 'H5', fileSubject: '身份证正面', fileOwner: '-1' }
      }
    },
    methods: {
      login () {
        Service.login()
      },
      fileUploadFinish (files) {
        console.log('文件上传结束')
        console.log(files)
      },
      fileUploadSuccess (file) {
        console.log('文件上传成功')
        console.log(file)
      },
      fileUploadError (msg) {
        console.log('文件上传错误')
        console.log(msg)
      },
      fileUploadDelete (file) {
        console.log('文件删除成功')
        console.log(file)
      },
      fileUploadChange (file) {
        console.log('文件改变')
        console.log(file)
      }
    }
  }
</script>

<style lang="less" scoped>
  .image-file-upload-example {
    h1 {
      text-align: center;
      padding: 20px;
    }
  }
</style>

