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
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>Vendas</CardTitle>
            <CardDescription>Histórico de vendas realizadas pela unidade.</CardDescription>
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
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10 text-primary">
                      <ShoppingCart className="h-4 w-4" />
                    </div>
                    <span className="font-mono font-medium">#{row.id}</span>
                  </div>
                )}
              />

              <TableData.Column<Venda>
                name="dataVenda"
                label="Data"
                render={(_, row) => (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDateBR(row.dataVenda)}</span>
                  </div>
                )}
              />

              <TableData.Column<Venda>
                name="formaPagamento"
                label="Pagamento"
                render={(_, row) => (
                  <div className="flex items-center gap-2">
                    <Banknote className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{row.formaPagamento}</span>
                  </div>
                )}
              />

              <TableData.Column<Venda>
                name="valorTotal"
                label="Total"
                render={(_, row) => (
                  <span className="text-base font-bold text-primary">
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
