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

const defaultErrorMessage = "Erro desconhecido"

const parseErrorMessage = async (response: Response): Promise<string> => {
  const contentType = response.headers.get("content-type") || ""
  if (contentType.includes("application/json")) {
    const data = await response.json().catch(() => null)
    if (typeof data === "string") {
      return data
    }
    if (data?.message) {
      return data.message
    }
    if (response.status === 401) {
      return "Usuário ou senha inválidos."
    }
    return defaultErrorMessage
  }

  const text = await response.text().catch(() => "")
  if (text) {
    return text
  }

  if (response.status === 401) {
    return "Usuário ou senha inválidos."
  }

  return defaultErrorMessage
}

export const login = async (input: LoginInput): Promise<LoginResponse> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: input.email,
      senha: input.password,
    }),
    
  })

  if (!response.ok) {
    const message = await parseErrorMessage(response)
    throw new AuthServiceError(message, response.status)
  }

  return response.json()
}
