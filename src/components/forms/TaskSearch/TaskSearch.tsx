import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SearchTaskSchema, SearchTaskInput } from '@/schemas/task.schema'
import { Button } from '@/components/ui/button'

interface TaskSearchProps {
  onSearch: (query: string) => Promise<void>
  onClear: () => void
  searching: boolean
  hasResults: boolean
  resultsCount?: number
}

export function TaskSearch({ onSearch, onClear, searching, hasResults, resultsCount }: TaskSearchProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<SearchTaskInput>({
    resolver: zodResolver(SearchTaskSchema),
    defaultValues: {
      query: ''
    }
  })

  const watchedQuery = watch('query')

  const handleSearch = async (data: SearchTaskInput) => {
    await onSearch(data.query)
  }

  const handleClear = () => {
    onClear()
  }

  return (
    <div className="mt-4">
      <label htmlFor="semantic-search" className="block text-sm font-medium mb-1">Buscar tarefas</label>
      <form onSubmit={handleSubmit(handleSearch)} className="flex items-center gap-2">
        <input
          id="semantic-search"
          {...register('query')}
          className="flex-1 rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="Descreva a tarefa (busca semântica)"
        />
        <Button
          type="submit"
          disabled={searching || !watchedQuery?.trim()}
          variant="outline"
          size="sm"
        >
          {searching ? 'Buscando...' : 'Buscar'}
        </Button>
      </form>

      {errors.query && (
        <p className="mt-1 text-xs text-destructive">{errors.query.message}</p>
      )}

      {hasResults && (
        <div className="mt-3">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">
              {resultsCount} resultado(s) encontrado(s)
            </span>
            <Button
              type="button"
              onClick={handleClear}
              variant="ghost"
              size="sm"
              className="text-sm text-muted-foreground hover:text-foreground underline"
            >
              Limpar busca
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
