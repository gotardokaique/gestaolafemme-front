"use client"

import * as React from "react"
import { useRouter, usePathname } from "next/navigation"
import { toast } from "@/components/ui/sonner"
import { ApiError, api } from "@/lib/api"

type AuthContextType = {
  handleAuthError: (error: unknown) => void
  logout: () => Promise<void>
}

const AuthContext = React.createContext<AuthContextType | null>(null)

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) throw new Error("useAuth deve ser usado dentro de AuthProvider")
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const isRedirecting = React.useRef(false)

  // Centraliza a limpeza e redirecionamento
  const forceLogout = React.useCallback((message?: string) => {
    if (isRedirecting.current) return
    isRedirecting.current = true

    if (message) toast.error(message)

    api.logout()
    if (pathname !== "/login") {
      router.replace("/login")
    }

    setTimeout(() => { isRedirecting.current = false }, 2000)
  }, [router, pathname])

  const handleAuthError = React.useCallback((error: unknown) => {
    if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
      forceLogout("Sessão inválida ou expirada.")
    }
  }, [forceLogout])

  const logout = React.useCallback(async () => {
    await api.logout()
  }, [])

  React.useEffect(() => {
    const handleAuthEvent = (e: Event) => {
      const detail = (e as CustomEvent).detail
      forceLogout(detail?.message || "Sessão expirada.")
    }

    window.addEventListener("auth-error", handleAuthEvent)
    return () => window.removeEventListener("auth-error", handleAuthEvent)
  }, [forceLogout])

  const value = React.useMemo(() => ({ handleAuthError, logout }), [handleAuthError, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}