import React, { FormEvent, useMemo, useState } from 'react'

type Task = {
  id: string
  title: string
  completed: boolean
}

function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState('')

  function addTask(e: FormEvent) {
    e.preventDefault()
    const value = title.trim()
    if (!value) return
    setTasks((prev) => [
      { id: crypto.randomUUID(), title: value, completed: false },
      ...prev,
    ])
    setTitle('')
  }

  function toggleComplete(id: string) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    )
  }

  function deleteTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id))
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

        <form onSubmit={addTask} className="mt-4 flex items-center gap-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Digite o título da task"
          />
          <button
            type="submit"
            className="inline-flex items-center rounded-md bg-primary text-primary-foreground px-3 py-2 text-sm font-medium shadow-sm hover:opacity-90"
          >
            Adicionar Task
          </button>
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
    </div>
  )
}

export default Home
