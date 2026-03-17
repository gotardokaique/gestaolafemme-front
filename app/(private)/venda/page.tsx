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
import { ShoppingCart, Calendar, Banknote, User, CheckCircle2, XCircle, Eye } from "lucide-react"
import { formatCurrency, formatDateBR } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import type { Venda } from "@/services/venda/venda.schemas"

const getStatusBadge = (situacao: Venda['situacao']) => {
  if (!situacao) return <Badge variant="secondary">Desconhecido</Badge>
  if (situacao.id === 1) return <Badge className="bg-amber-500 text-white hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700 border-none shadow-sm">{situacao.nome}</Badge>
  if (situacao.id === 2) return <Badge className="bg-emerald-500 text-white hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 border-none shadow-sm">{situacao.nome}</Badge>
  if (situacao.id === 3) return <Badge className="bg-rose-500 text-white hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-700 border-none shadow-sm">{situacao.nome}</Badge>
  return <Badge variant="secondary">{situacao.nome}</Badge>
}

export default function VendasPage() {
  const { data, loading, reload, handleConcluir, handleCancelar, processingId } = useVendasTable()

  const [confirmState, setConfirmState] = React.useState<{ open: boolean; type: "concluir" | "cancelar" | null; id: number | null }>({
    open: false,
    type: null,
    id: null,
  })

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
            actionsKey="acoes"
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
              <TableData.Column<Venda>
                name={"situacao" as any}
                label="Situação"
                render={(_, row) => getStatusBadge(row.situacao)}
              />

              <TableData.Column<Venda>
                name={"acoes" as any}
                label=""
                render={(_, row) => (
                  <div className="flex items-center gap-1 justify-end">
                    {row.situacao?.id === 1 ? (
                      <>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          title="Concluir"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setConfirmState({ open: true, type: "concluir", id: row.id });
                          }}
                          disabled={processingId === row.id}
                          className="h-8 w-8 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          title="Cancelar"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setConfirmState({ open: true, type: "cancelar", id: row.id });
                          }}
                          disabled={processingId === row.id}
                          className="h-8 w-8 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/30"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <Button type="button" variant="ghost" size="icon" title="Visualizar" disabled className="h-8 w-8">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    )}
                  </div>
                )}
              />
            </TableData.Columns>
          </TableData>
        </CardContent>
      </Card>

      <Dialog open={confirmState.open} onOpenChange={(val) => setConfirmState((prev) => ({ ...prev, open: val }))}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {confirmState.type === "concluir" ? "Confirmar Conclusão" : "Confirmar Cancelamento"}
            </DialogTitle>
            <DialogDescription className="text-center w-fit">
              {confirmState.type === "concluir"
                ? "Deseja concluir essa compra?"
                : "Deseja cancelar essa compra?"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirmState({ open: false, type: null, id: null })}
              disabled={processingId === confirmState.id}
            >
              Voltar
            </Button>
            <Button
              type="button"
              variant={confirmState.type === "concluir" ? "default" : "destructive"}
              disabled={processingId === confirmState.id}
              className={confirmState.type === "concluir" ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""}
              onClick={async () => {
                if (!confirmState.id) return
                if (confirmState.type === "concluir") {
                  await handleConcluir(confirmState.id)
                } else {
                  await handleCancelar(confirmState.id)
                }
                setConfirmState({ open: false, type: null, id: null })
              }}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
