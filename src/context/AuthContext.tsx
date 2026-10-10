import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { authService } from '../services/auth.service'
import {
  clearSession,
  getStoredUser,
  getToken,
  setStoredUser,
  setToken,
} from '../lib/storage'
import type { AuthUser } from '../types/api'

interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (body: {
    name: string
    email: string
    password: string
    rePassword: string
    phone: string
  }) => Promise<void>
  logout: () => void
  refreshUser: (user: AuthUser) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(getStoredUser())
  const [token, setTokenState] = useState<string | null>(getToken())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const current = getToken()
    if (!current) {
      setLoading(false)
      return
    }
    authService
      .verifyToken()
      .then(() => {
        setTokenState(current)
        setUser(getStoredUser())
      })
      .catch(() => {
        clearSession()
        setTokenState(null)
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const applySession = useCallback((nextToken: string, nextUser: AuthUser) => {
    setToken(nextToken)
    setStoredUser(nextUser)
    setTokenState(nextToken)
    setUser(nextUser)
  }, [])

  const login = useCallback(
    async (email: string, password: string) => {
      const { data } = await authService.signin({ email, password })
      applySession(data.token, data.user)
    },
    [applySession],
  )

  const register = useCallback(
    async (body: {
      name: string
      email: string
      password: string
      rePassword: string
      phone: string
    }) => {
      const { data } = await authService.signup(body)
      applySession(data.token, data.user)
    },
    [applySession],
  )

  const logout = useCallback(() => {
    clearSession()
    setTokenState(null)
    setUser(null)
  }, [])

  const refreshUser = useCallback((next: AuthUser) => {
    setStoredUser(next)
    setUser(next)
  }, [])

  const value = useMemo(
    () => ({ user, token, loading, login, register, logout, refreshUser }),
    [user, token, loading, login, register, logout, refreshUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
