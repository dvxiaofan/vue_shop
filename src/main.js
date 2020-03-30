import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import TreeTables from 'vue-table-with-tree-grid'
import './plugins/element.js'
import './assets/css/global.css'
// 导入字体图标库
import './assets/fonts/iconfont.css'

axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
// 配置axios 请求拦截器, 添加token, 保证拥有获取数据的权限
axios.interceptors.request.use(config => {
  // 为请求头对象添加token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false
// 注册为全局可用的组件
Vue.component('tree-table', TreeTables)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
