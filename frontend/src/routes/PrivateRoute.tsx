import { Navigate } from 'react-router-dom'
import { useAuth } from '@/auth/useAuth'
import { PageLoading } from '@/components/ui/LoadingSpinner'

interface PrivateRouteProps {
  children: React.ReactNode
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) return <PageLoading />

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
