import { z } from "zod"

export const EstoqueSchema = z.object({
  productId: z.number(),
  produtoNome: z.string(),
  produtoCodigo: z.string(),
  categoriaNome: z.string(),
  quantidadeAtual: z.number(),
  estoqueMinimo: z.number(),
})

export type Estoque = z.infer<typeof EstoqueSchema>

export const EstoqueListSchema = z.array(EstoqueSchema)

export const EstoqueAjusteSchema = z.object({
  novaQuantidade: z.number().min(0, "Quantidade não pode ser negativa"),
  observacao: z.string().min(1, "A observação é obrigatória para ajustes manuais"),
})

export type EstoqueAjusteDTO = z.infer<typeof EstoqueAjusteSchema>
