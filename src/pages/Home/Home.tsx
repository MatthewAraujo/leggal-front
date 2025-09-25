import React, { FormEvent, useEffect, useMemo, useState } from 'react'
import { taskService, type TaskPriority, type TaskStatus } from '@/services'

type Task = {
  id: string
  title: string
  description: string
  priority: TaskPriority
  status: TaskStatus
  completed?: boolean
}

function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<TaskPriority>('HIGH')
  const [status, setStatus] = useState<TaskStatus>('PENDING')
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string }>()
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [aiReason, setAiReason] = useState<string>()

  useEffect(() => {
    let cancelled = false
      ; (async () => {
        const result = await taskService.getTasks(page)
        if (!cancelled && result.ok) {
          const items = result.data.items.map((t: Task) => ({
            id: t.id,
            title: t.title,
            description: t.description,
            priority: t.priority,
            status: t.status,
            completed: t.status === 'COMPLETED'
          }))
          setTasks((prev) => (page === 1 ? items : [...prev, ...items]))
          setHasMore(items.length > 0)
        }
      })()
    return () => {
      cancelled = true
    }
  }, [page])

  async function addTask(e: FormEvent) {
    e.preventDefault()
    const value = title.trim()
    if (!value) return
    setSubmitting(true)
    setFeedback(undefined)
    try {
      const result = await taskService.createTask({
        title: value,
        description,
        priority,
        status
      })
      if (result.ok) {
        const created = result.data.task

        const normalized: Task = {
          id: created.id,
          title: created.title,
          description: created.description,
          priority: created.priority,
          status: created.status,
          completed: created.status === 'COMPLETED'
        }
        setTasks((prev) => {
          const next = [normalized, ...prev]
          return next
        })
        setTitle('')
        setDescription('')
        setPriority('HIGH')
        setStatus('PENDING')
        setAiReason(undefined)
        setFeedback({ type: 'success', text: 'Task criada com sucesso.' })
      } else {
        const responseData = result.error.response?.data as unknown as { message?: string } | undefined
        setFeedback({ type: 'error', text: responseData?.message || 'Falha ao criar a task.' })
      }
    } catch (err) {
      setFeedback({ type: 'error', text: 'Erro inesperado ao criar a task.' })
    } finally {
      setSubmitting(false)
    }
  }

  async function handleSuggestPriority() {
    setGenerating(true)
    setAiReason(undefined)
    setFeedback(undefined)
    try {
      const payload = { title: title.trim(), description: description.trim() }
      if (!payload.title || !payload.description) {
        setFeedback({ type: 'error', text: 'Preencha título e descrição para gerar prioridade.' })
        return
      }
      const result = await taskService.suggestPriority(payload)
      if (result.ok) {
        setPriority(result.data.priority)
        setAiReason(result.data.reason)
      } else {
        const responseData = result.error.response?.data as unknown as { message?: string } | undefined
        setFeedback({ type: 'error', text: responseData?.message || 'Falha ao sugerir prioridade.' })
      }
    } finally {
      setGenerating(false)
    }
  }

  function toggleComplete(id: string) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    )
  }

  async function deleteTask(id: string) {
    const current = tasks
    setTasks((prev) => prev.filter((t) => t.id !== id))
    const result = await taskService.deleteTask(id)
    if (!result.ok) {
      // rollback on failure
      setTasks(current)
      const responseData = result.error.response?.data as unknown as { message?: string } | undefined
      setFeedback({ type: 'error', text: responseData?.message || 'Falha ao excluir a task.' })
    }
  }

  const stats = useMemo(() => {
    const total = tasks.length
    const done = tasks.filter((t) => t.completed).length
    return { total, done }
  }, [tasks])

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="bg-card border rounded-lg p-4 md:p-6 shadow-sm">
        <h1 className="text-xl md:text-2xl font-semibold tracking-tight">Suas Tasks</h1>
        <p className="text-sm text-muted-foreground mt-1">Crie e gerencie suas tarefas.</p>

        {feedback && (
          <div
            className={`mt-4 text-sm rounded-md border px-3 py-2 ${feedback.type === 'error'
              ? 'border-destructive/40 text-destructive bg-destructive/5'
              : 'border-green-500/40 text-green-700 bg-green-500/5'
              }`}
          >
            {feedback.text}
          </div>
        )}

        <form onSubmit={addTask} className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2">
            <label htmlFor="title" className="block text-sm font-medium mb-1">Título</label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Digite o título da task"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium mb-1">Descrição</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-24 w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Descreva a task"
            />
          </div>
          <div className="sm:col-span-2 flex items-center justify-between rounded-md border p-3">
            <div>
              <p className="text-sm font-medium">Gerar prioridade da tarefa com IA</p>
              <p className="text-xs text-muted-foreground">Preencha título e descrição para habilitar.</p>
            </div>
            <button
              type="button"
              onClick={handleSuggestPriority}
              disabled={generating || !title.trim() || !description.trim()}
              className="inline-flex items-center rounded-md border px-3 py-2 text-sm hover:bg-accent disabled:opacity-50"
            >
              {generating ? 'Gerando...' : 'Gerar prioridade'}
            </button>
          </div>
          {aiReason && (
            <div className="sm:col-span-2 text-xs text-muted-foreground">{aiReason}</div>
          )}
          <div>
            <label htmlFor="priority" className="block text-sm font-medium mb-1">Prioridade</label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm"
            >
              <option value="LOW">Baixa</option>
              <option value="MEDIUM">Média</option>
              <option value="HIGH">Alta</option>
            </select>
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium mb-1">Status</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm"
            >
              <option value="PENDING">Pendente</option>
              <option value="IN_PROGRESS">Em progresso</option>
              <option value="COMPLETED">Concluída</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-3 py-2 text-sm font-medium shadow-sm hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? 'Adicionando...' : 'Adicionar Task'}
            </button>
          </div>
        </form>

        <div className="mt-3 text-xs text-muted-foreground">
          {stats.done} de {stats.total} concluídas
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <div key={task.id} className="bg-card border rounded-lg p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <h3 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                {task.title}
              </h3>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={() => toggleComplete(task.id)}
                className={`inline-flex items-center rounded-md px-3 py-1.5 text-xs font-medium border hover:bg-accent ${task.completed ? 'opacity-70' : ''
                  }`}
              >
                {task.completed ? 'Desfazer' : 'Concluir'}
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                className="inline-flex items-center rounded-md px-3 py-1.5 text-xs font-medium border text-destructive hover:bg-destructive/10"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}

        {tasks.length === 0 && (
          <div className="col-span-full text-center text-sm text-muted-foreground py-10 border rounded-lg">
            Nenhuma task adicionada ainda.
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-center">
        <button
          type="button"
          disabled={!hasMore}
          onClick={() => hasMore && setPage((p) => p + 1)}
          className="inline-flex items-center rounded-md border px-3 py-2 text-sm hover:bg-accent disabled:opacity-50"
        >
          {hasMore ? 'Carregar mais' : 'Não há mais tasks'}
        </button>
      </div>
    </div>
  )
}

export default Home
