#!/bin/bash

# AI Builders 部署脚本

echo "🚀 AI Builders 自动部署脚本"
echo ""

# 检查环境变量
if [ -z "$AI_BUILDER_TOKEN" ]; then
    echo "❌ 错误: AI_BUILDER_TOKEN 环境变量未设置"
    echo "请设置: export AI_BUILDER_TOKEN=your_token"
    exit 1
fi

# 检查是否已初始化 git
if [ ! -d ".git" ]; then
    echo "📦 初始化 Git 仓库..."
    git init
    git add .
    git commit -m "Initial commit"
    echo "✅ Git 仓库已初始化"
    echo ""
fi

# 获取仓库 URL
if [ -z "$REPO_URL" ]; then
    echo "请输入 GitHub 仓库 URL:"
    echo "示例: https://github.com/username/repo-name"
    read -p "> " REPO_URL
fi

# 设置默认值
SERVICE_NAME=${SERVICE_NAME:-"chatgpt-clone-nextjs"}
BRANCH=${BRANCH:-"main"}
PORT=${PORT:-3000}

echo ""
echo "部署配置:"
echo "  仓库 URL: $REPO_URL"
echo "  服务名: $SERVICE_NAME"
echo "  分支: $BRANCH"
echo "  端口: $PORT"
echo ""

read -p "确认部署? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "取消部署"
    exit 1
fi

# 运行 Node.js 部署脚本
node deploy-ai-builders.js "$REPO_URL" "$SERVICE_NAME" "$BRANCH" "$PORT"
