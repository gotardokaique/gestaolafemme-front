"use client"

import * as React from "react"
import { toast } from "sonner"
import Link from "next/link"
import { DollarSign, ShoppingBag, ShoppingCart, TrendingUp, TrendingDown, Package, Tag, Truck } from "lucide-react"

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
    <div className="flex flex-col gap-4 sm:gap-6">
      <h1 className="text-responsive-2xl font-bold tracking-tight">Dashboard</h1>

      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="transition-smooth hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Atual</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-xl sm:text-2xl font-bold ${data && data.saldoAtual >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatCurrency(data?.saldoAtual ?? 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Balanço geral
            </p>
          </CardContent>
        </Card>

        <Card className="transition-smooth hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas (Mês)</CardTitle>
            <ShoppingBag className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{formatCurrency(data?.valorTotalVendasMes ?? 0)}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              <span className="font-medium text-foreground mr-1">{data?.totalVendasMes ?? 0}</span> vendas realizadas
            </div>
          </CardContent>
        </Card>

        <Card className="transition-smooth hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compras (Mês)</CardTitle>
            <ShoppingCart className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{formatCurrency(data?.valorTotalComprasMes ?? 0)}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
              <span className="font-medium text-foreground mr-1">{data?.totalComprasMes ?? 0}</span> compras realizadas
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos ou mais detalhes poderiam vir aqui */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-7">
        <Card className="lg:col-span-4 transition-smooth hover:shadow-md">
          <CardHeader>
            <CardTitle className="text-responsive-lg">Visão Geral</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[200px] sm:h-[250px] flex items-center justify-center text-muted-foreground text-sm">
              Gráfico de evolução (Em breve)
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3 transition-smooth hover:shadow-md">
          <CardHeader>
            <CardTitle className="text-responsive-lg">Atalhos Rápidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              <Link href="/produto" className="flex items-center gap-4 p-3 rounded-lg border transition-colors group border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-md group-hover:bg-purple-200 transition-colors">
                  <Package className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-sm text-foreground">Produtos</h3>
                  <p className="text-xs text-muted-foreground">Gerenciar catálogo</p>
                </div>
              </Link>

              <Link href="/categoria-produto" className="flex items-center gap-4 p-3 rounded-lg border  transition-colors group border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <div className="p-2 bg-pink-100 text-pink-600 rounded-md group-hover:bg-pink-200 transition-colors">
                  <Tag className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-sm text-foreground">Categorias</h3>
                  <p className="text-xs text-muted-foreground">Organizar produtos</p>
                </div>
              </Link>

              <Link href="/fornecedor" className="flex items-center gap-4 p-3 rounded-lg border transition-colors group border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-md group-hover:bg-blue-200 transition-colors">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-sm text-foreground">Fornecedores</h3>
                  <p className="text-xs text-muted-foreground">Gestão de parceiros</p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
