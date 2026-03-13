"use client"

import { useState, useRef, type FormEvent } from "react"
import { Upload, X, Plus, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface FieldDefinition {
  name: string
  description: string
}

interface ExtractFormProps {
  onResult: (data: Record<string, string>[]) => void
  onError: (error: string) => void
  onLoading: (loading: boolean) => void
}

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/Extract`

export function ExtractForm({ onResult, onError, onLoading }: ExtractFormProps) {
  const [file, setFile] = useState<File | null>(null)
  const [fields, setFields] = useState<FieldDefinition[]>([
    { name: "", description: "" },
  ])
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function addField() {
    setFields((prev) => [...prev, { name: "", description: "" }])
  }

  function removeField(index: number) {
    setFields((prev) => prev.filter((_, i) => i !== index))
  }

  function updateField(
    index: number,
    key: keyof FieldDefinition,
    value: string
  ) {
    setFields((prev) =>
      prev.map((f, i) => (i === index ? { ...f, [key]: value } : f))
    )
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const dropped = e.dataTransfer.files[0]
    if (dropped) setFile(dropped)
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0]
    if (selected) setFile(selected)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (!file) {
      onError("Selecione um arquivo para enviar.")
      return
    }

    const validFields = fields.filter((f) => f.name.trim() !== "")
    if (validFields.length === 0) {
      onError("Adicione pelo menos um campo com nome.")
      return
    }

    setLoading(true)
    onLoading(true)
    onError("")

    try {
      const formData = new FormData()
      formData.append("File", file)
      formData.append("Fields", JSON.stringify(validFields))

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(text || `Erro ${response.status}`)
      }

      const data = await response.json()
      onResult(Array.isArray(data) ? data : [data])
    } catch (err) {
      onError(
        err instanceof Error ? err.message : "Erro ao processar a requisição."
      )
    } finally {
      setLoading(false)
      onLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Extração de Dados</CardTitle>
        <CardDescription>
          Envie um arquivo e defina os campos que deseja extrair.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* File Upload */}
          <div className="flex flex-col gap-2">
            <Label>Arquivo</Label>
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/40 px-6 py-10 text-center transition-colors hover:border-muted-foreground/50 hover:bg-muted/60"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  fileInputRef.current?.click()
                }
              }}
              aria-label="Selecionar arquivo para upload"
            >
              <Upload className="size-8 text-muted-foreground" />
              {file ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">
                    {file.name}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setFile(null)
                      if (fileInputRef.current) fileInputRef.current.value = ""
                    }}
                    className="rounded-full p-0.5 text-muted-foreground hover:text-foreground"
                    aria-label="Remover arquivo"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Arraste e solte ou clique para selecionar
                </p>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              className="sr-only"
              aria-hidden="true"
            />
          </div>

          {/* Fields */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Label>Campos para Extração</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addField}
              >
                <Plus className="size-4" />
                Adicionar Campo
              </Button>
            </div>

            <div className="flex flex-col gap-3">
              {fields.map((field, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="flex flex-1 flex-col gap-1">
                    <Input
                      placeholder="Nome do campo (ex: NomeCliente)"
                      value={field.name}
                      onChange={(e) =>
                        updateField(index, "name", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <Input
                      placeholder="Descrição (opcional)"
                      value={field.description}
                      onChange={(e) =>
                        updateField(index, "description", e.target.value)
                      }
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeField(index)}
                    disabled={fields.length === 1}
                    aria-label="Remover campo"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <Button type="submit" size="lg" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <Upload className="size-4" />
                Enviar e Extrair
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
