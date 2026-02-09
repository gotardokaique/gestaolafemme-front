"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Upload, X, FileImage, File, AlertCircle } from "lucide-react"

/**
 * Representa os dados do arquivo selecionado, compatível com o backend.
 */
export type FileData = {
  nome: string
  mimeType: string
  arquivo: string // Base64
}

type FileFieldProps = {
  /** Lista de extensões aceitas (ex: ".jpg, .png, .jpeg") */
  accept?: string
  /** Tamanho máximo do arquivo em bytes (default: 5MB) */
  maxSize?: number
  /** Campo obrigatório */
  required?: boolean
  /** Campo desabilitado */
  disabled?: boolean
  /** Valor atual */
  value?: FileData | null
  /** Callback quando o arquivo mudar */
  onChange?: (file: FileData | null) => void
  /** Placeholder do drag area */
  placeholder?: string
  /** Classes adicionais */
  className?: string
  /** Texto de ajuda */
  helperText?: string
  /** Exibir preview de imagem */
  showPreview?: boolean
}

export function FileField({
  accept = ".jpg, .jpeg, .png, .gif, .webp",
  maxSize = 5 * 1024 * 1024, // 5MB
  required = false,
  disabled = false,
  value,
  onChange,
  placeholder = "Arraste um arquivo ou clique para selecionar",
  className,
  helperText,
  showPreview = true,
}: FileFieldProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)

  // Gerar preview URL quando value mudar
  React.useEffect(() => {
    if (value?.arquivo && showPreview && value.mimeType.startsWith("image/")) {
      const url = `data:${value.mimeType};base64,${value.arquivo}`
      setPreviewUrl(url)
    } else {
      setPreviewUrl(null)
    }
  }, [value, showPreview])

  const validateFile = (file: File): string | null => {
    // Validar tamanho
    if (file.size > maxSize) {
      const maxMB = (maxSize / (1024 * 1024)).toFixed(1)
      return `Arquivo muito grande. Máximo: ${maxMB}MB`
    }

    // Validar extensão
    if (accept) {
      const extensions = accept
        .split(",")
        .map((ext) => ext.trim().toLowerCase())
      const fileExt = `.${file.name.split(".").pop()?.toLowerCase()}`
      if (!extensions.includes(fileExt) && !extensions.includes("*")) {
        return `Tipo de arquivo não permitido. Aceitos: ${accept}`
      }
    }

    return null
  }

  const processFile = async (file: File) => {
    setError(null)

    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    try {
      const base64 = await fileToBase64(file)
      const fileData: FileData = {
        nome: file.name,
        mimeType: file.type || "application/octet-stream",
        arquivo: base64,
      }
      onChange?.(fileData)
    } catch {
      setError("Erro ao processar o arquivo")
    }
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        // Remove o prefixo "data:...;base64,"
        const base64 = result.split(",")[1]
        resolve(base64)
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (disabled) return

    const files = e.dataTransfer.files
    if (files.length > 0) {
      processFile(files[0])
    }
  }

  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.click()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      processFile(files[0])
    }
    // Reset input para permitir selecionar o mesmo arquivo novamente
    e.target.value = ""
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    setError(null)
    onChange?.(null)
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const getFileSizeFromBase64 = (base64: string): number => {
    // Estimar tamanho do arquivo a partir do base64
    const padding = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0
    return Math.floor((base64.length * 3) / 4 - padding)
  }

  const isImage = value?.mimeType.startsWith("image/")

  return (
    <div className={cn("w-full", className)}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        disabled={disabled}
        className="hidden"
        aria-hidden="true"
      />

      {/* Área de Drop / Seleção */}
      {!value ? (
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          onClick={handleClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              handleClick()
            }
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative flex flex-col items-center justify-center gap-3 p-6",
            "border-2 border-dashed rounded-lg cursor-pointer",
            "transition-all duration-200",
            "bg-muted/30 hover:bg-muted/50",
            isDragging && "border-primary bg-primary/5 scale-[1.02]",
            !isDragging && !error && "border-muted-foreground/25 hover:border-muted-foreground/50",
            error && "border-destructive/50 bg-destructive/5",
            disabled && "opacity-50 cursor-not-allowed hover:bg-muted/30"
          )}
        >
          <div
            className={cn(
              "p-3 rounded-full transition-colors",
              isDragging ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
            )}
          >
            <Upload className="h-6 w-6" />
          </div>

          <div className="text-center">
            <p className="text-sm font-medium text-foreground">
              {placeholder}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {accept.replace(/\./g, "").toUpperCase()} • Máx {formatFileSize(maxSize)}
            </p>
          </div>
        </div>
      ) : (
        /* Preview do arquivo selecionado */
        <div
          className={cn(
            "relative flex items-center gap-3 p-3",
            "border rounded-lg bg-muted/30",
            "group transition-all duration-200",
            disabled && "opacity-50"
          )}
        >
          {/* Thumbnail / Ícone */}
          {showPreview && previewUrl && isImage ? (
            <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden bg-muted">
              <img
                src={previewUrl}
                alt={value.nome}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="h-16 w-16 flex-shrink-0 rounded-md bg-muted flex items-center justify-center">
              {isImage ? (
                <FileImage className="h-8 w-8 text-muted-foreground" />
              ) : (
                <File className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
          )}

          {/* Info do arquivo */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {value.nome}
            </p>
            <p className="text-xs text-muted-foreground">
              {value.mimeType} • {formatFileSize(getFileSizeFromBase64(value.arquivo))}
            </p>
          </div>

          {/* Botão remover */}
          {!disabled && (
            <button
              type="button"
              onClick={handleRemove}
              className={cn(
                "absolute -top-2 -right-2 p-1.5 rounded-full",
                "bg-destructive text-destructive-foreground",
                "opacity-0 group-hover:opacity-100 transition-opacity",
                "hover:bg-destructive/90 focus:opacity-100",
                "focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2"
              )}
              aria-label="Remover arquivo"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Mensagem de erro */}
      {error && (
        <div className="flex items-center gap-1.5 mt-2 text-destructive">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Helper text */}
      {helperText && !error && (
        <p className="text-xs text-muted-foreground mt-2">{helperText}</p>
      )}
    </div>
  )
}
