"use client"

import * as React from "react"
import { toast } from "@/components/ui/sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { TableData } from "@/components/table-data/table-data"
import { Condition } from "@/components/table-data/table-conditions" 

import { fornecedorApi } from "@/services/fornecedor/fornecedor.api"
import type { Fornecedor } from "@/services/fornecedor/fornecedor.schemas"

import { FornecedorCreateSheet } from "./components/fornecedor-create-sheet"
import { FornecedorEditSheet } from "./components/fornecedor-edit-sheet"

export default function FornecedoresPage() {
  const [data, setData] = React.useState<Fornecedor[]>([])
  const [loading, setLoading] = React.useState(true)

  const load = React.useCallback(async () => {
    setLoading(true)
    try {
      // ativos=false no seu exemplo => devolve todos? ajuste conforme seu backend
      const res = await fornecedorApi.list({ ativos: false })
      setData(res)
    } catch (e: any) {
      toast.error(e?.message ?? "Não foi possível carregar fornecedores.")
      setData([])
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    load()
  }, [load])

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>Fornecedores</CardTitle>
            <CardDescription>
              Cadastre e edite fornecedores do financeiro.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <FornecedorCreateSheet onCreated={load} />
          </div>
        </CardHeader>

        <CardContent>
          <TableData<Fornecedor>
            data={data}
            emptyText={loading ? "Carregando..." : "Nenhum fornecedor encontrado."}
            defaultTabKey={undefined}
          >
            <TableData.Tabs>
              <TableData.Tab label="Todos" condition={Condition.ALL} />
              <TableData.Tab name="ativo" label="Ativos" condition={Condition.EQUAL} value={true} />
              <TableData.Tab name="ativo" label="Inativos" condition={Condition.EQUAL} value={false} />
            </TableData.Tabs>

            <TableData.Columns>
              <TableData.Column name="nome" label="Nome" />
              <TableData.Column name="telefone" label="Telefone" render={(v) => (v ? String(v) : "-")} />
              <TableData.Column name="email" label="Email" render={(v) => (v ? String(v) : "-")} />
              <TableData.Column
                name="ativo"
                label="Status"
                render={(v) => (v ? "Ativo" : "Inativo")}
              />
              <TableData.Column<Fornecedor>
                name="id"
                label="Ações"
                render={(_, row) => (
                  <div className="flex justify-end">
                    <FornecedorEditSheet fornecedor={row} onUpdated={load} />
                  </div>
                )}
              />
            </TableData.Columns>
          </TableData>
        </CardContent>
      </Card>
    </div>
  )
}
