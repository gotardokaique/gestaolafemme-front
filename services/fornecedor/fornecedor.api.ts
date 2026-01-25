import { api } from "@/lib/api"
import {
  FornecedorListSchema,
  FornecedorCreateDTO,
  FornecedorUpdateDTO,
} from "./fornecedor.schemas"

export const fornecedorApi = {
  list: (params?: { ativos?: boolean }) =>
    api.get("/fornecedores", {
      params,
      schema: FornecedorListSchema,
    }),

  create: (dto: FornecedorCreateDTO) =>
    api.post("/fornecedores", {
      body: {
        nome: dto.nome,
        telefone: dto.telefone?.trim() || null,
        email: dto.email?.trim() || null,
        ativo: dto.ativo ?? true,
      },
    }),

  update: (id: number, dto: FornecedorUpdateDTO) =>
    api.put(`/fornecedores/${id}`, {
      body: {
        nome: dto.nome,
        telefone: dto.telefone?.trim() || null,
        email: dto.email?.trim() || null,
        ativo: dto.ativo ?? true,
      },
    }),
}
