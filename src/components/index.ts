// 通用布局组件导出
import AppLayout from './AppLayout.vue';
import Sidebar from './Sidebar.vue';
import AppLayoutExample from './AppLayoutExample.vue';
import type { App } from 'vue';

// 单独导出
export { AppLayout, Sidebar, AppLayoutExample };

// 默认导出
export default AppLayout;

// 安装函数 (可选，用于Vue插件安装)
export const install = (app: App) => {
  app.component('AppLayout', AppLayout);
  app.component('Sidebar', Sidebar);
  app.component('AppLayoutExample', AppLayoutExample);
};

// 版本信息
export const version = '1.0.0'; 