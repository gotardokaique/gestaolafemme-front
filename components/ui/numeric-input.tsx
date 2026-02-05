"use client"

import * as React from "react"
import { Input } from "./input"

interface NumericInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value?: number
  onChange?: (value: number) => void
  variant?: "currency" | "percentage" | "number"
  prefix?: string
  suffix?: string
}

export function NumericInput({
  value,
  onChange,
  variant = "number",
  prefix,
  suffix,
  className,
  ...props
}: NumericInputProps) {
  const [displayValue, setDisplayValue] = React.useState("")

  const formatValue = React.useCallback((val: number | undefined) => {
    if (val === undefined || isNaN(val)) return ""
    
    const digits = variant === "number" ? 0 : 2

    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }).format(val)
  }, [variant])

  React.useEffect(() => {
    setDisplayValue(formatValue(value))
  }, [value, formatValue])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, "")
    
    if (!raw) {
      setDisplayValue("")
      onChange?.(0)
      return
    }

    let numeric = parseInt(raw, 10)
    if (variant !== "number") {
      numeric = numeric / 100
    }
    
    setDisplayValue(formatValue(numeric))
    onChange?.(numeric)
  }

  return (
    <div className="relative">
      {prefix && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
          {prefix}
        </span>
      )}
      <Input
        {...props}
        className={`${className} ${prefix ? "pl-9" : ""} ${suffix ? "pr-9" : ""}`}
        value={displayValue}
        onChange={handleInputChange}
      />
      {suffix && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
          {suffix}
        </span>
      )}
    </div>
  )
}
