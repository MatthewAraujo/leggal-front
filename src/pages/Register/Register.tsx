import React, { FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { authService } from '@/services'

function Register() {
  const [values, setValues] = useState({ name: '', email: '', password: '' })
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle')
  const [message, setMessage] = useState<string>()

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target
    setValues((v) => ({ ...v, [name]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const result = await authService.signUp(values)
      if (!result.ok) {
        setStatus('error')
        setMessage('Não foi possível concluir o cadastro.')
      } else {
        setStatus('success')
        setMessage(
          'Cadastro realizado com sucesso! Agora você pode fazer login.'
        )
      }
    } catch (e) {
      setStatus('error')
      setMessage('Não foi possível concluir o cadastro.')
    }
  }

  return (
    <div className="min-h-[calc(100dvh-64px)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-card shadow-sm border rounded-lg p-6">
          <h1 className="text-2xl font-semibold tracking-tight">Criar conta</h1>
          <p className="text-muted-foreground mt-1">Cadastre-se para começar</p>

          {message && (
            <div
              className={`mt-4 text-sm rounded-md border px-3 py-2 ${status === 'error'
                  ? 'border-destructive/40 text-destructive bg-destructive/5'
                  : 'border-green-500/40 text-green-700 bg-green-500/5'
                }`}
            >
              {message}
            </div>
          )}

          <form noValidate onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Nome
              </label>
              <input
                value={values.name}
                type="name"
                name="name"
                id="name"
                onChange={handleChange}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                placeholder="Matthew Araujo"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                value={values.email}
                type="email"
                name="email"
                id="email"
                onChange={handleChange}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                placeholder="voce@exemplo.com"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1"
              >
                Senha
              </label>
              <input
                value={values.password}
                type="password"
                name="password"
                id="password"
                onChange={handleChange}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-3 py-2 text-sm font-medium shadow-sm hover:opacity-90 disabled:opacity-50"
            >
              {status === 'loading' ? 'Cadastrando...' : 'Cadastrar'}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            Já tem conta?{' '}
            <Link
              to="/login"
              className="text-primary underline-offset-4 hover:underline"
            >
              Entrar
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
