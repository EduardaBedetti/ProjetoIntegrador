"use client"

import { useState } from "react"
import { ExtractForm } from "@/components/extract-form"
import { ResultsGrid } from "@/components/results-grid"
import { AlertCircle } from "lucide-react"

export default function Home() {
  const [results, setResults] = useState<Record<string, string>[]>([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  return (
    <main className="mx-auto flex min-h-svh max-w-3xl flex-col gap-6 px-4 py-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-balance">
          Extrator de Documentos
        </h1>
        <p className="text-sm text-muted-foreground">
          Faça upload de um documento e defina os campos para extração
          automática via LlamaParse.
        </p>
      </div>

      <ExtractForm
        onResult={(data) => {
          setResults(data)
          setError("")
        }}
        onError={setError}
        onLoading={setLoading}
      />

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          {error}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="size-6 animate-spin rounded-full border-2 border-muted-foreground/25 border-t-foreground" />
        </div>
      )}

      {!loading && <ResultsGrid data={results} />}
    </main>
  )
}
