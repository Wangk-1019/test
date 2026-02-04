#!/bin/bash

# 检查部署状态脚本

SERVICE_NAME=${1:-"chatgpt-clone-nextjs"}
AI_BUILDER_TOKEN=${AI_BUILDER_TOKEN:-"sk_25972356_acc017a659a5012fa6101693bc25f94f2aa7"}

echo "🔍 检查部署状态: $SERVICE_NAME"
echo ""

curl -s -H "Authorization: Bearer $AI_BUILDER_TOKEN" \
  https://space.ai-builders.com/backend/v1/deployments/$SERVICE_NAME | \
  python3 -m json.tool 2>/dev/null || \
  curl -s -H "Authorization: Bearer $AI_BUILDER_TOKEN" \
  https://space.ai-builders.com/backend/v1/deployments/$SERVICE_NAME

echo ""
echo ""
echo "📋 查看日志:"
echo "curl -H \"Authorization: Bearer \$AI_BUILDER_TOKEN\" \\"
echo "  \"https://space.ai-builders.com/backend/v1/deployments/$SERVICE_NAME/logs?log_type=runtime\""
