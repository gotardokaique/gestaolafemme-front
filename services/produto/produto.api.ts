import { z } from "zod"
import { api } from "@/lib/api"
import {
  ProdutoListSchema,
  ProdutoSchema,
  type Produto,
  type ProdutoRequestDTO,
} from "./produto.schemas"
import type { FotoCatalogoRequestDTO } from "@/services/file-preview/file-preview.schemas"

const EmptyDataSchema = z.any()

type ListArgs = {
  ativo?: boolean
  filterParams?: URLSearchParams | null
}

function extractF(filterParams?: URLSearchParams | null): string[] {
  if (!filterParams) return []
  return filterParams.getAll("f").filter(Boolean).map(String)
}

export const produtoApi = {
  list: async ({ ativo, filterParams }: ListArgs = {}): Promise<Produto[]> => {
    const f = extractF(filterParams)

    const res = await api.get("/produtos", {
      params: {
        ...(ativo !== undefined ? { ativos: ativo } : {}),
        ...(f.length ? { f } : {}),
      },
      dataSchema: ProdutoListSchema,
    })

    return res.data ?? []
  },

  getById: async (id: number): Promise<Produto | null> => {
    const res = await api.get(`/produtos/${id}`, {
      dataSchema: ProdutoSchema,
    })
    return res.data || null
  },

  create: async (dto: ProdutoRequestDTO) => {
    const res = await api.post("/produtos", {
      dataSchema: EmptyDataSchema,
      body: {
        ...dto,
      },
    })
    return res
  },

  update: async (id: number, dto: ProdutoRequestDTO) => {
    const res = await api.put(`/produtos/${id}`, {
      dataSchema: EmptyDataSchema,
      body: {
        ...dto,
      },
    })
    return res
  },

  delete: async (id: number) => {
    const res = await api.delete(`/produtos/${id}`, {
      dataSchema: EmptyDataSchema,
    })
    return res
  },

  changeStatus: async (id: number) => {
    const res = await api.patch(`/produtos/${id}/status`, {
      dataSchema: EmptyDataSchema,
    })
    return res
  },

  // ============ Catálogo de Fotos ============

  /**
   * Adiciona uma foto ao catálogo do produto.
   */
  addFotoCatalogo: async (produtoId: number, dto: FotoCatalogoRequestDTO): Promise<number> => {
    const res = await api.post(`/produtos/${produtoId}/catalogo`, {
      dataSchema: z.object({ message: z.string(), id: z.number() }),
      body: dto,
    })
    return res.data?.id ?? 0
  },

  /**
   * Remove uma foto do catálogo do produto.
   */
  removeFotoCatalogo: async (produtoId: number, anexoId: number): Promise<void> => {
    await api.delete(`/produtos/${produtoId}/catalogo/${anexoId}`, {
      dataSchema: EmptyDataSchema,
    })
  },
}

