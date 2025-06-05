import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import cors from 'cors'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const port = 3001

// 启用CORS
app.use(cors())
app.use(express.json())

// 确保上传目录存在
const uploadsDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true })
}

// 配置multer用于文件上传
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir)
    },
    filename: function (req, file, cb) {
        // 生成唯一文件名
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const extension = path.extname(file.originalname)
        cb(null, 'image-' + uniqueSuffix + extension)
    }
})

// 文件过滤器
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error('不支持的文件类型'), false)
    }
}

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB限制
    },
    fileFilter: fileFilter
})

// 静态文件服务
app.use('/uploads', express.static(uploadsDir))

// 图片上传API
app.post('/api/upload-image', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: '没有文件上传' })
        }

        const fileUrl = `http://localhost:${port}/uploads/${req.file.filename}`
        
        // Froala要求的响应格式
        res.json({
            link: fileUrl,
            name: req.file.filename,
            type: req.file.mimetype,
            id: req.file.filename
        })
        
        console.log('图片上传成功:', req.file.filename)
    } catch (error) {
        console.error('上传错误:', error)
        res.status(500).json({ error: '服务器错误' })
    }
})

// 获取已上传的图片列表
app.get('/api/load-images', (req, res) => {
    try {
        const files = fs.readdirSync(uploadsDir)
        const images = files
            .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
            .map(file => ({
                url: `http://localhost:${port}/uploads/${file}`,
                thumb: `http://localhost:${port}/uploads/${file}`,
                name: file
            }))
        
        res.json(images)
    } catch (error) {
        console.error('获取图片列表错误:', error)
        res.status(500).json({ error: '服务器错误' })
    }
})

// 删除图片API
app.delete('/api/delete-image', (req, res) => {
    try {
        const { src } = req.body
        const filename = path.basename(src)
        const filePath = path.join(uploadsDir, filename)
        
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
            res.json({ success: true })
            console.log('图片删除成功:', filename)
        } else {
            res.status(404).json({ error: '文件不存在' })
        }
    } catch (error) {
        console.error('删除错误:', error)
        res.status(500).json({ error: '服务器错误' })
    }
})

// 错误处理中间件
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: '文件太大，最大支持5MB' })
        }
    }
    res.status(500).json({ error: error.message })
})

app.listen(port, () => {
    console.log(`图片上传服务器运行在 http://localhost:${port}`)
    console.log(`上传目录: ${uploadsDir}`)
})

export default app 