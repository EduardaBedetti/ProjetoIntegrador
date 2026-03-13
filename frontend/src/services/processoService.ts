import type {
  Processo,
  ProcessoFormData,
  ProcessoFiltros,
  PaginatedResponse,
  DashboardStats,
  Divergencia,
  StatusProcesso,
} from '@/types'
import { mockProcessos } from './mockData'

// Simulacao de delay de rede
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

let processos = [...mockProcessos]
let nextId = processos.length + 1

function calcularDivergencias(processo: Processo): Divergencia[] {
  // Em producao, compararia com dados do CE Mercante via API
  return processo.divergencias
}

function determinarStatus(processo: Processo): StatusProcesso {
  if (processo.ceHBL) return 'finalizado'
  if (processo.ceMaster && processo.divergencias.length === 0) return 'aguardando_ce_hbl'
  if (processo.ceMaster) return 'conferencia_pendente'
  return 'aguardando_ce_master'
}

export const processoService = {
  async listar(filtros: ProcessoFiltros): Promise<PaginatedResponse<Processo>> {
    await delay(400)

    let resultado = [...processos]

    if (filtros.busca) {
      const busca = filtros.busca.toLowerCase()
      resultado = resultado.filter(
        (p) =>
          p.numeroMBL.toLowerCase().includes(busca) ||
          p.numeroHBL.toLowerCase().includes(busca) ||
          (p.numeroMHBL && p.numeroMHBL.toLowerCase().includes(busca)) ||
          p.navio.toLowerCase().includes(busca)
      )
    }

    if (filtros.status) {
      resultado = resultado.filter((p) => p.status === filtros.status)
    }

    if (filtros.tipoCarga) {
      resultado = resultado.filter((p) => p.tipoCarga === filtros.tipoCarga)
    }

    resultado.sort(
      (a, b) =>
        new Date(b.atualizadoEm).getTime() - new Date(a.atualizadoEm).getTime()
    )

    const total = resultado.length
    const inicio = (filtros.pagina - 1) * filtros.porPagina
    const fim = inicio + filtros.porPagina
    const data = resultado.slice(inicio, fim)

    return {
      data,
      total,
      pagina: filtros.pagina,
      porPagina: filtros.porPagina,
      totalPaginas: Math.ceil(total / filtros.porPagina),
    }
  },

  async buscarPorId(id: string): Promise<Processo> {
    await delay(300)
    const processo = processos.find((p) => p.id === id)
    if (!processo) throw new Error('Processo nao encontrado')
    return { ...processo }
  },

  async criar(data: ProcessoFormData): Promise<Processo> {
    await delay(500)

    const novoProcesso: Processo = {
      id: String(nextId++),
      ...data,
      status: 'aguardando_ce_master',
      divergencias: [],
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
    }

    processos.unshift(novoProcesso)
    return { ...novoProcesso }
  },

  async atualizar(id: string, data: Partial<ProcessoFormData>): Promise<Processo> {
    await delay(400)

    const index = processos.findIndex((p) => p.id === id)
    if (index === -1) throw new Error('Processo nao encontrado')

    processos[index] = {
      ...processos[index],
      ...data,
      atualizadoEm: new Date().toISOString(),
    }

    return { ...processos[index] }
  },

  async registrarCEMaster(id: string, numeroCE: string): Promise<Processo> {
    await delay(500)

    const index = processos.findIndex((p) => p.id === id)
    if (index === -1) throw new Error('Processo nao encontrado')

    processos[index] = {
      ...processos[index],
      ceMaster: numeroCE,
      status: 'conferencia_pendente',
      atualizadoEm: new Date().toISOString(),
    }

    processos[index].divergencias = calcularDivergencias(processos[index])
    processos[index].status = determinarStatus(processos[index])

    return { ...processos[index] }
  },

  async registrarCEHBL(id: string, numeroCE: string): Promise<Processo> {
    await delay(500)

    const index = processos.findIndex((p) => p.id === id)
    if (index === -1) throw new Error('Processo nao encontrado')

    if (!processos[index].ceMaster) {
      throw new Error('CE Master deve ser registrado antes do CE HBL')
    }

    if (processos[index].divergencias.length > 0) {
      throw new Error('Existem divergencias que devem ser resolvidas antes de registrar o CE HBL')
    }

    processos[index] = {
      ...processos[index],
      ceHBL: numeroCE,
      status: 'finalizado',
      atualizadoEm: new Date().toISOString(),
    }

    return { ...processos[index] }
  },

  async conferir(
    id: string,
    dadosHBL: {
      navio: string
      viagem: string
      portoOrigem: string
      portoDestino: string
      pesoBruto: number
      quantidadeVolumes: number
      containers: { numero: string; tipo: string; peso?: number }[]
    }
  ): Promise<Processo> {
    await delay(600)

    const index = processos.findIndex((p) => p.id === id)
    if (index === -1) throw new Error('Processo nao encontrado')

    const processo = processos[index]
    const divergencias: Divergencia[] = []

    if (processo.navio !== dadosHBL.navio) {
      divergencias.push({
        campo: 'Navio',
        valorMBL: processo.navio,
        valorHBL: dadosHBL.navio,
      })
    }
    if (processo.viagem !== dadosHBL.viagem) {
      divergencias.push({
        campo: 'Viagem',
        valorMBL: processo.viagem,
        valorHBL: dadosHBL.viagem,
      })
    }
    if (processo.portoOrigem !== dadosHBL.portoOrigem) {
      divergencias.push({
        campo: 'Porto Origem',
        valorMBL: processo.portoOrigem,
        valorHBL: dadosHBL.portoOrigem,
      })
    }
    if (processo.portoDestino !== dadosHBL.portoDestino) {
      divergencias.push({
        campo: 'Porto Destino',
        valorMBL: processo.portoDestino,
        valorHBL: dadosHBL.portoDestino,
      })
    }
    if (processo.pesoBruto !== dadosHBL.pesoBruto) {
      divergencias.push({
        campo: 'Peso Bruto',
        valorMBL: String(processo.pesoBruto),
        valorHBL: String(dadosHBL.pesoBruto),
      })
    }
    if (processo.quantidadeVolumes !== dadosHBL.quantidadeVolumes) {
      divergencias.push({
        campo: 'Quantidade de Volumes',
        valorMBL: String(processo.quantidadeVolumes),
        valorHBL: String(dadosHBL.quantidadeVolumes),
      })
    }

    processos[index] = {
      ...processo,
      divergencias,
      status: divergencias.length > 0 ? 'conferencia_pendente' : determinarStatus(processo),
      atualizadoEm: new Date().toISOString(),
    }

    return { ...processos[index] }
  },

  async obterEstatisticas(): Promise<DashboardStats> {
    await delay(300)

    return {
      total: processos.length,
      aguardandoCE: processos.filter(
        (p) => p.status === 'aguardando_ce_master' || p.status === 'aguardando_ce_hbl'
      ).length,
      conferenciaPendente: processos.filter(
        (p) => p.status === 'conferencia_pendente'
      ).length,
      finalizado: processos.filter((p) => p.status === 'finalizado').length,
    }
  },

  async deletar(id: string): Promise<void> {
    await delay(300)
    const index = processos.findIndex((p) => p.id === id)
    if (index === -1) throw new Error('Processo nao encontrado')
    processos.splice(index, 1)
  },
}
