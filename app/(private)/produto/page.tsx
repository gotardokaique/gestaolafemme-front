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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

import type { Produto } from "@/services/produto/produto.schemas"
import { useProdutoTable } from "./components/use-produto-table"
import { ProdutoCreateSheet } from "./components/produto-create-sheet"
import { ProdutoEditSheet } from "./components/produto-edit-sheet"

import { Package, Tag, Banknote, Warehouse, MoreVertical, Edit2, Trash2, Power } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export default function ProdutosPage() {
  const {
    data,
    loading,
    reload,
    statusFilter,
    setStatusFilter,
    handleStatusChange,
    handleDelete
  } = useProdutoTable()

  const [editingProduto, setEditingProduto] = React.useState<Produto | null>(null)

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>Produtos</CardTitle>
            <CardDescription>Gerencie o catálogo de produtos e seus níveis de estoque.</CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <ProdutoCreateSheet onCreated={reload} />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full">
            <TabsList>
              <TabsTrigger value="ativos">Ativos</TabsTrigger>
              <TabsTrigger value="inativos">Inativos</TabsTrigger>
              <TabsTrigger value="todos">Todos</TabsTrigger>
            </TabsList>
          </Tabs>

          <TableData<Produto>
            data={data}
            emptyText={loading ? "Carregando..." : "Nenhum produto encontrado."}
            actionsKey="id"
          >
            <TableData.Columns>
              <TableData.Column<Produto>
                name="nome"
                label="Produto"
                render={(_, row) => (
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-8 w-8 shrink-0 rounded bg-muted flex items-center justify-center">
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <div className="font-medium leading-tight truncate">
                          {row.nome}
                        </div>
                        {!row.ativo && (
                          <Badge variant="secondary" className="text-[10px] h-4 uppercase">Inativo</Badge>
                        )}
                      </div>

                      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{row.codigo}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          <span>{row.categoriaNome}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              />

              <TableData.Column<Produto>
                name="valorVenda"
                label="Preços"
                render={(_, row) => (
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <span>Venda: {formatCurrency(row.valorVenda)}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Custo: {formatCurrency(row.valorCusto)}
                    </div>
                  </div>
                )}
              />

              <TableData.Column<Produto>
                name="quantidadeAtual"
                label="Estoque"
                render={(_, row) => {
                  const isLow = row.quantidadeAtual <= row.estoqueMinimo
                  return (
                    <div className="flex flex-col">
                      <div className={`flex items-center gap-2 text-sm font-medium ${isLow ? 'text-destructive' : 'text-foreground'}`}>
                        <Warehouse className="h-4 w-4" />
                        <span>{row.quantidadeAtual} un</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Mín: {row.estoqueMinimo} un
                      </div>
                    </div>
                  )
                }}
              />

              <TableData.Column<Produto>
                name="id"
                label=""
                render={(_, row) => (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditingProduto(row)}>
                        <Edit2 className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(row.id)}>
                        <Power className="mr-2 h-4 w-4" />
                        {row.ativo ? 'Desativar' : 'Ativar'}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDelete(row.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              />
            </TableData.Columns>
          </TableData>
        </CardContent>
      </Card>

      <ProdutoEditSheet 
        produto={editingProduto} 
        onOpenChange={(open) => !open && setEditingProduto(null)}
        onUpdated={reload}
      />
    </div>
  )
}
