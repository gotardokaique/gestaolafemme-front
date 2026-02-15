import { z } from "zod"
import { api } from "@/lib/api"

export type LoginInput = {
  email: string
  password: string
}

export type LoginResponse = {
  success: boolean
}

export class AuthServiceError extends Error {
  status?: number
  constructor(message: string, status?: number) {
    super(message)
    this.name = "AuthServiceError"
    this.status = status
  }
}

const LoginDataSchema = z.any().optional()

export const login = async (input: LoginInput): Promise<LoginResponse> => {
  try {
    await api.post("/auth/login", {
      dataSchema: LoginDataSchema,
      body: {
        email: input.email,
        senha: input.password,
      },
    })

    return { success: true }
  } catch (err: any) {
    const status = err?.status

    // if (status === 401) {
    //   throw new AuthServiceError("Credenciais inválidas. Verifique e-mail e senha.", 401)
    // }

    if (status === 429) {
      throw new AuthServiceError("Muitas tentativas. Tente novamente mais tarde.", 429)
    }

    throw new AuthServiceError(err?.message ?? "Falha na comunicação com o servidor.", status)
  }
}