"use client"

import * as React from "react"
import { toast } from "@/components/ui/sonner"
import { fornecedorApi } from "@/services/fornecedor/fornecedor.api"
import type { Fornecedor } from "@/services/fornecedor/fornecedor.schemas"

type FornecedorTabKey = "all" | "ativos" | "inativos"

function tabToAtivo(tab: FornecedorTabKey): boolean | undefined {
  if (tab === "ativos") return true
  if (tab === "inativos") return false
  return undefined
}

export function useFornecedoresTable() {
  const [data, setData] = React.useState<Fornecedor[]>([])
  const [loading, setLoading] = React.useState(true)
  const [tabKey, setTabKey] = React.useState<FornecedorTabKey>("all")

  const [filterParams, setFilterParams] = React.useState<URLSearchParams | null>(null)

  const load = React.useCallback(
    async (key?: FornecedorTabKey, params?: URLSearchParams | null) => {
      const effectiveKey = key ?? tabKey
      const effectiveParams = params ?? filterParams

      setLoading(true)
      try {
        const ativo = tabToAtivo(effectiveKey)

        const res = await fornecedorApi.list({
          ativo,
          filterParams: effectiveParams,
        })

        setData(res)
      } catch (e: any) {
        toast.error(e?.message ?? "Não foi possível carregar fornecedores.")
        setData([])
      } finally {
        setLoading(false)
      }
    },
    [tabKey, filterParams]
  )

  React.useEffect(() => {
    load(tabKey, filterParams)
  }, [tabKey, filterParams, load])

  const onTabKeyChange = React.useCallback((k: string) => {
    if (k === "all" || k === "ativos" || k === "inativos") {
      setTabKey(k)
      return
    }
    setTabKey("all")
  }, [])

  const applyFilters = React.useCallback((params: URLSearchParams) => {
    setFilterParams(params)
  }, [])

  const clearFilters = React.useCallback(() => {
    setFilterParams(null)
  }, [])

  return {
    data,
    loading,
    tabKey,
    onTabKeyChange,
    applyFilters,
    clearFilters,
    reload: () => load(tabKey, filterParams),
  }
}
