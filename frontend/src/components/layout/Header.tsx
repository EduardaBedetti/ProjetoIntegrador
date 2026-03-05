import { Bell, LogOut } from 'lucide-react'
import { useAuth } from '@/auth/useAuth'
import { ROLE_LABELS, ROLE_COLORS } from '@/auth/permissions'
import { cn } from '@/utils/cn'
import type { Role } from '@/auth/permissions'

interface HeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
}

export function Header({ title, subtitle, action }: HeaderProps) {
  const { user, switchRole, logout } = useAuth()

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-800">{title}</h1>
        {subtitle && (
          <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>
        )}
      </div>
      <div className="flex items-center gap-4">
        {action}

        {/* Role Switcher (dev only) */}
        <div className="flex items-center gap-1 rounded-lg border border-slate-200 p-1">
          {(['ADMIN', 'GESTOR', 'USER'] as Role[]).map((role) => (
            <button
              key={role}
              onClick={() => switchRole(role)}
              className={cn(
                'rounded-md px-2 py-1 text-xs font-medium transition-colors',
                user?.role === role
                  ? ROLE_COLORS[role]
                  : 'text-slate-400 hover:text-slate-600'
              )}
              title={`Trocar para ${ROLE_LABELS[role]}`}
            >
              {ROLE_LABELS[role].substring(0, 3).toUpperCase()}
            </button>
          ))}
        </div>

        <button className="relative rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger-500" />
        </button>

        {/* User info */}
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
            {user?.nome?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-slate-700 leading-tight">
              {user?.nome || 'Usuario'}
            </p>
            <p className="text-xs text-slate-400 leading-tight">
              {user ? ROLE_LABELS[user.role] : ''}
            </p>
          </div>
          <button
            onClick={logout}
            className="ml-1 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            title="Sair"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  )
}
