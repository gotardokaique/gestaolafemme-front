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
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpCircle,
  ArrowDownCircle,
  Filter
} from "lucide-react"
import { formatCurrency, formatDateBR, cn } from "@/lib/utils"
import { financeiroApi } from "@/services/financeiro/financeiro.api"
import type { FinanceiroResumo, LancamentoFinanceiro } from "@/services/financeiro/financeiro.schemas"
import { toast } from "@/components/ui/sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LancamentoFinanceiroCreateSheet } from "./components/financeiro-create-sheet"

export default function FinanceiroPage() {
  const [data, setData] = React.useState<FinanceiroResumo | null>(null)
  const [loading, setLoading] = React.useState(true)

  const loadData = React.useCallback(async () => {
    setLoading(true)
    try {
      const res = await financeiroApi.getResumo()
      setData(res)
    } catch (err) {
      toast.error("Erro ao carregar dados financeiros.")
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    loadData()
  }, [loadData])

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="relative overflow-hidden transition-smooth hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Atual</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{formatCurrency(data?.saldoAtual ?? 0)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total em caixa na unidade
            </p>
          </CardContent>
          <div className="absolute bottom-0 left-0 h-1 w-full bg-primary" />
        </Card>

        <Card className="transition-smooth hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-emerald-600">Total Entradas</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-emerald-600">
              {formatCurrency(data?.totalEntradas ?? 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Acumulado de vendas
            </p>
          </CardContent>
        </Card>

        <Card className="transition-smooth hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-rose-600">Total Saídas</CardTitle>
            <TrendingDown className="h-4 w-4 text-rose-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-rose-600">
              {formatCurrency(data?.totalSaidas ?? 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Acumulado de compras
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="transition-smooth">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-600">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-responsive-lg">Lançamentos Financeiros</CardTitle>
              <CardDescription className="text-responsive-sm">Visualização detalhada de todas as entradas e saídas.</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LancamentoFinanceiroCreateSheet onCreated={loadData} />
            <Button variant="outline" size="sm" onClick={loadData} className="text-xs sm:text-sm">
              Atualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <TableData<LancamentoFinanceiro>
            data={data?.lancamentos ?? []}
            emptyText={loading ? "Carregando..." : "Nenhum lançamento encontrado."}
            actionsKey="id"
          >
            <TableData.Columns>
              <TableData.Column<LancamentoFinanceiro>
                name="dataLancamento"
                label="Data"
                render={(_, row) => (
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    {formatDateBR(row.dataLancamento)}
                  </span>
                )}
              />

              <TableData.Column<LancamentoFinanceiro>
                name="descricao"
                label="Descrição"
                render={(_, row) => (
                  <div className="flex flex-col">
                    <span className="font-medium text-responsive-sm truncate">{row.descricao}</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                      ID: #{row.id}
                    </span>
                  </div>
                )}
              />

              <TableData.Column<LancamentoFinanceiro>
                name="tipo"
                label="Tipo"
                render={(_, row) => {
                  const isEntrada = row.tipo === "ENTRADA"
                  return (
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      {isEntrada ? (
                        <ArrowUpCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-500" />
                      ) : (
                        <ArrowDownCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-rose-500" />
                      )}
                      <Badge
                        variant={isEntrada ? "default" : "secondary"}
                        className={cn(
                          "text-[10px] sm:text-xs",
                          isEntrada ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none" : "bg-rose-100 text-rose-700 hover:bg-rose-100 border-none"
                        )}
                      >
                        {isEntrada ? "Receita" : "Despesa"}
                      </Badge>
                    </div>
                  )
                }}
              />

              <TableData.Column<LancamentoFinanceiro>
                name="valor"
                label="Valor"
                render={(_, row) => (
                  <span className={cn(
                    "font-bold text-xs sm:text-sm",
                    row.tipo === "ENTRADA" ? "text-emerald-600" : "text-rose-600"
                  )}>
                    {row.tipo === "ENTRADA" ? "+ " : "- "}
                    {formatCurrency(row.valor)}
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

