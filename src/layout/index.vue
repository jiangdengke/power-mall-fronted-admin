<template>
  <div class="app-wrapper">
    <div class="sidebar-container">
      <sidebar />
    </div>
    <div class="main-container">
      <div class="header">
        <navbar />
      </div>
      <div class="content-wrapper">
        <app-main />
      </div>
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  }
}
</script>

<style lang="scss" scoped>
.app-wrapper {
  position: relative;
  height: 100vh;
  width: 100%;
  display: flex;
  background: linear-gradient(135deg, #E8F0FF 0%, #F5F7FA 100%);

  .sidebar-container {
    width: 210px;
    height: 100%;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 1001;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 4px 0 10px rgba(0, 0, 0, 0.05);
    transition: width 0.3s;
    overflow: hidden;
  }

  .main-container {
    min-height: 100%;
    margin-left: 210px;
    position: relative;
    flex: 1;
    display: flex;
    flex-direction: column;

    .header {
      background: rgba(255, 255, 255, 0.95);
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
      backdrop-filter: blur(10px);
      z-index: 1000;
    }

    .content-wrapper {
      padding: 20px;
      flex: 1;
      overflow-y: auto;

      &::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }

      &::-webkit-scrollbar-thumb {
        background: rgba(144, 147, 153, 0.3);
        border-radius: 3px;
      }

      &::-webkit-scrollbar-track {
        background: transparent;
      }
    }
  }
}
</style>
