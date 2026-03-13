import { useNavigate } from 'react-router-dom'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/Button'
import { PageLoading } from '@/components/ui/LoadingSpinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { useProcessos } from '@/hooks/useProcessos'
import { formatPeso, formatData } from '@/utils/format'

export function ProcessoList() {
  const navigate = useNavigate()
  const [busca, setBusca] = useState('')

  const {
    processos,
    totalPaginas,
    paginaAtual,
    loading,
    atualizarFiltros,
    irParaPagina,
  } = useProcessos()

  const handleBusca = (e: React.FormEvent) => {
    e.preventDefault()
    atualizarFiltros({ busca })
  }

  return (
    <div className="bg-[#F1F3F5] min-h-screen">
      <Header
        action={
          <button
            onClick={() => navigate('/processos/novo')}
            className="rounded-[10px] bg-[#1D70A2] px-8 py-3 text-base font-medium text-[#F1F3F5] transition hover:bg-[#186090]"
          >
            Novo Processo
          </button>
        }
      />

      <div className="p-8">
        {/* Search bar */}
        <form onSubmit={handleBusca} className="mb-6 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar processo..."
              className="block w-full rounded-[10px] border border-[#2E2E2E] bg-white py-3 pl-10 pr-3 text-sm placeholder:text-slate-400 focus:border-[#1D70A2] focus:outline-none focus:ring-1 focus:ring-[#1D70A2]"
            />
          </div>
        </form>

        {/* Table */}
        {loading ? (
          <PageLoading />
        ) : processos.length === 0 ? (
          <EmptyState
            title="Nenhum processo encontrado"
            description="Altere os filtros ou cadastre um novo processo."
            action={
              <Button onClick={() => navigate('/processos/novo')}>
                Cadastrar Processo
              </Button>
            }
          />
        ) : (
          <div className="overflow-hidden rounded-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#0B3C5D] text-white">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                      Navio
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                      Porto Embarque
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                      Porto Destino
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                      Peso
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                      Metragem
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                      Qtd
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                      Container
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                      Lacre
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                      Data
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {processos.map((processo) => (
                    <tr
                      key={processo.id}
                      onClick={() => navigate(`/processos/${processo.id}`)}
                      className="cursor-pointer border-2 border-[#0B3C5D] bg-[#8DAAB4] transition-colors hover:bg-[#7d9aa4]"
                    >
                      <td className="px-4 py-4 text-sm text-[#2E2E2E]">
                        {processo.navio}
                      </td>
                      <td className="px-4 py-4 text-sm text-[#2E2E2E]">
                        {processo.portoOrigem}
                      </td>
                      <td className="px-4 py-4 text-sm text-[#2E2E2E]">
                        {processo.portoDestino}
                      </td>
                      <td className="px-4 py-4 text-sm text-[#2E2E2E]">
                        {formatPeso(processo.pesoBruto)}
                      </td>
                      <td className="px-4 py-4 text-sm text-[#2E2E2E]">
                        {processo.quantidadeVolumes}
                      </td>
                      <td className="px-4 py-4 text-sm text-[#2E2E2E]">
                        {processo.tipoCarga === 'FCL' ? processo.containers.length : '-'}
                      </td>
                      <td className="px-4 py-4 text-sm font-mono text-[#2E2E2E]">
                        {processo.tipoCarga === 'FCL' && processo.containers.length > 0
                          ? processo.containers[0].numero
                          : '-'}
                      </td>
                      <td className="px-4 py-4 text-sm font-mono text-[#2E2E2E]">
                        {processo.tipoCarga === 'FCL' && processo.containers.length > 0
                          ? `LACRE${processo.id}`
                          : '-'}
                      </td>
                      <td className="px-4 py-4 text-sm text-[#2E2E2E]">
                        {formatData(processo.criadoEm)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPaginas > 1 && (
              <div className="flex items-center justify-between bg-white px-6 py-3">
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
          </div>
        )}
      </div>
    </div>
  )
}
