// 专门用来操作token的方法
// 内部封装了繁琐的操作方法 参数处理 暴露三个函数 get,set,remove
import { TOKEN_KEY } from '@/constants/KEY'
// 获取token的方法
export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

// 设置方法
export function setToken(token) {
  return localStorage.setItem(TOKEN_KEY, token)
}

// 删除方法
export function removeToken() {
  return localStorage.removeItem(TOKEN_KEY)
}
