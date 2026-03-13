export type TipoCarga = 'FCL' | 'LCL'

export type StatusProcesso =
  | 'rascunho'
  | 'aguardando_ce_master'
  | 'conferencia_pendente'
  | 'aguardando_ce_hbl'
  | 'finalizado'

export const STATUS_LABELS: Record<StatusProcesso, string> = {
  rascunho: 'Rascunho',
  aguardando_ce_master: 'Aguardando CE Master',
  conferencia_pendente: 'Conferencia Pendente',
  aguardando_ce_hbl: 'Aguardando CE HBL',
  finalizado: 'Finalizado',
}

export const STATUS_COLORS: Record<StatusProcesso, string> = {
  rascunho: 'bg-slate-100 text-slate-700',
  aguardando_ce_master: 'bg-warning-50 text-warning-600',
  conferencia_pendente: 'bg-primary-50 text-primary-700',
  aguardando_ce_hbl: 'bg-warning-50 text-warning-600',
  finalizado: 'bg-success-50 text-success-700',
}

export interface Container {
  numero: string
  tipo: string
  peso?: number
}

export interface DadosDocumento {
  navio: string
  viagem: string
  portoOrigem: string
  portoDestino: string
  pesoBruto: number
  quantidadeVolumes: number
  tipoCarga: TipoCarga
  containers: Container[]
}

export interface Processo {
  id: string
  numeroMBL: string
  numeroHBL: string
  numeroMHBL?: string
  navio: string
  viagem: string
  portoOrigem: string
  portoDestino: string
  pesoBruto: number
  quantidadeVolumes: number
  tipoCarga: TipoCarga
  containers: Container[]
  ceMaster?: string
  ceHBL?: string
  status: StatusProcesso
  divergencias: Divergencia[]
  criadoEm: string
  atualizadoEm: string
}

export interface Divergencia {
  campo: string
  valorMBL: string
  valorHBL: string
  valorCE?: string
}

export interface DadosCEMercante {
  numeroCE: string
  navio: string
  viagem: string
  portoOrigem: string
  portoDestino: string
  pesoBruto: number
  quantidadeVolumes: number
  tipoCarga: TipoCarga
  containers: Container[]
}

export interface ProcessoFormData {
  numeroMBL: string
  numeroHBL: string
  numeroMHBL?: string
  navio: string
  viagem: string
  portoOrigem: string
  portoDestino: string
  pesoBruto: number
  quantidadeVolumes: number
  tipoCarga: TipoCarga
  containers: Container[]
}

export interface DashboardStats {
  total: number
  aguardandoCE: number
  conferenciaPendente: number
  finalizado: number
}

export interface ProcessoFiltros {
  busca?: string
  status?: StatusProcesso | ''
  tipoCarga?: TipoCarga | ''
  pagina: number
  porPagina: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  pagina: number
  porPagina: number
  totalPaginas: number
}
