import { z } from "zod"
import { api } from "@/lib/api"
import {
  ProdutoListSchema,
  ProdutoSchema,
  type Produto,
  type ProdutoRequestDTO,
} from "./produto.schemas"

const EmptyDataSchema = z.any()

export const produtoApi = {
  list: async (ativo?: boolean): Promise<Produto[]> => {
    const res = await api.get("/produtos", {
      params: {
        ...(ativo !== undefined ? { ativos: ativo } : {}),
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
}
