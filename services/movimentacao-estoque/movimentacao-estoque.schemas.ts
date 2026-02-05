import { z } from "zod"

export const MovimentacaoEstoqueSchema = z.object({
  id: z.number(),
  dataMovimentacao: z.string(),
  tipoMovimentacao: z.enum(["ENTRADA", "SAIDA", "AJUSTE"]),
  quantidade: z.number(),
  observacao: z.string().optional().nullable(),
  estoqueId: z.number(),
  produtoId: z.number(),
  produtoNome: z.string(),
})

export type MovimentacaoEstoque = z.infer<typeof MovimentacaoEstoqueSchema>

export const MovimentacaoEstoqueListSchema = z.array(MovimentacaoEstoqueSchema)
