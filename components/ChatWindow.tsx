'use client'

import { useState, useRef, useEffect } from 'react'
import styles from './ChatWindow.module.css'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatWindowProps {
  messages: Message[]
  isLoading: boolean
  currentModel: string
  onSendMessage: (message: string) => void
}

// 获取模型显示名称
function getModelDisplayName(modelId: string): string {
  const modelMap: Record<string, string> = {
    'grok-4-fast': 'Grok-4-Fast',
    'deepseek': 'DeepSeek',
    'supermind-agent-v1': 'Supermind Agent',
    'gemini-2.5-pro': 'Gemini 2.5 Pro',
    'gemini-3-flash-preview': 'Gemini 3 Flash',
    'gpt-5': 'GPT-5',
  }
  return modelMap[modelId] || modelId
}

export default function ChatWindow({
  messages,
  isLoading,
  currentModel,
  onSendMessage,
}: ChatWindowProps) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [input])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim())
      setInput('')
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className={styles.chatWindow}>
      <div className={styles.messagesContainer}>
        {messages.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 className={styles.emptyTitle}>开始新的对话</h2>
            <p className={styles.emptyText}>
              使用 {getModelDisplayName(currentModel)} 模型进行对话
            </p>
          </div>
        ) : (
          <div className={styles.messages}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`${styles.message} ${
                  message.role === 'user' ? styles.userMessage : styles.assistantMessage
                }`}
              >
                <div className={styles.messageContent}>
                  <div className={styles.messageRole}>
                    {message.role === 'user' ? '你' : getModelDisplayName(currentModel)}
                  </div>
                  <div className={styles.messageText}>
                    {message.content.split('\n').map((line, i) => (
                      <span key={i}>
                        {line}
                        {i < message.content.split('\n').length - 1 && <br />}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className={`${styles.message} ${styles.assistantMessage}`}>
                <div className={styles.messageContent}>
                  <div className={styles.messageRole}>{getModelDisplayName(currentModel)}</div>
                  <div className={styles.loading}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className={styles.inputContainer}>
        <form onSubmit={handleSubmit} className={styles.inputForm}>
          <div className={styles.inputWrapper}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入消息... (Shift+Enter 换行)"
              className={styles.textarea}
              rows={1}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={styles.sendButton}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 2L9 11M18 2L12 18L9 11M18 2L2 8L9 11"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </form>
        <div className={styles.inputFooter}>
          <p className={styles.footerText}>
            {getModelDisplayName(currentModel)} 可能会产生不准确的信息
          </p>
        </div>
      </div>
    </div>
  )
}
