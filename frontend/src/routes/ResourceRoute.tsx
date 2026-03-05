import { Navigate } from 'react-router-dom'
import { useAuth } from '@/auth/useAuth'
import { PageLoading } from '@/components/ui/LoadingSpinner'
import type { Resource } from '@/auth/permissions'

interface ResourceRouteProps {
  children: React.ReactNode
  resource: Resource
}

export function ResourceRoute({ children, resource }: ResourceRouteProps) {
  const { canAccess, isAuthenticated, isLoading } = useAuth()

  if (isLoading) return <PageLoading />

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!canAccess(resource)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <>{children}</>
}
