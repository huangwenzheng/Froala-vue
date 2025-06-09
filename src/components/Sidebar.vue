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
      
      <!-- 菜单滚动容器 -->
      <div class="menu-container">
        <!-- Element Plus Menu -->
        <el-menu
          :default-active="activeMenuItem"
          :collapse="isCollapsed"
          class="sidebar-menu"
          @select="handleMenuSelect"
          background-color="#2c3e50"
          text-color="#bdc3c7"
          active-text-color="#ffffff"
          :collapse-transition="true"
          router
          unique-opened
        >
          <!-- 基础菜单项 -->
          <el-menu-item 
            v-for="item in baseMenuItems" 
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

          <!-- 分隔线 -->
          <div class="menu-divider" v-if="permissionMenus.length > 0"></div>

          <!-- 权限菜单项 -->
          <template v-for="category in permissionMenus" :key="category.id">
            <el-sub-menu 
              v-if="category.children && category.children.length > 0"
              :index="category.name"
            >
              <template #title>
                <el-icon>
                  <component :is="getCategoryIcon(category.name)" />
                </el-icon>
                <span>{{ category.show_name }}</span>
              </template>
              
              <el-menu-item
                v-for="subItem in getVisibleSubItems(category.children)"
                :key="subItem.id"
                :index="`/${subItem.name}`"
              >
                <el-icon>
                  <component :is="getSubItemIcon(subItem.name)" />
                </el-icon>
                <template #title>
                  <span>{{ subItem.show_name }}</span>
                </template>
              </el-menu-item>
            </el-sub-menu>
            
            <el-menu-item 
              v-else
              :index="`/${category.name}`"
            >
              <el-icon>
                <component :is="getCategoryIcon(category.name)" />
              </el-icon>
              <template #title>
                <span>{{ category.show_name }}</span>
              </template>
            </el-menu-item>
          </template>
        </el-menu>
      </div>

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
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { permissionMenus } from '../router/index.js';
import { 
  Edit, 
  Document, 
  Setting, 
  QuestionFilled, 
  User,
  Expand,
  Fold,
  TrendCharts,
  FolderOpened,
  Money,
  Lock,
  Operation,
  DocumentChecked,
  PictureFilled,
  Tools,
  Platform,
  VideoCamera,
  List,
  DataAnalysis,
  Management
} from '@element-plus/icons-vue';

// Props
const props = defineProps({
  title: {
    type: String,
    default: '导航菜单'
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
const route = useRoute();

// 基础菜单项
const baseMenuItems = ref([
  {
    key: 'editor',
    title: '编辑器',
    icon: 'Edit',
    route: '/editor'
  }
]);

// 计算属性
const activeMenuItem = computed(() => {
  return route.path;
});

// 权限菜单处理方法
const getCategoryIcon = (name) => {
  const iconMap = {
    'market': TrendCharts,
    'project': FolderOpened,
    'finance': Money,
    'security': Lock,
    'management': Management,
    'operations': Operation,
    'compliance': DocumentChecked,
    'ui': PictureFilled,
    'test': Tools,
    'middle_platform': Platform,
    'live': VideoCamera
  };
  return iconMap[name] || Document;
};

const getSubItemIcon = (name) => {
  if (name.includes('/list')) return List;
  if (name.includes('/data')) return DataAnalysis;
  if (name.includes('/add')) return Edit;
  if (name.includes('/edit')) return Setting;
  if (name.includes('/delete')) return Document;
  return Document;
};

const getVisibleSubItems = (children) => {
  // 只显示 list 页面，其他操作页面通过按钮访问
  return children.filter(item => 
    item.name.includes('/list') || 
    item.children.length === 0
  );
};

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

// 监听路由变化
watch(() => route.path, (newPath) => {
  console.log('路由变化:', newPath);
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
  overflow: hidden; /* 防止整个侧边栏滚动 */
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
  flex-shrink: 0; /* 防止头部被压缩 */
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

/* 菜单容器 - 可滚动区域 */
.menu-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
}

/* 自定义滚动条样式 */
.menu-container::-webkit-scrollbar {
  width: 6px;
}

.menu-container::-webkit-scrollbar-track {
  background: #34495e;
  border-radius: 3px;
}

.menu-container::-webkit-scrollbar-thumb {
  background: #5a6c7d;
  border-radius: 3px;
  transition: background 0.3s;
}

.menu-container::-webkit-scrollbar-thumb:hover {
  background: #7f8c8d;
}

/* 折叠状态下隐藏滚动条 */
.sidebar.collapsed .menu-container::-webkit-scrollbar {
  width: 0px;
}

/* Element Plus Menu 样式重写 */
.sidebar-menu {
  border: none !important;
  width: 100% !important;
  background-color: transparent !important;
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

/* 菜单分隔线 */
.menu-divider {
  height: 1px;
  background-color: #34495e;
  margin: 10px 20px;
  transition: margin 0.3s ease;
}

.sidebar.collapsed .menu-divider {
  margin: 10px 12px;
}

/* 子菜单样式 */
.sidebar-menu .el-sub-menu .el-sub-menu__title {
  height: 56px !important;
  line-height: 56px !important;
  padding: 0 20px !important;
  background-color: #2c3e50 !important;
  color: #bdc3c7 !important;
}

.sidebar.collapsed .sidebar-menu .el-sub-menu .el-sub-menu__title {
  padding: 0 !important;
  justify-content: center !important;
}

.sidebar-menu .el-sub-menu .el-sub-menu__title:hover {
  background-color: #34495e !important;
  color: #ffffff !important;
}

.sidebar-menu .el-sub-menu.is-active .el-sub-menu__title {
  background-color: #34495e !important;
  color: #ffffff !important;
}

.sidebar-menu .el-sub-menu .el-sub-menu__title .el-icon {
  margin-right: 12px !important;
  font-size: 18px !important;
  width: 24px !important;
}

.sidebar.collapsed .sidebar-menu .el-sub-menu .el-sub-menu__title .el-icon {
  margin-right: 0 !important;
}

/* 子菜单项样式 */
.sidebar-menu .el-sub-menu .el-menu-item {
  height: 48px !important;
  line-height: 48px !important;
  padding-left: 60px !important;
  background-color: #34495e !important;
}

.sidebar.collapsed .sidebar-menu .el-sub-menu .el-menu-item {
  padding-left: 20px !important;
}

.sidebar-menu .el-sub-menu .el-menu-item:hover {
  background-color: #3a5270 !important;
}

.sidebar-menu .el-sub-menu .el-menu-item.is-active {
  background-color: #409eff !important;
  border-right: 3px solid #ffffff !important;
}

.sidebar.collapsed .sidebar-menu .el-sub-menu .el-menu-item.is-active {
  border-right: none !important;
  border-left: 3px solid #ffffff !important;
}

.sidebar-menu .el-sub-menu .el-menu-item .el-icon {
  margin-right: 8px !important;
  font-size: 16px !important;
  width: 20px !important;
}

.sidebar.collapsed .sidebar-menu .el-sub-menu .el-menu-item .el-icon {
  margin-right: 0 !important;
}

/* 侧边栏底部 */
.sidebar-footer {
  padding: 20px;
  border-top: 1px solid #34495e;
  flex-shrink: 0; /* 防止底部被压缩 */
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
  
  /* 手机端滚动条优化 */
  .menu-container {
    /* 在移动设备上使用更细的滚动条 */
    scrollbar-width: thin;
  }
  
  .menu-container::-webkit-scrollbar {
    width: 4px;
  }
  
  /* 手机端分隔线优化 */
  .menu-divider {
    margin: 8px 15px;
  }
  
  .sidebar.collapsed .menu-divider {
    margin: 8px 10px;
  }
}

/* 平板端样式优化 */
@media (max-width: 767px) and (min-width: 481px) {
  .menu-container::-webkit-scrollbar {
    width: 5px;
  }
}

/* 触摸设备滚动优化 */
@media (hover: none) and (pointer: coarse) {
  .menu-container {
    /* 为触摸设备优化滚动 */
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
  }
  
  .menu-container::-webkit-scrollbar {
    width: 3px;
  }
  
  .menu-container::-webkit-scrollbar-thumb {
    background: rgba(95, 108, 125, 0.6);
  }
}
</style> 