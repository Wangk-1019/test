'use client'

import { useState } from 'react'
import styles from './ModelSelector.module.css'

export interface Model {
  id: string
  name: string
  description: string
}

export const AVAILABLE_MODELS: Model[] = [
  {
    id: 'grok-4-fast',
    name: 'Grok-4-Fast',
    description: 'X.AI 的快速 Grok 模型',
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    description: '快速且经济高效的聊天模型',
  },
  {
    id: 'supermind-agent-v1',
    name: 'Supermind Agent',
    description: '多工具代理，支持网络搜索和 Gemini 切换',
  },
  {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    description: 'Google 的 Gemini 模型直接访问',
  },
  {
    id: 'gemini-3-flash-preview',
    name: 'Gemini 3 Flash',
    description: '快速的 Gemini 推理模型',
  },
  {
    id: 'gpt-5',
    name: 'GPT-5',
    description: 'OpenAI 兼容提供商',
  },
]

interface ModelSelectorProps {
  selectedModel: string
  onModelChange: (modelId: string) => void
}

export default function ModelSelector({
  selectedModel,
  onModelChange,
}: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedModelData = AVAILABLE_MODELS.find((m) => m.id === selectedModel)

  return (
    <div className={styles.modelSelector}>
      <button
        className={styles.selectorButton}
        onClick={() => setIsOpen(!isOpen)}
        title="选择模型"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 2L10.5 6.5L15.5 7.5L12 11L12.5 16L8 13.5L3.5 16L4 11L0.5 7.5L5.5 6.5L8 2Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
        <span className={styles.modelName}>
          {selectedModelData?.name || selectedModel}
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${styles.chevron} ${isOpen ? styles.open : ''}`}
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className={styles.overlay}
            onClick={() => setIsOpen(false)}
          />
          <div className={styles.dropdown}>
            <div className={styles.dropdownHeader}>
              <span>选择模型</span>
            </div>
            <div className={styles.modelList}>
              {AVAILABLE_MODELS.map((model) => (
                <button
                  key={model.id}
                  className={`${styles.modelOption} ${
                    selectedModel === model.id ? styles.selected : ''
                  }`}
                  onClick={() => {
                    onModelChange(model.id)
                    setIsOpen(false)
                  }}
                >
                  <div className={styles.modelOptionContent}>
                    <div className={styles.modelOptionName}>{model.name}</div>
                    <div className={styles.modelOptionDesc}>
                      {model.description}
                    </div>
                  </div>
                  {selectedModel === model.id && (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={styles.checkIcon}
                    >
                      <path
                        d="M13 4L6 11L3 8"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
