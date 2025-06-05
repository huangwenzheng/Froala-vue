import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

// 导入 Froala 编辑器相关文件
import 'froala-editor/js/plugins.pkgd.min.js'
import 'froala-editor/js/third_party/embedly.min'
import 'froala-editor/js/languages/zh_cn'
import 'froala-editor/css/froala_editor.pkgd.min.css'
import 'froala-editor/css/froala_style.min.css'

// 导入 Vue-Froala
import VueFroala from 'vue-froala-wysiwyg'

const app = createApp(App)
app.use(VueFroala)
app.mount('#app')
