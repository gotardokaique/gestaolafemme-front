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

  concluir: async (id: number) => {
    const res = await api.put(`/vendas/${id}/concluir`, {
      dataSchema: EmptyDataSchema,
    })
    return res
  },

  cancelar: async (id: number) => {
    const res = await api.put(`/vendas/${id}/cancelar`, {
      dataSchema: EmptyDataSchema,
    })
    return res
  },

  gerarLinkPagamento: async (id: number): Promise<{ tipo: string, paymentLink?: string | null, preferenceId?: string | null, qrCode?: string | null, qrCodeBase64?: string | null }> => {
    const res = await api.post(`/vendas/${id}/gerar-link-pagamento`, {
      dataSchema: z.object({ 
          tipo: z.string(),
          paymentLink: z.string().nullable().optional(), 
          preferenceId: z.string().nullable().optional(),
          qrCode: z.string().nullable().optional(),
          qrCodeBase64: z.string().nullable().optional()
      }),
    });
    return res.data!;
  },
}
