import { useNavigate } from 'react-router-dom'
import {
  Package,
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Ship,
  TrendingUp,
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { PageLoading } from '@/components/ui/LoadingSpinner'
import { ProtectedComponent } from '@/components/ProtectedComponent'
import { useDashboardStats } from '@/hooks/useProcessos'
import { useProcessos } from '@/hooks/useProcessos'
import { formatData } from '@/utils/format'

export function Dashboard() {
  const navigate = useNavigate()
  const { stats, loading: statsLoading } = useDashboardStats()
  const { processos, loading: processosLoading } = useProcessos({ porPagina: 5 })

  if (statsLoading || processosLoading) return <PageLoading />

  const cards = [
    {
      title: 'Total de Processos',
      value: stats?.total || 0,
      icon: Package,
      color: 'bg-primary-50 text-primary-600',
      iconBg: 'bg-primary-100',
    },
    {
      title: 'Aguardando CE',
      value: stats?.aguardandoCE || 0,
      icon: Clock,
      color: 'bg-warning-50 text-warning-600',
      iconBg: 'bg-warning-50',
    },
    {
      title: 'Conferencia Pendente',
      value: stats?.conferenciaPendente || 0,
      icon: AlertTriangle,
      color: 'bg-danger-50 text-danger-600',
      iconBg: 'bg-danger-50',
    },
    {
      title: 'Finalizados',
      value: stats?.finalizado || 0,
      icon: CheckCircle,
      color: 'bg-success-50 text-success-600',
      iconBg: 'bg-success-50',
    },
  ]

  return (
    <div>
      <Header
        title="Dashboard"
        subtitle="Visao geral dos processos de importacao"
        action={
          <ProtectedComponent resource="processos" action="create">
            <Button onClick={() => navigate('/processos/novo')}>
              Novo Processo
            </Button>
          </ProtectedComponent>
        }
      />

      <div className="p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <Card key={card.title} className="overflow-hidden">
              <CardContent className="flex items-center gap-4">
                <div className={`rounded-xl p-3 ${card.iconBg}`}>
                  <card.icon className={`h-6 w-6 ${card.color.split(' ')[1]}`} />
                </div>
                <div>
                  <p className="text-sm text-slate-500">{card.title}</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {card.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Processes */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-slate-400" />
                  <h2 className="text-base font-semibold text-slate-800">
                    Processos Recentes
                  </h2>
                </div>
                <button
                  onClick={() => navigate('/processos')}
                  className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
                >
                  Ver todos
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              <div className="divide-y divide-slate-50">
                {processos.map((processo) => (
                  <div
                    key={processo.id}
                    className="flex items-center justify-between px-6 py-3 transition-colors hover:bg-slate-50 cursor-pointer"
                    onClick={() => navigate(`/processos/${processo.id}`)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                        <Ship className="h-5 w-5 text-slate-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">
                          {processo.numeroHBL}
                        </p>
                        <p className="text-xs text-slate-500">
                          MBL: {processo.numeroMBL}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-slate-600">
                          {processo.navio}
                        </p>
                        <p className="text-xs text-slate-400">
                          {formatData(processo.atualizadoEm)}
                        </p>
                      </div>
                      <StatusBadge status={processo.status} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card>
              <div className="border-b border-slate-100 px-6 py-4">
                <h2 className="text-base font-semibold text-slate-800">
                  Acoes Rapidas
                </h2>
              </div>
              <CardContent className="space-y-3">
                <ProtectedComponent resource="processos" action="create">
                  <button
                    onClick={() => navigate('/processos/novo')}
                    className="flex w-full items-center gap-3 rounded-lg border border-slate-200 p-3 text-left transition-colors hover:bg-slate-50"
                  >
                    <div className="rounded-lg bg-primary-50 p-2">
                      <Package className="h-4 w-4 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        Cadastrar Processo
                      </p>
                      <p className="text-xs text-slate-500">
                        Novo MBL/HBL
                      </p>
                    </div>
                  </button>
                </ProtectedComponent>

                <ProtectedComponent resource="conferencia" action="update">
                  <button
                    onClick={() => navigate('/conferencia')}
                    className="flex w-full items-center gap-3 rounded-lg border border-slate-200 p-3 text-left transition-colors hover:bg-slate-50"
                  >
                    <div className="rounded-lg bg-warning-50 p-2">
                      <AlertTriangle className="h-4 w-4 text-warning-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        Conferir Documentos
                      </p>
                      <p className="text-xs text-slate-500">
                        MBL vs HBL vs CE
                      </p>
                    </div>
                  </button>
                </ProtectedComponent>

                <ProtectedComponent resource="ce-mercante" action="update">
                  <button
                    onClick={() => navigate('/ce-mercante')}
                    className="flex w-full items-center gap-3 rounded-lg border border-slate-200 p-3 text-left transition-colors hover:bg-slate-50"
                  >
                    <div className="rounded-lg bg-success-50 p-2">
                      <CheckCircle className="h-4 w-4 text-success-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        Registrar CE Mercante
                      </p>
                      <p className="text-xs text-slate-500">
                        CE do HBL
                      </p>
                    </div>
                  </button>
                </ProtectedComponent>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
