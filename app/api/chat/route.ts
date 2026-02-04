import { NextRequest, NextResponse } from 'next/server'

const AI_BUILDER_BASE_URL = process.env.AI_BUILDER_BASE_URL || 'https://space.ai-builders.com/backend'
const AI_BUILDER_TOKEN = process.env.AI_BUILDER_TOKEN

export async function POST(request: NextRequest) {
  try {
    const { messages, model = 'grok-4-fast' } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: '消息格式错误，需要 messages 数组' },
        { status: 400 }
      )
    }

    // 验证模型名称
    const validModels = [
      'deepseek',
      'supermind-agent-v1',
      'gemini-2.5-pro',
      'gemini-3-flash-preview',
      'gpt-5',
      'grok-4-fast'
    ]
    
    if (!validModels.includes(model)) {
      return NextResponse.json(
        { error: `不支持的模型: ${model}` },
        { status: 400 }
      )
    }

    if (!AI_BUILDER_TOKEN) {
      return NextResponse.json(
        { error: 'AI_BUILDER_TOKEN 未配置' },
        { status: 500 }
      )
    }

    const apiUrl = `${AI_BUILDER_BASE_URL}/v1/chat/completions`
    
    const requestBody = {
      model: model,
      messages: messages,
      temperature: 0.7,
      max_tokens: 2000,
      stream: false
    }

    // 创建 AbortController 用于超时控制（240秒超时）
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 240000) // 240秒超时（4分钟）

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AI_BUILDER_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('API 错误:', response.status, errorText)
        return NextResponse.json(
          { error: `API 请求失败: ${response.status}`, details: errorText },
          { status: response.status }
        )
      }

      const data = await response.json()
      
      return NextResponse.json({
        content: data.choices[0]?.message?.content || '无响应内容',
        model: data.model,
        usage: data.usage,
      })
    } catch (fetchError: any) {
      clearTimeout(timeoutId)
      
      // 处理超时错误
      if (fetchError.name === 'AbortError' || fetchError.code === 'UND_ERR_CONNECT_TIMEOUT') {
        console.error('请求超时:', fetchError)
        return NextResponse.json(
          { 
            error: '请求超时',
            details: '连接服务器超时，请检查网络连接或稍后重试。如果问题持续，可能是服务器暂时不可用。',
            code: 'TIMEOUT'
          },
          { status: 504 }
        )
      }
      
      // 处理其他网络错误
      if (fetchError.message?.includes('fetch failed') || fetchError.code === 'UND_ERR_CONNECT_TIMEOUT') {
        console.error('网络连接错误:', fetchError)
        return NextResponse.json(
          { 
            error: '网络连接失败',
            details: '无法连接到服务器。请检查：\n1. 网络连接是否正常\n2. 防火墙设置\n3. 服务器是否可访问\n4. DNS 解析是否正常',
            code: 'NETWORK_ERROR'
          },
          { status: 503 }
        )
      }
      
      throw fetchError
    }
  } catch (error: any) {
    console.error('聊天 API 错误:', error)
    return NextResponse.json(
      { 
        error: '服务器错误', 
        details: error.message || '未知错误，请稍后重试',
        code: 'SERVER_ERROR'
      },
      { status: 500 }
    )
  }
}
