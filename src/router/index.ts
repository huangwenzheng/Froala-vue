import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { permissionMenus, MenuItem } from './permissions.js'

// 定义权限的类型
interface Permission {
  id: string
  name: string
  action: string
}

// 动态生成路由的工具函数
const generateRoutes = (menuData: MenuItem[]): RouteRecordRaw[] => {
  const routes: RouteRecordRaw[] = []
  
  // 递归处理菜单数据
  const processMenu = (menus: MenuItem[], parentMenu: MenuItem | null = null) => {
    menus.forEach(menu => {
      const routePath = `/${menu.name}`
      
      // 为所有具有实际页面的菜单项创建路由
      // 包括：list页面、没有子项的独立页面、特殊功能页面
      const shouldCreateRoute = (
        menu.name.includes('/list') ||
        menu.name.includes('/roles') ||
        menu.children.length === 0 ||
        menu.name.includes('/test') ||
        menu.name.includes('/add')
      )
      
      if (shouldCreateRoute) {
        routes.push({
          path: routePath,
          name: menu.name.replace(/\//g, '_'),
          component: () => import('../views/DynamicView.vue'),
          meta: {
            title: menu.show_name,
            icon: getIconByCategory(menu.name),
            menuId: menu.id,
            parentId: menu.parent_id,
            category: parentMenu ? parentMenu.show_name : '',
            permissions: menu.children.map((child: MenuItem): Permission => ({
              id: child.id.toString(),
              name: child.show_name,
              action: child.name
            }))
          }
        })
      }
      
      // 递归处理子菜单
      if (menu.children && menu.children.length > 0) {
        processMenu(menu.children, menu)
      }
    })
  }
  
  processMenu(menuData)
  return routes
}

// 根据类别获取图标
const getIconByCategory = (name: string): string => {
  if (name.includes('market')) return 'TrendCharts'
  if (name.includes('project')) return 'FolderOpened'
  if (name.includes('finance')) return 'Money'
  if (name.includes('security')) return 'Lock'
  if (name.includes('management')) return 'Setting'
  if (name.includes('operations')) return 'Operation'
  if (name.includes('compliance')) return 'DocumentChecked'
  if (name.includes('ui')) return 'PictureFilled'
  if (name.includes('test')) return 'Tools'
  if (name.includes('middle_platform')) return 'Platform'
  if (name.includes('live')) return 'VideoCamera'
  return 'Document'
}

// 基础路由
const baseRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/editor'
  },
  {
    path: '/editor',
    name: 'Editor',
    component: () => import('../views/EditorView.vue'),
    meta: { title: '编辑器', icon: 'Edit' }
  }
]

// 动态路由
const dynamicRoutes = generateRoutes(permissionMenus)

// 合并所有路由
const routes: RouteRecordRaw[] = [
  ...baseRoutes,
  ...dynamicRoutes,
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFoundView.vue')
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes,
  // 路由切换时滚动到顶部
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 全局路由守卫
router.beforeEach((to, _from, next) => {
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - 管理系统` : '管理系统'
  
  // 这里可以添加权限验证逻辑
  // if (to.meta.requiresAuth && !isAuthenticated()) {
  //   next('/login');
  // } else {
  //   next();
  // }
  
  console.log('导航到:', to.path, '页面:', to.meta.title)
  
  next()
})

// 全局后置钩子
router.afterEach((to, from) => {
  // 路由切换完成后的逻辑
  console.log(`路由切换: ${from.path} -> ${to.path}`)
})

// 导出权限菜单供组件使用
export { permissionMenus }
export default router 