<script setup lang="ts">
import AppLayout from './components/AppLayout.vue'

// 定义菜单项类型
interface MenuItem {
  key: string
  title: string
  icon: string
  route: string
}

// 菜单配置
const menuItems: MenuItem[] = [
  {
    key: 'editor',
    title: '编辑器',
    icon: 'Edit',
    route: '/editor'
  },
]

const handleMenuChange = (menuKey: string) => {
  console.log('菜单切换到:', menuKey)
}

const handleCollapseChange = (collapsed: boolean) => {
  console.log('侧边栏折叠状态:', collapsed)
}
</script>

<template>
  <AppLayout 
    :menu-items="menuItems"
    @menu-change="handleMenuChange"
    @collapse-change="handleCollapseChange"
  />
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
