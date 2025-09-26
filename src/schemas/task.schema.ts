import { z } from 'zod'

export const TaskPriority = z.enum(['LOW', 'MEDIUM', 'HIGH'])
export const TaskStatus = z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED'])

export const CreateTaskSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(100, 'Título deve ter no máximo 100 caracteres'),
  description: z.string().max(500, 'Descrição deve ter no máximo 500 caracteres').default(''),
  priority: TaskPriority.default('HIGH'),
  status: TaskStatus.default('PENDING')
})

export const UpdateTaskSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(100, 'Título deve ter no máximo 100 caracteres'),
  description: z.string().max(500, 'Descrição deve ter no máximo 500 caracteres').default(''),
  priority: TaskPriority,
  status: TaskStatus
})

export const SuggestPrioritySchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória')
})

export const GenerateTaskSchema = z.object({
  text: z.string().min(1, 'Descrição é obrigatória para gerar tarefa')
})

export const SearchTaskSchema = z.object({
  query: z.string().min(1, 'Query de busca é obrigatória')
})

export type CreateTaskInput = z.infer<typeof CreateTaskSchema>
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>
export type SuggestPriorityInput = z.infer<typeof SuggestPrioritySchema>
export type GenerateTaskInput = z.infer<typeof GenerateTaskSchema>
export type SearchTaskInput = z.infer<typeof SearchTaskSchema>
export type TaskPriorityType = z.infer<typeof TaskPriority>
export type TaskStatusType = z.infer<typeof TaskStatus>
