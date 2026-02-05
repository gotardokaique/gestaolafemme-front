"use client"

import * as React from "react"
import { toast } from "@/components/ui/sonner"
import { categoriaProdutoApi } from "@/services/categoria-produto/categoria-produto.api"
import type { CategoriaProduto } from "@/services/categoria-produto/categoria-produto.schemas"

type CategoriaTabKey = "all" | "ativos" | "inativos"

function tabToAtivo(tab: CategoriaTabKey): boolean | undefined {
  if (tab === "ativos") return true
  if (tab === "inativos") return false
  return undefined
}

export function useCategoriaProdutoTable() {
  const [data, setData] = React.useState<CategoriaProduto[]>([])
  const [loading, setLoading] = React.useState(true)
  const [tabKey, setTabKey] = React.useState<CategoriaTabKey>("all")

  const [filterParams, setFilterParams] = React.useState<URLSearchParams | null>(null)

  const load = React.useCallback(
    async (key?: CategoriaTabKey, params?: URLSearchParams | null) => {
      const effectiveKey = key ?? tabKey
      const effectiveParams = params ?? filterParams

      setLoading(true)
      try {
        const ativo = tabToAtivo(effectiveKey)

        const res = await categoriaProdutoApi.list({
          ativo,
          filterParams: effectiveParams,
        })

        setData(res)
      } catch (e: any) {
        toast.error(e?.message ?? "Não foi possível carregar categorias.")
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
      setTabKey(k as CategoriaTabKey)
      return
    }
    setTabKey("all")
  }, [])

  const applyFilters = React.useCallback((params: URLSearchParams) => {
    setFilterParams(params)
  }, [])

  return {
    data,
    loading,
    tabKey,
    onTabKeyChange,
    reload: () => load(tabKey, filterParams),
    applyFilters,
  }
}

