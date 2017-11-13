<template>
  <div class="example">
    <WProgress :bar-height="5" :value="50"></WProgress>

    <template>
      <button @click="login">模拟登陆</button>
      <br>
      <file-upload @on-change="fileChange($event)" @on-error="fileError" 
        :target="fileUploadTarget"
        :max-size="-1" :max-width="1000" :quality="92"
        :max-length="-1"
        :default="defaultList"
        :data="postData"
        :multiple="true"
        width="188" height="118"></file-upload>
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
      fileChange (files) {
        console.log(files)
      },
      fileError (event) {
        console.log(event)
      }
    }
  }
</script>

<style scoped>
  .example {
    padding: 4%;
  }
</style>
