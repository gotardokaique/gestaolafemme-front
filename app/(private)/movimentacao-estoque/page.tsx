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
import {
  ArrowUpCircle,
  ArrowDownCircle,
  Settings,
  Calendar,
  Package,
  Info
} from "lucide-react"

import { useMovimentacoesTable } from "./components/use-movimentacoes-table"
import { formatDateBR } from "@/lib/utils"
import type { MovimentacaoEstoque } from "@/services/movimentacao-estoque/movimentacao-estoque.schemas"

export default function MovimentacaoEstoquePage() {
  const { data, loading } = useMovimentacoesTable()

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-teal-500/30 text-teal-500">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Movimentações do Estoque</CardTitle>
              <CardDescription>Histórico completo de entradas, saídas e ajustes de produtos.</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <TableData<MovimentacaoEstoque>
            data={data}
            emptyText={loading ? "Carregando..." : "Nenhuma movimentação encontrada."}
            actionsKey="id"
          >
            <TableData.Columns>
              <TableData.Column<MovimentacaoEstoque>
                name="dataMovimentacao"
                label="Data"
                render={(_, row) => (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">{formatDateBR(row.dataMovimentacao)}</span>
                  </div>
                )}
              />

              <TableData.Column<MovimentacaoEstoque>
                name="produtoNome"
                label="Produto"
                render={(_, row) => (
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">{row.produtoNome}</span>
                    <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider">ID: {row.produtoId}</span>
                  </div>
                )}
              />

              <TableData.Column<MovimentacaoEstoque>
                name="tipoMovimentacao"
                label="Tipo"
                render={(_, row) => {
                  const type = row.tipoMovimentacao
                  if (type === "ENTRADA") {
                    return (
                      <Badge variant="default" className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-200 gap-1">
                        <ArrowUpCircle className="h-3 w-3" />
                        Entrada
                      </Badge>
                    )
                  }
                  if (type === "SAIDA") {
                    return (
                      <Badge variant="destructive" className="bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 border-rose-200 gap-1">
                        <ArrowDownCircle className="h-3 w-3" />
                        Saída
                      </Badge>
                    )
                  }
                  return (
                    <Badge variant="secondary" className="gap-1">
                      <Settings className="h-3 w-3" />
                      Ajuste
                    </Badge>
                  )
                }}
              />

              <TableData.Column<MovimentacaoEstoque>
                name="quantidade"
                label="Qtd"
                render={(_, row) => (
                  <span className={`font-bold ${row.tipoMovimentacao === 'SAIDA' ? 'text-rose-600' : row.tipoMovimentacao === 'ENTRADA' ? 'text-emerald-600' : 'text-foreground'}`}>
                    {row.tipoMovimentacao === "SAIDA" ? "-" : "+"}{row.quantidade} un
                  </span>
                )}
              />

              <TableData.Column<MovimentacaoEstoque>
                name="observacao"
                label="Observação"
                render={(_, row) => (
                  <div className="flex items-center gap-2 max-w-[200px]">
                    {row.observacao ? (
                      <>
                        <Info className="h-3 w-3 text-muted-foreground shrink-0" />
                        <span className="text-xs text-muted-foreground truncate" title={row.observacao}>
                          {row.observacao}
                        </span>
                      </>
                    ) : (
                      <span className="text-xs text-muted-foreground/50">—</span>
                    )}
                  </div>
                )}
              />
            </TableData.Columns>
          </TableData>
        </CardContent>
      </Card>
    </div>
  )
}
