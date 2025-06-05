# Froala Vue 编辑器

一个基于 Vue 3 和 Froala 编辑器的富文本编辑器，支持图片上传到服务器。

## 功能特性

- ✅ 富文本编辑
- ✅ 实时内容监控
- ✅ 图片上传到服务器
- ✅ 图片管理（查看、删除）
- ✅ 快速插入按钮
- ✅ 中文界面
- ✅ 响应式设计

## 安装和使用

### 前端 (Vue 应用)

1. 安装依赖：
```bash
npm install
```

2. 启动开发服务器：
```bash
npm run dev
```

### 后端 (图片上传服务器)

1. 安装服务器依赖：
```bash
# 复制服务器package.json
cp server-package.json package.json

# 安装依赖
npm install express multer cors
```

2. 启动图片上传服务器：
```bash
node server.js
```

服务器将在 `http://localhost:3001` 启动。

## 图片上传功能

### 支持的功能

- **上传方式**：拖拽上传、点击上传、粘贴上传
- **文件类型**：JPEG, JPG, PNG, GIF, WebP
- **文件大小**：最大 5MB
- **图片管理**：可以查看已上传的图片库
- **图片编辑**：对齐、标题、链接、样式等

### API 接口

#### 上传图片
```
POST http://localhost:3001/api/upload-image
Content-Type: multipart/form-data
参数: file (文件)
```

响应格式：
```json
{
  "link": "http://localhost:3001/uploads/image-1234567890.jpg"
}
```

#### 获取图片列表
```
GET http://localhost:3001/api/load-images
```

响应格式：
```json
[
  {
    "url": "http://localhost:3001/uploads/image-1.jpg",
    "thumb": "http://localhost:3001/uploads/image-1.jpg",
    "name": "image-1.jpg"
  }
]
```

#### 删除图片
```
DELETE http://localhost:3001/api/delete-image
Content-Type: application/json
Body: { "src": "http://localhost:3001/uploads/image-1.jpg" }
```

## 使用方法

### 插入图片

1. **工具栏按钮**：点击工具栏的图片按钮
2. **快速插入**：在新行按回车后点击 "+" 按钮，选择图片
3. **拖拽上传**：直接将图片拖拽到编辑器中
4. **粘贴上传**：复制图片后在编辑器中粘贴

### 图片编辑

选中插入的图片后，会出现图片编辑工具栏，包括：
- 替换图片
- 对齐方式
- 添加标题
- 添加链接
- 调整大小
- 设置样式

## 目录结构

```
.
├── src/
│   ├── components/
│   │   └── FroalaEditor.vue    # 主编辑器组件
│   ├── App.vue                 # 主应用组件
│   └── main.js                 # 应用入口
├── server.js                   # 图片上传服务器
├── server-package.json         # 服务器依赖配置
├── uploads/                    # 图片存储目录（自动创建）
└── README.md                   # 说明文档
```

## 自定义配置

### 修改上传限制

在 `FroalaEditor.vue` 中修改：

```javascript
imageMaxSize: 10 * 1024 * 1024, // 改为10MB
imageAllowedTypes: ['jpeg', 'jpg', 'png'], // 只允许这些格式
```

### 修改API地址

```javascript
imageUploadURL: 'https://yourapi.com/upload-image',
imageManagerLoadURL: 'https://yourapi.com/load-images',
imageManagerDeleteURL: 'https://yourapi.com/delete-image',
```

### 添加认证

在 `imageUploadParams` 中添加认证信息：

```javascript
imageUploadParams: {
    userId: 'user123',
    token: 'your-auth-token'
},
```

## 注意事项

1. **许可证**：Froala 是商业软件，生产环境需要购买许可证
2. **安全性**：实际部署时请添加文件类型验证、用户认证等安全措施
3. **存储**：建议使用云存储服务（如阿里云OSS、AWS S3）替代本地存储
4. **CORS**：确保服务器正确配置CORS政策

## 故障排除

### 图片上传失败

1. 检查服务器是否启动
2. 检查网络连接
3. 查看浏览器控制台错误信息
4. 确认文件大小和类型是否符合要求

### 跨域问题

确保服务器启用了CORS，并且允许来自前端域名的请求。

## 贡献

欢迎提交 Issue 和 Pull Request！
