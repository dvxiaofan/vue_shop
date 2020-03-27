import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Orders from '../components/order/Orders.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/orders', component: Orders }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
/*
  to: 将要访问的路径
  from: 从哪个路径而来
  next: 是一个函数, 表示放行
*/
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  // 没有token, 强制跳转到登录页 (可以再加上服务器发送验证是否是正确的token)
  if (!tokenStr) return next('/login')
  next()
})

export default router
