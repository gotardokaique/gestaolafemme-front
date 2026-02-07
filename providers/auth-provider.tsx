"use client"

import * as React from "react"
import { useRouter, usePathname } from "next/navigation"
import { toast } from "@/components/ui/sonner"
import { ApiError } from "@/lib/api"

type AuthContextType = {
  handleAuthError: (error: unknown) => void
}

const AuthContext = React.createContext<AuthContextType | null>(null)

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}

type AuthProviderProps = {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const hasShownToastRef = React.useRef(false)

  const handleAuthError = React.useCallback((error: unknown) => {
    if (error instanceof ApiError) {
      if (error.status === 401 || error.status === 403) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token")
          
          if (!hasShownToastRef.current) {
            hasShownToastRef.current = true
            toast.error("Sessão expirada, faça login novamente")
            
            setTimeout(() => {
              hasShownToastRef.current = false
            }, 3000)
          }
          
          if (pathname !== "/login") {
            router.push("/login")
          }
        }
      }
    }
  }, [router, pathname])

  React.useEffect(() => {
    const handleAuthErrorEvent = (e: Event) => {
      const customEvent = e as CustomEvent
      const { status } = customEvent.detail || {}
      
      if (status === 401 || status === 403) {
        if (!hasShownToastRef.current) {
          hasShownToastRef.current = true
          toast.error("Sessão expirada, faça login novamente")
          
          setTimeout(() => {
            hasShownToastRef.current = false
          }, 3000)
        }
        
        if (pathname !== "/login") {
          router.push("/login")
        }
      }
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token" && e.newValue === null && pathname !== "/login") {
        if (!hasShownToastRef.current) {
          hasShownToastRef.current = true
          
          setTimeout(() => {
            hasShownToastRef.current = false
          }, 3000)
        }
        router.push("/login")
      }
    }

    window.addEventListener("auth-error", handleAuthErrorEvent)
    window.addEventListener("storage", handleStorageChange)
    
    return () => {
      window.removeEventListener("auth-error", handleAuthErrorEvent)
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [router, pathname])

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token")
      
      if (!token && pathname !== "/login" && !pathname.startsWith("/login")) {
        router.push("/login")
      }
    }
  }, [pathname, router])

  const value = React.useMemo(() => ({ handleAuthError }), [handleAuthError])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
