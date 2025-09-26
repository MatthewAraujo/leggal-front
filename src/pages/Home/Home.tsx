import React, { useMemo, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { TaskForm, EditTaskForm, TaskSearch, Feedback } from '@/components'
import { useTasks, useTaskSearch, useTaskAI } from '@/hooks'
import { calculateTaskStats } from '@/utils'
import { CreateTaskInput, UpdateTaskInput } from '@/schemas/task.schema'

function Home() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<{
    id: string
    title: string
    description: string
    priority: 'LOW' | 'MEDIUM' | 'HIGH'
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
  }>()

  // Hooks customizados
  const {
    tasks,
    loading,
    hasMore,
    feedback: tasksFeedback,
    setFeedback: setTasksFeedback,
    addTask,
    updateTask,
    deleteTask,
    loadMore
  } = useTasks()

  const {
    searchResults,
    searching,
    feedback: searchFeedback,
    setFeedback: setSearchFeedback,
    searchTasks,
    clearSearch
  } = useTaskSearch()

  const {
    generatingPriority,
    generatingTask,
    aiReason,
    feedback: aiFeedback,
    setFeedback: setAiFeedback,
    suggestPriority,
    generateTask
  } = useTaskAI()

  // Handlers para os formulários
  const handleAddTask = async (data: CreateTaskInput) => {
    await addTask(data)
  }

  const handleSuggestPriority = async (title: string, description: string) => {
    return await suggestPriority(title, description)
  }

  const handleGenerateTask = async (description: string) => {
    const result = await generateTask(description)
    if (result.success && result.task) {
      // A task será adicionada automaticamente pelo hook useTasks
    }
  }

  const handleSearch = async (query: string) => {
    await searchTasks(query)
  }

  const handleClearSearch = () => {
    clearSearch()
  }

  const handleDeleteTask = async (id: string) => {
    await deleteTask(id)
  }

  const openEdit = (task: any) => {
    setEditing({
      id: task.id,
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status
    })
    setDialogOpen(true)
  }

  const handleSaveEdit = async (data: UpdateTaskInput) => {
    if (!editing) return
    const result = await updateTask(editing.id, data)
    if (result.success) {
      setDialogOpen(false)
      setEditing(undefined)
    }
  }

  const handleToggleComplete = async (task: any) => {
    const newStatus = task.completed ? 'PENDING' : 'COMPLETED'
    await updateTask(task.id, {
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: newStatus
    })
  }

  const displayTasks = searchResults || tasks
  const stats = useMemo(() => calculateTaskStats(displayTasks), [displayTasks])

  // Feedback consolidado
  const currentFeedback = tasksFeedback || searchFeedback || aiFeedback

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="bg-card border rounded-lg p-4 md:p-6 shadow-sm">
        <h1 className="text-xl md:text-2xl font-semibold tracking-tight">Suas Tasks</h1>
        <p className="text-sm text-muted-foreground mt-1">Crie e gerencie suas tarefas.</p>

        {currentFeedback && (
          <Feedback
            type={currentFeedback.type}
            text={currentFeedback.text}
            className="mt-4"
          />
        )}

        <TaskSearch
          onSearch={handleSearch}
          onClear={handleClearSearch}
          searching={searching}
          hasResults={!!searchResults}
          resultsCount={searchResults?.length}
        />

        <TaskForm
          onSubmit={handleAddTask}
          onSuggestPriority={handleSuggestPriority}
          onGenerateTask={handleGenerateTask}
          generatingPriority={generatingPriority}
          generatingTask={generatingTask}
          aiReason={aiReason}
          submitting={loading}
        />

        <div className="mt-3 text-xs text-muted-foreground">
          {stats.done} de {stats.total} concluídas
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayTasks.map((task) => (
          <div
            key={task.id}
            className="bg-card border rounded-lg p-4 shadow-sm cursor-pointer hover:bg-accent/30"
            onClick={() => openEdit(task)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') openEdit(task)
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                {task.title}
              </h3>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleToggleComplete(task)
                }}
                className={`inline-flex items-center rounded-md px-3 py-1.5 text-xs font-medium border hover:bg-accent ${task.completed ? 'opacity-70' : ''
                  }`}
              >
                {task.completed ? 'Desfazer' : 'Concluir'}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeleteTask(task.id)
                }}
                className="inline-flex items-center rounded-md px-3 py-1.5 text-xs font-medium border text-destructive hover:bg-destructive/10"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}

        {displayTasks.length === 0 && (
          <div className="col-span-full text-center text-sm text-muted-foreground py-10 border rounded-lg">
            {searchResults ? 'Nenhum resultado encontrado.' : 'Nenhuma task adicionada ainda.'}
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes da Task</DialogTitle>
            <DialogDescription>Veja e edite as informações da tarefa.</DialogDescription>
          </DialogHeader>
          {editing && (
            <EditTaskForm
              task={editing}
              onSubmit={handleSaveEdit}
              onCancel={() => setDialogOpen(false)}
              submitting={loading}
            />
          )}
        </DialogContent>
      </Dialog>

      <div className="mt-6 flex justify-center">
        <button
          type="button"
          disabled={!hasMore || loading}
          onClick={loadMore}
          className="inline-flex items-center rounded-md border px-3 py-2 text-sm hover:bg-accent disabled:opacity-50"
        >
          {hasMore ? 'Carregar mais' : 'Não há mais tasks'}
        </button>
      </div>
    </div>
  )
}

export default Home
