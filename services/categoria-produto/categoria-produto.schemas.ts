import { z } from "zod"

export const CategoriaProdutoSchema = z.object({
  id: z.number(),
  nome: z.string().min(1, "Nome é obrigatório"),
  descricao: z.string().optional().nullable(),
  ativo: z.boolean(),
})

export type CategoriaProduto = z.infer<typeof CategoriaProdutoSchema>

export const CategoriaProdutoListSchema = z.array(CategoriaProdutoSchema)

export const CategoriaProdutoCreateSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  descricao: z.string().optional().nullable(),
  ativo: z.boolean().optional(),
})

export type CategoriaProdutoCreateDTO = z.infer<typeof CategoriaProdutoCreateSchema>

export const CategoriaProdutoUpdateSchema = CategoriaProdutoCreateSchema.extend({
})

export type CategoriaProdutoUpdateDTO = z.infer<typeof CategoriaProdutoUpdateSchema>
