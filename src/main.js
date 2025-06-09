import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

// 导入路由
import router from './router'

// 导入 Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 导入 Froala 编辑器相关文件
import 'froala-editor/js/plugins.pkgd.min.js'
import 'froala-editor/js/third_party/embedly.min'
import 'froala-editor/js/languages/zh_cn'
import 'froala-editor/css/froala_editor.pkgd.min.css'
import 'froala-editor/css/froala_style.min.css'

// 导入 Vue-Froala
import VueFroala from 'vue-froala-wysiwyg'

const app = createApp(App)

// 使用路由
app.use(router)

// 使用 Element Plus
app.use(ElementPlus)

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(VueFroala)
app.mount('#app')
