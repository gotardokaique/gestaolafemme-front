"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useSpeechToText } from "@/hooks/use-speech-to-text"
import { toast } from "sonner"
import { Mic, MicOff, Loader2 } from "lucide-react"

type VoiceMicButtonProps = {
  onInterim?: (text: string) => void
  onFinal?: (text: string) => void
  onError?: (msg: string) => void
  disabled?: boolean
  className?: string
  lang?: string

  // NOVO: permite o “começar do zero” quando o campo foi apagado
  resetKey?: string | number

  toastOnError?: boolean
  tooltipTextIdle?: string
  tooltipTextListening?: string
  tooltipTextUnsupported?: string
}

export function VoiceMicButton({
  onInterim,
  onFinal,
  onError,
  disabled,
  className,
  lang = "pt-BR",
  resetKey,
  toastOnError = true,
  tooltipTextIdle = "Clique para falar",
  tooltipTextListening = "Ouvindo... (clique para parar)",
  tooltipTextUnsupported = "Seu navegador não suporta voz",
}: VoiceMicButtonProps) {
  const { isSupported, isListening, toggle, reset, stop } = useSpeechToText({
    lang,
    continuous: true,
    interimResults: true,
    onInterim,
    onFinal,
    onError: (msg) => {
      onError?.(msg)
      if (toastOnError) {
        try { toast.error(msg) } catch {}
      }
    },
  })

    // NOVO: quando resetKey muda, limpamos o histórico do reconhecimento
  React.useEffect(() => {
    if (resetKey === undefined) return
    // se estiver ouvindo, pare antes de resetar
    stop()
    reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey])

  const isDisabled = disabled || !isSupported

  const label = !isSupported
    ? tooltipTextUnsupported
    : isListening
    ? tooltipTextListening
    : tooltipTextIdle

  const handlePointerDown = React.useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      e.preventDefault()
      if (isDisabled) return
      toggle()
    },
    [toggle, isDisabled]
  )

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            aria-label={label}
            aria-pressed={isListening}
            disabled={isDisabled}
            onPointerDown={handlePointerDown}
            className={cn(
              "select-none touch-none shrink-0 transition-all duration-200",
              isListening 
                ? "animate-pulse border-red-500 bg-red-100 hover:bg-red-200 text-red-600 dark:bg-red-900/40 dark:hover:bg-red-900/60 dark:text-red-400" 
                : "", 
              className
            )}
            variant="outline"
            size="icon"
          >
            <Mic className={cn("h-4 w-4", isListening ? "text-red-600 dark:text-red-400" : "")} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <span>{label}</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
