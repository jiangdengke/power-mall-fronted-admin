import { loginAPI } from '@/api/user'

export default {
  namespaced: true, // 开启命名空间
  state: {
    token: localStorage.getItem('power-mall-token'),
    name: '',
    avatar: ''
  },
  mutations: {
    setToken(state, newToken) {
      state.token = newToken
      // 存储到localStorage中
      localStorage.setItem('power-mall-token', newToken)
    },
    removeToken(state) {
      // 1.清空vuex中的token
      state.token = ''
      localStorage.removeItem('power-mall-token')
    }
  },
  actions: {
    // 登录
    async loginAction({ commit }, loginForm) {
      const response = await loginAPI(loginForm)
      const { data } = response
      if (data.tokenValue) {
        commit('setToken', data.tokenValue)
      }
      return data
    }
  }
}
