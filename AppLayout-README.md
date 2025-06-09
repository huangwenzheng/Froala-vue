# AppLayout 响应式布局组件系统

一个基于 Vue 3、Element Plus 和 Vue Router 的现代化响应式布局组件系统，提供完整的单页应用解决方案。

## ✨ 核心特性

- 🎯 **完全响应式** - 智能适配桌面、平板、手机三端
- 🚀 **现代技术栈** - Vue 3 Composition API + Element Plus + Vue Router 4
- 📱 **智能侧边栏** - 自动折叠/展开，状态持久化
- 🎨 **高度可配置** - 灵活的组件配置和主题定制
- ⚡ **性能优化** - 路由懒加载、防抖处理、状态管理
- 🔄 **路由集成** - 完整的路由系统和页面过渡动画
- 🎪 **平滑动画** - 页面切换、侧边栏过渡、加载状态

## 📦 技术栈

```json
{
  "vue": "^3.5.13",
  "vue-router": "^4.x",
  "element-plus": "^2.x",
  "@element-plus/icons-vue": "^2.x",
  "vite": "^6.x"
}
```

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install vue@^3.5.13 vue-router@^4 element-plus @element-plus/icons-vue
```

### 2. 项目结构

```
src/
├── components/
│   ├── AppLayout.vue      # 主布局组件
│   └── Sidebar.vue        # 侧边栏组件
├── views/                 # 页面组件
│   ├── EditorView.vue     # 编辑器页面
│   ├── DocumentsView.vue  # 文档管理页面
│   ├── SettingsView.vue   # 设置页面
│   ├── HelpView.vue       # 帮助页面
│   └── NotFoundView.vue   # 404页面
├── router/
│   └── index.js           # 路由配置
├── App.vue               # 应用入口
└── main.js               # 主程序入口
```

### 3. 主程序配置 (main.js)

```javascript
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import router from './router'
import App from './App.vue'

const app = createApp(App)

// 注册 Element Plus
app.use(ElementPlus)

// 注册所有图标组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 注册路由
app.use(router)

app.mount('#app')
```

### 4. 路由配置 (router/index.js)

```javascript
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/editor'
  },
  {
    path: '/editor',
    name: 'Editor',
    component: () => import('../views/EditorView.vue'),
    meta: { title: '编辑器', icon: 'Edit' }
  },
  {
    path: '/documents',
    name: 'Documents', 
    component: () => import('../views/DocumentsView.vue'),
    meta: { title: '文档', icon: 'Document' }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/SettingsView.vue'),
    meta: { title: '设置', icon: 'Setting' }
  },
  {
    path: '/help',
    name: 'Help',
    component: () => import('../views/HelpView.vue'),
    meta: { title: '帮助', icon: 'QuestionFilled' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFoundView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

// 路由守卫 - 设置页面标题
router.beforeEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} - 应用名称` : '应用名称'
})

export default router
```

### 5. 应用入口 (App.vue)

```vue
<template>
  <AppLayout>
    <router-view v-slot="{ Component }">
      <transition name="fade-slide" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </AppLayout>
</template>

<script setup>
import AppLayout from './components/AppLayout.vue'
</script>

<style>
/* 页面过渡动画 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
</style>
```

## 📋 组件 API

### AppLayout Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `title` | String | `'导航菜单'` | 侧边栏标题 |
| `showUserInfo` | Boolean | `true` | 是否显示用户信息 |
| `userName` | String | `'用户'` | 用户名称 |
| `autoCollapse` | Boolean | `true` | 自动响应式折叠 |

### AppLayout Events

| 事件 | 参数 | 描述 |
|------|------|------|
| `collapse-change` | `(collapsed: boolean)` | 侧边栏状态变化 |

### Sidebar Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `menuItems` | Array | `[]` | 菜单项配置 |
| `collapsed` | Boolean | `false` | 折叠状态 |
| `title` | String | `'导航菜单'` | 标题文本 |
| `showUserInfo` | Boolean | `true` | 显示用户信息 |
| `userName` | String | `'用户'` | 用户名 |

### 菜单项配置格式

```javascript
const menuItems = [
  {
    key: 'editor',           // 路由名称或唯一标识
    title: '编辑器',         // 显示文本
    icon: 'Edit',           // Element Plus 图标名
    path: '/editor'         // 路由路径（可选）
  }
]
```

## 🎨 响应式设计规范

### 断点定义

```css
/* 桌面端 */
@media (min-width: 768px) {
  .sidebar {
    width: 280px; /* 展开 */
    width: 64px;  /* 折叠 */
  }
}

/* 平板端 */
@media (min-width: 481px) and (max-width: 767px) {
  .sidebar {
    width: 240px; /* 展开 */
    width: 64px;  /* 折叠 */
  }
}

/* 手机端 */
@media (max-width: 480px) {
  .sidebar {
    width: 240px; /* 展开 */
    width: 64px;  /* 折叠 */
  }
}
```

### 智能折叠行为

- **≥768px (桌面)**: 默认展开，手动可控
- **<768px (移动)**: 默认折叠，触摸友好
- **状态持久化**: 用户设置会保存在 localStorage

## 🔧 高级配置

### 自定义主题

```css
:root {
  /* 侧边栏主题 */
  --sidebar-bg: #2c3e50;
  --sidebar-text: #bdc3c7;
  --sidebar-active: #3498db;
  --sidebar-hover: #34495e;
  
  /* 布局尺寸 */
  --sidebar-width: 280px;
  --sidebar-collapsed-width: 64px;
  --sidebar-mobile-width: 240px;
  
  /* 动画时间 */
  --transition-duration: 0.3s;
}
```

### 添加新页面

1. **创建视图组件**

```vue
<!-- src/views/NewView.vue -->
<template>
  <div class="view-container">
    <h1>新页面</h1>
    <p>页面内容...</p>
  </div>
</template>

<script setup>
// 页面逻辑
</script>

<style scoped>
.view-container {
  background: white;
  border-radius: 8px;
  padding: 30px;
  min-height: calc(100vh - 40px);
}
</style>
```

2. **添加路由配置**

```javascript
// router/index.js
{
  path: '/new',
  name: 'New',
  component: () => import('../views/NewView.vue'),
  meta: { title: '新页面', icon: 'Plus' }
}
```

3. **更新菜单项**

菜单项会自动从路由配置中生成，无需手动配置。

### 权限控制

```javascript
// router/index.js
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isAuthenticated = checkAuth() // 您的认证逻辑
  
  if (requiresAuth && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})
```

## 📱 视图组件示例

### 基础视图模板

```vue
<template>
  <div class="view-container">
    <!-- 页面头部 -->
    <div class="view-header">
      <h1>{{ title }}</h1>
      <div class="view-actions">
        <el-button type="primary" @click="handleAction">
          操作按钮
        </el-button>
      </div>
    </div>
    
    <!-- 页面内容 -->
    <div class="view-content">
      <!-- 您的内容 -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 页面标题
const title = ref('页面标题')

// 生命周期
onMounted(() => {
  console.log('页面已加载')
})

// 方法
const handleAction = () => {
  // 处理逻辑
}
</script>

<style scoped>
.view-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 30px;
  min-height: calc(100vh - 40px);
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
}

.view-content {
  /* 内容样式 */
}

/* 响应式设计 */
@media (max-width: 767px) {
  .view-container {
    padding: 20px;
  }
  
  .view-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
}
</style>
```

## 🎯 最佳实践

### 1. 组件组织

```javascript
// 推荐的组件结构
export default {
  name: 'ViewComponent',
  setup() {
    // 1. 响应式数据
    const data = ref({})
    
    // 2. 计算属性
    const computed = computed(() => {})
    
    // 3. 方法
    const methods = () => {}
    
    // 4. 生命周期
    onMounted(() => {})
    
    // 5. 返回
    return {
      data,
      computed,
      methods
    }
  }
}
```

### 2. 性能优化

```vue
<script setup>
// 使用 defineAsyncComponent 进行组件懒加载
import { defineAsyncComponent } from 'vue'

const HeavyComponent = defineAsyncComponent(() =>
  import('./HeavyComponent.vue')
)

// 防抖处理
import { debounce } from 'lodash-es'

const handleSearch = debounce((query) => {
  // 搜索逻辑
}, 300)
</script>
```

### 3. 错误处理

```vue
<script setup>
import { ref, onErrorCaptured } from 'vue'
import { ElMessage } from 'element-plus'

const error = ref(null)

onErrorCaptured((err) => {
  error.value = err
  ElMessage.error('页面加载出错，请刷新重试')
  return false
})
</script>
```

### 4. 状态管理

```javascript
// 简单状态管理
import { ref, provide, inject } from 'vue'

// 提供状态
const state = ref({
  sidebarCollapsed: false,
  currentTheme: 'default'
})

provide('appState', state)

// 注入状态
const appState = inject('appState')
```

## 🐛 故障排除

### 常见问题

**Q: 侧边栏不响应手势操作？**
```css
/* 确保触摸事件正确绑定 */
.sidebar-toggle {
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}
```

**Q: 路由切换没有动画？**
```vue
<!-- 确保使用了 transition 包装 router-view -->
<router-view v-slot="{ Component }">
  <transition name="fade" mode="out-in">
    <component :is="Component" />
  </transition>
</router-view>
```

**Q: 移动端侧边栏遮挡内容？**
```css
/* 确保正确的 z-index 层级 */
.sidebar {
  z-index: 1000;
}
.main-content {
  z-index: 1;
}
```

### 调试工具

```javascript
// 开发环境调试
if (process.env.NODE_ENV === 'development') {
  window.debugLayout = {
    sidebarState: () => console.log(sidebarCollapsed.value),
    currentRoute: () => console.log(route.path),
    breakpoint: () => console.log(window.innerWidth)
  }
}
```

## 📈 性能监控

```javascript
// 性能监控示例
const performanceObserver = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.entryType === 'navigation') {
      console.log('页面加载时间:', entry.loadEventEnd - entry.loadEventStart)
    }
  }
})

performanceObserver.observe({ entryTypes: ['navigation'] })
```

## 🔄 版本更新

### v2.0.0 (当前版本)
- ✅ 完整的 Vue Router 4 集成
- ✅ 页面过渡动画系统
- ✅ 响应式断点优化
- ✅ TypeScript 支持准备
- ✅ 性能优化和错误处理

### v1.0.0
- ✅ 基础布局组件
- ✅ 侧边栏导航系统
- ✅ Element Plus 集成

## 📄 许可证

MIT License - 详见 LICENSE 文件

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**🎉 现在您已经可以开始使用这个强大的布局系统构建现代化的 Vue 3 应用了！** 