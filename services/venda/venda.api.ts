import { z } from "zod"
import { api } from "@/lib/api"
import {
  VendaListSchema,
  VendaSchema,
  type Venda,
  type VendaRequestDTO,
} from "./venda.schemas"

const EmptyDataSchema = z.any()

export const vendaApi = {
  list: async (): Promise<Venda[]> => {
    const res = await api.get("/vendas", {
      dataSchema: VendaListSchema,
    })

    return res.data ?? []
  },

  getById: async (id: number): Promise<Venda | null> => {
    const res = await api.get(`/vendas/${id}`, {
      dataSchema: VendaSchema,
    })
    return res.data || null
  },

  create: async (dto: VendaRequestDTO) => {
    const res = await api.post("/vendas", {
      dataSchema: EmptyDataSchema,
      body: {
        ...dto,
        produtoId: Number(dto.produtoId),
        dataVenda: dto.dataVenda ? new Date(dto.dataVenda).toISOString() : undefined,
      },
    })
    return res
  },
}
