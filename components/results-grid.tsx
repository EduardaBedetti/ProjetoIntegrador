"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FileSearch } from "lucide-react"

interface ResultsGridProps {
  data: Record<string, string>[]
}

export function ResultsGrid({ data }: ResultsGridProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <FileSearch className="size-12 text-muted-foreground/50" />
          <p className="mt-4 text-sm text-muted-foreground">
            Nenhum resultado ainda. Envie um arquivo para ver os dados
            extraídos.
          </p>
        </CardContent>
      </Card>
    )
  }

  const columns = Object.keys(data[0])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resultados da Extração</CardTitle>
        <CardDescription>
          {data.length} {data.length === 1 ? "registro encontrado" : "registros encontrados"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col}>{col}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((col) => (
                  <TableCell key={col}>{row[col] ?? "—"}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
