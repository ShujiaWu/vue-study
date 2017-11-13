export default (maxWidth) => {
  return {
    //  图片最大宽度
    MAX_WIDTH: maxWidth || 800,
    /**
     * 文件流转base64
     * @param {file} source 图片对象
     * @param {number} quality 图片质量
     * @return {promise} promise 图片处理promise
     */
    fileToBase64ByQuality (file, quality) {
      let fileReader = new FileReader()
      let type = file.type
      return new Promise((resolve, reject) => {
        if (window.URL || window.webkitURL) {
          resolve(this.compress(URL.createObjectURL(file), quality, type))
        } else {
          fileReader.onload = () => {
            resolve(this.compress(fileReader.result, quality, type))
          }
          fileReader.onerror = (e) => {
            reject(e)
          }
          fileReader.readAsDataURL(file)
        }
      })
    },
    /**
      * base64压缩（图片-canvas互转）
      * @param {file} base64 base64图片数据
      * @param {number} quality 图片质量
      * @param {string} format 输出图片格式
      * @return {base64} data 图片处理完成后的base64
      */
    compress (base64, quality, mimeType) {
      let cvs = document.createElement('canvas')
      let img = document.createElement('img')
      img.crossOrigin = 'anonymous'
      return new Promise((resolve, reject) => {
        img.src = base64
        // 图片偏移值
        // let offetX = 0
        img.onload = () => {
          if (img.width > this.MAX_WIDTH) {
            cvs.width = this.MAX_WIDTH
            cvs.height = img.height * this.MAX_WIDTH / img.width
            // offetX = (img.width - this.MAX_WIDTH) / 2
          } else {
            cvs.width = img.width
            cvs.height = img.height
          }
          cvs.getContext('2d').drawImage(img, 0, 0, cvs.width, cvs.height)
          // quality 图片质量。0 到 1 之间的数字，并且只在格式为 image/jpeg 或 image/webp 时才有效，如果参数值格式不合法，将会被忽略并使用默认值。
          let imageData = cvs.toDataURL(mimeType, quality / 100)
          resolve(imageData)
        }
      })
    },
    /**
     * base64转文件流
     * @param {base64} base64数据
     * @param {string} format格式
     * @return {file}  文件blob
     */
    convertBase64UrlToBlob (base64, mimeType) {
      let bytes = window.atob(base64.split(',')[1])
      let ab = new ArrayBuffer(bytes.length)
      let ia = new Uint8Array(ab)
      for (let i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i)
      }
      let _blob = new Blob([ab], { type: mimeType })
      return _blob
    }
  }
}
