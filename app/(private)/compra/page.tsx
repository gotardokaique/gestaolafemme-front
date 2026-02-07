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

import type { Compra } from "@/services/compra/compra.schemas"
import { CompraCreateSheet } from "./components/compra-create-sheet"
import { useComprasTable } from "./components/use-compras-table"

import { ShoppingCart, Calendar, User, CreditCard, Banknote } from "lucide-react"
import { formatCurrency, formatDateBR } from "@/lib/utils"

export default function ComprasPage() {
  const {
    data,
    loading,
    reload,
  } = useComprasTable()

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <Card className="transition-smooth">
        <CardHeader className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-600">
              <ShoppingCart className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-responsive-lg">Compras</CardTitle>
              <CardDescription className="text-responsive-sm">Gerencie as compras e entradas de mercadorias.</CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <CompraCreateSheet onCreated={reload} />
          </div>
        </CardHeader>

        <CardContent>
          <TableData<Compra>
            data={data}
            emptyText={loading ? "Carregando..." : "Nenhuma compra registrada."}
            actionsKey="id"
            actionsWidthClassName="w-[50px]"
          >
            <TableData.Columns>
              <TableData.Column<Compra>
                name="dataCompra"
                label="Compra"
                render={(_, row) => (
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                      <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 dark:text-amber-400" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <div className="font-medium leading-tight truncate text-responsive-sm">
                          Compra #{row.id}
                        </div>
                      </div>

                      <div className="mt-1 flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>{formatDateBR(row.dataCompra)}</span>
                      </div>
                    </div>
                  </div>
                )}
              />

              <TableData.Column<Compra>
                name="fornecedorNome"
                label="Fornecedor"
                render={(_, row) => (
                  <div className="flex items-center gap-2">
                    <User className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                    <span className="text-xs sm:text-sm truncate">{row.fornecedorNome}</span>
                  </div>
                )}
              />

              <TableData.Column<Compra>
                name="valorTotal"
                label="Pagamento"
                render={(_, row) => (
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 font-medium text-emerald-600">
                      <Banknote className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="text-xs sm:text-sm">{formatCurrency(row.valorTotal)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                      <CreditCard className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      <span className="truncate">{row.formaPagamento}</span>
                    </div>
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
