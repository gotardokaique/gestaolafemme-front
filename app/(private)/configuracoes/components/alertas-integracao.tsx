"use client"

import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import toast from "react-hot-toast"

export function AlertasDeIntegracao() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const success = searchParams.get("success")
    const error = searchParams.get("error")

    if (success === "mp_connected") {
      toast.success("Mercado Pago conectado com sucesso!")
      router.replace(pathname)
    } else if (error) {
      toast.error(`Erro ao conectar: ${error}`)
      router.replace(pathname)
    }
  }, [searchParams, router, pathname])

  return null
}
