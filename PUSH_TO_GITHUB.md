# 推送到 GitHub 指南

## 🔐 身份验证方法

GitHub 已不再支持密码认证，需要使用以下方式之一：

### 方法一：使用 Personal Access Token（推荐）

1. **创建 Personal Access Token**
   - 访问：https://github.com/settings/tokens
   - 点击 "Generate new token" → "Generate new token (classic)"
   - 设置名称：`chatgpt-clone-deploy`
   - 选择权限：至少勾选 `repo`（完整仓库访问权限）
   - 点击 "Generate token"
   - **重要**：复制生成的 token（只显示一次）

2. **使用 Token 推送**
   
   运行以下命令，当提示输入密码时，粘贴你的 Personal Access Token：

   ```bash
   cd /Users/everglow/Desktop/tmp
   git push -u origin main
   ```
   
   或者直接在 URL 中包含 token（临时方法）：
   
   ```bash
   git remote set-url origin https://YOUR_TOKEN@github.com/Wangk-1019/test.git
   git push -u origin main
   ```

### 方法二：使用 SSH 密钥（更安全）

1. **检查是否已有 SSH 密钥**
   ```bash
   ls -al ~/.ssh
   ```

2. **如果没有，生成新的 SSH 密钥**
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   # 按 Enter 使用默认路径
   # 可以设置密码或直接按 Enter
   ```

3. **复制公钥**
   ```bash
   cat ~/.ssh/id_ed25519.pub
   # 复制输出的内容
   ```

4. **添加到 GitHub**
   - 访问：https://github.com/settings/keys
   - 点击 "New SSH key"
   - 粘贴公钥内容
   - 点击 "Add SSH key"

5. **更改远程 URL 为 SSH**
   ```bash
   cd /Users/everglow/Desktop/tmp
   git remote set-url origin git@github.com:Wangk-1019/test.git
   git push -u origin main
   ```

### 方法三：使用 GitHub CLI

```bash
# 安装 GitHub CLI
brew install gh

# 登录
gh auth login

# 推送
git push -u origin main
```

## 🚀 快速推送（使用 Token）

如果你已经有 Personal Access Token，可以直接运行：

```bash
cd /Users/everglow/Desktop/tmp

# 方法 A：交互式输入 token
git push -u origin main
# 用户名：Wangk-1019
# 密码：粘贴你的 Personal Access Token

# 方法 B：在 URL 中包含 token（临时）
git remote set-url origin https://YOUR_TOKEN@github.com/Wangk-1019/test.git
git push -u origin main
```

## ✅ 推送成功后

推送成功后，你就可以使用 AI Builders 部署了：

```bash
export AI_BUILDER_TOKEN=sk_25972356_acc017a659a5012fa6101693bc25f94f2aa7
./deploy-ai-builders.sh
```

或者直接：

```bash
export AI_BUILDER_TOKEN=sk_25972356_acc017a659a5012fa6101693bc25f94f2aa7

node deploy-ai-builders.js \
  https://github.com/Wangk-1019/test \
  chatgpt-clone-nextjs \
  main \
  3000
```

## 🔍 验证推送

推送成功后，访问以下 URL 查看代码：
https://github.com/Wangk-1019/test
