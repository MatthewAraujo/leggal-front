import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UpdateTaskSchema, UpdateTaskInput, TaskPriorityType, TaskStatusType } from '@/schemas/task.schema'
import { Button } from '@/components/ui/button'

interface EditTaskFormProps {
  task: {
    id: string
    title: string
    description: string
    priority: TaskPriorityType
    status: TaskStatusType
  }
  onSubmit: (data: UpdateTaskInput) => Promise<void>
  onCancel: () => void
  submitting: boolean
}

export function EditTaskForm({ task, onSubmit, onCancel, submitting }: EditTaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<UpdateTaskInput>({
    resolver: zodResolver(UpdateTaskSchema) as any,
    defaultValues: {
      title: task.title,
      description: task.description ?? '',
      priority: task.priority,
      status: task.status
    }
  })

  useEffect(() => {
    reset({
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status
    })
  }, [task, reset])

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="edit-title">Título</label>
        <input
          id="edit-title"
          {...register('title')}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        {errors.title && (
          <p className="mt-1 text-xs text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="edit-description">Descrição</label>
        <textarea
          id="edit-description"
          {...register('description')}
          className="min-h-24 w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        {errors.description && (
          <p className="mt-1 text-xs text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="edit-priority">Prioridade</label>
          <select
            id="edit-priority"
            {...register('priority')}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm"
          >
            <option value="LOW">Baixa</option>
            <option value="MEDIUM">Média</option>
            <option value="HIGH">Alta</option>
          </select>
          {errors.priority && (
            <p className="mt-1 text-xs text-destructive">{errors.priority.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="edit-status">Status</label>
          <select
            id="edit-status"
            {...register('status')}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm"
          >
            <option value="PENDING">Pendente</option>
            <option value="IN_PROGRESS">Em progresso</option>
            <option value="COMPLETED">Concluída</option>
          </select>
          {errors.status && (
            <p className="mt-1 text-xs text-destructive">{errors.status.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          onClick={onCancel}
          variant="outline"
          size="sm"
        >
          Cancelar
        </Button>
        <Button
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={submitting}
          size="sm"
        >
          {submitting ? 'Salvando...' : 'Salvar alterações'}
        </Button>
      </div>
    </div>
  )
}
