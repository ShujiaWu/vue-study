<template>
  <div class="example">
    <WProgress :bar-height="5" :value="50"></WProgress>

    <template>
      <button @click="login">模拟登陆</button>
      <br>
      <file-upload
        :target="fileUploadTarget"
        :max-size="-1" :max-width="1000" :quality="92"
        :max-length="2"
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
    </template>
  </div>
</template>

<script>
  import WProgress from '@/components/progress/Progress'
  import FileUpload from '@/components/file-upload/FileUpload'
  import Service from './service'
  export default {
    components: {
      WProgress, FileUpload
    },
    data () {
      return {
        defaultList: [{url: 'http://wlightning.oss-cn-shenzhen.aliyuncs.com/imagefile/55a3f2322ee020171107161100949.png', uuid: '55a3f2322ee020171107161100949'}],
        fileUploadTarget: '/wallet/oss/upload',
        // defaultList: [],
        postData: { version: 'v1', channel: 'H5-Client-C', fileSubject: '身份证正面', fileOwner: '-1' }
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

<style scoped>
  .example {
    padding: 4%;
  }
</style>
