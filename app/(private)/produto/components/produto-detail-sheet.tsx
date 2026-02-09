"use client"

import * as React from "react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { FilePreview } from "@/components/ui/file-preview"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { toast } from "@/components/ui/sonner"
import {
  Package,
  Tag,
  Barcode,
  DollarSign,
  TrendingUp,
  Warehouse,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileText,
  Images,
  Calendar,
} from "lucide-react"

import { produtoApi } from "@/services/produto/produto.api"
import { filePreviewApi } from "@/services/file-preview/file-preview.api"
import type { Produto } from "@/services/produto/produto.schemas"
import type { FilePreviewData, FotoCatalogoData } from "@/services/file-preview/file-preview.schemas"
import { formatCurrency } from "@/lib/utils"

type Props = {
  produtoId: number | null
  onOpenChange: (open: boolean) => void
}

export function ProdutoDetailSheet({ produtoId, onOpenChange }: Props) {
  const [produto, setProduto] = React.useState<Produto | null>(null)
  const [foto, setFoto] = React.useState<FilePreviewData | null>(null)
  const [fotosCatalogo, setFotosCatalogo] = React.useState<FotoCatalogoData[]>([])
  const [loadingProduto, setLoadingProduto] = React.useState(false)
  const [loadingFoto, setLoadingFoto] = React.useState(false)
  const [loadingCatalogo, setLoadingCatalogo] = React.useState(false)

  // Carregar dados do produto, foto e catálogo em paralelo
  React.useEffect(() => {
    if (produtoId) {
      // Requisição 1: Dados do produto
      setLoadingProduto(true)
      produtoApi.getById(produtoId)
        .then((data) => setProduto(data))
        .catch((err) => {
          toast.error(err?.message ?? "Erro ao carregar produto.")
          onOpenChange(false)
        })
        .finally(() => setLoadingProduto(false))

      // Requisição 2: Foto do produto (separada para não pesar)
      setLoadingFoto(true)
      filePreviewApi.getProdutoFoto(produtoId)
        .then((data) => setFoto(data))
        .catch(() => setFoto(null))
        .finally(() => setLoadingFoto(false))

      // Requisição 3: Fotos do catálogo
      setLoadingCatalogo(true)
      filePreviewApi.getProdutoCatalogo(produtoId)
        .then((data) => setFotosCatalogo(data))
        .catch(() => setFotosCatalogo([]))
        .finally(() => setLoadingCatalogo(false))
    } else {
      setProduto(null)
      setFoto(null)
      setFotosCatalogo([])
    }
  }, [produtoId, onOpenChange])

  const isOpen = produtoId !== null

  const calcularMargem = (): number => {
    if (!produto || produto.valorCusto <= 0) return 0
    return ((produto.valorVenda / produto.valorCusto) - 1) * 100
  }

  const isEstoqueBaixo = produto && produto.quantidadeAtual <= produto.estoqueMinimo

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sheet-content-standard overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <SheetTitle>Detalhes do Produto</SheetTitle>
              <SheetDescription>
                Visualize todas as informações do produto.
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6 pb-10">
          {/* Seção: Foto do Produto */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Foto do Produto
            </h3>
            <FilePreview
              data={foto}
              loading={loadingFoto}
              height={200}
              emptyText="Produto sem foto"
              objectFit="cover"
              rounded="lg"
            />
          </div>

          {/* Seção: Catálogo de Fotos */}
          {(loadingCatalogo || fotosCatalogo.length > 0) && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Images className="h-4 w-4" />
                Catálogo de Fotos
                {fotosCatalogo.length > 0 && (
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {fotosCatalogo.length} {fotosCatalogo.length === 1 ? "foto" : "fotos"}
                  </Badge>
                )}
              </h3>
              {loadingCatalogo ? (
                <Skeleton className="h-[160px] w-full rounded-lg" />
              ) : (
                <Carousel
                  opts={{ align: "start" }}
                  className="w-full max-w-full"
                >
                  <CarouselContent>
                    {fotosCatalogo.map((foto) => {
                      const dataUrl = `data:${foto.mimeType};base64,${foto.arquivo}`
                      return (
                        <CarouselItem key={foto.id} className="basis-1/2 md:basis-1/3">
                          <div className="p-1">
                            <Card className="overflow-hidden">
                              <CardContent className="relative p-0 aspect-square">
                                <img
                                  src={dataUrl}
                                  alt={foto.nome}
                                  className="h-full w-full object-cover"
                                />
                                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                                  <p className="text-white text-xs font-medium truncate">
                                    {foto.nome}
                                  </p>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </CarouselItem>
                      )
                    })}
                  </CarouselContent>
                  {fotosCatalogo.length > 2 && (
                    <>
                      <CarouselPrevious className="-left-3" />
                      <CarouselNext className="-right-3" />
                    </>
                  )}
                </Carousel>
              )}
            </div>
          )}


          <Separator />

          {/* Seção: Informações Básicas */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Informações Básicas</h3>

            {loadingProduto ? (
              <div className="space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            ) : produto ? (
              <div className="space-y-4">
                {/* Nome e Status */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-semibold text-foreground truncate">
                      {produto.nome}
                    </h4>
                  </div>
                  <Badge
                    variant={produto.ativo ? "default" : "secondary"}
                    className="shrink-0"
                  >
                    {produto.ativo ? (
                      <>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Ativo
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3 mr-1" />
                        Inativo
                      </>
                    )}
                  </Badge>
                </div>

                {/* Código */}
                <div className="flex items-center gap-2 text-sm">
                  <Barcode className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Código:</span>
                  <span className="font-medium font-mono">{produto.codigo}</span>
                </div>

                {/* Categoria */}
                <div className="flex items-center gap-2 text-sm">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Categoria:</span>
                  <Badge variant="outline">{produto.categoriaNome}</Badge>
                </div>

                {/* Data de Cadastro */}
                {produto.dataCadastro && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Cadastrado em:</span>
                    <span className="font-medium">
                      {new Date(produto.dataCadastro).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                )}

                {/* Descrição */}
                {produto.descricao && (
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">Descrição:</span>
                    <p className="text-sm text-foreground bg-muted/50 rounded-md p-3">
                      {produto.descricao}
                    </p>
                  </div>
                )}
              </div>
            ) : null}
          </div>

          <Separator />

          {/* Seção: Valores */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Valores</h3>

            {loadingProduto ? (
              <div className="grid grid-cols-3 gap-3">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : produto ? (
              <div className="grid grid-cols-3 gap-3">
                {/* Valor Custo */}
                <div className="p-3 rounded-lg bg-muted/50 border">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <DollarSign className="h-3.5 w-3.5" />
                    Custo
                  </div>
                  <p className="text-base font-semibold text-foreground">
                    {formatCurrency(produto.valorCusto)}
                  </p>
                </div>

                {/* Valor Venda */}
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400 mb-1">
                    <DollarSign className="h-3.5 w-3.5" />
                    Venda
                  </div>
                  <p className="text-base font-semibold text-green-600 dark:text-green-400">
                    {formatCurrency(produto.valorVenda)}
                  </p>
                </div>

                {/* Margem */}
                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <div className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 mb-1">
                    <TrendingUp className="h-3.5 w-3.5" />
                    Margem
                  </div>
                  <p className="text-base font-semibold text-blue-600 dark:text-blue-400">
                    {calcularMargem().toFixed(1)}%
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          <Separator />

          {/* Seção: Estoque */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Estoque</h3>

            {loadingProduto ? (
              <div className="grid grid-cols-2 gap-3">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : produto ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  {/* Quantidade Atual */}
                  <div className={`p-3 rounded-lg border ${
                    isEstoqueBaixo 
                      ? "bg-destructive/10 border-destructive/20" 
                      : "bg-muted/50"
                  }`}>
                    <div className={`flex items-center gap-1.5 text-xs mb-1 ${
                      isEstoqueBaixo 
                        ? "text-destructive" 
                        : "text-muted-foreground"
                    }`}>
                      <Warehouse className="h-3.5 w-3.5" />
                      Quantidade Atual
                    </div>
                    <p className={`text-xl font-bold ${
                      isEstoqueBaixo 
                        ? "text-destructive" 
                        : "text-foreground"
                    }`}>
                      {produto.quantidadeAtual}
                      <span className="text-sm font-normal ml-1">un</span>
                    </p>
                  </div>

                  {/* Estoque Mínimo */}
                  <div className="p-3 rounded-lg bg-muted/50 border">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      Estoque Mínimo
                    </div>
                    <p className="text-xl font-bold text-foreground">
                      {produto.estoqueMinimo}
                      <span className="text-sm font-normal ml-1">un</span>
                    </p>
                  </div>
                </div>

                {/* Alerta de estoque baixo */}
                {isEstoqueBaixo && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <p className="text-sm">
                      Estoque abaixo do nível mínimo! Considere reabastecer este produto.
                    </p>
                  </div>
                )}
              </>
            ) : null}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

