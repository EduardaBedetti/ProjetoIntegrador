import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  FilePlus,
  List,
  GitCompare,
  FileCheck,
  Ship,
  ChevronLeft,
  ChevronRight,
  Users,
  BarChart3,
  Settings,
  type LucideIcon,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/utils/cn'
import { useAuth } from '@/auth/useAuth'
import type { Resource } from '@/auth/permissions'

interface NavItem {
  name: string
  href: string
  icon: LucideIcon
  resource: Resource
}

const allNavItems: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard, resource: 'dashboard' },
  { name: 'Novo Processo', href: '/processos/novo', icon: FilePlus, resource: 'processos' },
  { name: 'Processos', href: '/processos', icon: List, resource: 'processos' },
  { name: 'Conferencia', href: '/conferencia', icon: GitCompare, resource: 'conferencia' },
  { name: 'CE Mercante', href: '/ce-mercante', icon: FileCheck, resource: 'ce-mercante' },
  { name: 'Relatorios', href: '/relatorios', icon: BarChart3, resource: 'relatorios' },
  { name: 'Usuarios', href: '/usuarios', icon: Users, resource: 'usuarios' },
  { name: 'Configuracoes', href: '/configuracoes', icon: Settings, resource: 'configuracoes' },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const { canAccess, can } = useAuth()

  // Filtra itens de navegacao baseado nas permissoes do usuario
  const navigation = allNavItems.filter((item) => {
    // "Novo Processo" so aparece para quem pode criar
    if (item.href === '/processos/novo') {
      return can('processos', 'create')
    }
    return canAccess(item.resource)
  })

  return (
    <aside
      className={cn(
        'flex h-screen flex-col border-r border-slate-200 bg-white transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-slate-100 px-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Ship className="h-7 w-7 text-primary-600" />
            <span className="text-lg font-bold text-slate-800">ShipTrack</span>
          </div>
        )}
        {collapsed && <Ship className="mx-auto h-7 w-7 text-primary-600" />}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            'rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600',
            collapsed && 'mx-auto mt-0'
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.href === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                collapsed && 'justify-center px-2'
              )
            }
            title={collapsed ? item.name : undefined}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-100 p-4">
        {!collapsed && (
          <p className="text-xs text-slate-400">
            v1.0.0
          </p>
        )}
      </div>
    </aside>
  )
}
