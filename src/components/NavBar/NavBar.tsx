import { useRoutePaths, useSession } from '@/hooks'
import { Link } from 'react-router-dom'
import { CanAccess } from '../CanAccess'

function NavBar() {
  const { isAuthenticated, user, signOut } = useSession()
  const { LOGIN_PATH, METRICS_PATH, REGISTER_PATH, ROOT_PATH, USERS_PATH } =
    useRoutePaths()

  return (
    <header className="h-16 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-6xl px-4 h-full flex items-center justify-between gap-4">
        <Link to={ROOT_PATH} className="inline-flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-primary"></div>
          <span className="font-semibold tracking-tight">Leggal</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <Link to={ROOT_PATH} className="hover:text-foreground">Home</Link>
          <CanAccess permissions={['users.list']}>
            <Link to={USERS_PATH} className="hover:text-foreground">Users</Link>
          </CanAccess>
          <CanAccess permissions={['metrics.list']}>
            <Link to={METRICS_PATH} className="hover:text-foreground">Metrics</Link>
          </CanAccess>
        </nav>

        <div className="flex items-center gap-3">
          {!isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                to={LOGIN_PATH}
                className="inline-flex items-center rounded-md border px-3 py-1.5 text-sm hover:bg-accent"
              >
                Login
              </Link>
              <Link
                to={REGISTER_PATH}
                className="inline-flex items-center rounded-md bg-primary text-primary-foreground px-3 py-1.5 text-sm hover:opacity-90"
              >
                Cadastre-se
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {user?.email}
              </span>
              <button
                onClick={signOut}
                className="inline-flex items-center rounded-md border px-3 py-1.5 text-sm hover:bg-accent"
              >
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default NavBar
