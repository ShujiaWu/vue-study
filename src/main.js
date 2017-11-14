// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from '@/backend/index'

import '@/assets/styles/reset.css'
import '@/assets/styles/common.css'
import '@/assets/styles/main.css'

Vue.config.productionTip = false

// 将axios注册成为Vue原型属性
Vue.prototype.$http = axios

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
