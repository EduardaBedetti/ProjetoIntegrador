import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { PageLoading } from '@/components/ui/LoadingSpinner'
import { useProcesso } from '@/hooks/useProcessos'
import { formatData } from '@/utils/format'

export function ProcessoDetalhes() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { processo, loading, error } = useProcesso(id)

  if (loading) return <PageLoading />
  if (error || !processo) {
    return (
      <div className="flex h-64 flex-col items-center justify-center">
        <p className="text-[#2E2E2E]">{error || 'Processo nao encontrado'}</p>
        <button
          className="mt-4 rounded-[10px] border border-[#2E2E2E] bg-white px-8 py-3 text-base font-medium text-[#2E2E2E] transition hover:bg-[#F1F3F5]"
          onClick={() => navigate('/processos')}
        >
          Voltar
        </button>
      </div>
    )
  }

  const statusLabel = processo.status
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())

  return (
    <div className="bg-[#F1F3F5] min-h-screen">
      <Header
        action={
          <button
            onClick={() => navigate('/processos')}
            className="rounded-[10px] border border-white/30 bg-transparent px-6 py-3 text-base font-medium text-[#F1F3F5] transition hover:bg-white/10"
          >
            <span className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </span>
          </button>
        }
      />

      <div className="p-8">
        {/* Top section: NOME, DATA, STATUS + Descricao IA */}
        <div className="mb-6 flex items-start justify-between gap-8">
          <div className="space-y-1">
            <p className="text-2xl font-bold text-black">
              NOME: <span className="font-bold">{processo.navio}</span>
            </p>
            <p className="text-2xl font-bold text-black">
              DATA: <span className="font-bold">{formatData(processo.criadoEm)}</span>
            </p>
            <p className="text-2xl font-bold text-black">
              STATUS: <span className="font-bold">{statusLabel}</span>
            </p>
          </div>

          <div className="flex-shrink-0 rounded-[20px] bg-[#1D70A2] px-10 py-14">
            <p className="text-2xl font-bold text-[#F1F3F5]">
              Descricao gerada por IA
            </p>
          </div>
        </div>

        {/* Large placeholder area */}
        <div className="rounded-[20px] bg-[#D9D9D9]" style={{ minHeight: '500px' }} />
      </div>
    </div>
  )
}
