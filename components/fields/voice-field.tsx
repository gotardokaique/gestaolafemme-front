"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { VoiceMicButton } from "@/components/common/voice-mic-button"

// Extends Input/Textarea props but excludes value and onChange because we handle them
type InputProps = Omit<React.ComponentProps<typeof Input>, "value" | "onChange">
type TextareaProps = Omit<React.ComponentProps<typeof Textarea>, "value" | "onChange">

type VoiceFieldProps = {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  as?: "input" | "textarea"
  inputProps?: InputProps
  textareaProps?: TextareaProps
}

export function VoiceField({
  value,
  onChange,
  placeholder,
  disabled,
  className,
  as = "input",
  inputProps,
  textareaProps,
}: VoiceFieldProps) {
  const isTextarea = as === "textarea"

  // Quando o usuário apagar o campo (ficar ""), mudamos essa chave para resetar o mic
  const [resetKey, setResetKey] = React.useState<number>(0)
  const prevValueRef = React.useRef<string>(value)

  React.useEffect(() => {
    const prev = prevValueRef.current
    // Detecta transição: tinha algo -> virou vazio (usuário limpou)
    if (prev && !value) {
      setResetKey((k) => k + 1)
    }
    prevValueRef.current = value
  }, [value])

  const handleChange = (v: string) => {
    onChange(v)
  }

  return (
    <div className={cn("relative flex items-start gap-2 w-full", className)}>
      <div className="flex-1 relative min-w-0">
        {isTextarea ? (
          <Textarea
            {...(textareaProps ?? {})}
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className={cn("min-h-[80px] resize-none pr-10", textareaProps?.className)}
          />
        ) : (
          <Input
            {...(inputProps ?? {})}
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className={cn("pr-10", inputProps?.className)}
          />
        )}
        
        {/* Posiciona o botão dentro do input/textarea para economizar espaço */}
        <div className={cn(
          "absolute right-1 top-1.5 z-10",
          isTextarea ? "top-2 right-2" : ""
        )}>
          <VoiceMicButton
            className="h-7 w-7 sm:h-8 sm:w-8"
            disabled={disabled}
            onInterim={handleChange}
            onFinal={handleChange}
            resetKey={resetKey} // NOVO: garante “começar do zero” após limpar o campo
            tooltipTextIdle="Falar"
          />
        </div>
      </div>
    </div>
  )
}
