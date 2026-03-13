import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import {
  FileCheck,
  Search,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
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

export function CEMercante() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [processoId, setProcessoId] = useState(searchParams.get('id') || '')
  const [processo, setProcesso] = useState<Processo | null>(null)
  const [loading, setLoading] = useState(false)
  const [registrando, setRegistrando] = useState(false)
  const [numeroCE, setNumeroCE] = useState('')
  const [ceError, setCeError] = useState('')

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
      const p = await processoService.buscarPorId(id)
      setProcesso(p)
      setNumeroCE('')
      setCeError('')
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

  const handleRegistrarCE = async () => {
    if (!processo) return
    setCeError('')

    if (!numeroCE.trim()) {
      setCeError('Numero do CE e obrigatorio')
      return
    }

    try {
      setRegistrando(true)
      const atualizado = await processoService.registrarCEHBL(
        processo.id,
        numeroCE.trim()
      )
      setProcesso(atualizado)
      toast.success('CE Mercante do HBL registrado com sucesso!')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao registrar CE'
      toast.error(message)
      setCeError(message)
    } finally {
      setRegistrando(false)
    }
  }

  const podeRegistrar = processo &&
    processo.ceMaster &&
    processo.divergencias.length === 0 &&
    !processo.ceHBL

  return (
    <div>
      <Header
        title="Registro de CE Mercante"
        subtitle="Registre o CE Mercante do HBL"
      />

      <div className="mx-auto max-w-3xl p-8">
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
            {/* Process Summary */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-slate-800">
                    Resumo do Processo
                  </h3>
                  <StatusBadge status={processo.status} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <InfoItem label="MBL" value={processo.numeroMBL} />
                  <InfoItem label="HBL" value={processo.numeroHBL} />
                  <InfoItem label="Navio" value={processo.navio} />
                  <InfoItem label="Viagem" value={processo.viagem} />
                  <InfoItem label="Porto Origem" value={processo.portoOrigem} />
                  <InfoItem label="Porto Destino" value={processo.portoDestino} />
                  <InfoItem label="Peso Bruto" value={formatPeso(processo.pesoBruto)} />
                  <InfoItem label="Volumes" value={String(processo.quantidadeVolumes)} />
                </div>

                {/* CE Status */}
                <div className="mt-4 flex flex-col gap-2 rounded-lg border border-slate-200 p-4">
                  <div className="flex items-center gap-2">
                    {processo.ceMaster ? (
                      <CheckCircle className="h-4 w-4 text-success-500" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-warning-500" />
                    )}
                    <span className="text-sm text-slate-700">
                      CE Master:{' '}
                      {processo.ceMaster ? (
                        <span className="font-medium text-success-600">
                          {processo.ceMaster}
                        </span>
                      ) : (
                        <span className="text-warning-600">Pendente</span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {processo.ceHBL ? (
                      <CheckCircle className="h-4 w-4 text-success-500" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-warning-500" />
                    )}
                    <span className="text-sm text-slate-700">
                      CE HBL:{' '}
                      {processo.ceHBL ? (
                        <span className="font-medium text-success-600">
                          {processo.ceHBL}
                        </span>
                      ) : (
                        <span className="text-warning-600">Pendente</span>
                      )}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Warnings */}
            {!processo.ceMaster && (
              <Card className="mb-6 border-warning-300">
                <CardContent className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-warning-500" />
                  <div>
                    <p className="text-sm font-medium text-warning-700">
                      CE Master pendente
                    </p>
                    <p className="text-xs text-warning-600">
                      O CE Master deve ser registrado pelo armador/agente antes de registrar o CE do HBL.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {processo.divergencias.length > 0 && (
              <Card className="mb-6 border-danger-300">
                <CardContent className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 h-5 w-5 text-danger-500" />
                  <div>
                    <p className="text-sm font-medium text-danger-700">
                      Divergencias encontradas
                    </p>
                    <p className="text-xs text-danger-600 mb-2">
                      Resolva as divergencias antes de registrar o CE do HBL.
                    </p>
                    <ul className="space-y-1">
                      {processo.divergencias.map((d, i) => (
                        <li key={i} className="text-xs text-danger-600">
                          {d.campo}: MBL ({d.valorMBL}) vs HBL ({d.valorHBL})
                        </li>
                      ))}
                    </ul>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="mt-3"
                      onClick={() => navigate(`/conferencia?id=${processo.id}`)}
                    >
                      Ir para Conferencia
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {processo.ceHBL && (
              <Card className="mb-6 border-success-300">
                <CardContent className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-success-500" />
                  <div>
                    <p className="text-sm font-medium text-success-700">
                      CE HBL ja registrado
                    </p>
                    <p className="text-xs text-success-600">
                      CE: {processo.ceHBL} - Processo finalizado.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* CE Registration Form */}
            {podeRegistrar && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <FileCheck className="h-5 w-5 text-primary-500" />
                    <h3 className="text-base font-semibold text-slate-800">
                      Registrar CE Mercante do HBL
                    </h3>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    label="Numero do CE Mercante"
                    value={numeroCE}
                    onChange={(e) => {
                      setNumeroCE(e.target.value)
                      setCeError('')
                    }}
                    error={ceError}
                    placeholder="Ex: CE-2024-H-00123"
                    required
                  />

                  <div className="rounded-lg bg-primary-50 p-3">
                    <p className="text-xs text-primary-700">
                      Ao registrar o CE, o processo sera marcado como finalizado.
                      Certifique-se de que todos os dados estao corretos.
                    </p>
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button
                      variant="secondary"
                      onClick={() => navigate(`/processos/${processo.id}`)}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Voltar ao Processo
                    </Button>
                    <Button
                      onClick={handleRegistrarCE}
                      loading={registrando}
                    >
                      <FileCheck className="h-4 w-4" />
                      Registrar CE
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm font-medium text-slate-800">{value}</p>
    </div>
  )
}
