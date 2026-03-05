import { useNavigate } from 'react-router-dom'
import { ShieldX, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/auth/useAuth'
import { ROLE_LABELS } from '@/auth/permissions'

export function Unauthorized() {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <div className="flex h-full items-center justify-center p-8">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-danger-50">
          <ShieldX className="h-10 w-10 text-danger-500" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800">Acesso Negado</h1>
        <p className="mt-2 text-slate-500">
          Voce nao tem permissao para acessar esta pagina.
        </p>
        {user && (
          <p className="mt-1 text-sm text-slate-400">
            Seu nivel de acesso: <strong>{ROLE_LABELS[user.role]}</strong>
          </p>
        )}
        <div className="mt-6 flex justify-center gap-3">
          <Button variant="secondary" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <Button onClick={() => navigate('/')}>
            Ir para Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}
