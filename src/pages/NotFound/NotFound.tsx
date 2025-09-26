import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="min-h-[calc(100dvh-64px)] flex items-center justify-center px-4">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-semibold">Página não encontrada</h2>
        <p className="text-muted-foreground">
          Opa! Parece que você tentou acessar uma página que não existe ou foi
          movida.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium shadow-sm hover:opacity-90"
        >
          Voltar para a Home
        </Link>
      </div>
    </div>
  )
}

export default NotFound

