import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import router from '@/router'

const service = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? '/api-admin' : 'http://localhost:8888/api-admin', // 根据环境使用不同的baseURL
  timeout: 5000, // request timeout
  withCredentials: false // 关闭跨域携带cookie，因为我们使用了代理
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('power-mall-token')
    // 如果 token 存在，则添加到请求头中
    if (token) {
      config.headers['power-mall-token'] = token
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data

    // 401 表示未登录，需要特殊处理
    if (res.code === 401) {
      store.commit('user/removeToken')
      router.push('/login')
      return Promise.reject(new Error(res.msg || '未登录'))
    }

    // 处理业务响应
    if (res.code === 200) {
      return res
    }
    console.log('响应错误:', res)

    // 其他业务错误，统一处理
    Message.error(res.msg || '操作失败')
    return Promise.reject(new Error(res.msg || '操作失败'))
  },
  error => {
    console.error('响应错误:', error)
    // 处理网络错误等
    Message.error(error.response?.data?.msg || '网络错误，请稍后重试')
    return Promise.reject(error)
  }
)

export default service
