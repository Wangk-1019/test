#!/bin/bash

# 部署脚本
echo "🚀 开始部署流程..."

# 检查是否已初始化 git
if [ ! -d ".git" ]; then
    echo "📦 初始化 Git 仓库..."
    git init
    git add .
    git commit -m "Initial commit"
    echo "✅ Git 仓库已初始化"
fi

# 检查是否安装了 Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "📥 安装 Vercel CLI..."
    npm install -g vercel
fi

echo ""
echo "选择部署方式："
echo "1. Vercel（推荐）"
echo "2. 构建生产版本（本地）"
echo "3. Docker"
read -p "请选择 (1-3): " choice

case $choice in
    1)
        echo "🌐 使用 Vercel 部署..."
        vercel login
        vercel
        echo "✅ 部署完成！"
        ;;
    2)
        echo "🔨 构建生产版本..."
        npm run build
        echo "✅ 构建完成！运行 'npm start' 启动生产服务器"
        ;;
    3)
        echo "🐳 使用 Docker 部署..."
        if [ ! -f "Dockerfile" ]; then
            echo "❌ 未找到 Dockerfile，请先创建"
        else
            docker build -t chatgpt-clone .
            echo "✅ Docker 镜像构建完成！"
            echo "运行: docker run -p 3000:3000 -e AI_BUILDER_TOKEN=your_token chatgpt-clone"
        fi
        ;;
    *)
        echo "❌ 无效选择"
        ;;
esac
