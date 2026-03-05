import { useState, useEffect, useCallback } from 'react'
import type { Processo, ProcessoFiltros, PaginatedResponse, DashboardStats } from '@/types'
import { processoService } from '@/services/processoService'

export function useProcessos(filtrosIniciais?: Partial<ProcessoFiltros>) {
  const [dados, setDados] = useState<PaginatedResponse<Processo> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filtros, setFiltros] = useState<ProcessoFiltros>({
    pagina: 1,
    porPagina: 10,
    ...filtrosIniciais,
  })

  const carregar = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const resultado = await processoService.listar(filtros)
      setDados(resultado)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar processos')
    } finally {
      setLoading(false)
    }
  }, [filtros])

  useEffect(() => {
    carregar()
  }, [carregar])

  const atualizarFiltros = useCallback((novosFiltros: Partial<ProcessoFiltros>) => {
    setFiltros((prev) => ({ ...prev, ...novosFiltros, pagina: 1 }))
  }, [])

  const irParaPagina = useCallback((pagina: number) => {
    setFiltros((prev) => ({ ...prev, pagina }))
  }, [])

  return {
    processos: dados?.data || [],
    total: dados?.total || 0,
    totalPaginas: dados?.totalPaginas || 0,
    paginaAtual: dados?.pagina || 1,
    loading,
    error,
    filtros,
    atualizarFiltros,
    irParaPagina,
    recarregar: carregar,
  }
}

export function useProcesso(id: string | undefined) {
  const [processo, setProcesso] = useState<Processo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const carregar = useCallback(async () => {
    if (!id) return
    try {
      setLoading(true)
      setError(null)
      const resultado = await processoService.buscarPorId(id)
      setProcesso(resultado)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar processo')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    carregar()
  }, [carregar])

  return { processo, loading, error, recarregar: carregar }
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const carregar = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const resultado = await processoService.obterEstatisticas()
      setStats(resultado)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar estatisticas')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    carregar()
  }, [carregar])

  return { stats, loading, error, recarregar: carregar }
}
