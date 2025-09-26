import { Routes, Route } from 'react-router-dom'
import { useRoutePaths } from '@/hooks'
import { Home, Login, Register, } from '@/pages'
import { PrivateRoute, } from '../PrivateRoute'
import { PublicRoute } from '../PublicRoute'
import { Users } from 'lucide-react'
import path from 'path'
import { NotFound } from '@/pages/NotFound'

function Router() {
  const {
    LOGIN_PATH,
    REGISTER_PATH,
    ROOT_PATH,
  } = useRoutePaths()

  return (
    <Routes>
      <Route
        path={ROOT_PATH}
        element={
          <PrivateRoute redirectTo={LOGIN_PATH}>
            <Home />
          </PrivateRoute>
        }
      />
      <Route
        path="/home"
        element={
          <PrivateRoute redirectTo={LOGIN_PATH}>
            <Home />
          </PrivateRoute>
        }
      />

      <Route
        path={LOGIN_PATH}
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route path={REGISTER_PATH} element={<Register />} />
      <Route path="/signup" element={<Register />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default Router
