"use client"

import * as React from "react"
import { toast } from "@/components/ui/sonner"
import { produtoApi } from "@/services/produto/produto.api"
import type { Produto } from "@/services/produto/produto.schemas"

export function useProdutoTable() {
  const [data, setData] = React.useState<Produto[]>([])
  const [loading, setLoading] = React.useState(true)

  const load = React.useCallback(async () => {
    setLoading(true)
    try {
      // Carrega todos os produtos - o filtro é feito pelo TableData.Tabs no cliente
      const res = await produtoApi.list()
      setData(res)
    } catch (e: any) {
      toast.error(e?.message ?? "Não foi possível carregar produtos.")
      setData([])
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    load()
  }, [load])

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

  return {
    data,
    loading,
    reload: load,
    handleStatusChange,
    handleDelete,
  }
}

