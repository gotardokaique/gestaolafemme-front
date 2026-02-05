import { z } from "zod"

export const CompraSchema = z.object({
  id: z.number(),
  dataCompra: z.string().or(z.date()),
  valorTotal: z.number(),
  formaPagamento: z.string(),
  fornecedorId: z.number(),
  fornecedorNome: z.string(),
})

export type Compra = z.infer<typeof CompraSchema>

export const CompraListSchema = z.array(CompraSchema)

export const CompraCreateSchema = z.object({
  fornecedorId: z.number().min(1, "Fornecedor é obrigatório"),
  formaPagamento: z.string().min(1, "Forma de pagamento é obrigatória"),
  quantidade: z.number().min(1, "Quantidade deve ser pelo menos 1"),
  produtoIds: z.array(z.number()).min(1, "Pelo menos um produto deve ser selecionado"),
  observacao: z.string().optional().nullable(),
  dataCompra: z.string().optional().nullable(),
})

export type CompraCreateDTO = z.infer<typeof CompraCreateSchema>
