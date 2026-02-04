# 部署状态

## 🚀 部署信息

- **服务名**: `chatgpt-clone-nextjs`
- **仓库**: https://github.com/Wangk-1019/test
- **分支**: `main`
- **端口**: `3000`
- **公共 URL**: https://chatgpt-clone-nextjs.ai-builders.space/

## ⏳ 当前状态

部署已重新排队，正在构建中...

## 📋 检查部署状态

### 方法一：使用脚本

```bash
./check-deployment.sh
```

### 方法二：使用 curl

```bash
curl -H "Authorization: Bearer sk_25972356_acc017a659a5012fa6101693bc25f94f2aa7" \
  https://space.ai-builders.com/backend/v1/deployments/chatgpt-clone-nextjs
```

### 方法三：查看日志

```bash
# 构建日志
curl -H "Authorization: Bearer sk_25972356_acc017a659a5012fa6101693bc25f94f2aa7" \
  "https://space.ai-builders.com/backend/v1/deployments/chatgpt-clone-nextjs/logs?log_type=build&timeout=60"

# 运行时日志
curl -H "Authorization: Bearer sk_25972356_acc017a659a5012fa6101693bc25f94f2aa7" \
  "https://space.ai-builders.com/backend/v1/deployments/chatgpt-clone-nextjs/logs?log_type=runtime&timeout=60"
```

## ⏰ 预计时间

- 部署通常需要 **5-10 分钟** 完成
- 请耐心等待构建和部署过程

## ✅ 部署成功后的步骤

1. 访问应用: https://chatgpt-clone-nextjs.ai-builders.space/
2. 测试聊天功能
3. 检查模型选择功能

## 🔧 如果部署失败

1. 查看构建日志找出错误原因
2. 检查 Dockerfile 配置
3. 确认 Next.js standalone 输出是否正确
4. 重新推送修复后的代码并重新部署

## 📝 部署配置

- ✅ Next.js standalone 模式已启用
- ✅ Dockerfile 已配置
- ✅ 环境变量已设置
- ✅ PORT 环境变量支持
