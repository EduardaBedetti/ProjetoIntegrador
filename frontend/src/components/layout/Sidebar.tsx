import { NavLink } from 'react-router-dom'
import { Anchor, User } from 'lucide-react'
import { cn } from '@/utils/cn'

const navigation = [
  { name: 'Novo Processo', href: '/processos/novo' },
  { name: 'Processo em Andamento', href: '/processos' },
  { name: 'Detalhes do Processo', href: '/conferencia' },
]

export function Sidebar() {
  return (
    <aside className="flex h-screen w-64 flex-col bg-[#0B3C5D] text-white">
      {/* Header with logo and user */}
      <div className="flex items-center justify-between px-5 py-5">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white">
            <Anchor className="h-6 w-6 text-[#0B3C5D]" />
          </div>
          <span className="text-lg font-bold tracking-wide text-white">
            <span className="text-[#F4A261]">P</span>ort<span className="text-[#F4A261]">P</span>rocess
          </span>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
          <User className="h-5 w-5 text-white" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-5 py-4">
        <p className="mb-3 flex items-center gap-2 text-base font-semibold text-white">
          <span className="h-2 w-2 rounded-full bg-white" />
          Agenciamento
        </p>
        <div className="ml-4 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === '/processos'}
              className={({ isActive }) =>
                cn(
                  'block px-3 py-2 text-base transition-colors',
                  isActive
                    ? 'text-white underline underline-offset-4'
                    : 'text-white/80 hover:text-white hover:underline hover:underline-offset-4'
                )
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      </nav>
    </aside>
  )
}
