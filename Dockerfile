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

# 设置构建时环境变量（如果需要）
ARG AI_BUILDER_TOKEN
ARG AI_BUILDER_BASE_URL
ENV AI_BUILDER_TOKEN=$AI_BUILDER_TOKEN
ENV AI_BUILDER_BASE_URL=${AI_BUILDER_BASE_URL:-https://space.ai-builders.com/backend}

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 复制必要的文件
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

# PORT 将由 Koyeb 设置，不要硬编码
ENV HOSTNAME="0.0.0.0"

# 运行时环境变量（AI_BUILDER_TOKEN 会自动注入）
ENV AI_BUILDER_BASE_URL="https://space.ai-builders.com/backend"

# 使用 PORT 环境变量（Koyeb 会自动设置）
CMD ["node", "server.js"]
