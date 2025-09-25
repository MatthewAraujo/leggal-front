import { AxiosError } from 'axios'
import { api } from '@/services'

export type SignInPayload = {
  email: string
  password: string
}

export type SignUpPayload = {
  name: string
  email: string
  password: string
}

export type AuthResponse = {
  token: string
  refreshToken: string
  permissions: string[]
  roles: string[]
}

export class AuthService {
  async signIn(payload: SignInPayload) {
    try {
      const { data } = await api.post('/sessions', payload)
      const token = (data as any)?.token ?? (data as any)?.access_token
      const refreshToken =
        (data as any)?.refreshToken ?? (data as any)?.refresh_token
      const permissions = (data as any)?.permissions ?? []
      const roles = (data as any)?.roles ?? []

      const normalized: AuthResponse = {
        token,
        refreshToken,
        permissions,
        roles
      }

      return { ok: true, data: normalized } as const
    } catch (error) {
      return { ok: false, error: error as AxiosError } as const
    }
  }

  async signUp(payload: SignUpPayload) {
    try {
      const { data } = await api.post('/accounts', payload)
      return { ok: true, data } as const
    } catch (error) {
      return { ok: false, error: error as AxiosError } as const
    }
  }

  async me() {
    try {
      const { data } = await api.get('/me')
      return { ok: true, data } as const
    } catch (error) {
      return { ok: false, error: error as AxiosError } as const
    }
  }
}

export const authService = new AuthService()
