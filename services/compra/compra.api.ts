import { z } from "zod"
import { api } from "@/lib/api"
import {
  CompraListSchema,
  type CompraCreateDTO,
  type Compra,
} from "./compra.schemas"

const EmptyDataSchema = z.any()

export const compraApi = {
  list: async (): Promise<Compra[]> => {
    const res = await api.get("/compras", {
      dataSchema: CompraListSchema,
    })

    return res.data ?? []
  },

  create: async (dto: CompraCreateDTO) => {
    const res = await api.post("/compras", {
      dataSchema: EmptyDataSchema,
      body: {
        fornecedorId: dto.fornecedorId,
        formaPagamento: dto.formaPagamento,
        quantidade: dto.quantidade,
        produtoIds: dto.produtoIds,
        observacao: dto.observacao || null,
        dataCompra: dto.dataCompra ? new Date(dto.dataCompra).toISOString() : undefined,
      },
    })
    return res
  },

  delete: async (id: number) => {
    const res = await api.delete(`/compras/${id}`, {
      dataSchema: EmptyDataSchema,
    })
    return res
  },
}
