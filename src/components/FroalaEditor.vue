<template>
    <div class="editor-container">

        <froala :tag="'textarea'" :config="config" v-model="content" @froalaEditor="handleEditorInit" />
        
        <!-- 图片预览模态框 -->
        <div v-if="previewImage" class="image-modal" @click="closePreview">
            <div class="modal-content" @click.stop>
                <button class="close-btn" @click="closePreview">✕</button>
                <img :src="previewImage" alt="预览图片" class="preview-img" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue'

const emit = defineEmits(['update:modelValue']);

const props = defineProps({
     height: {
        type: Number,
        default: 200
    }
})

const content = ref('')
const editorLoaded = ref(false)
const previewImage = ref(null)

// 打开图片预览
const openPreview = (imageSrc) => {
    previewImage.value = imageSrc
}

// 关闭图片预览
const closePreview = () => {
    previewImage.value = null
}

// 为编辑器中的图片添加点击事件
const addImageClickEvents = (editor) => {
    setTimeout(() => {
        const editorElement = editor.el
        if (editorElement) {
            // 为所有图片添加点击事件
            const images = editorElement.querySelectorAll('img')
            images.forEach(img => {
                img.style.cursor = 'pointer'
                img.addEventListener('dblclick', (e) => {
                    e.preventDefault()
                    openPreview(img.src)
                })
            })
        }
    }, 100)
}

const config =ref({
    language: 'zh_cn',
    placeholderText: '请输入内容...',
    heightMin: props.height,
    quickInsertEnabled:true,
    quickInsertButtons:['image'],
    quickInsertTags:['p','div','h1','h2','h3'],
    
    // 图片上传配置
    imageUploadURL: 'http://localhost:3001/api/upload-image', // 图片上传API地址
    imageUploadParams: {
        // 可以添加额外的参数，比如用户ID等
        userId: 'user123'
    },
    imageUploadParam: 'file', // 上传参数名
    imageUploadMethod: 'POST',
    imageMaxSize: 5 * 1024 * 1024, // 5MB
    imageAllowedTypes: ['jpeg', 'jpg', 'png', 'gif', 'webp'],
    
    // 图片上传响应处理
    imageUploadToS3: false, // 如果使用S3设为true
    
    // 图片管理配置
    imageManagerLoadURL: 'http://localhost:3001/api/load-images', // 加载已上传图片列表的API
    imageManagerDeleteURL: 'http://localhost:3001/api/delete-image', // 删除图片的API
    imageManagerDeleteMethod: 'DELETE',
    
    // 图片调整大小
    imageResize: true,
    imageResizeWithPercent: false,
    imageRoundPercent: true,
    
    // 图片编辑选项
    imageEditButtons: [
        'imageReplace', 'imageAlign', 'imageCaption', 'imageRemove', 
        'imageLink', 'linkOpen', 'linkEdit', 'linkRemove', 
        'imageDisplay', 'imageStyle', 'imageAlt', 'imageSize'
    ],
    toolbarButtons: ['bold', 'italic', 'underline', 'fontSize', 'textColor', 'backgroundColor', 'clearFormatting','alignLeft', 'alignCenter', 'alignRight', 'alignFull','paragraphFormat', 'formatOL', 'formatUL', 'insertHR','insertLink', 'insertImage', 'insertTable','insertVideo', 'insertAudio','undo', 'redo', 'fullscreen', 'html'],
    // toolbarButtons: {

    //     'moreText': {
    //         buttons: ['bold', 'italic', 'underline', 'fontSize', 'textColor', 'backgroundColor', 'clearFormatting']
    //     },
    //     'moreParagraph': {
    //         buttons: ['alignLeft', 'alignCenter', 'alignRight', 'alignFull', 'formatOL', 'formatUL', 'insertHR']
    //     },
    //     'moreRich': {
    //         buttons: ['insertLink', 'insertImage', 'insertTable']
    //     },
    //     'moreMedia': {
    //         buttons: ['insertVideo', 'insertAudio']
    //     },
    //     'moreMisc': {
    //         buttons: ['undo', 'redo', 'fullscreen', 'html']
    //     }
    // },

    events: {
        'initialized': function () {
            console.log('✅ 配置中的 initialized 事件触发')
            editorLoaded.value = true
            addImageClickEvents(this)
        },
        'contentChanged': function () {
            console.log('✅ 配置中的内容变化事件触发')
            const currentContent = this.html.get()
            emit('update:modelValue', currentContent)
            console.log('当前内容：', currentContent)
            // 内容变化时重新添加图片点击事件
            addImageClickEvents(this)
        },
        'keyup': function () {
            console.log('✅ 按键事件触发')
            const currentContent = this.html.get()
            emit('update:modelValue', currentContent)
        },
        // 图片上传相关事件
        'image.beforeUpload': function (images) {
            console.log('准备上传图片：', images)
            // 可以在这里添加上传前的验证逻辑
            return true // 返回false可以阻止上传
        },
        'image.uploaded': function (response) {
            console.log('图片上传成功：', response)
            // 图片上传后添加点击事件
            addImageClickEvents(this)
        },
        'image.error': function (error, response) {
            console.error('图片上传失败：', error, response)
            // 处理上传失败
            alert('图片上传失败，请重试')
        },
        'image.replaced': function ($img, response) {
            console.log('图片已替换：', $img, response)
            // 图片替换后添加点击事件
            addImageClickEvents(this)
        }
    }
})

const handleEditorInit = (editor) => {
    console.log('🎉 Vue 组件事件：编辑器已初始化', editor)
    editorLoaded.value = true

    // 测试编辑器功能
    setTimeout(() => {
        console.log('测试设置内容...')
        editor.html.set('<p>测试内容</p>')
    }, 1000)
}
</script>

<style scoped>
.editor-container {
    margin: 20px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.debug-info {
    margin: 10px;
    padding: 10px;
    background-color: #f0f0f0;
    border-radius: 4px;
    font-family: monospace;
    font-size: 12px;
}

.content-preview {
    margin: 20px;
    padding: 15px;
    background-color: #f8f9fa;
    border-radius: 4px;
}

.preview-text {
    margin: 10px 0;
    padding: 10px;
    border: 1px solid #e9ecef;
    border-radius: 4px;
    background-color: white;
    min-height: 50px;
}

.word-count {
    color: #6c757d;
    font-size: 14px;
    text-align: right;
    margin-top: 5px;
}

h3 {
    margin: 0 0 10px 0;
    color: #495057;
    font-size: 16px;
}

#fr-logo{
    display: none !important;
}

/* 图片预览模态框样式 */
.image-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-content {
    position: relative;
    max-width: 90vw;
    max-height: 90vh;
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
}

.close-btn {
    position: fixed;
    top: 20px;
    right: 20px;
    width: 30px;
    height: 30px;
    border: none;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
    color: white;
    font-size: 16px;
    cursor: pointer;
    z-index: 1001;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
}

.close-btn:hover {
    background: rgba(255, 255, 255, 0.8);
}

.preview-img {
    max-width: 90vw;
    max-height: 90vh;
    object-fit: contain;
    display: block;
}

/* 编辑器内图片样式 */
:deep(.fr-element img) {
    cursor: pointer !important;
    transition: opacity 0.2s;
}

:deep(.fr-element img:hover) {
    opacity: 0.8;
}
</style>