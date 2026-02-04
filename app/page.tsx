'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import ChatWindow from '@/components/ChatWindow'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface Chat {
  id: string
  title: string
  messages: Message[]
  model: string
  createdAt: Date
}

export default function Home() {
  const [chats, setChats] = useState<Chat[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [currentMessages, setCurrentMessages] = useState<Message[]>([])
  const [currentModel, setCurrentModel] = useState<string>('grok-4-fast')
  const [isLoading, setIsLoading] = useState(false)

  // 从 localStorage 加载聊天记录
  useEffect(() => {
    const savedChats = localStorage.getItem('chats')
    if (savedChats) {
      const parsedChats = JSON.parse(savedChats).map((chat: any) => ({
        ...chat,
        model: chat.model || 'grok-4-fast', // 兼容旧数据
        createdAt: new Date(chat.createdAt),
      }))
      setChats(parsedChats)
      
      // 如果有保存的当前聊天 ID，恢复它
      const savedCurrentChatId = localStorage.getItem('currentChatId')
      if (savedCurrentChatId && parsedChats.find((c: Chat) => c.id === savedCurrentChatId)) {
        setCurrentChatId(savedCurrentChatId)
        const chat = parsedChats.find((c: Chat) => c.id === savedCurrentChatId)
        setCurrentMessages(chat.messages || [])
        setCurrentModel(chat.model || 'grok-4-fast')
      } else if (parsedChats.length > 0) {
        // 如果没有保存的当前聊天，使用第一个聊天的模型
        setCurrentModel(parsedChats[0].model || 'grok-4-fast')
      }
    }
    
    // 加载默认模型设置
    const savedModel = localStorage.getItem('defaultModel')
    if (savedModel) {
      setCurrentModel(savedModel)
    }
  }, [])

  // 保存聊天记录到 localStorage
  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem('chats', JSON.stringify(chats))
    }
  }, [chats])

  // 保存当前聊天 ID
  useEffect(() => {
    if (currentChatId) {
      localStorage.setItem('currentChatId', currentChatId)
    } else {
      localStorage.removeItem('currentChatId')
    }
  }, [currentChatId])

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: '新对话',
      messages: [],
      model: currentModel,
      createdAt: new Date(),
    }
    setChats([newChat, ...chats])
    setCurrentChatId(newChat.id)
    setCurrentMessages([])
  }

  const selectChat = (chatId: string) => {
    const chat = chats.find((c) => c.id === chatId)
    if (chat) {
      setCurrentChatId(chatId)
      setCurrentMessages(chat.messages)
      setCurrentModel(chat.model || 'grok-4-fast')
    }
  }
  
  const handleModelChange = (modelId: string) => {
    setCurrentModel(modelId)
    localStorage.setItem('defaultModel', modelId)
    
    // 如果当前有选中的聊天，更新该聊天的模型
    if (currentChatId) {
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === currentChatId ? { ...chat, model: modelId } : chat
        )
      )
    }
  }

  const deleteChat = (chatId: string) => {
    const updatedChats = chats.filter((c) => c.id !== chatId)
    setChats(updatedChats)
    
    if (currentChatId === chatId) {
      if (updatedChats.length > 0) {
        setCurrentChatId(updatedChats[0].id)
        setCurrentMessages(updatedChats[0].messages)
        setCurrentModel(updatedChats[0].model || 'grok-4-fast')
      } else {
        setCurrentChatId(null)
        setCurrentMessages([])
      }
    }
  }

  const updateChatTitle = (chatId: string, firstMessage: string) => {
    const title = firstMessage.slice(0, 30) + (firstMessage.length > 30 ? '...' : '')
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === chatId ? { ...chat, title } : chat
      )
    )
  }

  const sendMessage = async (content: string) => {
    let chatId = currentChatId
    
    // 如果没有当前聊天，先创建一个
    if (!chatId) {
      const newChat: Chat = {
        id: Date.now().toString(),
        title: '新对话',
        messages: [],
        model: currentModel,
        createdAt: new Date(),
      }
      setChats([newChat, ...chats])
      setCurrentChatId(newChat.id)
      chatId = newChat.id
    }

    const userMessage: Message = { role: 'user', content }
    const newMessages = [...currentMessages, userMessage]
    setCurrentMessages(newMessages)
    setIsLoading(true)

    // 如果是第一条消息，更新标题
    if (currentMessages.length === 0) {
      updateChatTitle(chatId, content)
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          model: currentModel,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.details || errorData.error || `请求失败: ${response.status}`
        throw new Error(errorMessage)
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.details || data.error)
      }
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.content,
      }

      const updatedMessages = [...newMessages, assistantMessage]
      setCurrentMessages(updatedMessages)

      // 更新聊天记录
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === chatId
            ? { ...chat, messages: updatedMessages }
            : chat
        )
      )
    } catch (error: any) {
      console.error('发送消息失败:', error)
      let errorContent = '抱歉，发送消息时出现错误。请稍后重试。'
      
      if (error.message) {
        if (error.message.includes('超时') || error.message.includes('TIMEOUT')) {
          errorContent = '⏱️ 请求超时\n\n连接服务器超时，可能的原因：\n• 网络连接不稳定\n• 服务器响应较慢\n• 请求内容过长\n\n请检查网络连接后重试。'
        } else if (error.message.includes('网络') || error.message.includes('连接')) {
          errorContent = '🌐 网络连接失败\n\n无法连接到服务器，请检查：\n• 网络连接是否正常\n• 防火墙设置\n• 服务器是否可访问\n\n如果问题持续，请联系管理员。'
        } else {
          errorContent = `❌ 错误：${error.message}\n\n请稍后重试，或检查网络连接。`
        }
      }
      
      const errorMessage: Message = {
        role: 'assistant',
        content: errorContent,
      }
      setCurrentMessages([...newMessages, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar
        chats={chats}
        currentChatId={currentChatId}
        currentModel={currentModel}
        onSelectChat={selectChat}
        onNewChat={createNewChat}
        onDeleteChat={deleteChat}
        onModelChange={handleModelChange}
      />
      <ChatWindow
        messages={currentMessages}
        isLoading={isLoading}
        currentModel={currentModel}
        onSendMessage={sendMessage}
      />
    </div>
  )
}
