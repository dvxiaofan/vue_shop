import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import TreeTables from 'vue-table-with-tree-grid'
// 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

// import NProgress from 'nprogress'
// import 'nprogress/nprogress.css'

// import './plugins/element.js'
import './assets/css/global.css'
// 导入字体图标库
import './assets/fonts/iconfont.css'

axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
// 配置axios 请求拦截器, 添加token, 保证拥有获取数据的权限
// request 拦截器中 展示进度条
axios.interceptors.request.use(config => {
  // 展示进度条
  // NProgress.start()
  // 为请求头对象添加token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

// 在response 拦截器中隐藏进度条
axios.interceptors.response.use(config => {
  // 隐藏进度条
  // NProgress.done()
  return config
})

Vue.prototype.$http = axios

Vue.config.productionTip = false
// 注册为全局可用的组件
Vue.component('tree-table', TreeTables)

// 全局时间过滤器
Vue.filter('dateFormat', function(originVal) {
  const dt = new Date(originVal)
  const year = dt.getFullYear()
  // 处理不足两位的月份
  const month = (dt.getMonth() + 1 + '').padStart(2, '0')
  const day = (dt.getDay() + '').padStart(2, '0')

  const hour = (dt.getHours() + '').padStart(2, '0')
  const minus = (dt.getMinutes() + '').padStart(2, '0')
  const seconds = (dt.getSeconds() + '').padStart(2, '0')

  return `${year}-${month}-${day} ${hour}:${minus}:${seconds}`
})

// 将富文本编辑器注册为全局可用
Vue.use(VueQuillEditor)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
