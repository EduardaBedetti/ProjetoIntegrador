import { useAuth } from '@/auth/useAuth'
import type { Resource, Action, Role } from '@/auth/permissions'

interface ProtectedComponentProps {
  children: React.ReactNode
  resource?: Resource
  action?: Action
  roles?: Role[]
  fallback?: React.ReactNode
}

/**
 * Renderiza children apenas se o usuario tiver permissao.
 * Pode verificar por resource+action ou por roles diretamente.
 *
 * Exemplos:
 *   <ProtectedComponent resource="usuarios" action="create">
 *     <Button>Criar Usuario</Button>
 *   </ProtectedComponent>
 *
 *   <ProtectedComponent roles={['ADMIN', 'GESTOR']}>
 *     <RelatorioPanel />
 *   </ProtectedComponent>
 */
export function ProtectedComponent({
  children,
  resource,
  action,
  roles,
  fallback = null,
}: ProtectedComponentProps) {
  const { user, can, canAccess } = useAuth()

  if (!user) return <>{fallback}</>

  // Check by roles
  if (roles && !roles.includes(user.role)) {
    return <>{fallback}</>
  }

  // Check by resource + action
  if (resource && action && !can(resource, action)) {
    return <>{fallback}</>
  }

  // Check by resource access only
  if (resource && !action && !canAccess(resource)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
