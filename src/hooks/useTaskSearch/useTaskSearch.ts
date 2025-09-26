import { useState, useCallback } from 'react'
import { taskService } from '@/services'
import { Task } from '@/hooks/useTasks'
import { TaskPriorityType } from '@/schemas/task.schema'

export function useTaskSearch() {
  const [searchResults, setSearchResults] = useState<Task[]>()
  const [searching, setSearching] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string }>()

  const searchTasks = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults(undefined)
      return
    }

    setSearching(true)
    setFeedback(undefined)
    setSearchResults(undefined)

    try {
      const result = await taskService.semanticSearch(query)
      if (result.ok) {
        const items: Task[] = result.data.tasks
          .filter((taskItem) => taskItem) // Filter out null/undefined items
          .map((taskItem) => {
            // Handle both possible structures: { task: {...} } or direct task object
            const task = taskItem.task || taskItem
            if (!task || !task.id) {
              console.warn('Invalid task item:', taskItem)
              return null
            }
            return {
              id: task.id,
              title: task.title,
              description: task.description,
              priority: task.priority as TaskPriorityType,
              status: task.status,
              completed: task.status === 'COMPLETED'
            }
          })
          .filter((item): item is NonNullable<typeof item> => item !== null) // Remove null items

        setSearchResults(items)
      } else {
        const responseData = result.error.response?.data as unknown as { message?: string } | undefined
        setFeedback({ type: 'error', text: responseData?.message || 'Falha na busca.' })
      }
    } catch (err) {
      setFeedback({ type: 'error', text: 'Erro inesperado na busca.' })
    } finally {
      setSearching(false)
    }
  }, [])

  const clearSearch = useCallback(() => {
    setSearchResults(undefined)
    setFeedback(undefined)
  }, [])

  return {
    searchResults,
    searching,
    feedback,
    setFeedback,
    searchTasks,
    clearSearch
  }
}
