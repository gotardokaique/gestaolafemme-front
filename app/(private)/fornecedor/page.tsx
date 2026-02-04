"use client"

import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TableData } from "@/components/table-data/table-data"
import { Condition } from "@/components/table-data/table-conditions"

import type { Fornecedor } from "@/services/fornecedor/fornecedor.schemas"
import { FornecedorCreateSheet } from "./components/fornecedor-create-sheet"
import { FornecedorEditSheet } from "./components/fornecedor-edit-sheet"
import { useFornecedoresTable } from "./components/use-fornecedores-table"

import { User, Phone, Mail, BadgeCheck, BadgeX } from "lucide-react"
import { formatPhoneBR } from "@/lib/utils"

export default function FornecedoresPage() {
  const {
    data,
    loading,
    tabKey,
    onTabKeyChange,
    reload,
    applyFilters,
  } = useFornecedoresTable()

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>Fornecedores</CardTitle>
            <CardDescription>Cadastre e edite fornecedores.</CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <FornecedorCreateSheet onCreated={reload} />
          </div>
        </CardHeader>

        <CardContent>
          <TableData<Fornecedor>
            data={data}
            emptyText={loading ? "Carregando..." : "Nenhum fornecedor encontrado."}
            tabKey={tabKey}
            onTabKeyChange={onTabKeyChange}
            defaultTabKey="all"
            onServerFilterChange={({ params }) => applyFilters(params)}
            actionsKey="id"
            actionsWidthClassName="w-[120px]"
          >
            {/* FILTERS (MODAL) */}
            <TableData.Filters title="Filtros de Fornecedor">
              <TableData.Filter
                name="nome"
                label="Nome"
                condition={Condition.LIKE}
                placeholder="Buscar por nome"
              />

              <TableData.Filter
                name="email"
                label="Email"
                condition={Condition.LIKE}
                placeholder="exemplo@email.com"
              />

              <TableData.Filter
                name="telefone"
                label="Telefone"
                condition={Condition.LIKE}
                placeholder="(99) 99999-9999"
                trim
              />
            </TableData.Filters>

            {/* TABS */}
            <TableData.Tabs>
              <TableData.Tab
                tabKey="ativos"
                name="ativo"
                label="Ativos"
                condition={Condition.EQUAL}
                value={true}
              />
              <TableData.Tab
                tabKey="inativos"
                name="ativo"
                label="Inativos"
                condition={Condition.EQUAL}
                value={false}
              />
            </TableData.Tabs>

            {/* COLUMNS */}
            <TableData.Columns>
              <TableData.Column<Fornecedor>
                name="nome"
                label="Informações"
                render={(_, row) => {
                  const phone = formatPhoneBR(row.telefone as any)
                  const email = row.email ? String(row.email) : "-"
                  const isActive = !!row.ativo

                  return (
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 shrink-0 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-5 w-5 text-muted-foreground" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <div className="font-medium leading-tight truncate">
                            {row.nome ?? "-"}
                          </div>

                          {isActive ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600">
                              <BadgeCheck className="h-4 w-4" />
                              <span className="text-xs">Ativo</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-destructive">
                              <BadgeX className="h-4 w-4" />
                              <span className="text-xs">Inativo</span>
                            </span>
                          )}
                        </div>

                        <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-4 w-4 text-emerald-600" />
                          <span className="truncate">{phone}</span>
                        </div>

                        <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          <span className="truncate">{email}</span>
                        </div>
                      </div>
                    </div>
                  )
                }}
              />

              <TableData.Column<Fornecedor>
                name="id"
                label=""
                render={(_, row) => (
                  <div className="flex justify-end">
                    <FornecedorEditSheet fornecedor={row} onUpdated={reload} />
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
