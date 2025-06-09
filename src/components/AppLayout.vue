<template>
  <div class="app-layout">
    <Sidebar 
      :menu-items="menuItems"
      :active-item="currentRoute"
      @menu-change="handleMenuChange" 
      @collapse-change="handleCollapseChange"
    />
    
    <main class="main-content" :class="{ collapsed: sidebarCollapsed }">
      <div class="content-wrapper">
        <router-view v-slot="{ Component }">
          <transition name="fade-slide" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>
  </div>
</template>

<script setup>
import Sidebar from './Sidebar.vue';
import { ref, onMounted, onUnmounted, computed, provide } from 'vue';
import { useRouter, useRoute } from 'vue-router';

// Props
const props = defineProps({
  menuItems: {
    type: Array,
    default: () => [
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
    ]
  }
});

// Emits
const emit = defineEmits(['menu-change', 'collapse-change']);

// 路由相关
const router = useRouter();
const route = useRoute();

// 响应式数据
const sidebarCollapsed = ref(false);
const screenWidth = ref(0);

// 计算当前路由对应的菜单key
const currentRoute = computed(() => {
  const currentPath = route.path;
  const menuItem = props.menuItems.find(item => item.route === currentPath);
  return menuItem ? menuItem.key : '';
});

// 方法
const handleMenuChange = (menuKey) => {
  // 根据菜单key找到对应的路由
  const menuItem = props.menuItems.find(item => item.key === menuKey);
  if (menuItem && menuItem.route) {
    router.push(menuItem.route);
  }
  emit('menu-change', menuKey);
};

const handleCollapseChange = (collapsed) => {
  sidebarCollapsed.value = collapsed;
  emit('collapse-change', collapsed);
};

// 更新屏幕宽度
const updateScreenWidth = () => {
  screenWidth.value = window.innerWidth;
};

// 监听窗口尺寸变化
const handleResize = () => {
  updateScreenWidth();
};

// 初始化时根据屏幕尺寸设置默认状态
onMounted(() => {
  updateScreenWidth();
  const isSmallScreen = screenWidth.value < 768;
  sidebarCollapsed.value = isSmallScreen;
  
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

// 提供给子组件的状态
provide('layoutState', {
  sidebarCollapsed,
  screenWidth
});

// 暴露给父组件的方法和数据
defineExpose({
  currentRoute,
  sidebarCollapsed,
  screenWidth,
  toggleSidebar: () => {
    // 可以添加手动切换侧边栏的方法
  }
});
</script>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  background: #f8f9fa;
  transition: margin-left 0.3s ease;
  margin-left: 280px;
}

.main-content.collapsed {
  margin-left: 64px;
}

.content-wrapper {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

/* 路由过渡动画 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* 响应式设计 */
/* 平板端样式 */
@media (max-width: 767px) and (min-width: 481px) {
  .main-content {
    margin-left: 280px;
  }
  
  .main-content.collapsed {
    margin-left: 64px;
  }
  
  .content-wrapper {
    padding: 15px;
  }
}

/* 手机端样式 */
@media (max-width: 480px) {
  .main-content {
    margin-left: 240px;
  }
  
  .main-content.collapsed {
    margin-left: 64px;
  }
  
  .content-wrapper {
    padding: 8px;
  }
}
</style> 