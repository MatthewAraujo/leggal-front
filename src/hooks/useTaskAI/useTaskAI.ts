import { useState, useCallback } from 'react'
import { taskService } from '@/services'
import { TaskPriorityType } from '@/schemas/task.schema'

export function useTaskAI() {
  const [generatingPriority, setGeneratingPriority] = useState(false)
  const [generatingTask, setGeneratingTask] = useState(false)
  const [aiReason, setAiReason] = useState<string>()
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string }>()

  const suggestPriority = useCallback(async (title: string, description: string) => {
    setGeneratingPriority(true)
    setAiReason(undefined)
    setFeedback(undefined)

    try {
      const payload = { title: title.trim(), description: description.trim() }
      if (!payload.title || !payload.description) {
        setFeedback({ type: 'error', text: 'Preencha título e descrição para gerar prioridade.' })
        return { success: false }
      }

      const result = await taskService.suggestPriority(payload)
      if (result.ok) {
        setAiReason(result.data.reason)
        return { success: true, priority: result.data.priority as TaskPriorityType }
      } else {
        const responseData = result.error.response?.data as unknown as { message?: string } | undefined
        setFeedback({ type: 'error', text: responseData?.message || 'Falha ao sugerir prioridade.' })
        return { success: false }
      }
    } catch (err) {
      setFeedback({ type: 'error', text: 'Erro inesperado ao sugerir prioridade.' })
      return { success: false }
    } finally {
      setGeneratingPriority(false)
    }
  }, [])

  const generateTask = useCallback(async (description: string) => {
    setGeneratingTask(true)
    setFeedback(undefined)

    try {
      const payload = { text: description.trim() }
      if (!payload.text) {
        setFeedback({ type: 'error', text: 'Preencha a descrição para gerar uma tarefa com IA.' })
        return { success: false }
      }

      const result = await taskService.generateTask(payload)
      if (result.ok) {
        const task = result.data.task
        setFeedback({ type: 'success', text: 'Tarefa gerada com sucesso!' })
        return { success: true, task }
      } else {
        const responseData = result.error.response?.data as unknown as { message?: string } | undefined
        setFeedback({ type: 'error', text: responseData?.message || 'Falha ao gerar tarefa com IA.' })
        return { success: false }
      }
    } catch (err) {
      setFeedback({ type: 'error', text: 'Erro inesperado ao gerar tarefa.' })
      return { success: false }
    } finally {
      setGeneratingTask(false)
    }
  }, [])

  return {
    generatingPriority,
    generatingTask,
    aiReason,
    feedback,
    setFeedback,
    suggestPriority,
    generateTask
  }
}
