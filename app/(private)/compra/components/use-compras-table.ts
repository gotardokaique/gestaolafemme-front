"use client"

import * as React from "react"
import { toast } from "@/components/ui/sonner"
import { compraApi } from "@/services/compra/compra.api"
import type { Compra } from "@/services/compra/compra.schemas"

export function useComprasTable() {
  const [data, setData] = React.useState<Compra[]>([])
  const [loading, setLoading] = React.useState(true)

  const load = React.useCallback(async () => {
    setLoading(true)
    try {
      const res = await compraApi.list()
      setData(res)
    } catch (e: any) {
      toast.error(e?.message ?? "Não foi possível carregar compras.")
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
