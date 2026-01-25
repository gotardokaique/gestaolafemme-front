"use client"

import { Condition } from "@/components/table-data/table-conditions"
import { TableData } from "@/components/table-data/table-data"

type Produto = {
  id: number
  nome: string
  valorVenda: number
  ativo: boolean
}

export default function ProdutosPage() {
  const data: Produto[] = [
    { id: 1, nome: "Anel", valorVenda: 200, ativo: true },
    { id: 2, nome: "Colar", valorVenda: 250, ativo: false },
    { id: 3, nome: "Pulseira", valorVenda: 200, ativo: true },
    { id: 4, nome: "Brinco", valorVenda: 120, ativo: false },
    { id: 5, nome: "Pingente", valorVenda: 200, ativo: false },
    { id: 6, nome: "Anel Solitário", valorVenda: 520, ativo: true },
    { id: 7, nome: "Choker", valorVenda: 250, ativo: true },
    { id: 8, nome: "Argola", valorVenda: 120, ativo: true },
    { id: 9, nome: "Corrente", valorVenda: 200, ativo: true },
    { id: 10, nome: "Medalha", valorVenda: 180, ativo: false },
    { id: 11, nome: "Anel Duplo", valorVenda: 250, ativo: false },
    { id: 12, nome: "Riviera", valorVenda: 399, ativo: true },
  ]

  return (
   <TableData<Produto> data={data}>
  <TableData.Tabs>
    <TableData.Tab
      label="Todos"
      condition={Condition.ALL}
    />

    <TableData.Tab
      name="ativo"
      label="Ativos"
      condition={Condition.EQUAL}
      value={true}
    />

    <TableData.Tab
      name="ativo"
      label="Inativos"
      condition={Condition.EQUAL}
      value={false}
    />

    <TableData.Tab
      name="valorVenda"
      label="Valor = 200"
      condition={Condition.EQUAL}
      value={200}
    />

    <TableData.Tab
      name="valorVenda"
      label="Valor ≥ 250"
      condition={Condition.GREATER_OR_EQUAL}
      value={250}
    />

    <TableData.Tab
      name="nome"
      label="Nome contém 'Anel'"
      condition={Condition.LIKE}
      value="Anel"
    />
  </TableData.Tabs>

  <TableData.Columns>
    <TableData.Column name="id" label="Id" />
    <TableData.Column name="nome" label="Nome" />
    <TableData.Column
      name="valorVenda"
      label="Valor"
      render={(v) => `R$ ${Number(v).toFixed(2)}`}
    />
  </TableData.Columns>
</TableData>
  )
}
