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

const API_URL = process.env.NEXT_PUBLIC_API_URL

function assertApiUrl() {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL não configurada.")
  }
}

const parseErrorMessage = async (response: Response): Promise<string> => {
  const contentType = response.headers.get("content-type") || ""

  if (contentType.includes("application/json")) {
    const data = await response.json().catch(() => null)

    // back pode devolver só string
    if (typeof data === "string") {
      return data
    }

    // padrão que você usa: { "message": "..." }
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
  assertApiUrl()

  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: input.email,
      senha: input.password, // alinhado com LoginRequestDTO(email, senha)
    }),
  })

  if (!response.ok) {
    const message = await parseErrorMessage(response)
    throw new AuthServiceError(message, response.status)
  }

  // LoginResponseDTO(token)
  return response.json()
}
