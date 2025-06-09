import { createRouter, createWebHistory } from 'vue-router';

// 导入页面组件
import EditorView from '../views/EditorView.vue';
import DocumentsView from '../views/DocumentsView.vue';
import SettingsView from '../views/SettingsView.vue';
import HelpView from '../views/HelpView.vue';

// 路由配置
const routes = [
  {
    path: '/',
    redirect: '/editor'
  },
  {
    path: '/editor',
    name: 'Editor',
    component: EditorView,
    meta: {
      title: '编辑器',
      icon: 'Edit'
    }
  },
  {
    path: '/documents',
    name: 'Documents',
    component: DocumentsView,
    meta: {
      title: '文档管理',
      icon: 'Document'
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: SettingsView,
    meta: {
      title: '设置',
      icon: 'Setting'
    }
  },
  {
    path: '/help',
    name: 'Help',
    component: HelpView,
    meta: {
      title: '帮助',
      icon: 'QuestionFilled'
    }
  },
  // 404 页面
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFoundView.vue'),
    meta: {
      title: '页面不存在'
    }
  }
];

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes,
  // 路由切换时滚动到顶部
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

// 全局路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - Froala Vue` : 'Froala Vue';
  
  // 这里可以添加权限验证逻辑
  // if (to.meta.requiresAuth && !isAuthenticated()) {
  //   next('/login');
  // } else {
  //   next();
  // }
  
  next();
});

// 全局后置钩子
router.afterEach((to, from) => {
  // 路由切换完成后的逻辑
  console.log(`路由切换: ${from.path} -> ${to.path}`);
});

export default router; 