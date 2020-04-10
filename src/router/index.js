import Vue from 'vue'
import VueRouter from 'vue-router'
/* 懒加载组件 */
const Login = () =>
  import(/* webpackChunkName: "login_home_welcome" */ '../components/Login.vue')
const Home = () =>
  import(/* webpackChunkName: "login_home_welcome" */ '../components/Home.vue')
const Welcome = () =>
  import(
    /* webpackChunkName: "login_home_welcome" */ '../components/Welcome.vue'
  )
const Users = () =>
  import(
    /* webpackChunkName: "Users_Rights_Roles" */ '../components/user/Users.vue'
  )
const Roles = () =>
  import(
    /* webpackChunkName: "Users_Rights_Roles" */ '../components/power/Roles.vue'
  )
const Rights = () =>
  import(
    /* webpackChunkName: "Users_Rights_Roles" */ '../components/power/Rights.vue'
  )
const Cate = () =>
  import(/* webpackChunkName: "Cate_Params" */ '../components/goods/Cate.vue')
const Params = () =>
  import(/* webpackChunkName: "Cate_Params" */ '../components/goods/Params.vue')
const Goods = () =>
  import(
    /* webpackChunkName: "GoodsList_Add" */ '../components/goods/Goods.vue'
  )
const Add = () =>
  import(/* webpackChunkName: "GoodsList_Add" */ '../components/goods/Add.vue')

const Orders = () =>
  import(
    /* webpackChunkName: "Order_Report" */ '../components/order/Orders.vue'
  )
const Report = () =>
  import(
    /* webpackChunkName: "Order_Report" */ '../components/report/Report.vue'
  )

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
      { path: '/roles', component: Roles },
      { path: '/rights', component: Rights },
      { path: '/orders', component: Orders },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params },
      { path: '/goods', component: Goods },
      { path: '/goods/add', component: Add },
      { path: '/reports', component: Report }
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
