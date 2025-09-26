import React from 'react'

interface FeedbackProps {
  type: 'success' | 'error'
  text: string
  className?: string
}

export function Feedback({ type, text, className = '' }: FeedbackProps) {
  if (!text) return null

  return (
    <div
      className={`text-sm rounded-md border px-3 py-2 ${type === 'error'
          ? 'border-destructive/40 text-destructive bg-destructive/5'
          : 'border-green-500/40 text-green-700 bg-green-500/5'
        } ${className}`}
    >
      {text}
    </div>
  )
}
