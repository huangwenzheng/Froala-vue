@echo off
chcp 65001 >nul

echo 🚀 启动 Froala Vue 编辑器项目
echo ================================

:: 检查是否安装了 Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: 请先安装 Node.js
    pause
    exit /b 1
)

:: 检查是否安装了 npm
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: 请先安装 npm
    pause
    exit /b 1
)

echo 📦 安装前端依赖...
call npm install

echo 🖼️  设置图片上传服务器...

:: 检查是否存在 uploads 目录
if not exist "uploads" (
    mkdir uploads
    echo ✅ 创建 uploads 目录
)

:: 检查是否已安装服务器依赖
if not exist "node_modules\express" (
    echo 📦 安装服务器依赖...
    call npm install express multer cors
)

echo 🎯 启动服务...

:: 启动图片上传服务器
echo 🖼️  启动图片上传服务器 (端口 3001)...
start "图片上传服务器" cmd /k "node server.js"

:: 等待服务器启动
timeout /t 3 /nobreak >nul

:: 启动前端开发服务器
echo 🎨 启动前端开发服务器 (端口 5174)...
start "前端开发服务器" cmd /k "npm run dev"

echo.
echo ✅ 启动完成！
echo ================================
echo 📱 前端地址: http://localhost:5174
echo 🖼️  图片服务器: http://localhost:3001
echo 📁 图片存储目录: .\uploads
echo.
echo 💡 使用提示:
echo    - 在编辑器中可以直接拖拽图片上传
echo    - 点击工具栏的图片按钮上传
echo    - 按回车键后点击 + 快速插入图片
echo.
echo 🔧 如需停止服务，请关闭对应的命令行窗口
echo.

pause 