<template>
  <div class="image-upload">
    <!-- 图片预览区域 -->
    <div class="perview-area" v-for="(item,index) in uploaded" :key="index" :style="perviewAreaStyle(item)">
      <!-- 关闭按钮 -->
      <img src="./images/close.png" class="close" @click="deleteFile(item)" v-if="item.deletealed">
      <!-- 进度条 -->
      <div class="progress-cover" style="background-color: rgba(0,0,0,0.5)" v-if="item.status !== 'finished'">
        <w-progress :value="item.progress" :bar-height="5" class="progress" v-if="item.showProgress" :style="{top: `${(height-5) / 2}px`}"></w-progress>
      </div>
    </div>
    <!-- 图片选择 -->
    <div class="upload-area" v-if="maxLength <= 0 || uploaded.length < maxLength" :style="uploadAreaStyle">
      <label :for="id">
        <div style="height:100%;text-align:center">
        </div>
      </label>
      <form class="form">
        <input class="uploader-input" :accept="accept" :multiple="multiple && maxLength !== 0 && maxLength !== 1" type="file" hidden @change="uploadInputFileChange($event)" :id="id">
      </form>
    </div>
  </div>
</template>

<script>
  import Progress from '@/components/progress/Progress'
  import ImageCompress from '@/utils/image-compress'
  export default {
    props: {
      data: {
        type: Object,
        default: () => {}
      },
      default: {
        type: Array,
        default: () => []
      },
      multiple: {
        type: Boolean,
        default: false
      },
      accept: {
        type: String,
        default: 'image/*'
      },
      // 文件数
      maxLength: {
        type: Number,
        default: 1
      },
      bg: {
        type: String,
        default: undefined
      },
      width: {
        type: [String, Number],
        default: 188
      },
      height: {
        type: [String, Number],
        default: 118
      },
      // 文件大小限制
      maxSize: {
        type: Number,
        default: -1
      },
      quality: {
        type: Number,
        default: 92
      },
      maxWidth: {
        type: Number,
        default: 800
      },
      target: {
        type: String,
        required: true
      }
    },
    components: {
      'w-progress': Progress
    },
    mounted () {
      this.form = this.$el.getElementsByClassName('form')
      this.compress = ImageCompress(this.maxWidth)
      this.default.forEach(element => {
        this.uploaded.push({
          url: element.url,
          uuid: element.uuid,
          progress: 100,
          showProgress: false,
          status: 'finished',
          deletealed: true
        })
      })
    },
    data () {
      return {
        // 表单
        form: undefined,
        // 组件Input输入对象ID
        id: `upload_${new Date().getTime()}`,
        // 已上传的文件列表
        uploaded: [],
        uploading: [],
        progress: 0,
        // 图片压缩对象
        compress: null,
        // 上传队列锁
        taskLock: false
      }
    },
    watch: {
      default (val) {
        this.uploaded.splice(0, this.uploaded.length)
        val.forEach(element => {
          this.uploaded.push({
            url: element.url,
            uuid: element.uuid,
            progress: 100,
            showProgress: false,
            status: 'finished',
            deletealed: true
          })
        })
      },
      maxWidth (val, oldVal) {
        if (val !== oldVal) {
          this.compress = ImageCompress(val)
        }
      }
    },
    computed: {
      /** 上传区域的样式 */
      uploadAreaStyle () {
        let style = {
          height: `${this.height}px`,
          width: `${this.width}px`
        }
        if (this.bg) {
          style['background-image'] = `url(${this.bg})`
        }
        return style
      }
    },
    methods: {
      getImagesBg (file) {
        let result = `url('${file.url}')`
        return result
      },
      perviewAreaStyle (file) {
        let style = {
          height: `${this.height}px`,
          width: `${this.width}px`
        }
        if (file.url) {
          style['background-image'] = `url(${file.url})`
        }
        return style
      },
      // input中选择的文件发生变化的时候
      uploadInputFileChange (event) {
        let files = event.target.files
        for (var i = 0; i < files.length; i++) {
          let file = files[i]
          // 比较文件大小限制
          if (this.maxSize > 0 && file.size > this.maxSize) {
            this.$emit('on-error', '文件大小超过限制', file)
            continue
          }
          if (this.uploaded.length + 1 > this.maxLength) {
            this.$emit('on-error', '文件数量超过限制', file)
            break
          }
          // 生成文件对象信息
          let obj = {
            info: file,
            url: undefined,
            status: 'waitting',
            progress: 0,
            showProgress: true,
            deletealed: true
          }
          // 预览
          let reader = new FileReader()
          reader.onload = function (e) {
            obj.url = e.target.result
          }
          reader.readAsDataURL(file)
          // 将文件加入到列表中
          this.uploaded.push(obj)
          this.uploading.push(obj)
        }
        // 清空input选择的文件
        this.form[0].reset()
        // 上传文件
        this.upload()
      },
      // 上传文件
      upload () {
        if (this.taskLock) {
          return
        }
        if (this.uploading.length <= 0) {
          this.finish()
          return
        }
        this.taskLock = true
        let file = this.uploading.shift()
        let _this = this
        let param = new FormData()
        // 上传阶段不允许移除
        file.deletealed = false
        // post参数
        for (let key in this.data) {
          if (this.data.hasOwnProperty(key)) {
            let element = this.data[key]
            param.append(key, element)
          }
        }
        // 文件
        this.compress.fileToBase64ByQuality(file.info, this.quality).then(result => {
          param.append('file', this.compress.convertBase64UrlToBlob(result, file.info.type), file.info.name)
          let xhr = new XMLHttpRequest()
          xhr.open('post', this.target, true)
          xhr.onreadystatechange = function () {
            if (this.readyState === 4) {
              try {
                file.response = JSON.parse(this.response)
                if (this.status === 200) {
                  _this.uploadSuccess(file)
                } else {
                  _this.uploadError(file)
                }
              } catch (e) {
                console.error(e)
                _this.uploadError(file)
              }
              _this.taskLock = false
              file.deletealed = true
              _this.upload()
            }
          }
          xhr.upload.onprogress = function (ev) {
            if (ev.lengthComputable) {
              file.progress = 100 * ev.loaded / ev.total
              _this.progress = file.progress
            }
          }
          xhr.send(param)
        })
      },
      /** 文件上传成功 */
      uploadSuccess (file) {
        file.status = 'finished'
        file.progress = 100
        file.showProgress = false
        this.$emit('on-success', file)
      },
      /** 所有文件上传结束 */
      finish () {
        let arr = []
        this.uploaded.forEach((element) => {
          if (element.response) {
            // 新上传的
            arr.push({
              url: element.response.result && element.response.result.downPath,
              uuid: element.response.result && element.response.result.uuid
            })
          } else {
            // 默认列表
            arr.push({
              url: element.url,
              uuid: element.uuid
            })
          }
        }, this)
        this.$emit('on-change', arr)
        this.$emit('on-finish', arr)
      },
      /** 文件上传错误 */
      uploadError (file) {
        let pos = this.uploaded.indexOf(file)
        if (pos >= 0) {
          this.uploaded.splice(pos, 1)
        }
        this.$emit('on-error', file.response, file)
      },
      /** 删除文件 */
      deleteFile (file) {
        let pos = this.uploaded.indexOf(file)
        if (pos >= 0) {
          this.uploaded.splice(pos, 1)
        }
        let posUploading = this.uploading.indexOf(file)
        if (posUploading >= 0) {
          this.uploading.splice(posUploading, 1)
        }
        if (file.status === 'waitting') {
          return
        }
        let arr = []
        this.uploaded.forEach((element) => {
          if (element.url) {
            arr.push({
              url: element.url,
              uuid: element.uuid || (element.response ? element.response.result.uuid : '')
            })
          }
        }, this)
        this.$emit('on-delete', file)
        this.$emit('on-change', arr)
      }
    }
  }
</script>

<style scoped>
  .image-upload {
    display: inline-block;
  }

  .perview-area {
    position: relative;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;
  }

  .perview-area,
  .upload-area {
    vertical-align: middle;
    margin-bottom: 10px;
  }

  .perview-area {
    border: 1px solid #EEE;
  }

  .progress {
    position: absolute;
    right: 2px;
    left: 2px;
  }

  .close {
    position: absolute;
    right: -10px;
    top: -10px;
    width: 20px;
    height: 20px;
    cursor: pointer;
  }

  .progress-cover {
    width: 100%;
    height: 100%;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    position: relative;
  }

  .upload-area {
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;
    background-image: url('./images/default.png')
  }

  .upload-area {
    position: relative;
  }
</style>
