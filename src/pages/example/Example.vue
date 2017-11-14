<template>
  <div class="example">
    <ul>
      <li><button class="btn" @click="gotoImageFileUpload">移动端图片上传</button></li>
    </ul>
  </div>
</template>

<script>
  export default {
    methods: {
      gotoImageFileUpload () {
        this.$router.push({
          name: 'MobileImageUploadExample'
        })
      }
    }
  }
</script>

<style scoped>
  .example {
    padding: 4%;
  }
</style>
