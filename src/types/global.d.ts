/* Vue 单文件组件类型声明 */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

/* Froala 编辑器类型声明 */
declare module 'vue-froala-wysiwyg' {
  import { App } from 'vue'
  const plugin: {
    install(app: App): void
  }
  export default plugin
}

declare module 'froala-editor' {
  export default class FroalaEditor {
    constructor(element: HTMLElement, options?: any)
    events: {
      on(event: string, callback: Function): void
    }
    html: {
      get(): string
      set(html: string): void
    }
    destroy(): void
  }
}

/* Froala 编辑器实例类型 */
interface FroalaEditorInstance {
  html: {
    get(): string
    set(html: string): void
  }
  el: HTMLElement
}

/* 扩展全局Window对象 */
declare global {
  interface Window {
    FroalaEditor: any
  }
} 