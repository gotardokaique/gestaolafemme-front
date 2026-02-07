"use client"

import * as React from "react"
import { useAuth } from "@/providers/auth-provider"

export function useApiErrorHandler() {
  const { handleAuthError } = useAuth()

  const handleError = React.useCallback((error: unknown) => {
    handleAuthError(error)
    throw error
  }, [handleAuthError])

  return { handleError }
}
