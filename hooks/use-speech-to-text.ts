"use client"

import * as React from "react"



/* ===================== TYPES ===================== */

// We define these types locally if they are not available globally
// But for cleaner code, we usually keep them in a types file or rely on lib.dom.d.ts
// However, since SpeechRecognition is often experimental, we define the interface here to avoid TS errors.

type SpeechRecognitionAlternative = {
  transcript: string
  confidence: number
}

type SpeechRecognitionResult = {
  isFinal: boolean
  length: number
  [index: number]: SpeechRecognitionAlternative
}

type SpeechRecognitionResultList = {
  length: number
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
  resultIndex?: number
}

interface SpeechRecognitionErrorEvent extends Event {
  error?: string
  message?: string
}

interface SpeechRecognition extends EventTarget {
  lang: string
  continuous: boolean
  interimResults: boolean
  start: () => void
  stop: () => void
  abort: () => void
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onend?: ((event: Event) => void) | null
}

type SpeechRecognitionConstructor = new () => SpeechRecognition

declare global {
  interface Window {
    webkitSpeechRecognition?: SpeechRecognitionConstructor
    SpeechRecognition?: SpeechRecognitionConstructor
  }
}

/* ===================== API ===================== */

type UseSpeechToTextOptions = {
  lang?: string
  continuous?: boolean
  interimResults?: boolean
  onInterim?: (text: string) => void // texto completo exibível
  onFinal?: (text: string) => void   // texto final completo
  onError?: (message: string) => void
}

type UseSpeechToTextReturn = {
  isSupported: boolean
  isListening: boolean
  transcript: string
  finalTranscript: string
  error: string | null
  start: () => void
  stop: () => void
  toggle: () => void
  reset: () => void
}

/* ===================== HOOK ===================== */

export function useSpeechToText(
  options?: UseSpeechToTextOptions
): UseSpeechToTextReturn {
  const opts = React.useMemo(
    () => ({
      lang: options?.lang ?? "pt-BR",
      continuous: options?.continuous ?? true,
      interimResults: options?.interimResults ?? true,
      onInterim: options?.onInterim,
      onFinal: options?.onFinal,
      onError: options?.onError,
    }),
    [
      options?.lang,
      options?.continuous,
      options?.interimResults,
      options?.onInterim,
      options?.onFinal,
      options?.onError,
    ]
  )

  /* ---------- refs de controle ---------- */

  const recognitionRef = React.useRef<SpeechRecognition | null>(null)
  const restartTimerRef = React.useRef<number | null>(null)

  const isListeningRef = React.useRef(false)
  const finalTranscriptRef = React.useRef("")
  const lastInterimRef = React.useRef("")

  const fatalErrorRef = React.useRef(false)
  const lastErrorRef = React.useRef<{ msg: string; ts: number } | null>(null)

  /* ---------- state ---------- */

  const [isSupported, setIsSupported] = React.useState(false)
  const [isListening, setIsListening] = React.useState(false)
  const [transcript, setTranscript] = React.useState("")
  const [finalTranscript, setFinalTranscript] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)

  /* ---------- suporte ---------- */

  React.useEffect(() => {
    const supported =
      typeof window !== "undefined" &&
      !!(window.SpeechRecognition || window.webkitSpeechRecognition)
    setIsSupported(supported)
  }, [])

  /* ---------- utils ---------- */

  const clearRestartTimer = React.useCallback(() => {
    if (restartTimerRef.current) {
      window.clearTimeout(restartTimerRef.current)
      restartTimerRef.current = null
    }
  }, [])

  const handleError = React.useCallback(
    (message: string, fatal = false) => {
      const now = Date.now()
      const last = lastErrorRef.current

      // anti-spam de erro
      if (last && last.msg === message && now - last.ts < 1200) return
      lastErrorRef.current = { msg: message, ts: now }

      setError(message)
      opts.onError?.(message)

      if (fatal) {
        fatalErrorRef.current = true
        isListeningRef.current = false
        setIsListening(false)
        clearRestartTimer()
        try {
          recognitionRef.current?.abort()
        } catch {}
      }
    },
    [opts, clearRestartTimer]
  )

  const cleanupRecognition = React.useCallback(() => {
    clearRestartTimer()
    try {
      recognitionRef.current?.abort()
    } catch {}
    recognitionRef.current = null
  }, [clearRestartTimer])

  /* ---------- start ---------- */

  const start = React.useCallback(() => {
    if (!isSupported) {
      handleError("Seu navegador não suporta reconhecimento de voz.")
      return
    }
    if (isListeningRef.current) return

    fatalErrorRef.current = false

    try {
      const Ctor =
        window.SpeechRecognition || window.webkitSpeechRecognition
      if (!Ctor) {
        handleError("API de reconhecimento de voz indisponível.")
        return
      }

      cleanupRecognition()

      const rec = new Ctor()
      recognitionRef.current = rec

      rec.lang = opts.lang
      rec.continuous = !!opts.continuous
      rec.interimResults = !!opts.interimResults

      rec.onresult = (event: SpeechRecognitionEvent) => {
        let interim = ""
        const finals: string[] = []

        const startIndex =
          typeof event.resultIndex === "number"
            ? event.resultIndex
            : 0

        for (let i = startIndex; i < event.results.length; i++) {
          const result = event.results[i]
          const text = result[0]?.transcript ?? ""
          if (!text) continue

          if (result.isFinal) finals.push(text)
          else interim += text
        }

        if (finals.length) {
          const chunk = finals.join(" ").trim()
          if (chunk) {
            const next = finalTranscriptRef.current
              ? `${finalTranscriptRef.current} ${chunk}`.trim()
              : chunk

            finalTranscriptRef.current = next
            setFinalTranscript(next)
            opts.onFinal?.(next)
          }
        }

        const display = `${finalTranscriptRef.current} ${interim}`.trim()
        if (display !== lastInterimRef.current) {
          lastInterimRef.current = display
          setTranscript(display)
          opts.onInterim?.(display)
        }
      }

      rec.onerror = (e: SpeechRecognitionErrorEvent) => {
        const err = String(e?.error || "").toLowerCase()

        if (err === "not-allowed" || err === "service-not-allowed") {
          handleError(
            "Microfone bloqueado. Conecte um microfone ou headset, verifique as permissões do navegador e do sistema e recarregue a página.",
            true
          )
          return
        }

        if (err === "not-found") {
          handleError(
            "Nenhum microfone encontrado. Conecte um dispositivo de áudio e tente novamente.",
            true
          )
          return
        }

        if (err === "audio-capture") {
          handleError(
            "Microfone em uso por outro aplicativo. Feche Meet, Discord, WhatsApp Web ou apps similares.",
            true
          )
          return
        }

        if (err === "no-speech") {
          // Ignorar erro "no-speech" e apenas registrar log se necessário
          // handleError("Nenhuma fala detectada. Fale mais perto do microfone e tente novamente.")
          return
        }

        handleError(
          e?.message || e?.error || "Erro no reconhecimento de voz."
        )
      }

      rec.onend = () => {
        if (fatalErrorRef.current) return

        if (isListeningRef.current && opts.continuous) {
          clearRestartTimer()
          restartTimerRef.current = window.setTimeout(() => {
            if (!fatalErrorRef.current) {
              try {
                recognitionRef.current?.start()
              } catch {}
            }
          }, 250)
        } else {
          setIsListening(false)
        }
      }

      isListeningRef.current = true
      setIsListening(true)
      setError(null)

      rec.start()
    } catch {
      isListeningRef.current = false
      setIsListening(false)
      handleError("Não foi possível iniciar o microfone.")
    }
  }, [isSupported, opts, handleError, cleanupRecognition, clearRestartTimer])

  /* ---------- stop / toggle / reset ---------- */

  const stop = React.useCallback(() => {
    isListeningRef.current = false
    setIsListening(false)
    clearRestartTimer()
    try {
      recognitionRef.current?.stop()
    } catch {}
  }, [clearRestartTimer])

  const toggle = React.useCallback(() => {
    isListeningRef.current ? stop() : start()
  }, [start, stop])

  const reset = React.useCallback(() => {
    lastInterimRef.current = ""
    finalTranscriptRef.current = ""
    fatalErrorRef.current = false
    setTranscript("")
    setFinalTranscript("")
    setError(null)
  }, [])

  React.useEffect(() => {
    return () => {
      isListeningRef.current = false
      cleanupRecognition()
    }
  }, [cleanupRecognition])

  return {
    isSupported,
    isListening,
    transcript,
    finalTranscript,
    error,
    start,
    stop,
    toggle,
    reset,
  }
}
