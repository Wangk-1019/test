'use client'

import { useState } from 'react'
import styles from './Sidebar.module.css'
import ModelSelector from './ModelSelector'

interface Chat {
  id: string
  title: string
  createdAt: Date
}

interface SidebarProps {
  chats: Chat[]
  currentChatId: string | null
  currentModel: string
  onSelectChat: (chatId: string) => void
  onNewChat: () => void
  onDeleteChat: (chatId: string) => void
  onModelChange: (modelId: string) => void
}

export default function Sidebar({
  chats,
  currentChatId,
  currentModel,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onModelChange,
}: SidebarProps) {
  const [hoveredChatId, setHoveredChatId] = useState<string | null>(null)

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <button className={styles.newChatButton} onClick={onNewChat}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 3V13M3 8H13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          新对话
        </button>
      </div>

      <div className={styles.chatList}>
        {chats.length === 0 ? (
          <div className={styles.emptyState}>
            <p>还没有对话记录</p>
            <p className={styles.emptyHint}>点击"新对话"开始聊天</p>
          </div>
        ) : (
          chats.map((chat) => (
            <div
              key={chat.id}
              className={`${styles.chatItem} ${
                currentChatId === chat.id ? styles.active : ''
              }`}
              onClick={() => onSelectChat(chat.id)}
              onMouseEnter={() => setHoveredChatId(chat.id)}
              onMouseLeave={() => setHoveredChatId(null)}
            >
              <div className={styles.chatContent}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={styles.chatIcon}
                >
                  <path
                    d="M2 3H14V13H2V3Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 5H14"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <span className={styles.chatTitle}>{chat.title}</span>
              </div>
              {hoveredChatId === chat.id && (
                <button
                  className={styles.deleteButton}
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteChat(chat.id)
                  }}
                  title="删除对话"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 4L12 12M12 4L4 12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              )}
            </div>
          ))
        )}
      </div>

      <div className={styles.sidebarFooter}>
        <div className={styles.footerInfo}>
          <ModelSelector
            selectedModel={currentModel}
            onModelChange={onModelChange}
          />
        </div>
      </div>
    </div>
  )
}
