import { z } from "zod"
import { api } from "@/lib/api"

export type LoginInput = {
  email: string
  password: string
}

export type LoginResponse = {
  token: string
}

export class AuthServiceError extends Error {
  status?: number
  constructor(message: string, status?: number) {
    super(message)
    this.name = "AuthServiceError"
    this.status = status
  }
}

const LoginDataSchema = z.object({
  token: z.string().min(10),
})

export const login = async (input: LoginInput): Promise<LoginResponse> => {
  try {
    const res = await api.post("/auth/login", {
      skipAuth: true,
      dataSchema: LoginDataSchema,
      body: {
        email: input.email,
        senha: input.password,
      },
    })

    const token = res.data?.token
    if (!token) throw new AuthServiceError("Token não retornado no login.", 500)
    return { token }
  } catch (err: any) {
    // seu api.ts lança ApiError em erro HTTP / success=false
    const msg = err?.message ?? "Erro desconhecido"
    const status = err?.status
    throw new AuthServiceError(
      status === 401 ? "Usuário ou senha inválidos." : msg,
      status
    )
  }
}
