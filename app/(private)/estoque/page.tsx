"use client"

import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TableData } from "@/components/table-data/table-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Warehouse,
  AlertTriangle,
  Package,
  Settings2,
  Tag,
  Search
} from "lucide-react"

import { useEstoqueTable } from "./components/use-estoque-table"
import { EstoqueAjusteSheet } from "./components/estoque-ajuste-sheet"
import type { Estoque } from "@/services/estoque/estoque.schemas"

export default function EstoquePage() {
  const { data, loading, reload } = useEstoqueTable()
  const [selectedEstoque, setSelectedEstoque] = React.useState<Estoque | null>(null)
  const [isAjusteOpen, setIsAjusteOpen] = React.useState(false)

  const handleAjuste = (estoque: Estoque) => {
    setSelectedEstoque(estoque)
    setIsAjusteOpen(true)
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <Card className="transition-smooth">
        <CardHeader className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/20 text-purple-600">
              <Warehouse className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-responsive-lg">Saldo em Estoque</CardTitle>
              <CardDescription className="text-responsive-sm">Visão geral das quantidades reais e níveis críticos.</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <TableData<Estoque>
            data={data}
            emptyText={loading ? "Carregando..." : "Nenhum item em estoque."}
            actionsKey="productId"
          >
            <TableData.Columns>
              <TableData.Column<Estoque>
                name="produtoNome"
                label="Produto"
                render={(_, row) => (
                  <div className="flex flex-col">
                    <span className="font-medium text-responsive-sm">{row.produtoNome}</span>
                    <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-muted-foreground uppercase font-mono">
                      <span className="truncate">{row.produtoCodigo}</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5 truncate">
                        <Tag className="h-2.5 w-2.5 shrink-0" />
                        {row.categoriaNome}
                      </span>
                    </div>
                  </div>
                )}
              />

              <TableData.Column<Estoque>
                name="quantidadeAtual"
                label="Saldo Atual"
                render={(_, row) => {
                  const isLow = row.quantidadeAtual <= row.estoqueMinimo
                  return (
                    <div className="flex items-center gap-2">
                      <span className={`text-base sm:text-lg font-bold ${isLow ? 'text-destructive' : 'text-foreground'}`}>
                        {row.quantidadeAtual}
                      </span>
                      <span className="text-xs text-muted-foreground">un</span>
                      {isLow && (
                        <Badge variant="destructive" className="h-5 px-1.5 text-[10px] animate-pulse">
                          BAIXO
                        </Badge>
                      )}
                    </div>
                  )
                }}
              />

              <TableData.Column<Estoque>
                name="estoqueMinimo"
                label="Mínimo"
                render={(_, row) => (
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <AlertTriangle className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    <span className="text-xs sm:text-sm">{row.estoqueMinimo} un</span>
                  </div>
                )}
              />

              <TableData.Column<Estoque>
                name="productId"
                label=""
                render={(_, row) => (
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAjuste(row)}
                      className="gap-2 h-8 text-xs sm:text-sm"
                    >
                      <Settings2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      <span className="hidden sm:inline">Ajustar</span>
                      <span className="sm:hidden">Ajustar</span>
                    </Button>
                  </div>
                )}
              />
            </TableData.Columns>
          </TableData>
        </CardContent>
      </Card>

      <EstoqueAjusteSheet
        estoque={selectedEstoque}
        open={isAjusteOpen}
        onOpenChange={setIsAjusteOpen}
        onUpdated={reload}
      />
    </div>
  )
}
