import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import router from '@/router'

// 创建 axios 实例
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

    // 打印请求信息
    console.group(`%c请求: ${config.url}`, 'color: #409EFF; font-weight: bold;')
    console.log('请求方法:', config.method.toUpperCase())
    console.log('请求URL:', config.baseURL + config.url)
    console.log('请求参数:', config.method === 'get' ? config.params : config.data)
    console.log('请求头:', {
      'power-mall-token': config.headers['power-mall-token'] || '未设置',
      'Content-Type': config.headers['Content-Type'],
      ...config.headers
    })
    console.groupEnd()

    return config
  },
  error => {
    console.group('%c请求错误', 'color: #F56C6C; font-weight: bold;')
    console.error('错误信息:', error)
    console.groupEnd()
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data

    // 打印响应信息
    console.group(`%c响应: ${response.config.url}`, 'color: #67C23A; font-weight: bold;')
    console.log('状态码:', response.status)
    console.log('响应数据:', res)
    console.groupEnd()

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

    // 其他业务错误，统一处理
    console.group('%c业务错误', 'color: #E6A23C; font-weight: bold;')
    console.log('错误码:', res.code)
    console.log('错误信息:', res.msg)
    console.groupEnd()

    Message.error(res.msg || '操作失败')
    return Promise.reject(new Error(res.msg || '操作失败'))
  },
  error => {
    console.group('%c响应错误', 'color: #F56C6C; font-weight: bold;')
    console.error('错误信息:', error)
    console.log('错误响应:', error.response)
    console.groupEnd()

    // 处理网络错误等
    Message.error(error.response?.data?.msg || '网络错误，请稍后重试')
    return Promise.reject(error)
  }
)

export default service
