"use client"

import * as React from "react"
import toast from "react-hot-toast"
import { produtoApi } from "@/services/produto/produto.api"
import type { Produto } from "@/services/produto/produto.schemas"

export function useProdutoTable() {
  const [data, setData] = React.useState<Produto[]>([])
  const [loading, setLoading] = React.useState(true)

  const [filterParams, setFilterParams] = React.useState<URLSearchParams | null>(null)

  const load = React.useCallback(
    async (params?: URLSearchParams | null) => {
      const effectiveParams = params !== undefined ? params : filterParams

      setLoading(true)
      try {
        const res = await produtoApi.list({
          filterParams: effectiveParams,
        })
        setData(res)
      } catch (e: any) {
        toast.error(e?.message ?? "Não foi possível carregar produtos.")
        setData([])
      } finally {
        setLoading(false)
      }
    },
    [filterParams]
  )

  React.useEffect(() => {
    load(filterParams)
  }, [filterParams, load])

  const handleStatusChange = async (id: number) => {
    try {
      const res = await produtoApi.changeStatus(id)
      toast.success(res.message || "Status alterado com sucesso!")
      load()
    } catch (e: any) {
      toast.error(e?.message ?? "Erro ao alterar status.")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return
    try {
      const res = await produtoApi.delete(id)
      toast.success(res.message || "Produto excluído com sucesso!")
      load()
    } catch (e: any) {
      toast.error(e?.message ?? "Erro ao excluir produto.")
    }
  }

  const applyFilters = React.useCallback((params: URLSearchParams) => {
    setFilterParams(params)
  }, [])

  const clearFilters = React.useCallback(() => {
    setFilterParams(null)
  }, [])

  return {
    data,
    loading,
    reload: () => load(filterParams),
    handleStatusChange,
    handleDelete,
    applyFilters,
    clearFilters,
  }
}
