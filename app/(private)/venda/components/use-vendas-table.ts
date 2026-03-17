"use client"

import * as React from "react"
import toast from "react-hot-toast"
import { vendaApi } from "@/services/venda/venda.api"
import type { Venda } from "@/services/venda/venda.schemas"

export function useVendasTable() {
  const [data, setData] = React.useState<Venda[]>([])
  const [loading, setLoading] = React.useState(true)
  const [processingId, setProcessingId] = React.useState<number | null>(null)

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

  const handleConcluir = async (id: number) => {
    setProcessingId(id)
    try {
      await vendaApi.concluir(id)
      toast.success("Venda concluída com sucesso!")
      load()
    } catch (e: any) {
      toast.error(e?.message ?? "Erro ao concluir venda.")
    } finally {
      setProcessingId(null)
    }
  }

  const handleCancelar = async (id: number) => {
    setProcessingId(id)
    try {
      await vendaApi.cancelar(id)
      toast.success("Venda cancelada com sucesso!")
      load()
    } catch (e: any) {
      toast.error(e?.message ?? "Erro ao cancelar venda.")
    } finally {
      setProcessingId(null)
    }
  }

  const handleGerarLink = async (id: number) => {
    setProcessingId(id)
    try {
      const res = await vendaApi.gerarLinkPagamento(id)
      return res
    } catch (e: any) {
      toast.error(e?.message ?? "Erro ao gerar link de pagamento.")
      return null
    } finally {
      setProcessingId(null)
    }
  }

  React.useEffect(() => {
    load()
  }, [load])

  return {
    data,
    loading,
    processingId,
    reload: load,
    handleConcluir,
    handleCancelar,
    handleGerarLink,
  }
}
