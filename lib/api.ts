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
  dataSchema?: TDataSchema
  signal?: AbortSignal
  timeoutMs?: number
  cache?: RequestCache
  next?: NextFetchRequestConfig
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
      v.forEach(item => item != null && usp.append(k, String(item)))
      continue
    }
    usp.set(k, String(v))
  }
  const qs = usp.toString()
  return qs ? `?${qs}` : ""
}

async function parseBody(res: Response): Promise<unknown> {
  if (res.status === 204 || res.status === 205) return undefined
  const ct = (res.headers.get("content-type") ?? "").toLowerCase()
  try {
    const raw = await res.text()
    if (!raw?.trim()) return undefined
    if (ct.includes("application/json") || (raw.startsWith("{") || raw.startsWith("["))) {
      return JSON.parse(raw)
    }
    return raw
  } catch { return undefined }
}

function extractMessage(details: unknown, status: number): string {
  if (typeof details === "string") return details.trim()
  if (details && typeof details === "object") {
    const any = details as any
    const msg = any.message || any.mensagem || any.error || any.data?.message || any.data?.mensagem
    if (msg) return String(msg).trim()
  }
  return `Erro HTTP ${status}`
}

function buildSignal(userSignal?: AbortSignal, timeoutMs?: number) {
  if (!timeoutMs && !userSignal) return undefined
  const controller = new AbortController()
  if (userSignal) {
    if (userSignal.aborted) controller.abort(userSignal.reason)
    else userSignal.addEventListener("abort", () => controller.abort(userSignal.reason), { once: true })
  }
  let timeoutId: ReturnType<typeof setTimeout>
  if (timeoutMs && timeoutMs > 0) {
    timeoutId = setTimeout(() => controller.abort(new Error("Request timeout")), timeoutMs)
  }
  return { signal: controller.signal, cleanup: () => timeoutId && clearTimeout(timeoutId) }
}

async function request<TDataSchema extends z.ZodTypeAny | undefined, TData = unknown>(
  method: HttpMethod,
  path: string,
  opts: RequestOptions<TDataSchema> = {}
): Promise<ApiEnvelope<TDataSchema extends z.ZodTypeAny ? z.infer<TDataSchema> : TData>> {
  assertApiUrl()

  const url = `${API_URL}${path}${buildQuery(opts.params)}`
  const headers: Record<string, string> = { Accept: "application/json", ...opts.headers }

  let body: BodyInit | undefined
  if (opts.body != null) {
    headers["Content-Type"] = headers["Content-Type"] ?? "application/json"
    body = JSON.stringify(opts.body)
  }

  const sig = buildSignal(opts.signal, opts.timeoutMs)

  try {
    const res = await fetch(url, {
      method,
      headers,
      body,
      signal: sig?.signal,
      cache: opts.cache,
      next: opts.next as any,
      credentials: "include", // ESSENCIAL: Envia/Recebe cookies HttpOnly
    })

    const parsed = await parseBody(res)

    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("auth-error", {
            detail: { status: res.status, message: extractMessage(parsed, res.status) }
          }))
        }
      }
      throw new ApiError(extractMessage(parsed, res.status), res.status, parsed, { url, method })
    }

    const envelopeSchema = ApiEnvelopeSchema(opts.dataSchema ?? z.any())
    const envSafe = envelopeSchema.safeParse(parsed)

    if (envSafe.success) {
      if (!envSafe.data.success) {
        throw new ApiError(envSafe.data.message ?? "Erro na operação.", res.status, envSafe.data, { url, method })
      }
      return envSafe.data as any
    }

    if (opts.dataSchema) {
      return { success: true, message: null, data: opts.dataSchema.parse(parsed) } as any
    }

    return { success: true, message: null, data: parsed as any } as any

  } catch (err: any) {
    if (err?.name === "AbortError") throw new ApiError("Timeout da requisição.", 499, undefined, { url, method })
    if (err instanceof ApiError) throw err
    throw new ApiError(err?.message ?? "Falha de rede.", 0, undefined, { url, method })
  } finally {
    sig?.cleanup?.()
  }
}

export const api = {
  get: <TS extends z.ZodTypeAny | undefined>(p: string, o?: RequestOptions<TS>) => request<TS>("GET", p, o),
  post: <TS extends z.ZodTypeAny | undefined>(p: string, o?: RequestOptions<TS>) => request<TS>("POST", p, o),
  put: <TS extends z.ZodTypeAny | undefined>(p: string, o?: RequestOptions<TS>) => request<TS>("PUT", p, o),
  patch: <TS extends z.ZodTypeAny | undefined>(p: string, o?: RequestOptions<TS>) => request<TS>("PATCH", p, o),
  delete: <TS extends z.ZodTypeAny | undefined>(p: string, o?: RequestOptions<TS>) => request<TS>("DELETE", p, o),

  // Logout agora é uma chamada de API, pois só o back pode "limpar" o cookie HttpOnly
  logout: async () => {
    try { await request("POST", "/auth/logout"); }
    finally { window.location.href = "/login"; }
  }
}