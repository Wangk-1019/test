# 部署指南

本项目支持多种部署方式，推荐使用 Vercel（Next.js 官方平台）。

## 方式一：Vercel 部署（推荐）

### 1. 准备工作

确保项目已推送到 Git 仓库（GitHub、GitLab 或 Bitbucket）。

### 2. 部署步骤

#### 方法 A：通过 Vercel 网站部署

1. 访问 [Vercel](https://vercel.com)
2. 使用 GitHub/GitLab/Bitbucket 账号登录
3. 点击 "Add New Project"
4. 导入你的 Git 仓库
5. 配置环境变量：
   - `AI_BUILDER_TOKEN`: 你的 AI Builder Token
   - `AI_BUILDER_BASE_URL`: `https://space.ai-builders.com/backend`
6. 点击 "Deploy"

#### 方法 B：使用 Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel

# 设置环境变量
vercel env add AI_BUILDER_TOKEN
vercel env add AI_BUILDER_BASE_URL

# 生产环境部署
vercel --prod
```

### 3. 配置环境变量

在 Vercel 项目设置中添加以下环境变量：

- **AI_BUILDER_TOKEN**: `sk_25972356_acc017a659a5012fa6101693bc25f94f2aa7`
- **AI_BUILDER_BASE_URL**: `https://space.ai-builders.com/backend`

### 4. 函数超时设置

Vercel 免费版默认函数超时为 10 秒，Pro 版为 60 秒。如果需要 240 秒超时，需要：

1. 升级到 Vercel Pro 计划
2. 在项目设置中启用 "Extended Execution Time"
3. 或者在 `vercel.json` 中配置（已包含）

## 方式二：Docker 部署

### 1. 创建 Dockerfile

```dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### 2. 更新 next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
}

module.exports = nextConfig
```

### 3. 构建和运行

```bash
# 构建镜像
docker build -t chatgpt-clone .

# 运行容器
docker run -p 3000:3000 \
  -e AI_BUILDER_TOKEN=your_token \
  -e AI_BUILDER_BASE_URL=https://space.ai-builders.com/backend \
  chatgpt-clone
```

## 方式三：传统服务器部署（PM2）

### 1. 安装依赖

```bash
npm install
```

### 2. 构建项目

```bash
npm run build
```

### 3. 使用 PM2 运行

```bash
# 安装 PM2
npm install -g pm2

# 启动应用
pm2 start npm --name "chatgpt-clone" -- start

# 设置环境变量
pm2 start npm --name "chatgpt-clone" -- start \
  --env AI_BUILDER_TOKEN=your_token \
  --env AI_BUILDER_BASE_URL=https://space.ai-builders.com/backend

# 保存配置
pm2 save
pm2 startup
```

### 4. 使用 Nginx 反向代理（可选）

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 方式四：Netlify 部署

### 1. 创建 netlify.toml

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "20"
```

### 2. 部署

1. 访问 [Netlify](https://netlify.com)
2. 连接 Git 仓库
3. 设置环境变量
4. 部署

## 环境变量说明

无论使用哪种部署方式，都需要设置以下环境变量：

- **AI_BUILDER_TOKEN**: AI Builder API Token
- **AI_BUILDER_BASE_URL**: API 基础 URL（默认：`https://space.ai-builders.com/backend`）

## 注意事项

1. **超时设置**: API 路由设置了 240 秒超时，确保部署平台支持此超时时间
2. **环境变量安全**: 不要将 `.env.local` 文件提交到 Git 仓库
3. **构建优化**: Next.js 会自动优化构建，无需额外配置
4. **静态资源**: 确保静态资源正确部署

## 故障排查

### 构建失败
- 检查 Node.js 版本（需要 18+）
- 检查依赖是否正确安装
- 查看构建日志

### API 请求失败
- 检查环境变量是否正确设置
- 检查网络连接
- 查看服务器日志

### 超时错误
- 检查部署平台的超时限制
- 考虑升级到支持更长超时的计划

## 推荐配置

- **开发环境**: 本地运行 `npm run dev`
- **生产环境**: Vercel（最简单）或 Docker（更灵活）
- **企业环境**: Kubernetes + Docker
