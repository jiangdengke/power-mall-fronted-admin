import request from '@/utils/request'

// 登录接口
/**
 * @description: 登录函数
 * @param {*} data { mobile,password}
 * @return {*} promise
 */
export function loginAPI(params) {
  return request({
    url: '/ums/login',
    method: 'get',
    params
  })
}
