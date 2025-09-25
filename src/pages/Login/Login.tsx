import React, { FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AxiosError } from 'axios'
import { useSession } from '@/hooks'

function initialFormValues() {
  return {
    email: '',
    password: ''
  }
}

type FeedbackMessage = {
  type: 'error' | 'success'
  text: string
}

function isAxiosErr(val: unknown): val is AxiosError {
  return typeof val === 'object' && val !== null && 'isAxiosError' in val
}

function Login() {
  const [values, setValues] = useState(initialFormValues)
  const [loginRequestStatus, setLoginRequestStatus] = useState('success')
  const [message, setMessage] = useState<FeedbackMessage>()
  const { signIn } = useSession()
  const navigate = useNavigate()

  const users = [
    { name: 'Admin', email: 'admin@site.com', password: 'password@123' },
    { name: 'Client', email: 'client@site.com', password: 'password@123' }
  ]

  function handleUserChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const user = event.target.value
    setValues(JSON.parse(user))
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target

    setValues({
      ...values,
      [name]: value
    })
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    setLoginRequestStatus('loading')

    try {
      const result = await signIn(values)
      if (isAxiosErr(result)) {
        const responseData = result.response?.data as unknown as
          | {
            message?: string
          }
          | undefined
        const backendMsg = responseData?.message
        setMessage({
          type: 'error',
          text: backendMsg || 'Credenciais inválidas.'
        })
      } else {
        setMessage({ type: 'success', text: 'Login realizado com sucesso!' })
        navigate('/home')
      }
    } catch (error) {
    } finally {
      setLoginRequestStatus('success')
    }
  }

  useEffect(() => {
    // clean the function to prevent memory leak
    return () => setLoginRequestStatus('success')
  }, [])

  return (
    <div className="min-h-[calc(100dvh-64px)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-card shadow-sm border rounded-lg p-6">
          <h1 className="text-2xl font-semibold tracking-tight">Entrar</h1>
          <p className="text-muted-foreground mt-1">
            Acesse sua conta para continuar
          </p>

          {message &&
            (() => {
              const alertClassName = `mt-4 text-sm rounded-md border px-3 py-2 ${message.type === 'error'
                ? 'border-destructive/40 text-destructive bg-destructive/5'
                : 'border-green-500/40 text-green-700 bg-green-500/5'
                }`
              return <div className={alertClassName}>{message.text}</div>
            })()}

          <form noValidate onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                value={values.email}
                type="email"
                name="email"
                id="email"
                disabled={loginRequestStatus === 'loading'}
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
                disabled={loginRequestStatus === 'loading'}
                onChange={handleChange}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loginRequestStatus === 'loading'}
              className="w-full inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-3 py-2 text-sm font-medium shadow-sm hover:opacity-90 disabled:opacity-50"
            >
              {loginRequestStatus === 'loading' ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            Não tem uma conta?{' '}
            <Link
              to="/signup"
              className="text-primary underline-offset-4 hover:underline"
            >
              Cadastre-se
            </Link>
          </div>

          <div className="mt-6">
            <label className="block text-xs text-muted-foreground mb-1">
              Usuários de teste
            </label>
            <select
              name="select-user"
              onChange={handleUserChange}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm"
            >
              <option value="" style={{ display: 'none' }}>
                Selecione um usuário
              </option>
              {users.map((user) => (
                <option key={user.email} value={JSON.stringify(user)}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
