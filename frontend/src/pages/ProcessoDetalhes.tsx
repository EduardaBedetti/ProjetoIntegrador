import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Ship,
  MapPin,
  Package,
  FileText,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { PageLoading } from '@/components/ui/LoadingSpinner'
import { useProcesso } from '@/hooks/useProcessos'
import { formatPeso, formatDataHora } from '@/utils/format'

export function ProcessoDetalhes() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { processo, loading, error } = useProcesso(id)

  if (loading) return <PageLoading />
  if (error || !processo) {
    return (
      <div className="flex h-64 flex-col items-center justify-center">
        <p className="text-slate-500">{error || 'Processo nao encontrado'}</p>
        <Button variant="secondary" className="mt-4" onClick={() => navigate('/processos')}>
          Voltar
        </Button>
      </div>
    )
  }

  return (
    <div>
      <Header
        title={`Processo ${processo.numeroHBL}`}
        subtitle={`MBL: ${processo.numeroMBL}`}
        action={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => navigate('/processos')}>
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            {processo.status === 'conferencia_pendente' && (
              <Button onClick={() => navigate(`/conferencia?id=${processo.id}`)}>
                Conferir
              </Button>
            )}
            {processo.status === 'aguardando_ce_hbl' && (
              <Button onClick={() => navigate(`/ce-mercante?id=${processo.id}`)}>
                Registrar CE HBL
              </Button>
            )}
          </div>
        }
      />

      <div className="p-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Status */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-slate-500">Status:</span>
                  <StatusBadge status={processo.status} />
                </div>
                {processo.ceMaster && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success-500" />
                    <span className="text-sm text-slate-600">
                      CE Master: {processo.ceMaster}
                    </span>
                  </div>
                )}
                {processo.ceHBL && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success-500" />
                    <span className="text-sm text-slate-600">
                      CE HBL: {processo.ceHBL}
                    </span>
                  </div>
                )}
                {processo.divergencias.length > 0 && (
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-danger-500" />
                    <span className="text-sm text-danger-600">
                      {processo.divergencias.length} divergencia(s)
                    </span>
                  </div>
                )}
                <div className="ml-auto text-sm text-slate-400">
                  Atualizado: {formatDataHora(processo.atualizadoEm)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Dados do BL */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-slate-400" />
                <h3 className="text-base font-semibold text-slate-800">
                  Dados do BL
                </h3>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoRow label="MBL" value={processo.numeroMBL} />
              <InfoRow label="HBL" value={processo.numeroHBL} />
              {processo.numeroMHBL && (
                <InfoRow label="MHBL" value={processo.numeroMHBL} />
              )}
            </CardContent>
          </Card>

          {/* Transporte */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Ship className="h-5 w-5 text-slate-400" />
                <h3 className="text-base font-semibold text-slate-800">
                  Transporte
                </h3>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoRow label="Navio" value={processo.navio} />
              <InfoRow label="Viagem" value={processo.viagem} />
              <div className="flex items-start gap-2 pt-2">
                <MapPin className="mt-0.5 h-4 w-4 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-600">{processo.portoOrigem}</p>
                  <p className="text-xs text-slate-400">para</p>
                  <p className="text-sm text-slate-600">{processo.portoDestino}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Carga */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-slate-400" />
                <h3 className="text-base font-semibold text-slate-800">
                  Carga
                </h3>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoRow label="Peso Bruto" value={formatPeso(processo.pesoBruto)} />
              <InfoRow label="Volumes" value={String(processo.quantidadeVolumes)} />
              <InfoRow label="Tipo" value={processo.tipoCarga} />
            </CardContent>
          </Card>

          {/* Containers */}
          {processo.tipoCarga === 'FCL' && processo.containers.length > 0 && (
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <h3 className="text-base font-semibold text-slate-800">
                    Containers ({processo.containers.length})
                  </h3>
                </CardHeader>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                          Numero
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                          Tipo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                          Peso
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {processo.containers.map((c, i) => (
                        <tr key={i}>
                          <td className="px-6 py-3 text-sm font-mono text-slate-700">
                            {c.numero}
                          </td>
                          <td className="px-6 py-3 text-sm text-slate-600">
                            {c.tipo}
                          </td>
                          <td className="px-6 py-3 text-sm text-slate-600">
                            {c.peso ? formatPeso(c.peso) : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* Divergencias */}
          {processo.divergencias.length > 0 && (
            <div className="lg:col-span-3">
              <Card className="border-danger-200">
                <CardHeader className="bg-danger-50">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-danger-500" />
                    <h3 className="text-base font-semibold text-danger-700">
                      Divergencias Encontradas ({processo.divergencias.length})
                    </h3>
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
                          Valor MBL
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                          Valor HBL
                        </th>
                        {processo.divergencias.some((d) => d.valorCE) && (
                          <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                            Valor CE
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {processo.divergencias.map((d, i) => (
                        <tr key={i} className="bg-danger-50/30">
                          <td className="px-6 py-3 text-sm font-medium text-slate-700">
                            {d.campo}
                          </td>
                          <td className="px-6 py-3 text-sm text-slate-600">
                            {d.valorMBL}
                          </td>
                          <td className="px-6 py-3 text-sm text-danger-600 font-medium">
                            {d.valorHBL}
                          </td>
                          {processo.divergencias.some((div) => div.valorCE) && (
                            <td className="px-6 py-3 text-sm text-slate-600">
                              {d.valorCE || '-'}
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-medium text-slate-800">{value}</span>
    </div>
  )
}
