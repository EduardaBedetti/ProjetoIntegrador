import { useNavigate } from 'react-router-dom'
import { Search, Filter, ChevronLeft, ChevronRight, Eye, Ship } from 'lucide-react'
import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageLoading } from '@/components/ui/LoadingSpinner'
import { ProtectedComponent } from '@/components/ProtectedComponent'
import { useProcessos } from '@/hooks/useProcessos'
import { formatPeso, formatData } from '@/utils/format'
import type { StatusProcesso, TipoCarga } from '@/types'

export function ProcessoList() {
  const navigate = useNavigate()
  const [busca, setBusca] = useState('')
  const [statusFiltro, setStatusFiltro] = useState<StatusProcesso | ''>('')
  const [tipoCargaFiltro, setTipoCargaFiltro] = useState<TipoCarga | ''>('')

  const {
    processos,
    total,
    totalPaginas,
    paginaAtual,
    loading,
    atualizarFiltros,
    irParaPagina,
  } = useProcessos()

  const handleBusca = (e: React.FormEvent) => {
    e.preventDefault()
    atualizarFiltros({ busca, status: statusFiltro || undefined, tipoCarga: tipoCargaFiltro || undefined })
  }

  const handleStatusChange = (status: StatusProcesso | '') => {
    setStatusFiltro(status)
    atualizarFiltros({ busca, status: status || undefined, tipoCarga: tipoCargaFiltro || undefined })
  }

  const handleTipoCargaChange = (tipo: TipoCarga | '') => {
    setTipoCargaFiltro(tipo)
    atualizarFiltros({ busca, status: statusFiltro || undefined, tipoCarga: tipo || undefined })
  }

  return (
    <div>
      <Header
        title="Processos"
        subtitle={`${total} processo${total !== 1 ? 's' : ''} encontrado${total !== 1 ? 's' : ''}`}
        action={
          <ProtectedComponent resource="processos" action="create">
            <Button onClick={() => navigate('/processos/novo')}>
              Novo Processo
            </Button>
          </ProtectedComponent>
        }
      />

      <div className="p-8">
        {/* Filters */}
        <Card className="mb-6">
          <div className="p-4">
            <form onSubmit={handleBusca} className="flex flex-wrap items-end gap-4">
              <div className="flex-1 min-w-[240px]">
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Buscar
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    placeholder="Buscar por MBL, HBL, navio..."
                    className="block w-full rounded-lg border border-slate-300 py-2 pl-10 pr-3 text-sm shadow-sm placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="w-48">
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  <Filter className="mr-1 inline h-3.5 w-3.5" />
                  Status
                </label>
                <select
                  value={statusFiltro}
                  onChange={(e) => handleStatusChange(e.target.value as StatusProcesso | '')}
                  className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="">Todos</option>
                  <option value="rascunho">Rascunho</option>
                  <option value="aguardando_ce_master">Aguardando CE Master</option>
                  <option value="conferencia_pendente">Conferencia Pendente</option>
                  <option value="aguardando_ce_hbl">Aguardando CE HBL</option>
                  <option value="finalizado">Finalizado</option>
                </select>
              </div>

              <div className="w-36">
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Tipo Carga
                </label>
                <select
                  value={tipoCargaFiltro}
                  onChange={(e) => handleTipoCargaChange(e.target.value as TipoCarga | '')}
                  className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="">Todos</option>
                  <option value="FCL">FCL</option>
                  <option value="LCL">LCL</option>
                </select>
              </div>

              <Button type="submit" size="md">
                Buscar
              </Button>
            </form>
          </div>
        </Card>

        {/* Table */}
        {loading ? (
          <PageLoading />
        ) : processos.length === 0 ? (
          <Card>
            <EmptyState
              title="Nenhum processo encontrado"
              description="Altere os filtros ou cadastre um novo processo."
              action={
                <Button onClick={() => navigate('/processos/novo')}>
                  Cadastrar Processo
                </Button>
              }
            />
          </Card>
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      HBL / MBL
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Navio / Viagem
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Rota
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Carga
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Data
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Acoes
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {processos.map((processo) => (
                    <tr
                      key={processo.id}
                      className="transition-colors hover:bg-slate-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                            <Ship className="h-4 w-4 text-slate-500" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-800">
                              {processo.numeroHBL}
                            </p>
                            <p className="text-xs text-slate-500">
                              {processo.numeroMBL}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-700">
                          {processo.navio}
                        </p>
                        <p className="text-xs text-slate-500">
                          {processo.viagem}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-700">
                          {processo.portoOrigem.split(' ')[0]}
                        </p>
                        <p className="text-xs text-slate-500">
                          {processo.portoDestino.split(' ')[0]}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-700">
                          {formatPeso(processo.pesoBruto)}
                        </p>
                        <p className="text-xs text-slate-500">
                          {processo.quantidadeVolumes} vol. | {processo.tipoCarga}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={processo.status} />
                        {processo.divergencias.length > 0 && (
                          <p className="mt-1 text-xs text-danger-600">
                            {processo.divergencias.length} divergencia(s)
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-500">
                          {formatData(processo.atualizadoEm)}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/processos/${processo.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                          Ver
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPaginas > 1 && (
              <div className="flex items-center justify-between border-t border-slate-200 px-6 py-3">
                <p className="text-sm text-slate-500">
                  Pagina {paginaAtual} de {totalPaginas}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={paginaAtual <= 1}
                    onClick={() => irParaPagina(paginaAtual - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={paginaAtual >= totalPaginas}
                    onClick={() => irParaPagina(paginaAtual + 1)}
                  >
                    Proxima
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  )
}
