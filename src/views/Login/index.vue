<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
      <div class="title-container">
        <h3 class="title">Power Mall 后台管理系统</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <i class="el-icon-user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="用户名"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <i class="el-icon-lock" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <i :class="passwordType === 'password' ? 'el-icon-view' : 'el-icon-hide'" />
        </span>
      </el-form-item>

      <el-checkbox v-model="loginForm.remember">记住我</el-checkbox>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">
        登录
      </el-button>
    </el-form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: '',
        remember: false
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  methods: {
    ...mapActions('user', ['loginAction']),
    showPwd() {
      this.passwordType = this.passwordType === 'password' ? '' : 'password'
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    async handleLogin() {
      try {
        // 表单校验
        await this.$refs.loginForm.validate()
        // 开启加载状态
        this.loading = true

        // 调用登录接口
        await this.loginAction(this.loginForm)

        // 如果记住我被勾选，保存form_key
        if (this.loginForm.remember) {
          localStorage.setItem('form_key', JSON.stringify({
            username: this.loginForm.username,
            remember: true
          }))
        }

        // 登录成功后跳转
        this.$router.push('/')

        // 显示成功提示
        this.$message.success('登录成功')
      } catch (error) {
        console.error('登录失败:', error)
        this.$message.error(error.message || '登录失败')
      } finally {
        // 关闭加载状态
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #8b9fff 0%, #6b85ff 100%);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  .login-form {
    position: relative;
    width: 420px;
    max-width: 100%;
    padding: 40px;
    margin: 0 auto;
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }

  .title-container {
    position: relative;
    margin-bottom: 30px;

    .title {
      font-size: 24px;
      color: #409EFF;
      margin: 0 auto;
      text-align: center;
      font-weight: normal;
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: #909399;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: #909399;
    cursor: pointer;
    user-select: none;
  }

  .el-input {
    display: inline-block;
    height: 40px;
    width: 85%;

    input {
      background: #fafafa;
      border: 0;
      -webkit-appearance: none;
      border-radius: 4px;
      padding: 12px 5px 12px 15px;
      height: 40px;
      color: #606266;

      &:-webkit-autofill {
        box-shadow: 0 0 0 1000px #fafafa inset !important;
        -webkit-text-fill-color: #606266 !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid #DCDFE6;
    background: #fafafa;
    border-radius: 4px;
    margin-bottom: 20px;

    &:hover {
      border-color: #409EFF;
    }
  }

  .el-checkbox {
    margin-bottom: 20px;
    color: #606266;
  }

  .el-button--primary {
    height: 40px;
    font-size: 16px;
    background: #409EFF;
    border: none;
    border-radius: 4px;
    margin-top: 10px;

    &:hover, &:focus {
      background: #66b1ff;
    }
  }
}
</style>
