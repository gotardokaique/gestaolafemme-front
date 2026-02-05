"use client"

import * as React from "react"
import { toast } from "@/components/ui/sonner"
import { estoqueApi } from "@/services/estoque/estoque.api"
import type { Estoque } from "@/services/estoque/estoque.schemas"

export function useEstoqueTable() {
  const [data, setData] = React.useState<Estoque[]>([])
  const [loading, setLoading] = React.useState(true)

  const load = React.useCallback(async () => {
    setLoading(true)
    try {
      const res = await estoqueApi.list()
      setData(res)
    } catch (e: any) {
      toast.error(e?.message ?? "Não foi possível carregar o estoque.")
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
