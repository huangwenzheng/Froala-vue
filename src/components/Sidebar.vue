<template>
  <div class="sidebar-container">
    <!-- 侧边栏 -->
    <nav class="sidebar" :class="{ collapsed: isCollapsed }">
      <div class="sidebar-header">
        <h2 v-show="!isCollapsed">{{ title }}</h2>
        <div class="header-buttons">
          <!-- 折叠按钮 -->
          <button class="collapse-btn" @click="toggleCollapse">
            <el-icon>
              <Expand v-if="isCollapsed" />
              <Fold v-else />
            </el-icon>
          </button>
        </div>
      </div>
      
      <!-- Element Plus Menu -->
      <el-menu
        :default-active="activeItem"
        :collapse="isCollapsed"
        class="sidebar-menu"
        @select="handleMenuSelect"
        background-color="#2c3e50"
        text-color="#bdc3c7"
        active-text-color="#ffffff"
        :collapse-transition="true"
        router
      >
        <el-menu-item 
          v-for="item in menuItems" 
          :key="item.key" 
          :index="item.route || item.key"
        >
          <el-icon>
            <component :is="item.icon" />
          </el-icon>
          <template #title>
            <span>{{ item.title }}</span>
          </template>
        </el-menu-item>
      </el-menu>

      <div class="sidebar-footer" v-if="showUserInfo">
        <div class="user-info" :class="{ collapsed: isCollapsed }">
          <el-avatar class="avatar" :size="40">
            <el-icon><User /></el-icon>
          </el-avatar>
          <div class="user-name" v-show="!isCollapsed">{{ userName }}</div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { 
  Edit, 
  Document, 
  Setting, 
  QuestionFilled, 
  User,
  Expand,
  Fold
} from '@element-plus/icons-vue';

// Props
const props = defineProps({
  title: {
    type: String,
    default: '导航菜单'
  },
  menuItems: {
    type: Array,
    default: () => [
      {
        key: 'editor',
        title: '编辑器',
        icon: 'Edit'
      },
      {
        key: 'documents',
        title: '文档管理',
        icon: 'Document'
      },
      {
        key: 'settings',
        title: '设置',
        icon: 'Setting'
      },
      {
        key: 'help',
        title: '帮助',
        icon: 'QuestionFilled'
      }
    ]
  },
  activeItem: {
    type: String,
    default: 'editor'
  },
  showUserInfo: {
    type: Boolean,
    default: true
  },
  userName: {
    type: String,
    default: '用户'
  },
  autoCollapse: {
    type: Boolean,
    default: true
  }
});

// Emits
const emit = defineEmits(['menu-change', 'collapse-change']);

// 响应式数据
const isCollapsed = ref(false);

// 方法
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
  emit('collapse-change', isCollapsed.value);
};

const handleMenuSelect = (index) => {
  emit('menu-change', index);
};

// 根据屏幕尺寸设置初始状态
const updateCollapseState = () => {
  if (!props.autoCollapse) return;
  
  const isSmallScreen = window.innerWidth < 768;
  isCollapsed.value = isSmallScreen; // 小屏幕折叠，大屏幕展开
  emit('collapse-change', isCollapsed.value);
};

// 监听窗口尺寸变化
const handleResize = () => {
  if (!props.autoCollapse) return;
  
  // 防抖处理，避免频繁触发
  clearTimeout(handleResize.timeoutId);
  handleResize.timeoutId = setTimeout(() => {
    const wasSmallScreen = isCollapsed.value;
    const isSmallScreen = window.innerWidth < 768;
    
    // 只有在屏幕类型发生变化时才自动调整
    if ((wasSmallScreen && !isSmallScreen) || (!wasSmallScreen && isSmallScreen)) {
      updateCollapseState();
    }
  }, 150);
};

// 监听 activeItem prop 变化
watch(() => props.activeItem, (newValue) => {
  // 可以在这里添加额外的逻辑
}, { immediate: true });

// 初始化
onMounted(() => {
  if (props.autoCollapse) {
    updateCollapseState();
    window.addEventListener('resize', handleResize);
  }
});

onUnmounted(() => {
  if (props.autoCollapse) {
    window.removeEventListener('resize', handleResize);
    clearTimeout(handleResize.timeoutId);
  }
});

// 暴露方法给父组件
defineExpose({
  toggleCollapse,
  isCollapsed
});
</script>

<style scoped>
.sidebar-container {
  position: relative;
}

/* 侧边栏 */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100vh;
  background: #2c3e50;
  color: white;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
}

/* 折叠状态 */
.sidebar.collapsed {
  width: 64px;
}

/* 侧边栏头部 */
.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #34495e;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 72px;
}

.sidebar.collapsed .sidebar-header {
  padding: 20px 12px;
  justify-content: center;
}

.sidebar-header h2 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: white;
  transition: opacity 0.3s ease;
}

.header-buttons {
  display: flex;
  gap: 8px;
  align-items: center;
}

.sidebar.collapsed .header-buttons {
  justify-content: center;
}

.collapse-btn {
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
  min-width: 32px;
  min-height: 32px;
}

.collapse-btn:hover {
  background-color: #34495e;
}

/* Element Plus Menu 样式重写 */
.sidebar-menu {
  flex: 1;
  border: none !important;
  width: 100% !important;
}

.sidebar-menu .el-menu-item {
  height: 56px !important;
  line-height: 56px !important;
  padding: 0 20px !important;
  margin: 0 !important;
  border-radius: 0 !important;
  display: flex !important;
  align-items: center !important;
  transition: all 0.3s ease !important;
}

.sidebar.collapsed .sidebar-menu .el-menu-item {
  padding: 0 !important;
  justify-content: center !important;
}

.sidebar-menu .el-menu-item:hover {
  background-color: #34495e !important;
}

.sidebar-menu .el-menu-item.is-active {
  background-color: #34495e !important;
  border-right: 3px solid #409eff !important;
}

.sidebar.collapsed .sidebar-menu .el-menu-item.is-active {
  border-right: none !important;
  border-left: 3px solid #409eff !important;
}

.sidebar-menu .el-menu-item .el-icon {
  margin-right: 12px !important;
  font-size: 18px !important;
  width: 24px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  transition: all 0.3s ease !important;
}

.sidebar.collapsed .sidebar-menu .el-menu-item .el-icon {
  margin-right: 0 !important;
}

/* 折叠状态下隐藏菜单文字 */
.sidebar.collapsed .sidebar-menu .el-menu-item .el-menu-item-title {
  opacity: 0 !important;
  width: 0 !important;
  overflow: hidden !important;
}

/* 确保折叠时文字完全不显示 */
.sidebar.collapsed .el-menu-item .el-menu-item-title,
.sidebar.collapsed .el-menu-item > span {
  display: none !important;
}

/* 折叠状态下的tooltip优化 */
.sidebar.collapsed .el-menu-item {
  position: relative;
}

/* 确保图标在折叠状态下正确居中 */
.sidebar.collapsed .el-menu-item .el-icon {
  width: 100% !important;
}

/* 侧边栏底部 */
.sidebar-footer {
  padding: 20px;
  border-top: 1px solid #34495e;
}

.sidebar.collapsed .sidebar-footer {
  padding: 20px 12px;
}

.user-info {
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
}

.user-info.collapsed {
  justify-content: center;
}

.avatar {
  margin-right: 12px;
  background-color: #409eff !important;
  transition: margin 0.3s ease;
  flex-shrink: 0;
}

.user-info.collapsed .avatar {
  margin-right: 0;
}

.user-name {
  font-size: 1rem;
  font-weight: 500;
  color: white;
  transition: opacity 0.3s ease;
  white-space: nowrap;
  overflow: hidden;
}

.user-info.collapsed .user-name {
  opacity: 0;
  width: 0;
}

/* 桌面端样式 */
@media (min-width: 768px) {
  .sidebar {
    height: 100vh;
    min-height: 100vh;
  }
}

/* 平板端样式 */
@media (max-width: 767px) and (min-width: 481px) {
  
  .sidebar.collapsed {
    width: 64px;
  }
}

/* 手机端样式 */
@media (max-width: 480px) {
  .sidebar {
    width: 240px; /* 手机端展开宽度 */
  }
  
  .sidebar.collapsed {
    width: 64px; /* 手机端折叠宽度 */
  }
  
  /* 手机端调整字体大小 */
  .sidebar-header h2 {
    font-size: 1rem;
  }
  
  .sidebar-menu .el-menu-item {
    height: 48px !important;
    line-height: 48px !important;
    font-size: 0.9rem;
  }
  
  .sidebar.collapsed .sidebar-menu .el-menu-item {
    height: 48px !important;
  }
  
  .sidebar-menu .el-menu-item .el-icon {
    font-size: 16px !important;
    width: 20px !important;
  }
  
  .user-name {
    font-size: 0.9rem;
  }
  
  /* 手机端折叠按钮优化 */
  .sidebar.collapsed .collapse-btn {
    padding: 6px;
    min-width: 28px;
    min-height: 28px;
  }
}
</style> 