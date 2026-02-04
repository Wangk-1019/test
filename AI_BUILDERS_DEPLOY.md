# AI Builders 部署指南

AI Builders 提供免费的部署服务，可以将你的 Next.js 应用部署到 `ai-builders.space` 域名。

## 🎯 优势

- ✅ **免费托管 12 个月**（从首次成功部署开始）
- ✅ **自动部署**到 Koyeb 平台
- ✅ **自定义子域名**：`your-service-name.ai-builders.space`
- ✅ **环境变量自动注入**（包括 `AI_BUILDER_TOKEN`）
- ✅ **支持公开的 GitHub 仓库**

## 📋 前置要求

1. **公开的 GitHub 仓库**
   - 仓库必须是公开的
   - 不能包含敏感信息（密码、API keys 等）

2. **环境变量**
   - `AI_BUILDER_TOKEN`: 你的 AI Builder Token

3. **项目要求**
   - 必须监听 `PORT` 环境变量
   - 单进程/单端口（API 和静态文件从同一服务器提供）

## 🚀 快速部署

### 方法一：使用部署脚本（推荐）

```bash
# 1. 确保环境变量已设置
export AI_BUILDER_TOKEN=sk_25972356_acc017a659a5012fa6101693bc25f94f2aa7

# 2. 运行部署脚本
./deploy-ai-builders.sh
```

脚本会引导你：
1. 初始化 Git 仓库（如果需要）
2. 输入 GitHub 仓库 URL
3. 确认部署配置
4. 自动调用 AI Builders API 部署

### 方法二：直接使用 Node.js 脚本

```bash
# 设置环境变量
export AI_BUILDER_TOKEN=sk_25972356_acc017a659a5012fa6101693bc25f94f2aa7

# 运行部署
node deploy-ai-builders.js \
  https://github.com/yourusername/your-repo \
  chatgpt-clone-nextjs \
  main \
  3000
```

参数说明：
- `repo_url`: GitHub 仓库 URL（必需）
- `service_name`: 服务名称（可选，默认：chatgpt-clone-nextjs）
- `branch`: Git 分支（可选，默认：main）
- `port`: 端口号（可选，默认：3000）

### 方法三：使用 curl 直接调用 API

```bash
curl -X POST https://space.ai-builders.com/backend/v1/deployments \
  -H "Authorization: Bearer $AI_BUILDER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "repo_url": "https://github.com/yourusername/your-repo",
    "service_name": "chatgpt-clone-nextjs",
    "branch": "main",
    "port": 3000,
    "env_vars": {
      "AI_BUILDER_BASE_URL": "https://space.ai-builders.com/backend",
      "NODE_ENV": "production"
    }
  }'
```

## 📝 部署前准备

### 1. 确保项目已推送到 GitHub

```bash
# 初始化 Git（如果还没有）
git init
git add .
git commit -m "Ready for deployment"

# 在 GitHub 创建仓库后
git remote add origin https://github.com/yourusername/your-repo.git
git branch -M main
git push -u origin main
```

### 2. 检查项目配置

确保 `package.json` 中有正确的启动脚本：

```json
{
  "scripts": {
    "start": "next start",
    "build": "next build"
  }
}
```

### 3. 确保监听 PORT 环境变量

Next.js 默认会监听 `PORT` 环境变量，无需额外配置。

## 🔍 查看部署状态

### 列出所有部署

```bash
curl -H "Authorization: Bearer $AI_BUILDER_TOKEN" \
  https://space.ai-builders.com/backend/v1/deployments
```

### 查看特定服务状态

```bash
curl -H "Authorization: Bearer $AI_BUILDER_TOKEN" \
  https://space.ai-builders.com/backend/v1/deployments/chatgpt-clone-nextjs
```

### 查看部署日志

```bash
curl -H "Authorization: Bearer $AI_BUILDER_TOKEN" \
  "https://space.ai-builders.com/backend/v1/deployments/chatgpt-clone-nextjs/logs?log_type=runtime"
```

## ⚙️ 环境变量配置

部署时会自动注入以下环境变量：

- `AI_BUILDER_TOKEN`: 自动注入（无需在请求中提供）
- `PORT`: 由 Koyeb 设置（你的应用必须监听此端口）

你可以在部署请求中添加自定义环境变量：

```json
{
  "env_vars": {
    "AI_BUILDER_BASE_URL": "https://space.ai-builders.com/backend",
    "NODE_ENV": "production",
    "CUSTOM_VAR": "value"
  }
}
```

**重要**：环境变量不会存储在平台数据库中，每次部署都需要重新提供。

## 📊 部署流程

1. **提交部署请求** → API 返回 202 Accepted
2. **Koyeb 开始构建** → 克隆仓库、安装依赖、构建应用
3. **部署完成** → 通常需要 5-10 分钟
4. **服务可用** → 访问 `https://your-service-name.ai-builders.space`

## ⚠️ 限制和注意事项

1. **服务数量限制**
   - 每个用户有最大服务数限制（默认 2 个）
   - 联系管理员可以删除服务或扩展限制

2. **免费期限**
   - 免费托管 12 个月（从首次成功部署开始）

3. **仓库要求**
   - 必须是公开仓库
   - 不能包含敏感信息
   - 不能有私有子模块

4. **端口配置**
   - 应用必须监听 `PORT` 环境变量
   - Koyeb 会自动设置此变量

## 🐛 故障排查

### 部署失败

1. 检查仓库 URL 是否正确
2. 确认仓库是公开的
3. 检查分支名称是否正确
4. 查看部署日志：`/v1/deployments/{service_name}/logs`

### 服务无法访问

1. 检查部署状态：`/v1/deployments/{service_name}`
2. 查看运行时日志
3. 确认应用正在监听 `PORT` 环境变量

### 环境变量问题

- 环境变量不会持久化存储
- 每次部署都需要重新提供
- `AI_BUILDER_TOKEN` 会自动注入，无需手动设置

## 📚 相关资源

- API 文档: https://www.ai-builders.com/resources/students-backend/openapi.json
- 部署提示 URL: 在部署响应中的 `deployment_prompt_url` 字段

## 💡 提示

1. **首次部署**：建议先测试本地构建是否成功
   ```bash
   npm run build
   npm start
   ```

2. **更新部署**：推送新代码到 GitHub 后，重新运行部署脚本

3. **监控部署**：使用 API 端点定期检查部署状态

4. **日志调试**：如果遇到问题，查看构建和运行时日志
