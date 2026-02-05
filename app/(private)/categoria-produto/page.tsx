"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TableData } from "@/components/table-data/table-data"
import { Condition } from "@/components/table-data/table-conditions"

import type { CategoriaProduto } from "@/services/categoria-produto/categoria-produto.schemas"
import { CategoriaProdutoCreateSheet } from "./components/categoria-produto-create-sheet"
import { CategoriaProdutoEditSheet } from "./components/categoria-produto-edit-sheet"
import { useCategoriaProdutoTable } from "./components/use-categoria-produto-table"

import { Tags, BadgeCheck, BadgeX, StickyNote } from "lucide-react"

export default function CategoriasProdutoPage() {
  const {
    data,
    loading,
    tabKey,
    onTabKeyChange,
    reload,
    applyFilters,
  } = useCategoriaProdutoTable()

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>Categorias de Produto</CardTitle>
            <CardDescription>Cadastre e edite as categorias dos seus produtos.</CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <CategoriaProdutoCreateSheet onCreated={reload} />
          </div>
        </CardHeader>

        <CardContent>
          <TableData<CategoriaProduto>
            data={data}
            emptyText={loading ? "Carregando..." : "Nenhuma categoria encontrada."}
            tabKey={tabKey}
            onTabKeyChange={onTabKeyChange}
            defaultTabKey="all"
            onServerFilterChange={({ params }) => applyFilters(params)}
            actionsKey="id"
            actionsWidthClassName="w-[120px]"
          >
            {/* FILTERS (MODAL) */}
            <TableData.Filters title="Filtros de Categoria">
              <TableData.Filter
                name="nome"
                label="Nome"
                condition={Condition.LIKE}
                placeholder="Buscar por nome"
              />
            </TableData.Filters>

            {/* TABS */}
            <TableData.Tabs>
              <TableData.Tab
                tabKey="ativos"
                name="ativo"
                label="Ativas"
                condition={Condition.EQUAL}
                value={true}
              />
              <TableData.Tab
                tabKey="inativos"
                name="ativo"
                label="Inativas"
                condition={Condition.EQUAL}
                value={false}
              />
            </TableData.Tabs>

            {/* COLUMNS */}
            <TableData.Columns>
              <TableData.Column<CategoriaProduto>
                name="nome"
                label="Informações"
                render={(_, row) => {
                  const isActive = !!row.ativo
                  const descricao = row.descricao || "Sem descrição"

                  return (
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 shrink-0 rounded-full bg-muted flex items-center justify-center">
                        <Tags className="h-5 w-5 text-muted-foreground" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <div className="font-medium leading-tight truncate">
                            {row.nome ?? "-"}
                          </div>

                          {isActive ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600">
                              <BadgeCheck className="h-4 w-4" />
                              <span className="text-xs font-medium">Ativo</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-destructive">
                              <BadgeX className="h-4 w-4" />
                              <span className="text-xs font-medium">Inativo</span>
                            </span>
                          )}
                        </div>

                        <div className="mt-1 flex items-start gap-2 text-sm text-muted-foreground">
                          <StickyNote className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                          <span className="line-clamp-2">{descricao}</span>
                        </div>
                      </div>
                    </div>
                  )
                }}
              />

              <TableData.Column<CategoriaProduto>
                name="id"
                label=""
                render={(_, row) => (
                  <div className="flex justify-end">
                    <CategoriaProdutoEditSheet categoria={row} onUpdated={reload} />
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
