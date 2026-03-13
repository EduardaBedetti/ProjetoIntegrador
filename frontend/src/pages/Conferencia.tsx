import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import {
  GitCompare,
  AlertTriangle,
  CheckCircle,
  Search,
  ArrowRight,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { Header } from '@/components/layout/Header'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { PageLoading } from '@/components/ui/LoadingSpinner'
import { processoService } from '@/services/processoService'
import { formatPeso } from '@/utils/format'
import type { Processo } from '@/types'

interface CampoConferencia {
  label: string
  campo: string
  valorMBL: string
  valorHBL: string
  valorCE?: string
  divergente: boolean
}

export function Conferencia() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [processoId, setProcessoId] = useState(searchParams.get('id') || '')
  const [processo, setProcesso] = useState<Processo | null>(null)
  const [loading, setLoading] = useState(false)
  const [conferindo, setConferindo] = useState(false)

  // HBL fields for comparison
  const [hblNavio, setHblNavio] = useState('')
  const [hblViagem, setHblViagem] = useState('')
  const [hblPortoOrigem, setHblPortoOrigem] = useState('')
  const [hblPortoDestino, setHblPortoDestino] = useState('')
  const [hblPesoBruto, setHblPesoBruto] = useState('')
  const [hblVolumes, setHblVolumes] = useState('')
  const [conferido, setConferido] = useState(false)
  const [campos, setCampos] = useState<CampoConferencia[]>([])

  useEffect(() => {
    const idFromParams = searchParams.get('id')
    if (idFromParams) {
      setProcessoId(idFromParams)
      carregarProcesso(idFromParams)
    }
  }, [searchParams])

  const carregarProcesso = async (id: string) => {
    try {
      setLoading(true)
      setConferido(false)
      setCampos([])
      const p = await processoService.buscarPorId(id)
      setProcesso(p)
      // Pre-fill HBL fields with MBL data (user can change if different)
      setHblNavio(p.navio)
      setHblViagem(p.viagem)
      setHblPortoOrigem(p.portoOrigem)
      setHblPortoDestino(p.portoDestino)
      setHblPesoBruto(String(p.pesoBruto))
      setHblVolumes(String(p.quantidadeVolumes))
    } catch {
      toast.error('Processo nao encontrado')
      setProcesso(null)
    } finally {
      setLoading(false)
    }
  }

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault()
    if (processoId.trim()) {
      carregarProcesso(processoId.trim())
    }
  }

  const handleConferir = async () => {
    if (!processo) return

    const camposConferencia: CampoConferencia[] = [
      {
        label: 'Navio',
        campo: 'navio',
        valorMBL: processo.navio,
        valorHBL: hblNavio,
        valorCE: processo.ceMaster ? processo.navio : undefined,
        divergente: processo.navio !== hblNavio,
      },
      {
        label: 'Viagem',
        campo: 'viagem',
        valorMBL: processo.viagem,
        valorHBL: hblViagem,
        valorCE: processo.ceMaster ? processo.viagem : undefined,
        divergente: processo.viagem !== hblViagem,
      },
      {
        label: 'Porto Origem',
        campo: 'portoOrigem',
        valorMBL: processo.portoOrigem,
        valorHBL: hblPortoOrigem,
        valorCE: processo.ceMaster ? processo.portoOrigem : undefined,
        divergente: processo.portoOrigem !== hblPortoOrigem,
      },
      {
        label: 'Porto Destino',
        campo: 'portoDestino',
        valorMBL: processo.portoDestino,
        valorHBL: hblPortoDestino,
        valorCE: processo.ceMaster ? processo.portoDestino : undefined,
        divergente: processo.portoDestino !== hblPortoDestino,
      },
      {
        label: 'Peso Bruto',
        campo: 'pesoBruto',
        valorMBL: formatPeso(processo.pesoBruto),
        valorHBL: formatPeso(parseFloat(hblPesoBruto) || 0),
        valorCE: processo.ceMaster ? formatPeso(processo.pesoBruto) : undefined,
        divergente: processo.pesoBruto !== (parseFloat(hblPesoBruto) || 0),
      },
      {
        label: 'Qtd. Volumes',
        campo: 'quantidadeVolumes',
        valorMBL: String(processo.quantidadeVolumes),
        valorHBL: hblVolumes,
        valorCE: processo.ceMaster ? String(processo.quantidadeVolumes) : undefined,
        divergente: processo.quantidadeVolumes !== parseInt(hblVolumes, 10),
      },
    ]

    setCampos(camposConferencia)
    setConferido(true)

    // Persist divergences
    try {
      setConferindo(true)
      await processoService.conferir(processo.id, {
        navio: hblNavio,
        viagem: hblViagem,
        portoOrigem: hblPortoOrigem,
        portoDestino: hblPortoDestino,
        pesoBruto: parseFloat(hblPesoBruto) || 0,
        quantidadeVolumes: parseInt(hblVolumes, 10) || 0,
        containers: processo.containers,
      })

      const temDivergencia = camposConferencia.some((c) => c.divergente)
      if (temDivergencia) {
        toast.error('Divergencias encontradas! Verifique os campos destacados.')
      } else {
        toast.success('Conferencia concluida sem divergencias!')
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro na conferencia')
    } finally {
      setConferindo(false)
    }
  }

  const temDivergencia = campos.some((c) => c.divergente)

  return (
    <div>
      <Header
        title="Conferencia Documental"
        subtitle="Comparacao entre MBL, HBL e CE Mercante"
      />

      <div className="p-8">
        {/* Search */}
        <Card className="mb-6">
          <CardContent>
            <form onSubmit={handleBuscar} className="flex items-end gap-4">
              <div className="flex-1">
                <Input
                  label="ID ou numero do processo"
                  value={processoId}
                  onChange={(e) => setProcessoId(e.target.value)}
                  placeholder="Insira o ID do processo"
                />
              </div>
              <Button type="submit" loading={loading}>
                <Search className="h-4 w-4" />
                Buscar
              </Button>
            </form>
          </CardContent>
        </Card>

        {loading && <PageLoading />}

        {processo && !loading && (
          <>
            {/* Process Info */}
            <Card className="mb-6">
              <CardContent className="flex flex-wrap items-center gap-6">
                <div>
                  <p className="text-sm text-slate-500">HBL</p>
                  <p className="font-medium text-slate-800">{processo.numeroHBL}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">MBL</p>
                  <p className="font-medium text-slate-800">{processo.numeroMBL}</p>
                </div>
                {processo.numeroMHBL && (
                  <div>
                    <p className="text-sm text-slate-500">MHBL</p>
                    <p className="font-medium text-slate-800">{processo.numeroMHBL}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-slate-500">Status</p>
                  <StatusBadge status={processo.status} />
                </div>
                {processo.ceMaster && (
                  <div>
                    <p className="text-sm text-slate-500">CE Master</p>
                    <p className="text-sm font-medium text-success-600">{processo.ceMaster}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* HBL Data Input */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* MBL Data (read only) */}
              <Card>
                <CardHeader className="bg-primary-50">
                  <h3 className="text-base font-semibold text-primary-800">
                    Dados do MBL
                  </h3>
                </CardHeader>
                <CardContent className="space-y-3">
                  <InfoRow label="Navio" value={processo.navio} />
                  <InfoRow label="Viagem" value={processo.viagem} />
                  <InfoRow label="Porto Origem" value={processo.portoOrigem} />
                  <InfoRow label="Porto Destino" value={processo.portoDestino} />
                  <InfoRow label="Peso Bruto" value={formatPeso(processo.pesoBruto)} />
                  <InfoRow label="Qtd. Volumes" value={String(processo.quantidadeVolumes)} />
                </CardContent>
              </Card>

              {/* HBL Data (editable) */}
              <Card>
                <CardHeader className="bg-warning-50">
                  <h3 className="text-base font-semibold text-warning-800">
                    Dados do HBL (confira e ajuste)
                  </h3>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Input label="Navio" value={hblNavio} onChange={(e) => setHblNavio(e.target.value)} />
                  <Input label="Viagem" value={hblViagem} onChange={(e) => setHblViagem(e.target.value)} />
                  <Input label="Porto Origem" value={hblPortoOrigem} onChange={(e) => setHblPortoOrigem(e.target.value)} />
                  <Input label="Porto Destino" value={hblPortoDestino} onChange={(e) => setHblPortoDestino(e.target.value)} />
                  <Input label="Peso Bruto (kg)" type="number" step="0.01" value={hblPesoBruto} onChange={(e) => setHblPesoBruto(e.target.value)} />
                  <Input label="Qtd. Volumes" type="number" value={hblVolumes} onChange={(e) => setHblVolumes(e.target.value)} />
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 flex justify-center">
              <Button size="lg" onClick={handleConferir} loading={conferindo}>
                <GitCompare className="h-5 w-5" />
                Realizar Conferencia
              </Button>
            </div>

            {/* Results */}
            {conferido && (
              <div className="mt-8">
                <Card className={temDivergencia ? 'border-danger-300' : 'border-success-300'}>
                  <CardHeader className={temDivergencia ? 'bg-danger-50' : 'bg-success-50'}>
                    <div className="flex items-center gap-2">
                      {temDivergencia ? (
                        <>
                          <AlertTriangle className="h-5 w-5 text-danger-500" />
                          <h3 className="text-base font-semibold text-danger-700">
                            Divergencias Encontradas
                          </h3>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-5 w-5 text-success-500" />
                          <h3 className="text-base font-semibold text-success-700">
                            Conferencia OK - Sem Divergencias
                          </h3>
                        </>
                      )}
                    </div>
                  </CardHeader>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50">
                          <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                            Campo
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                            MBL
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                            HBL
                          </th>
                          {processo.ceMaster && (
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                              CE Mercante
                            </th>
                          )}
                          <th className="px-6 py-3 text-center text-xs font-semibold uppercase text-slate-500">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {campos.map((campo) => (
                          <tr
                            key={campo.campo}
                            className={campo.divergente ? 'bg-danger-50' : ''}
                          >
                            <td className="px-6 py-3 text-sm font-medium text-slate-700">
                              {campo.label}
                            </td>
                            <td className="px-6 py-3 text-sm text-slate-600">
                              {campo.valorMBL}
                            </td>
                            <td
                              className={`px-6 py-3 text-sm ${
                                campo.divergente
                                  ? 'font-bold text-danger-600'
                                  : 'text-slate-600'
                              }`}
                            >
                              {campo.valorHBL}
                            </td>
                            {processo.ceMaster && (
                              <td className="px-6 py-3 text-sm text-slate-600">
                                {campo.valorCE || '-'}
                              </td>
                            )}
                            <td className="px-6 py-3 text-center">
                              {campo.divergente ? (
                                <span className="inline-flex items-center gap-1 text-xs font-medium text-danger-600">
                                  <AlertTriangle className="h-3.5 w-3.5" />
                                  Divergente
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-xs font-medium text-success-600">
                                  <CheckCircle className="h-3.5 w-3.5" />
                                  OK
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>

                {!temDivergencia && processo.status !== 'finalizado' && (
                  <div className="mt-4 flex justify-center">
                    <Button
                      variant="primary"
                      onClick={() => navigate(`/ce-mercante?id=${processo.id}`)}
                    >
                      Prosseguir para CE Mercante
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-medium text-slate-800">{value}</span>
    </div>
  )
}
