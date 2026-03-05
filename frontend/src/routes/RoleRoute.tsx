import { Navigate } from 'react-router-dom'
import { useAuth } from '@/auth/useAuth'
import { PageLoading } from '@/components/ui/LoadingSpinner'
import type { Role } from '@/auth/permissions'

interface RoleRouteProps {
  children: React.ReactNode
  roles: Role[]
}

export function RoleRoute({ children, roles }: RoleRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth()

  if (isLoading) return <PageLoading />

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <>{children}</>
}
