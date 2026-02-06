"use client"

import * as React from "react"
import { toast } from "sonner"
import { DollarSign, ShoppingBag, ShoppingCart, TrendingUp, TrendingDown } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { dashboardApi } from "@/services/dashboard/dashboard.api"
import type { Dashboard } from "@/services/dashboard/dashboard.schemas"
import { formatCurrency } from "@/lib/utils"

export default function DashboardPage() {
  const [data, setData] = React.useState<Dashboard | null>(null)
  const [loading, setLoading] = React.useState(true)

  const loadData = React.useCallback(async () => {
    try {
      setLoading(true)
      const res = await dashboardApi.get()
      setData(res)
    } catch (error) {
      toast.error("Erro ao carregar dashboard.")
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    loadData()
  }, [loadData])

  if (loading && !data) {
    return <div className="p-8 text-center text-muted-foreground">Carregando indicadores...</div>
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>

      {/* Cards de Métricas */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Saldo Atual */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Atual</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${data && data.saldoAtual >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatCurrency(data?.saldoAtual ?? 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Balanço geral
            </p>
          </CardContent>
        </Card>

        {/* Vendas no Mês */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas (Mês)</CardTitle>
            <ShoppingBag className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data?.valorTotalVendasMes ?? 0)}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              <span className="font-medium text-foreground mr-1">{data?.totalVendasMes ?? 0}</span> vendas realizadas
            </div>
          </CardContent>
        </Card>

        {/* Compras no Mês */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compras (Mês)</CardTitle>
            <ShoppingCart className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data?.valorTotalComprasMes ?? 0)}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
              <span className="font-medium text-foreground mr-1">{data?.totalComprasMes ?? 0}</span> compras realizadas
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos ou mais detalhes poderiam vir aqui */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Visão Geral</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
              Gráfico de evolução (Em breve)
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Atalhos Rápidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                    Use o menu lateral para acessar as funcionalidades completas.
                </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
