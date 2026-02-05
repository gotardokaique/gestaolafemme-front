import { z } from "zod"

export const VendaSchema = z.object({
  id: z.number(),
  dataVenda: z.string(),
  valorTotal: z.number(),
  formaPagamento: z.string(),
})

export type Venda = z.infer<typeof VendaSchema>

export const VendaListSchema = z.array(VendaSchema)

export const VendaRequestSchema = z.object({
  produtoId: z.number().min(1, "Produto é obrigatório"),
  quantidade: z.number().min(1, "Quantidade deve ser pelo menos 1"),
  valorTotal: z.number().optional().nullable(),
  formaPagamento: z.string().min(1, "Forma de pagamento é obrigatória"),
  observacao: z.string().optional().nullable(),
  dataVenda: z.string().optional().nullable(),
})

export type VendaRequestDTO = z.infer<typeof VendaRequestSchema>
