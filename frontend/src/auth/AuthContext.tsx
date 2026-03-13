import { createContext, useState, useEffect, useCallback } from 'react'
import type { Role } from './permissions'

export interface User {
  id: string
  nome: string
  email: string
  role: Role
  setor: string
  ativo: boolean
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

interface AuthContextType extends AuthState {
  login: (user: User) => void
  logout: () => void
  switchRole: (role: Role) => void
}

const STORAGE_KEY = 'shiptrack_auth_user'

// Usuario padrao para desenvolvimento (simula login)
const DEFAULT_USER: User = {
  id: '1',
  nome: 'Admin Sistema',
  email: 'admin@shiptrack.com',
  role: 'ADMIN',
  setor: 'TI',
  ativo: true,
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
  switchRole: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  })

  // Restaurar sessao do localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const user = JSON.parse(stored) as User
        setState({ user, isAuthenticated: true, isLoading: false })
      } else {
        // Em dev, auto-login como admin
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_USER))
        setState({ user: DEFAULT_USER, isAuthenticated: true, isLoading: false })
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY)
      setState({ user: null, isAuthenticated: false, isLoading: false })
    }
  }, [])

  const login = useCallback((user: User) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    setState({ user, isAuthenticated: true, isLoading: false })
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setState({ user: null, isAuthenticated: false, isLoading: false })
  }, [])

  // Permite trocar role em dev para testar permissoes
  const switchRole = useCallback((role: Role) => {
    setState((prev) => {
      if (!prev.user) return prev
      const updated = { ...prev.user, role }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return { ...prev, user: updated }
    })
  }, [])

  return (
    <AuthContext.Provider value={{ ...state, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  )
}
