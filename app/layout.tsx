import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ChatGPT Clone - Grok Chat',
  description: '基于 Grok-4-Fast 的聊天应用',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
