#!/usr/bin/env node

/**
 * AI Builders 部署脚本
 * 使用 AI Builders Space API 自动部署到 Koyeb
 */

const https = require('https');

const AI_BUILDER_BASE_URL = process.env.AI_BUILDER_BASE_URL || 'https://space.ai-builders.com/backend';
const AI_BUILDER_TOKEN = process.env.AI_BUILDER_TOKEN;

// 从命令行参数获取配置
const args = process.argv.slice(2);
const repoUrl = args[0] || process.env.REPO_URL;
const serviceName = args[1] || process.env.SERVICE_NAME || 'chatgpt-clone-nextjs';
const branch = args[2] || process.env.BRANCH || 'main';
const port = parseInt(args[3] || process.env.PORT || '3000');

if (!AI_BUILDER_TOKEN) {
  console.error('❌ 错误: AI_BUILDER_TOKEN 环境变量未设置');
  console.log('请设置环境变量: export AI_BUILDER_TOKEN=your_token');
  process.exit(1);
}

if (!repoUrl) {
  console.error('❌ 错误: 需要提供 GitHub 仓库 URL');
  console.log('使用方法: node deploy-ai-builders.js <repo_url> [service_name] [branch] [port]');
  console.log('示例: node deploy-ai-builders.js https://github.com/username/repo my-app main 3000');
  process.exit(1);
}

// 准备部署请求
const deploymentData = {
  repo_url: repoUrl,
  service_name: serviceName,
  branch: branch,
  port: port,
  env_vars: {
    AI_BUILDER_BASE_URL: 'https://space.ai-builders.com/backend',
    NODE_ENV: 'production',
    PORT: port.toString()
  },
  streaming_log_timeout_seconds: 120
};

const postData = JSON.stringify(deploymentData);

const url = new URL(`${AI_BUILDER_BASE_URL}/v1/deployments`);
const options = {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${AI_BUILDER_TOKEN}`,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('🚀 开始部署到 AI Builders...');
console.log(`📦 仓库: ${repoUrl}`);
console.log(`🏷️  服务名: ${serviceName}`);
console.log(`🌿 分支: ${branch}`);
console.log(`🔌 端口: ${port}`);
console.log('');

const req = https.request(url, options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    if (res.statusCode === 202) {
      const response = JSON.parse(data);
      console.log('✅ 部署已排队！');
      console.log('');
      console.log('📋 部署信息:');
      console.log(`   服务名: ${response.service_name}`);
      console.log(`   状态: ${response.status}`);
      if (response.url) {
        console.log(`   URL: ${response.url}`);
      }
      if (response.deployment_prompt_url) {
        console.log(`   部署提示: ${response.deployment_prompt_url}`);
      }
      console.log('');
      console.log('⏳ 部署通常需要 5-10 分钟完成');
      console.log('💡 提示: 使用以下命令查看部署状态:');
      console.log(`   curl -H "Authorization: Bearer ${AI_BUILDER_TOKEN}" ${AI_BUILDER_BASE_URL}/v1/deployments/${serviceName}`);
    } else {
      console.error(`❌ 部署失败: ${res.statusCode}`);
      console.error('响应:', data);
      try {
        const error = JSON.parse(data);
        if (error.detail) {
          console.error('详情:', error.detail);
        }
      } catch (e) {
        console.error('原始响应:', data);
      }
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ 请求错误:', error.message);
  process.exit(1);
});

req.write(postData);
req.end();
