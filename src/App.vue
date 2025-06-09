<script setup>
import AppLayout from './components/AppLayout.vue';

// 菜单配置
const menuItems = [
  {
    key: 'editor',
    title: '编辑器',
    icon: 'Edit',
    route: '/editor'
  },
  {
    key: 'documents',
    title: '文档管理',
    icon: 'Document',
    route: '/documents'
  },
  {
    key: 'settings',
    title: '设置',
    icon: 'Setting',
    route: '/settings'
  },
  {
    key: 'help',
    title: '帮助',
    icon: 'QuestionFilled',
    route: '/help'
  }
];

const handleMenuChange = (menuKey) => {
  console.log('菜单切换到:', menuKey);
};

const handleCollapseChange = (collapsed) => {
  console.log('侧边栏折叠状态:', collapsed);
};
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
