"use client"

import * as React from "react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { FilePreview } from "@/components/ui/file-preview"
import { FileField, type FileData } from "@/components/fields/file-field"
import { toast } from "@/components/ui/sonner"
import { Images, Plus, Trash2, X, Loader2 } from "lucide-react"

import { filePreviewApi } from "@/services/file-preview/file-preview.api"
import { produtoApi } from "@/services/produto/produto.api"
import type { FotoCatalogoData } from "@/services/file-preview/file-preview.schemas"

type Props = {
  produtoId: number | null
  produtoNome?: string
  onOpenChange: (open: boolean) => void
}

export function ProdutoCatalogoSheet({ produtoId, produtoNome, onOpenChange }: Props) {
  const [fotos, setFotos] = React.useState<FotoCatalogoData[]>([])
  const [loading, setLoading] = React.useState(false)
  const [adding, setAdding] = React.useState(false)

  // Form para adicionar nova foto
  const [novaFoto, setNovaFoto] = React.useState<FileData | null>(null)
  const [descricao, setDescricao] = React.useState("")
  const [removingId, setRemovingId] = React.useState<number | null>(null)

  // Carregar fotos do catálogo
  const loadFotos = React.useCallback(async () => {
    if (!produtoId) return
    setLoading(true)
    try {
      const data = await filePreviewApi.getProdutoCatalogo(produtoId)
      setFotos(data)
    } catch {
      toast.error("Erro ao carregar fotos do catálogo.")
    } finally {
      setLoading(false)
    }
  }, [produtoId])

  React.useEffect(() => {
    if (produtoId) {
      loadFotos()
      // Reset form
      setNovaFoto(null)
      setDescricao("")
    } else {
      setFotos([])
    }
  }, [produtoId, loadFotos])

  const handleAddFoto = async () => {
    if (!produtoId || !novaFoto) {
      toast.error("Selecione uma imagem.")
      return
    }

    setAdding(true)
    try {
      await produtoApi.addFotoCatalogo(produtoId, {
        nome: descricao.trim() || novaFoto.nome,
        mimeType: novaFoto.mimeType,
        arquivo: novaFoto.arquivo,
      })
      toast.success("Foto adicionada ao catálogo!")
      setNovaFoto(null)
      setDescricao("")
      loadFotos()
    } catch (err: any) {
      toast.error(err?.message ?? "Erro ao adicionar foto.")
    } finally {
      setAdding(false)
    }
  }

  const handleRemoveFoto = async (anexoId: number) => {
    if (!produtoId) return
    
    setRemovingId(anexoId)
    try {
      await produtoApi.removeFotoCatalogo(produtoId, anexoId)
      toast.success("Foto removida do catálogo!")
      setFotos((prev) => prev.filter((f) => f.id !== anexoId))
    } catch (err: any) {
      toast.error(err?.message ?? "Erro ao remover foto.")
    } finally {
      setRemovingId(null)
    }
  }

  const isOpen = produtoId !== null

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sheet-content-standard overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
              <Images className="h-5 w-5" />
            </div>
            <div>
              <SheetTitle>Catálogo de Fotos</SheetTitle>
              <SheetDescription>
                {produtoNome ? `Gerencie as fotos de catálogo do produto "${produtoNome}"` : "Gerencie as fotos de catálogo do produto"}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6 pb-10">
          {/* Seção: Adicionar nova foto */}
          <div className="p-4 rounded-lg border bg-muted/30 space-y-4">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Adicionar Foto ao Catálogo
            </h3>

            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Descrição / Variação</Label>
                <Input
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Ex: COR: VERMELHA, TAMANHO: P"
                />
                <p className="text-xs text-muted-foreground">
                  Opcional. Use para identificar variações do produto.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Imagem</Label>
                <FileField
                  accept=".jpg, .jpeg, .png, .webp"
                  maxSize={5 * 1024 * 1024}
                  value={novaFoto}
                  onChange={setNovaFoto}
                  placeholder="Selecione ou arraste uma imagem"
                />
              </div>

              <Button
                onClick={handleAddFoto}
                disabled={!novaFoto || adding}
                className="w-full"
              >
                {adding ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Adicionando...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar ao Catálogo
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Seção: Fotos existentes */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Fotos do Catálogo ({fotos.length})
            </h3>

            {loading ? (
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-32 w-full rounded-lg" />
                ))}
              </div>
            ) : fotos.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Images className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Nenhuma foto no catálogo.</p>
                <p className="text-sm">Adicione fotos para mostrar variações do produto.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {fotos.map((foto) => (
                  <div
                    key={foto.id}
                    className="relative group rounded-lg overflow-hidden border bg-muted/10"
                  >
                    <FilePreview
                      data={foto}
                      height={120}
                      compact
                      showControls={false}
                      bordered={false}
                      objectFit="cover"
                    />

                    {/* Overlay com nome e botão remover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-2">
                        <p className="text-white text-xs font-medium truncate">
                          {foto.nome}
                        </p>
                      </div>
                    </div>

                    {/* Botão remover */}
                    <button
                      type="button"
                      onClick={() => handleRemoveFoto(foto.id)}
                      disabled={removingId === foto.id}
                      className="absolute top-1 right-1 p-1.5 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/90 disabled:opacity-50"
                      aria-label="Remover foto"
                    >
                      {removingId === foto.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </button>

                    {/* Badge com nome sempre visível */}
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                      <p className="text-white text-xs font-medium truncate">
                        {foto.nome}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
