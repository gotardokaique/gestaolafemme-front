"use client"

import * as React from "react"
import { toast } from "@/components/ui/sonner"
import { movimentacaoEstoqueApi } from "@/services/movimentacao-estoque/movimentacao-estoque.api"
import type { MovimentacaoEstoque } from "@/services/movimentacao-estoque/movimentacao-estoque.schemas"

export function useMovimentacoesTable() {
  const [data, setData] = React.useState<MovimentacaoEstoque[]>([])
  const [loading, setLoading] = React.useState(true)

  const load = React.useCallback(async () => {
    setLoading(true)
    try {
      const res = await movimentacaoEstoqueApi.list()
      setData(res)
    } catch (e: any) {
      toast.error(e?.message ?? "Não foi possível carregar movimentações.")
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
