import { useContext, useMemo } from 'react'
import { AuthContext } from './AuthContext'
import { hasPermission, hasAccess } from './permissions'
import type { Resource, Action, Role } from './permissions'

export function useAuth() {
  const context = useContext(AuthContext)

  const helpers = useMemo(() => {
    const role = context.user?.role

    return {
      ...context,
      role: role as Role | undefined,

      // Verifica se tem acesso a um recurso (qualquer acao)
      canAccess: (resource: Resource): boolean => {
        if (!role) return false
        return hasAccess(role, resource)
      },

      // Verifica se pode executar acao especifica
      can: (resource: Resource, action: Action): boolean => {
        if (!role) return false
        return hasPermission(role, resource, action)
      },

      // Atalhos comuns
      isAdmin: role === 'ADMIN',
      isGestor: role === 'GESTOR',
      isUser: role === 'USER',
    }
  }, [context])

  return helpers
}
