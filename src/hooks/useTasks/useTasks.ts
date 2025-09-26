import { useState, useEffect, useCallback } from 'react'
import { taskService } from '@/services'
import { TaskPriorityType, TaskStatusType } from '@/schemas/task.schema'

export type Task = {
  id: string
  title: string
  description: string
  priority: TaskPriorityType
  status: TaskStatusType
  completed?: boolean
}

export type Feedback = {
  type: 'success' | 'error'
  text: string
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<Feedback>()

  const loadTasks = useCallback(async (pageNum: number = 1) => {
    setLoading(true)
    try {
      const result = await taskService.getTasks(pageNum)
      if (result.ok) {
        const items = result.data.items.map((t: any) => ({
          id: t.id,
          title: t.title,
          description: t.description,
          priority: t.priority,
          status: t.status,
          completed: t.status === 'COMPLETED'
        }))
        setTasks((prev) => (pageNum === 1 ? items : [...prev, ...items]))
        setHasMore(items.length > 0)
      } else {
        const responseData = result.error.response?.data as unknown as { message?: string } | undefined
        setFeedback({ type: 'error', text: responseData?.message || 'Falha ao carregar tarefas.' })
      }
    } catch (err) {
      setFeedback({ type: 'error', text: 'Erro inesperado ao carregar tarefas.' })
    } finally {
      setLoading(false)
    }
  }, [])

  const appendTaskToList = useCallback((created: any) => {
    const normalized: Task = {
      id: created.id,
      title: created.title,
      description: created.description,
      priority: created.priority,
      status: created.status,
      completed: created.status === 'COMPLETED',
    }
    setTasks((prev) => [normalized, ...prev])
    return normalized
  }, [])

  const addTask = useCallback(async (taskData: {
    title: string
    description: string
    priority: TaskPriorityType
    status: TaskStatusType
  }) => {
    setLoading(true)
    setFeedback(undefined)
    try {
      const result = await taskService.createTask(taskData)
      if (result.ok) {
        const created = result.data.task
        appendTaskToList(created)
        setFeedback({ type: 'success', text: 'Tarefa criada com sucesso.' })
        return { success: true }
      } else {
        const responseData = result.error.response?.data as unknown as { message?: string } | undefined
        setFeedback({ type: 'error', text: responseData?.message || 'Falha ao criar a tarefa.' })
        return { success: false }
      }
    } catch (err) {
      setFeedback({ type: 'error', text: 'Erro inesperado ao criar a tarefa.' })
      return { success: false }
    } finally {
      setLoading(false)
    }
  }, [appendTaskToList])

  const updateTask = useCallback(async (id: string, taskData: {
    title: string
    description: string
    priority: TaskPriorityType
    status: TaskStatusType
  }) => {
    setLoading(true)
    setFeedback(undefined)
    try {
      const result = await taskService.updateTask(id, taskData)
      if (result.ok) {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === id
              ? {
                ...t,
                ...taskData,
                completed: taskData.status === 'COMPLETED'
              }
              : t
          )
        )
        setFeedback({ type: 'success', text: 'Tarefa atualizada com sucesso.' })
        return { success: true }
      } else {
        const responseData = result.error.response?.data as unknown as { message?: string } | undefined
        setFeedback({ type: 'error', text: responseData?.message || 'Falha ao atualizar a tarefa.' })
        return { success: false }
      }
    } catch (err) {
      setFeedback({ type: 'error', text: 'Erro inesperado ao atualizar a tarefa.' })
      return { success: false }
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteTask = useCallback(async (id: string) => {
    const current = tasks
    setTasks((prev) => prev.filter((t) => t.id !== id))
    try {
      const result = await taskService.deleteTask(id)
      if (!result.ok) {
        // rollback on failure
        setTasks(current)
        const responseData = result.error.response?.data as unknown as { message?: string } | undefined
        setFeedback({ type: 'error', text: responseData?.message || 'Falha ao excluir a tarefa.' })
        return { success: false }
      }
      return { success: true }
    } catch (err) {
      setTasks(current)
      setFeedback({ type: 'error', text: 'Erro inesperado ao excluir a tarefa.' })
      return { success: false }
    }
  }, [tasks])


  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      const nextPage = page + 1
      setPage(nextPage)
      loadTasks(nextPage)
    }
  }, [hasMore, loading, page, loadTasks])

  useEffect(() => {
    loadTasks(1)
  }, [loadTasks])

  return {
    tasks,
    loading,
    hasMore,
    feedback,
    setFeedback,
    addTask,
    updateTask,
    deleteTask,
    loadMore,
    appendTaskToList
  }
}
