import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, useFieldArray } from 'react-hook-form'
import { Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { Header } from '@/components/layout/Header'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { processoService } from '@/services/processoService'
import type { ProcessoFormData, TipoCarga } from '@/types'

interface FormValues {
  numeroMBL: string
  numeroHBL: string
  numeroMHBL: string
  navio: string
  viagem: string
  portoOrigem: string
  portoDestino: string
  pesoBruto: string
  quantidadeVolumes: string
  tipoCarga: TipoCarga
  containers: { numero: string; tipo: string; peso: string }[]
}

export function ProcessoForm() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      numeroMBL: '',
      numeroHBL: '',
      numeroMHBL: '',
      navio: '',
      viagem: '',
      portoOrigem: '',
      portoDestino: '',
      pesoBruto: '',
      quantidadeVolumes: '',
      tipoCarga: 'FCL',
      containers: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'containers',
  })

  const tipoCarga = watch('tipoCarga')

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true)

      const formData: ProcessoFormData = {
        numeroMBL: data.numeroMBL.trim(),
        numeroHBL: data.numeroHBL.trim(),
        numeroMHBL: data.numeroMHBL?.trim() || undefined,
        navio: data.navio.trim(),
        viagem: data.viagem.trim(),
        portoOrigem: data.portoOrigem.trim(),
        portoDestino: data.portoDestino.trim(),
        pesoBruto: parseFloat(data.pesoBruto),
        quantidadeVolumes: parseInt(data.quantidadeVolumes, 10),
        tipoCarga: data.tipoCarga,
        containers: data.containers.map((c) => ({
          numero: c.numero.trim(),
          tipo: c.tipo,
          peso: c.peso ? parseFloat(c.peso) : undefined,
        })),
      }

      await processoService.criar(formData)
      toast.success('Processo cadastrado com sucesso!')
      navigate('/processos')
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Erro ao cadastrar processo'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Header
        title="Cadastro de Processo"
        subtitle="Registre um novo processo de importacao"
      />

      <div className="mx-auto max-w-4xl p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Dados do BL */}
          <Card>
            <CardHeader>
              <h3 className="text-base font-semibold text-slate-800">
                Dados do BL
              </h3>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Input
                label="Numero do MBL"
                {...register('numeroMBL', {
                  required: 'MBL e obrigatorio',
                })}
                error={errors.numeroMBL?.message}
                placeholder="Ex: MAEU220145678"
                required
              />
              <Input
                label="Numero do HBL"
                {...register('numeroHBL', {
                  required: 'HBL e obrigatorio',
                })}
                error={errors.numeroHBL?.message}
                placeholder="Ex: HBL-2024-001"
                required
              />
              <Input
                label="Numero do MHBL"
                {...register('numeroMHBL')}
                placeholder="Opcional"
                helpText="Preencha se houver agente intermediario"
              />
            </CardContent>
          </Card>

          {/* Dados de Transporte */}
          <Card>
            <CardHeader>
              <h3 className="text-base font-semibold text-slate-800">
                Dados de Transporte
              </h3>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Navio"
                {...register('navio', {
                  required: 'Navio e obrigatorio',
                })}
                error={errors.navio?.message}
                placeholder="Ex: MSC GULSUN"
                required
              />
              <Input
                label="Viagem"
                {...register('viagem', {
                  required: 'Viagem e obrigatoria',
                })}
                error={errors.viagem?.message}
                placeholder="Ex: 024E"
                required
              />
              <Input
                label="Porto de Origem"
                {...register('portoOrigem', {
                  required: 'Porto de origem e obrigatorio',
                })}
                error={errors.portoOrigem?.message}
                placeholder="Ex: SHANGHAI (CNSHA)"
                required
              />
              <Input
                label="Porto de Destino"
                {...register('portoDestino', {
                  required: 'Porto de destino e obrigatorio',
                })}
                error={errors.portoDestino?.message}
                placeholder="Ex: SANTOS (BRSSZ)"
                required
              />
            </CardContent>
          </Card>

          {/* Dados da Carga */}
          <Card>
            <CardHeader>
              <h3 className="text-base font-semibold text-slate-800">
                Dados da Carga
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Input
                  label="Peso Bruto (kg)"
                  type="number"
                  step="0.01"
                  {...register('pesoBruto', {
                    required: 'Peso bruto e obrigatorio',
                    min: { value: 0.01, message: 'Peso deve ser maior que zero' },
                  })}
                  error={errors.pesoBruto?.message}
                  placeholder="Ex: 15420.50"
                  required
                />
                <Input
                  label="Quantidade de Volumes"
                  type="number"
                  {...register('quantidadeVolumes', {
                    required: 'Quantidade de volumes e obrigatoria',
                    min: { value: 1, message: 'Deve ter ao menos 1 volume' },
                  })}
                  error={errors.quantidadeVolumes?.message}
                  placeholder="Ex: 342"
                  required
                />
                <Select
                  label="Tipo de Carga"
                  {...register('tipoCarga', {
                    required: 'Tipo de carga e obrigatorio',
                  })}
                  error={errors.tipoCarga?.message}
                  options={[
                    { value: 'FCL', label: 'FCL - Full Container Load' },
                    { value: 'LCL', label: 'LCL - Less Container Load' },
                  ]}
                  required
                />
              </div>

              {/* Containers */}
              {tipoCarga === 'FCL' && (
                <div className="mt-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="text-sm font-medium text-slate-700">
                      Containers
                    </h4>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        append({ numero: '', tipo: '40HC', peso: '' })
                      }
                    >
                      <Plus className="h-4 w-4" />
                      Adicionar Container
                    </Button>
                  </div>

                  {fields.length === 0 && (
                    <p className="text-sm text-slate-500 py-4 text-center border border-dashed border-slate-200 rounded-lg">
                      Nenhum container adicionado. Clique em "Adicionar Container" para incluir.
                    </p>
                  )}

                  <div className="space-y-3">
                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="flex items-end gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3"
                      >
                        <div className="flex-1">
                          <Input
                            label="Numero"
                            {...register(
                              `containers.${index}.numero` as const,
                              { required: 'Obrigatorio' }
                            )}
                            error={errors.containers?.[index]?.numero?.message}
                            placeholder="Ex: MSKU1234567"
                            required
                          />
                        </div>
                        <div className="w-32">
                          <Select
                            label="Tipo"
                            {...register(
                              `containers.${index}.tipo` as const
                            )}
                            options={[
                              { value: '20GP', label: '20GP' },
                              { value: '40GP', label: '40GP' },
                              { value: '40HC', label: '40HC' },
                              { value: '20RF', label: '20RF' },
                              { value: '40RF', label: '40RF' },
                            ]}
                          />
                        </div>
                        <div className="w-36">
                          <Input
                            label="Peso (kg)"
                            type="number"
                            step="0.01"
                            {...register(
                              `containers.${index}.peso` as const
                            )}
                            placeholder="Opcional"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}
                          className="mb-1 text-danger-500 hover:text-danger-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/processos')}
            >
              Cancelar
            </Button>
            <Button type="submit" loading={loading}>
              Cadastrar Processo
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
