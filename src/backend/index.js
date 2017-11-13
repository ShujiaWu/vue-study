import axios from 'axios'
// import store from '../store/index'
import router from '@/router/index'
import Qs from 'qs'
// import * as MutationTypes from '../store/mutation-types'
// import _ from 'lodash'
axios.defaults.baseURL = ''
axios.defaults.paramsSerializer = function (params) {
  return Qs.stringify(params, { arrayFormat: 'repeat' })
}
/**
 * 请求处理
 */
axios.interceptors.request.use(config => {
  // 写入地址位置信息
  if (!config.headers) {
    config.headers = {}
  }

  // config.headers['User-Gps'] = store.getters.getGeoposition

  switch (true) {
    case config.method.toLowerCase() === 'post':
    case config.method.toLowerCase() === 'put':
    case config.method.toLowerCase() === 'patch':
      config.data.channel = 'H5'
      break
    case config.method.toLowerCase() === 'get':
    case config.method.toLowerCase() === 'delete':
    case config.method.toLowerCase() === 'head':
    case config.method.toLowerCase() === 'options':
      // GET请求
      if (!config.params) {
        config.params = {}
      }
      config.params.channel = 'H5'
      break
  }

  return config
}, error => {
  return Promise.reject(error)
})

/**
 * 响应处理
 */
axios.interceptors.response.use(response => {
  return {
    isSuccess: true,
    status: response.status,
    code: response.data.statusCode,
    message: response.data.message,
    data: response.data.result
  }
}, error => {
  // HTTP 请求失败
  let response = error.response
  let message = 'HTTP请求失败:' + response.statusText
  let code = 'HTTP_ERROR'
  let status = response.status || 400
  if (response.data && response.data.message) {
    message = response.data.message
    code = response.data.statusCode
  }
  // console.log(error.response)
  // let reg = new RegExp(/code (\d{3})/)
  // reg.test(error.message)
  // let status = RegExp.$1
  console.warn('【HTTP全局】HTTP状态码：', status, '，错误信息：', message)
  switch (status) {
    case '401':
    case 401: {
      console.log(router)
      // 用户未登录
      // store.commit(MutationTypes.ROUTES_LOG_PREV_PAGE, {
      //   url: window.location.href.indexOf('login') > 0 ? undefined : location.href.substr(location.href.indexOf('#/') + 1)
      // })
      router.replace('/login')
      break
    }
    default:
  }
  return {
    isSuccess: false,
    status: status,
    message: message,
    code: code
  }
})
export default axios
