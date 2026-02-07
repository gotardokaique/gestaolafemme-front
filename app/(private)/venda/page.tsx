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
import { useVendasTable } from "./components/use-vendas-table"
import { VendaCreateSheet } from "./components/venda-create-sheet"
import { ShoppingCart, Calendar, Banknote, User } from "lucide-react"
import { formatCurrency, formatDateBR } from "@/lib/utils"

import type { Venda } from "@/services/venda/venda.schemas"

export default function VendasPage() {
  const { data, loading, reload } = useVendasTable()

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <Card className="transition-smooth">
        <CardHeader className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-600">
              <ShoppingCart className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-responsive-lg">Vendas</CardTitle>
              <CardDescription className="text-responsive-sm">Histórico de vendas realizadas pela unidade.</CardDescription>
            </div>
          </div>

          <VendaCreateSheet onCreated={reload} />
        </CardHeader>

        <CardContent>
          <TableData<Venda>
            data={data}
            emptyText={loading ? "Carregando..." : "Nenhuma venda cadastrada."}
            actionsKey="id"
          >
            <TableData.Columns>
              <TableData.Column<Venda>
                name="id"
                label="Venda"
                render={(_, row) => (
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                      <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </div>
                    <span className="font-mono font-medium text-xs sm:text-sm">#{row.id}</span>
                  </div>
                )}
              />

              <TableData.Column<Venda>
                name="dataVenda"
                label="Data"
                render={(_, row) => (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-xs sm:text-sm">{formatDateBR(row.dataVenda)}</span>
                  </div>
                )}
              />

              <TableData.Column<Venda>
                name="formaPagamento"
                label="Pagamento"
                render={(_, row) => (
                  <div className="flex items-center gap-2">
                    <Banknote className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                    <span className="text-xs sm:text-sm font-medium truncate">{row.formaPagamento}</span>
                  </div>
                )}
              />

              <TableData.Column<Venda>
                name="valorTotal"
                label="Total"
                render={(_, row) => (
                  <span className="text-sm sm:text-base font-bold text-primary">
                    {formatCurrency(row.valorTotal)}
                  </span>
                )}
              />
            </TableData.Columns>
          </TableData>
        </CardContent>
      </Card>
    </div>
  )
}
