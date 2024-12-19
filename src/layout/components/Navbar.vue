<template>
  <div class="navbar">
    <div class="logo-container">
      <img src="@/assets/common/logo.svg" class="logo">
      <span class="title">Power Mall 后台管理系统</span>
    </div>
    <div class="right-menu">
      <a href="https://github.com/jiangdengke/power-mall-fronted-admin" target="_blank" class="github-link">
        <svg-icon icon-class="github" />
        <span>GitHub</span>
      </a>
      <el-dropdown class="avatar-container" trigger="click" placement="bottom-end">
        <div class="avatar-wrapper">
          <span class="name">管理员</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item>
            <router-link to="/" class="dropdown-item-link">
              <i class="el-icon-s-home" />
              <span>首页</span>
            </router-link>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <div class="dropdown-item-link" @click="logout">
              <i class="el-icon-switch-button" />
              <span>退出登录</span>
            </div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { removeToken } from '@/utils/auth'
import { mapMutations } from 'vuex'

export default {
  methods: {
    ...mapMutations('user', ['removeToken']),
    async logout() {
      try {
        // 清除vuex中的token
        this.removeToken()
        // 清除localStorage中的token和form_key
        removeToken()
        localStorage.removeItem('form_key')
        // 跳转到登录页
        this.$router.push('/login')
      } catch (error) {
        console.error('退出登录失败:', error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 64px;
  line-height: 64px;
  position: relative;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  padding: 0 20px;

  .logo-container {
    display: flex;
    align-items: center;
    
    .logo {
      width: 32px;
      height: 32px;
      margin-right: 12px;
    }

    .title {
      font-size: 18px;
      font-weight: 600;
      background: linear-gradient(45deg, #409EFF, #36D1DC);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      white-space: nowrap;
    }
  }

  .right-menu {
    height: 100%;
    display: flex;
    align-items: center;
    gap: 16px;

    .github-link {
      display: flex;
      align-items: center;
      padding: 0 12px;
      height: 40px;
      border-radius: 20px;
      background: rgba(64, 158, 255, 0.1);
      color: #409EFF;
      text-decoration: none;
      transition: all 0.3s;

      &:hover {
        background: rgba(64, 158, 255, 0.2);
      }
      
      svg {
        font-size: 16px;
        margin-right: 8px;
      }
      
      span {
        font-size: 14px;
      }
    }

    .avatar-container {
      cursor: pointer;

      .avatar-wrapper {
        display: flex;
        align-items: center;
        padding: 0 12px;
        height: 40px;
        border-radius: 20px;
        background: rgba(64, 158, 255, 0.1);
        transition: all 0.3s;
        
        &:hover {
          background: rgba(64, 158, 255, 0.2);
        }
        
        .name {
          font-size: 14px;
          color: #409EFF;
          margin-right: 8px;
        }

        .el-icon-caret-bottom {
          font-size: 12px;
          color: #409EFF;
        }
      }
    }
  }
}

.user-dropdown {
  margin: 5px 0 0;
  padding: 6px 0;
  background: rgba(255, 255, 255, 0.98);
  border: none;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  min-width: 140px;
  
  ::v-deep .el-dropdown-menu__item {
    display: block;
    padding: 0;
    line-height: 1;
    
    &:hover {
      background-color: transparent;
    }

    &.el-dropdown-menu__item--divided {
      margin-top: 6px;
      border-top: 1px solid rgba(0, 0, 0, 0.05);
      padding-top: 6px;
    }

    .dropdown-item-link {
      display: flex;
      align-items: center;
      padding: 10px 16px;
      font-size: 14px;
      color: #666;
      transition: all 0.3s;
      text-decoration: none;
      
      &:hover {
        background-color: rgba(64, 158, 255, 0.1);
        color: #409EFF;
      }

      i {
        font-size: 16px;
        margin-right: 10px;
      }

      span {
        line-height: 1;
      }
    }
  }
}
</style>
