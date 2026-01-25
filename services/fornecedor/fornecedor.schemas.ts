import { z } from "zod"

export const FornecedorSchema = z.object({
  id: z.number(),
  nome: z.string(),
  telefone: z.string(),
  email: z.string(),
  ativo: z.boolean(),
})

export type Fornecedor = z.infer<typeof FornecedorSchema>

export const FornecedorListSchema = z.array(FornecedorSchema)

export const FornecedorCreateSchema = z.object({
  nome: z.string(),
  telefone: z.string(),
  email: z.string(),
  ativo: z.boolean().default(true),
})

export type FornecedorCreateDTO = z.infer<typeof FornecedorCreateSchema>

export const FornecedorUpdateSchema = FornecedorCreateSchema.extend({
})

export type FornecedorUpdateDTO = z.infer<typeof FornecedorUpdateSchema>
