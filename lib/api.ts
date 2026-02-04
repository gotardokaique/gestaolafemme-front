import { z } from "zod"

export class ApiError extends Error {
  status: number
  details?: unknown
  url?: string
  method?: string

  constructor(
    message: string,
    status: number,
    details?: unknown,
    meta?: { url?: string; method?: string }
  ) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.details = details
    this.url = meta?.url
    this.method = meta?.method
  }
}

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

type NextFetchRequestConfig = {
  revalidate?: number | false
  tags?: string[]
}

/**
 * ENVELOPE PADRÃO DO BACK:
 * { success: boolean, message?: string|null, data?: T|null }
 */
export const ApiEnvelopeSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    message: z.string().nullable().optional(),
    data: dataSchema.optional().nullable(),
  })

export type ApiEnvelope<T = unknown> = {
  success: boolean
  message?: string | null
  data?: T | null
}

type RequestOptions<TDataSchema extends z.ZodTypeAny | undefined> = {
  params?: Record<string, unknown>
  body?: unknown
  headers?: Record<string, string>
  dataSchema?: TDataSchema // <<< agora você passa só o schema do data
  skipAuth?: boolean
  signal?: AbortSignal
  timeoutMs?: number
  cache?: RequestCache
  next?: NextFetchRequestConfig
  keepTokenOnAuthError?: boolean
}

const API_URL = process.env.NEXT_PUBLIC_API_URL

function assertApiUrl() {
  if (!API_URL) throw new Error("NEXT_PUBLIC_API_URL não configurada.")
}

function buildQuery(params?: Record<string, unknown>) {
  if (!params) return ""
  const usp = new URLSearchParams()

  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null) continue

    if (Array.isArray(v)) {
      for (const item of v) {
        if (item === undefined || item === null) continue
        usp.append(k, String(item))
      }
      continue
    }

    usp.set(k, String(v))
  }

  const qs = usp.toString()
  return qs ? `?${qs}` : ""
}

function base64UrlDecodeToString(input: string) {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/")
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=")
  return atob(padded)
}

function getValidToken(): string | null {
  if (typeof window === "undefined") return null

  const token = localStorage.getItem("token")
  if (!token) return null

  try {
    const parts = token.split(".")
    if (parts.length < 2) throw new Error("JWT inválido")

    const payloadJson = base64UrlDecodeToString(parts[1])
    const payload = JSON.parse(payloadJson)

    const exp = Number(payload?.exp)
    if (!exp) return token

    const now = Math.floor(Date.now() / 1000)
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

/**
 * Parse robusto:
 * - tenta JSON se content-type for json
 * - se não for, mas o texto "parece" json, tenta parse também
 */
async function parseBody(res: Response): Promise<unknown> {
  if (res.status === 204 || res.status === 205) return undefined

  const len = res.headers.get("content-length")
  if (len === "0") return undefined

  const ct = (res.headers.get("content-type") ?? "").toLowerCase()

  try {
    const raw = await res.text()
    if (!raw || !raw.trim()) return undefined

    if (ct.includes("application/json")) {
      try {
        return JSON.parse(raw)
      } catch {
        return raw
      }
    }

    const t = raw.trim()
    if ((t.startsWith("{") && t.endsWith("}")) || (t.startsWith("[") && t.endsWith("]"))) {
      try {
        return JSON.parse(t)
      } catch {
        return raw
      }
    }

    return raw
  } catch {
    return undefined
  }
}

function extractMessage(details: unknown, status: number): string {
  if (typeof details === "string" && details.trim()) return details.trim()

  if (details && typeof details === "object") {
    const any = details as any

    // suporta envelope padrão
    if (typeof any.message === "string" && any.message.trim()) return any.message.trim()
    if (typeof any.mensagem === "string" && any.mensagem.trim()) return any.mensagem.trim()
    if (typeof any.error === "string" && any.error.trim()) return any.error.trim()

    // às vezes vem { data: { message } }
    if (any.data && typeof any.data === "object") {
      const d = any.data as any
      if (typeof d.message === "string" && d.message.trim()) return d.message.trim()
      if (typeof d.mensagem === "string" && d.mensagem.trim()) return d.mensagem.trim()
    }
  }

  return `Erro HTTP ${status}`
}

function buildSignal(userSignal?: AbortSignal, timeoutMs?: number) {
  if (!timeoutMs && !userSignal) return undefined

  const controller = new AbortController()

  if (userSignal) {
    if (userSignal.aborted) controller.abort(userSignal.reason)
    else {
      const onAbort = () => controller.abort(userSignal.reason)
      userSignal.addEventListener("abort", onAbort, { once: true })
    }
  }

  let timeoutId: ReturnType<typeof setTimeout> | undefined
  if (timeoutMs && timeoutMs > 0) {
    timeoutId = setTimeout(() => controller.abort(new Error("Request timeout")), timeoutMs)
  }

  return { signal: controller.signal, cleanup: () => timeoutId && clearTimeout(timeoutId) }
}

/**
 * request() agora SEMPRE retorna ApiEnvelope<T>
 * - success=false vira ApiError
 * - message SEMPRE acessível pra toast
 */
async function request<TDataSchema extends z.ZodTypeAny | undefined, TData = unknown>(
  method: HttpMethod,
  path: string,
  opts: RequestOptions<TDataSchema> = {}
): Promise<ApiEnvelope<TDataSchema extends z.ZodTypeAny ? z.infer<TDataSchema> : TData>> {
  assertApiUrl()

  const url = `${API_URL}${path}${buildQuery(opts.params)}`
  const token = opts.skipAuth ? null : getValidToken()

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...opts.headers,
  }

  const hasBody = opts.body !== undefined && opts.body !== null
  let body: BodyInit | undefined

  if (hasBody) {
    headers["Content-Type"] = headers["Content-Type"] ?? "application/json"
    body = JSON.stringify(opts.body)
  }

  if (token) headers.Authorization = `Bearer ${token}`

  const sig = buildSignal(opts.signal, opts.timeoutMs)

  try {
    const res = await fetch(url, {
      method,
      headers,
      body,
      signal: sig?.signal,
      cache: opts.cache,
      next: opts.next as any,
      credentials: "same-origin",
    })

    const parsed = await parseBody(res)

    // erro HTTP: tenta extrair message do envelope/obj/string
    if (!res.ok) {
      if (!opts.keepTokenOnAuthError && (res.status === 401 || res.status === 403)) {
        if (typeof window !== "undefined") localStorage.removeItem("token")
      }

      const msg = extractMessage(parsed, res.status)
      throw new ApiError(msg, res.status, parsed, { url, method })
    }

    // sucesso HTTP: valida envelope padrão
    const envelopeSchema = ApiEnvelopeSchema(opts.dataSchema ?? z.any())
    const env = envelopeSchema.parse(parsed) as ApiEnvelope<any>

    // sucesso HTTP mas business fail
    if (!env.success) {
      throw new ApiError(env.message ?? "Erro.", res.status, env, { url, method })
    }

    return env as any
  } catch (err: any) {
    if (err?.name === "AbortError") {
      throw new ApiError("Requisição cancelada.", 499, undefined, { url, method })
    }
    if (err instanceof ApiError) throw err
    throw new ApiError(err?.message ?? "Falha de rede.", 0, undefined, { url, method })
  } finally {
    sig?.cleanup?.()
  }
}

export const api = {
  get: <TDataSchema extends z.ZodTypeAny | undefined>(path: string, opts?: RequestOptions<TDataSchema>) =>
    request<TDataSchema>("GET", path, opts),

  post: <TDataSchema extends z.ZodTypeAny | undefined>(path: string, opts?: RequestOptions<TDataSchema>) =>
    request<TDataSchema>("POST", path, opts),

  put: <TDataSchema extends z.ZodTypeAny | undefined>(path: string, opts?: RequestOptions<TDataSchema>) =>
    request<TDataSchema>("PUT", path, opts),

  patch: <TDataSchema extends z.ZodTypeAny | undefined>(path: string, opts?: RequestOptions<TDataSchema>) =>
    request<TDataSchema>("PATCH", path, opts),

  delete: <TDataSchema extends z.ZodTypeAny | undefined>(path: string, opts?: RequestOptions<TDataSchema>) =>
    request<TDataSchema>("DELETE", path, opts),

  token: {
    getValid: getValidToken,
    clear: () => typeof window !== "undefined" && localStorage.removeItem("token"),
    set: (t: string) => typeof window !== "undefined" && localStorage.setItem("token", t),
  },
}
