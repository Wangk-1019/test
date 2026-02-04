# GitHub 仓库设置指南

## ✅ 已完成

- ✅ Git 仓库已初始化
- ✅ 所有文件已添加到暂存区
- ✅ 初始提交已创建（23 个文件，7597 行代码）
- ✅ 主分支已设置为 `main`

## 📋 下一步：在 GitHub 创建仓库

### 方法一：通过 GitHub 网站创建（推荐）

1. **访问 GitHub**
   - 打开 https://github.com
   - 登录你的账号

2. **创建新仓库**
   - 点击右上角的 "+" 按钮
   - 选择 "New repository"

3. **填写仓库信息**
   - **Repository name**: `chatgpt-clone-nextjs`（或你喜欢的名称）
   - **Description**: `ChatGPT Clone built with Next.js and Grok models`
   - **Visibility**: 选择 **Public**（AI Builders 部署需要公开仓库）
   - ⚠️ **不要**勾选 "Initialize this repository with a README"（我们已经有了）
   - ⚠️ **不要**添加 .gitignore 或 license（我们已经有了）

4. **点击 "Create repository"**

5. **连接本地仓库到 GitHub**

   复制 GitHub 显示的仓库 URL（例如：`https://github.com/yourusername/chatgpt-clone-nextjs.git`），然后运行：

   ```bash
   cd /Users/everglow/Desktop/tmp
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git push -u origin main
   ```

### 方法二：使用 GitHub CLI（如果已安装）

```bash
# 安装 GitHub CLI（如果还没有）
# brew install gh

# 登录 GitHub
gh auth login

# 创建仓库并推送
cd /Users/everglow/Desktop/tmp
gh repo create chatgpt-clone-nextjs --public --source=. --remote=origin --push
```

## 🔐 推送代码到 GitHub

创建仓库后，运行以下命令推送代码：

```bash
cd /Users/everglow/Desktop/tmp

# 添加远程仓库（替换为你的实际仓库 URL）
git remote add origin https://github.com/yourusername/your-repo-name.git

# 推送到 GitHub
git push -u origin main
```

如果遇到认证问题，可能需要：
- 使用 Personal Access Token（而不是密码）
- 或者配置 SSH 密钥

## ⚠️ 重要提示

1. **仓库必须是公开的**（Public）
   - AI Builders 部署服务只支持公开仓库

2. **不要提交敏感信息**
   - `.env.local` 已在 `.gitignore` 中，不会被提交
   - 确保没有硬编码 API keys 或 tokens

3. **检查已提交的文件**
   ```bash
   git ls-files
   ```

## 🚀 推送完成后

推送成功后，你就可以使用 AI Builders 部署了：

```bash
export AI_BUILDER_TOKEN=sk_25972356_acc017a659a5012fa6101693bc25f94f2aa7
./deploy-ai-builders.sh
```

或者直接使用：

```bash
export AI_BUILDER_TOKEN=sk_25972356_acc017a659a5012fa6101693bc25f94f2aa7

node deploy-ai-builders.js \
  https://github.com/yourusername/your-repo-name \
  chatgpt-clone-nextjs \
  main \
  3000
```

## 📝 当前仓库状态

- **分支**: `main`
- **提交数**: 1
- **文件数**: 23
- **代码行数**: 7597+

## 🔍 验证设置

运行以下命令检查 Git 配置：

```bash
# 查看远程仓库配置
git remote -v

# 查看提交历史
git log --oneline

# 查看当前状态
git status
```
