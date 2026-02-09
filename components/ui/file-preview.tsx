"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { ImageOff, Loader2, FileImage, FileVideo, File, ZoomIn, Download, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export type FilePreviewData = {
  nome: string
  mimeType: string
  arquivo: string // Base64
  tamanhoBytes?: number
}

type FilePreviewProps = {
  /** Dados do arquivo para exibir */
  data?: FilePreviewData | null
  /** URL para carregar os dados (alternativa a data) */
  src?: string
  /** Loading state */
  loading?: boolean
  /** Exibir em modo compacto */
  compact?: boolean
  /** Altura do preview */
  height?: number | string
  /** Largura do preview */
  width?: number | string
  /** Classe CSS adicional */
  className?: string
  /** Mostrar controles (zoom, download) */
  showControls?: boolean
  /** Texto quando não há imagem */
  emptyText?: string
  /** Placeholder para estado vazio */
  emptyIcon?: React.ReactNode
  /** Arredondamento do container */
  rounded?: "none" | "sm" | "md" | "lg" | "full"
  /** Exibir borda */
  bordered?: boolean
  /** Object fit */
  objectFit?: "contain" | "cover" | "fill" | "none"
  /** Callback ao clicar no preview */
  onClick?: () => void
}

export function FilePreview({
  data,
  src,
  loading = false,
  compact = false,
  height = compact ? 80 : 200,
  width = "100%",
  className,
  showControls = true,
  emptyText = "Sem imagem",
  emptyIcon,
  rounded = "lg",
  bordered = true,
  objectFit = "contain",
  onClick,
}: FilePreviewProps) {
  const [isZoomed, setIsZoomed] = React.useState(false)
  const [imageError, setImageError] = React.useState(false)

  // Construir URL de dados a partir do base64
  const dataUrl = React.useMemo(() => {
    if (!data?.arquivo) return null
    return `data:${data.mimeType};base64,${data.arquivo}`
  }, [data])

  const isImage = data?.mimeType?.startsWith("image/")
  const isVideo = data?.mimeType?.startsWith("video/")
  const isPdf = data?.mimeType === "application/pdf"

  const roundedClass = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  }[rounded]

  const handleDownload = () => {
    if (!dataUrl || !data) return
    const link = document.createElement("a")
    link.href = dataUrl
    link.download = data.nome
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return ""
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  // Estado de loading
  if (loading) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted/50",
          bordered && "border",
          roundedClass,
          className
        )}
        style={{ height, width }}
      >
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin" />
          {!compact && <span className="text-sm">Carregando...</span>}
        </div>
      </div>
    )
  }

  // Estado vazio
  if (!data || !data.arquivo) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted/30",
          bordered && "border border-dashed",
          roundedClass,
          className
        )}
        style={{ height, width }}
      >
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          {emptyIcon || <ImageOff className={cn("text-muted-foreground/50", compact ? "h-6 w-6" : "h-10 w-10")} />}
          {!compact && <span className="text-sm">{emptyText}</span>}
        </div>
      </div>
    )
  }

  // Preview de imagem
  if (isImage && !imageError) {
    return (
      <>
        <div
          className={cn(
            "relative group overflow-hidden bg-muted/10",
            bordered && "border",
            roundedClass,
            onClick && "cursor-pointer",
            className
          )}
          style={{ height, width }}
          onClick={onClick}
        >
          <img
            src={dataUrl!}
            alt={data.nome}
            className={cn(
              "h-full w-full transition-transform duration-300",
              objectFit === "contain" && "object-contain",
              objectFit === "cover" && "object-cover",
              objectFit === "fill" && "object-fill",
              objectFit === "none" && "object-none",
              "group-hover:scale-105"
            )}
            onError={() => setImageError(true)}
          />

          {/* Overlay com controles */}
          {showControls && !compact && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              <Button
                size="icon"
                variant="secondary"
                className="h-9 w-9"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsZoomed(true)
                }}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="secondary"
                className="h-9 w-9"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDownload()
                }}
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Info do arquivo */}
          {!compact && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-white text-sm font-medium truncate">{data.nome}</p>
              {data.tamanhoBytes && (
                <p className="text-white/70 text-xs">{formatFileSize(data.tamanhoBytes)}</p>
              )}
            </div>
          )}
        </div>

        {/* Modal de zoom */}
        {isZoomed && (
          <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setIsZoomed(false)}
          >
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-4 right-4 text-white hover:bg-white/20"
              onClick={() => setIsZoomed(false)}
            >
              <X className="h-6 w-6" />
            </Button>

            <img
              src={dataUrl!}
              alt={data.nome}
              className="max-h-full max-w-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="text-white text-sm truncate max-w-xs">{data.nome}</span>
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20 h-8"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDownload()
                }}
              >
                <Download className="h-4 w-4 mr-1" />
                Baixar
              </Button>
            </div>
          </div>
        )}
      </>
    )
  }

  // Preview de vídeo
  if (isVideo) {
    return (
      <div
        className={cn(
          "relative overflow-hidden bg-black",
          bordered && "border",
          roundedClass,
          className
        )}
        style={{ height, width }}
      >
        <video
          src={dataUrl!}
          controls
          className="h-full w-full object-contain"
        >
          Seu navegador não suporta a tag de vídeo.
        </video>
      </div>
    )
  }

  // Preview de PDF (iframe)
  if (isPdf) {
    return (
      <div
        className={cn(
          "relative overflow-hidden bg-muted/10",
          bordered && "border",
          roundedClass,
          className
        )}
        style={{ height: typeof height === "number" ? Math.max(height, 300) : height, width }}
      >
        <iframe
          src={dataUrl!}
          title={data.nome}
          className="h-full w-full"
        />
      </div>
    )
  }

  // Arquivo genérico
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-muted/30",
        bordered && "border",
        roundedClass,
        className
      )}
      style={{ height, width }}
    >
      <div className="flex flex-col items-center gap-3 text-muted-foreground p-4">
        <div className="p-3 rounded-full bg-muted">
          {isImage ? (
            <FileImage className="h-8 w-8" />
          ) : isVideo ? (
            <FileVideo className="h-8 w-8" />
          ) : (
            <File className="h-8 w-8" />
          )}
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-foreground truncate max-w-[200px]">{data.nome}</p>
          <p className="text-xs">{data.mimeType}</p>
          {data.tamanhoBytes && (
            <p className="text-xs">{formatFileSize(data.tamanhoBytes)}</p>
          )}
        </div>
        {showControls && (
          <Button size="sm" variant="outline" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Baixar
          </Button>
        )}
      </div>
    </div>
  )
}
