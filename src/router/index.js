import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'

Vue.use(Router)

const router = new Router({
  routes: routes
})

// 路由钩子
router.beforeEach((to, from, next) => {
  next()
})

router.afterEach(route => {
})

export default router
