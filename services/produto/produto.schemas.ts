import { z } from "zod"

export const ProdutoSchema = z.object({
  id: z.number(),
  nome: z.string().min(1, "Nome é obrigatório"),
  codigo: z.string().min(1, "Código é obrigatório"),
  descricao: z.string().optional().nullable(),
  valorCusto: z.number(),
  valorVenda: z.number(),
  ativo: z.boolean(),
  categoriaId: z.number(),
  categoriaNome: z.string(),
  estoqueMinimo: z.number(),
  quantidadeAtual: z.number(),
  dataCadastro: z.string().optional().nullable(),
})

export type Produto = z.infer<typeof ProdutoSchema>

export const ProdutoListSchema = z.array(ProdutoSchema)

export const FotoSchema = z.object({
  nome: z.string(),
  mimeType: z.string(),
  arquivo: z.string(),
}).nullable().optional()

export type FotoDTO = z.infer<typeof FotoSchema>

export const ProdutoRequestSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  codigo: z.string().min(1, "Código é obrigatório"),
  descricao: z.string().optional().nullable(),
  valorCusto: z.number().min(0, "Valor de custo deve ser positivo"),
  valorVenda: z.number().min(0, "Valor de venda deve ser positivo"),
  categoriaId: z.number().min(1, "Categoria é obrigatória"),
  estoqueMinimo: z.number().min(0, "Estoque mínimo deve ser positivo"),
  quantidadeInicial: z.number().min(0, "Quantidade inicial deve ser positiva").optional(),
  ativo: z.boolean().optional(),
  margemLucro: z.number().optional(),
  foto: FotoSchema,
})

export type ProdutoRequestDTO = z.infer<typeof ProdutoRequestSchema>

