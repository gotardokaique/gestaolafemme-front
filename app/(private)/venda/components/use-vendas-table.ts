"use client"

import * as React from "react"
import { toast } from "@/components/ui/sonner"
import { vendaApi } from "@/services/venda/venda.api"
import type { Venda } from "@/services/venda/venda.schemas"

export function useVendasTable() {
  const [data, setData] = React.useState<Venda[]>([])
  const [loading, setLoading] = React.useState(true)

  const load = React.useCallback(async () => {
    setLoading(true)
    try {
      const res = await vendaApi.list()
      setData(res)
    } catch (e: any) {
      toast.error(e?.message ?? "Não foi possível carregar vendas.")
      setData([])
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    load()
  }, [load])

  return {
    data,
    loading,
    reload: load,
  }
}
