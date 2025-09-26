import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateTaskSchema, CreateTaskInput, TaskPriorityType, TaskStatusType } from '@/schemas/task.schema'
import { Button } from '@/components/ui/button'

interface TaskFormProps {
  onSubmit: (data: CreateTaskInput) => Promise<void>
  onSuggestPriority: (title: string, description: string) => Promise<{ success: boolean; priority?: string }>
  onGenerateTask: (description: string) => Promise<void>
  generatingPriority: boolean
  generatingTask: boolean
  aiReason?: string
  submitting: boolean
}

export function TaskForm({
  onSubmit,
  onSuggestPriority,
  onGenerateTask,
  generatingPriority,
  generatingTask,
  aiReason,
  submitting
}: TaskFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<CreateTaskInput>({
    resolver: zodResolver(CreateTaskSchema) as any,
    defaultValues: {
      title: '',
      description: '',
      priority: 'HIGH',
      status: 'PENDING'
    }
  })

  const watchedTitle = watch('title')
  const watchedDescription = watch('description')

  const handleFormSubmit = async (data: CreateTaskInput) => {
    await onSubmit(data)
    // Reset form after successful submission
    setValue('title', '')
    setValue('description', '')
    setValue('priority', 'HIGH')
    setValue('status', 'PENDING')
  }

  const handleSuggestPriority = async () => {
    if (watchedTitle && watchedDescription) {
      const result = await onSuggestPriority(watchedTitle, watchedDescription)
      if (result.success && result.priority) {
        setValue('priority', result.priority as TaskPriorityType)
      }
    }
  }

  const handleGenerateTask = async () => {
    if (watchedDescription) {
      await onGenerateTask(watchedDescription)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div className="sm:col-span-2">
        <label htmlFor="title" className="block text-sm font-medium mb-1">Título</label>
        <input
          id="title"
          {...register('title')}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="Digite o título da task"
        />
        {errors.title && (
          <p className="mt-1 text-xs text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="description" className="block text-sm font-medium mb-1">Descrição</label>
        <textarea
          id="description"
          {...register('description')}
          className="min-h-24 w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="Descreva a task"
        />
        {errors.description && (
          <p className="mt-1 text-xs text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="sm:col-span-2 flex items-center justify-between rounded-md border p-3">
        <div>
          <p className="text-sm font-medium">Gerar prioridade da tarefa com IA</p>
          <p className="text-xs text-muted-foreground">Preencha título e descrição para habilitar.</p>
        </div>
        <Button
          type="button"
          onClick={handleSuggestPriority}
          disabled={generatingPriority || !watchedTitle?.trim() || !watchedDescription?.trim()}
          variant="outline"
          size="sm"
        >
          {generatingPriority ? 'Gerando...' : 'Gerar prioridade'}
        </Button>
      </div>

      {aiReason && (
        <div className="sm:col-span-2 text-xs text-muted-foreground">{aiReason}</div>
      )}

      <div className="sm:col-span-2 flex items-center justify-between rounded-md border p-3">
        <div>
          <p className="text-sm font-medium">Gerar tarefa com IA</p>
          <p className="text-xs text-muted-foreground">Preencha a descrição para habilitar.</p>
        </div>
        <Button
          type="button"
          onClick={handleGenerateTask}
          disabled={generatingTask || !watchedDescription?.trim()}
          variant="outline"
          size="sm"
        >
          {generatingTask ? 'Gerando...' : 'Gerar tarefa'}
        </Button>
      </div>

      <div>
        <label htmlFor="priority" className="block text-sm font-medium mb-1">Prioridade</label>
        <select
          id="priority"
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
        <label htmlFor="status" className="block text-sm font-medium mb-1">Status</label>
        <select
          id="status"
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

      <div className="sm:col-span-2">
        <Button
          type="submit"
          disabled={submitting}
          className="w-full"
        >
          {submitting ? 'Adicionando...' : 'Adicionar Task'}
        </Button>
      </div>
    </form>
  )
}
