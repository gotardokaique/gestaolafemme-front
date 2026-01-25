// src/lib/api.ts
import { z } from "zod"

export class ApiError extends Error {
  status: number
  details?: unknown

  constructor(message: string, status: number, details?: unknown) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.details = details
  }
}

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

type RequestOptions<TSchema extends z.ZodTypeAny | undefined> = {
  params?: Record<string, unknown>
  body?: unknown
  headers?: Record<string, string>
  /**
   * Se passar schema, a resposta é validada (e tipada) com Zod.
   * Se não passar, retorna unknown (ou T via generic).
   */
  schema?: TSchema
  /**
   * Se true, NÃO envia Authorization automaticamente.
   * Útil para login/registro.
   */
  skipAuth?: boolean
}

const API_URL = process.env.NEXT_PUBLIC_API_URL

function assertApiUrl() {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL não configurada.")
  }
}

function buildQuery(params?: Record<string, unknown>) {
  if (!params) return ""
  const usp = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null) continue
    usp.set(k, String(v))
  }
  const qs = usp.toString()
  return qs ? `?${qs}` : ""
}

/**
 * JWT exp check simples:
 * - Se não tiver token -> null
 * - Se token inválido -> null
 * - Se expirado (com folga) -> null
 */
function getValidToken(): string | null {
  if (typeof window === "undefined") return null
  const token = localStorage.getItem("token")
  if (!token) return null

  try {
    const parts = token.split(".")
    if (parts.length < 2) return null

    const payload = JSON.parse(
      atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
    )
    const exp = Number(payload?.exp)
    if (!exp) return token // se não tem exp, não bloqueia

    const now = Math.floor(Date.now() / 1000)

    // folga 30s para evitar “expirou enquanto requisita”
    if (now >= exp - 30) {
      localStorage.removeItem("token")
      return null
    }

    return token
  } catch {
    localStorage.removeItem("token")
    return null
  }
}

async function parseError(response: Response) {
  const ct = response.headers.get("content-type") ?? ""
  try {
    if (ct.includes("application/json")) {
      return await response.json()
    }
    return await response.text()
  } catch {
    return null
  }
}

async function request<
  TSchema extends z.ZodTypeAny | undefined,
  TOut = unknown
>(
  method: HttpMethod,
  path: string,
  opts: RequestOptions<TSchema> = {}
): Promise<TSchema extends z.ZodTypeAny ? z.infer<TSchema> : TOut> {
  assertApiUrl()

  const url = `${API_URL}${path}${buildQuery(opts.params)}`
  const token = opts.skipAuth ? null : getValidToken()

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...opts.headers,
  }

  if (opts.body !== undefined && opts.body !== null) {
    headers["Content-Type"] = "application/json"
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(url, {
    method,
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
  })

  if (!res.ok) {
    const details = await parseError(res)
    const msg =
      (typeof details === "string" && details.trim()) ||
      (typeof details === "object" && details && (details as any).message) ||
      `Erro HTTP ${res.status}`

    // Alinhado com back:
    // - JWT expirado
    // - sessão Redis inválida (user:session:<id> removida)
    // => limpa token local
    if (res.status === 401 || res.status === 403) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token")
      }
    }

    throw new ApiError(msg, res.status, details)
  }

  // 204 sem body
  if (res.status === 204) return undefined as any

  const contentType = res.headers.get("content-type") ?? ""
  const data = contentType.includes("application/json")
    ? await res.json()
    : await res.text()

  if (opts.schema) {
    return opts.schema.parse(data) as any
  }

  return data as any
}

export const api = {
  get: <TSchema extends z.ZodTypeAny | undefined, TOut = unknown>(
    path: string,
    opts?: RequestOptions<TSchema>
  ) => request<TSchema, TOut>("GET", path, opts),

  post: <TSchema extends z.ZodTypeAny | undefined, TOut = unknown>(
    path: string,
    opts?: RequestOptions<TSchema>
  ) => request<TSchema, TOut>("POST", path, opts),

  put: <TSchema extends z.ZodTypeAny | undefined, TOut = unknown>(
    path: string,
    opts?: RequestOptions<TSchema>
  ) => request<TSchema, TOut>("PUT", path, opts),

  patch: <TSchema extends z.ZodTypeAny | undefined, TOut = unknown>(
    path: string,
    opts?: RequestOptions<TSchema>
  ) => request<TSchema, TOut>("PATCH", path, opts),

  delete: <TSchema extends z.ZodTypeAny | undefined, TOut = unknown>(
    path: string,
    opts?: RequestOptions<TSchema>
  ) => request<TSchema, TOut>("DELETE", path, opts),

  token: {
    getValid: getValidToken,
    clear: () =>
      typeof window !== "undefined" && localStorage.removeItem("token"),
    set: (t: string) =>
      typeof window !== "undefined" && localStorage.setItem("token", t),
  },
}
