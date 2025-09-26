import { Task } from '@/hooks/useTasks'

export function calculateTaskStats(tasks: Task[]) {
  const total = tasks.length
  const done = tasks.filter((t) => t.completed).length
  const pending = tasks.filter((t) => !t.completed).length

  return { total, done, pending }
}

export function getPriorityLabel(priority: string) {
  const labels = {
    LOW: 'Baixa',
    MEDIUM: 'Média',
    HIGH: 'Alta'
  }
  return labels[priority as keyof typeof labels] || priority
}

export function getStatusLabel(status: string) {
  const labels = {
    PENDING: 'Pendente',
    IN_PROGRESS: 'Em progresso',
    COMPLETED: 'Concluída'
  }
  return labels[status as keyof typeof labels] || status
}

export function getPriorityColor(priority: string) {
  const colors = {
    LOW: 'text-green-600 bg-green-100',
    MEDIUM: 'text-yellow-600 bg-yellow-100',
    HIGH: 'text-red-600 bg-red-100'
  }
  return colors[priority as keyof typeof colors] || 'text-gray-600 bg-gray-100'
}

export function getStatusColor(status: string) {
  const colors = {
    PENDING: 'text-gray-600 bg-gray-100',
    IN_PROGRESS: 'text-blue-600 bg-blue-100',
    COMPLETED: 'text-green-600 bg-green-100'
  }
  return colors[status as keyof typeof colors] || 'text-gray-600 bg-gray-100'
}
