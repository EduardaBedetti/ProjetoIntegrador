import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, X, CheckCircle, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/Button'

interface DocumentData {
  nomeNavio: string
  portoEmbarque: string
  portoDestino: string
  pesoBruto: string
  metragem: string
  quantidade: string
  container: string
  lacre: string
  dataEmbarque: string
}

const emptyDoc: DocumentData = {
  nomeNavio: '',
  portoEmbarque: '',
  portoDestino: '',
  pesoBruto: '',
  metragem: '',
  quantidade: '',
  container: '',
  lacre: '',
  dataEmbarque: '',
}

const fieldLabels: Record<keyof DocumentData, string> = {
  nomeNavio: 'Nome do Navio',
  portoEmbarque: 'Porto Embarque',
  portoDestino: 'Porto Destino',
  pesoBruto: 'Peso Bruto',
  metragem: 'Metragem',
  quantidade: 'Quantidade',
  container: 'Container',
  lacre: 'Lacre',
  dataEmbarque: 'Data Embarque',
}

export function ProcessoForm() {
  const navigate = useNavigate()
  const [doc1, setDoc1] = useState<DocumentData>({ ...emptyDoc })
  const [doc2, setDoc2] = useState<DocumentData>({ ...emptyDoc })
  const [file1, setFile1] = useState<File | null>(null)
  const [file2, setFile2] = useState<File | null>(null)
  const fileRef1 = useRef<HTMLInputElement>(null)
  const fileRef2 = useRef<HTMLInputElement>(null)

  const handleFileUpload = (fileNum: 1 | 2) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (fileNum === 1) {
      setFile1(file)
      // Simulate parsing document data
      setDoc1({
        nomeNavio: 'MSC GULSUN',
        portoEmbarque: 'Shanghai',
        portoDestino: 'Santos',
        pesoBruto: '8000',
        metragem: '40',
        quantidade: '100',
        container: 'MSKU1234567',
        lacre: 'LACRE1',
        dataEmbarque: '11/03',
      })
    } else {
      setFile2(file)
      setDoc2({
        nomeNavio: 'MSC GULSUN',
        portoEmbarque: 'Shanghai',
        portoDestino: 'Santos',
        pesoBruto: '8000',
        metragem: '40',
        quantidade: '100',
        container: 'MSKU1234567',
        lacre: 'LACRE1',
        dataEmbarque: '11/03',
      })
    }
    toast.success(`Documento ${fileNum} carregado com sucesso!`)
  }

  const clearFile = (fileNum: 1 | 2) => {
    if (fileNum === 1) {
      setFile1(null)
      setDoc1({ ...emptyDoc })
      if (fileRef1.current) fileRef1.current.value = ''
    } else {
      setFile2(null)
      setDoc2({ ...emptyDoc })
      if (fileRef2.current) fileRef2.current.value = ''
    }
  }

  const validateField = (key: keyof DocumentData): 'match' | 'mismatch' | 'empty' => {
    if (!doc1[key] || !doc2[key]) return 'empty'
    return doc1[key] === doc2[key] ? 'match' : 'mismatch'
  }

  const handleSave = () => {
    toast.success('Processo salvo com sucesso!')
    navigate('/processos')
  }

  const fields = Object.keys(fieldLabels) as (keyof DocumentData)[]

  return (
    <div className="bg-[#F1F3F5] min-h-screen">
      <Header />

      <div className="p-8">
        {/* Document upload area */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Document 1 */}
          <div className="rounded-lg border-2 border-dashed border-[#2E2E2E] bg-white p-6">
            <h3 className="mb-4 text-center text-sm font-semibold text-[#2E2E2E]">Documento 1</h3>
            {file1 ? (
              <div className="flex items-center justify-between rounded bg-[#F1F3F5] px-4 py-3">
                <span className="text-sm text-[#2E2E2E] truncate">{file1.name}</span>
                <button onClick={() => clearFile(1)} className="ml-2 text-[#2E2E2E] hover:text-red-500">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileRef1.current?.click()}
                className="flex w-full flex-col items-center gap-2 rounded-lg border border-[#2E2E2E] bg-[#F1F3F5] px-4 py-8 text-[#2E2E2E] transition hover:border-[#1D70A2] hover:text-[#1D70A2]"
              >
                <Upload className="h-8 w-8" />
                <span className="text-sm">Clique para carregar</span>
              </button>
            )}
            <input
              ref={fileRef1}
              type="file"
              className="hidden"
              accept=".pdf,.xlsx,.xls,.csv"
              onChange={handleFileUpload(1)}
            />
            {file1 && (
              <button
                onClick={() => clearFile(1)}
                className="mt-3 w-full rounded bg-[#F4A261] px-4 py-2 text-sm font-medium text-white hover:bg-[#e0913a]"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Document 2 */}
          <div className="rounded-lg border-2 border-dashed border-[#2E2E2E] bg-white p-6">
            <h3 className="mb-4 text-center text-sm font-semibold text-[#2E2E2E]">Documento 2</h3>
            {file2 ? (
              <div className="flex items-center justify-between rounded bg-[#F1F3F5] px-4 py-3">
                <span className="text-sm text-[#2E2E2E] truncate">{file2.name}</span>
                <button onClick={() => clearFile(2)} className="ml-2 text-[#2E2E2E] hover:text-red-500">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileRef2.current?.click()}
                className="flex w-full flex-col items-center gap-2 rounded-lg border border-[#2E2E2E] bg-[#F1F3F5] px-4 py-8 text-[#2E2E2E] transition hover:border-[#1D70A2] hover:text-[#1D70A2]"
              >
                <Upload className="h-8 w-8" />
                <span className="text-sm">Clique para carregar</span>
              </button>
            )}
            <input
              ref={fileRef2}
              type="file"
              className="hidden"
              accept=".pdf,.xlsx,.xls,.csv"
              onChange={handleFileUpload(2)}
            />
            {file2 && (
              <button
                onClick={() => clearFile(2)}
                className="mt-3 w-full rounded bg-[#F4A261] px-4 py-2 text-sm font-medium text-white hover:bg-[#e0913a]"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* Comparison Table */}
        <div className="overflow-hidden rounded-lg">
          <table className="w-full">
            <thead>
              <tr className="bg-[#0B3C5D] text-white">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Campo
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Documento 1
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Documento 2
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">
                  Validacao
                </th>
              </tr>
            </thead>
            <tbody>
              {fields.map((key) => {
                const status = validateField(key)
                return (
                  <tr
                    key={key}
                    className="border-2 border-[#0B3C5D] bg-[#8DAAB4]"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-[#2E2E2E]">
                      {fieldLabels[key]}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#2E2E2E]">
                      {doc1[key] || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#2E2E2E]">
                      {doc2[key] || '-'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {status === 'match' && (
                        <CheckCircle className="mx-auto h-5 w-5 text-green-500" />
                      )}
                      {status === 'mismatch' && (
                        <XCircle className="mx-auto h-5 w-5 text-[#F4A261]" />
                      )}
                      {status === 'empty' && (
                        <span className="text-[#2E2E2E]">-</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => navigate('/processos')}
            className="rounded-[10px] border border-[#2E2E2E] bg-white px-8 py-3 text-base font-medium text-[#2E2E2E] transition hover:bg-[#F1F3F5]"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="rounded-[10px] bg-[#1D70A2] px-8 py-3 text-base font-medium text-[#F1F3F5] transition hover:bg-[#186090]"
          >
            Salvar Processo
          </button>
        </div>
      </div>
    </div>
  )
}
