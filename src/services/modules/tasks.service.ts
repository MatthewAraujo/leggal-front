import { AxiosError } from 'axios'
import { api } from '@/services'

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH'
export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'

export type CreateTaskPayload = {
  title: string
  description: string
  priority: TaskPriority
  status: TaskStatus
}

export type Task = {
  task: {
    id: string
    title: string
    description: string
    priority: TaskPriority
    status: TaskStatus
    createdAt?: string
  }
}

export class TaskService {
  async createTask(payload: CreateTaskPayload) {
    try {
      const { data } = await api.post<Task>('/tasks', payload)
      return { ok: true, data } as const
    } catch (error) {
      return { ok: false, error: error as AxiosError } as const
    }
  }

  async getTasks(page = 1) {
    try {
      const { data } = await api.get<{ items?: Task[]; data?: Task[]; tasks?: Task[]; total?: number }>(
        '/tasks',
        { params: { page } }
      )
      const items = (data as any)?.items ?? (data as any)?.data ?? (data as any)?.tasks ?? []
      const total = (data as any)?.total ?? items.length
      return { ok: true, data: { items, total } } as const
    } catch (error) {
      return { ok: false, error: error as AxiosError } as const
    }
  }

  async deleteTask(id: string) {
    try {
      await api.delete(`/tasks/${id}`)
      return { ok: true } as const
    } catch (error) {
      return { ok: false, error: error as AxiosError } as const
    }
  }
}

export const taskService = new TaskService()
