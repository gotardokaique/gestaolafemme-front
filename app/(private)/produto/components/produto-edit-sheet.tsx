"use client"

import * as React from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { toast } from "@/components/ui/sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { CategoriaField } from "@/components/fields/categoria-field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  ProdutoRequestSchema,
  type ProdutoRequestDTO,
  type Produto,
} from "@/services/produto/produto.schemas"
import { produtoApi } from "@/services/produto/produto.api"
import { categoriaProdutoApi } from "@/services/categoria-produto/categoria-produto.api"
import type { CategoriaProduto } from "@/services/categoria-produto/categoria-produto.schemas"
import { NumericInput } from "@/components/ui/numeric-input"
import { Pencil } from "lucide-react"
import { FileField, type FileData } from "@/components/fields/file-field"

type Props = {
  produto: Produto | null
  onOpenChange: (open: boolean) => void
  onUpdated: () => void
}

export function ProdutoEditSheet({ produto, onOpenChange, onUpdated }: Props) {
  const [categorias, setCategorias] = React.useState<CategoriaProduto[]>([])

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { isSubmitting, errors },
  } = useForm<ProdutoRequestDTO>({
    resolver: zodResolver(ProdutoRequestSchema),
  })

  const selectedCategoria = watch("categoriaId")
  const isActive = watch("ativo")
  const valorCusto = watch("valorCusto")
  const valorVenda = watch("valorVenda")
  const margemLucro = watch("margemLucro")

  // Bidirectional Calculation logic
  const isCalculating = React.useRef(false)

  React.useEffect(() => {
    if (isCalculating.current) return
    isCalculating.current = true

    if (valorCusto > 0) {
      const margin = ((valorVenda / valorCusto) - 1) * 100
      if (Math.abs(margin - (margemLucro || 0)) > 0.01) {
        setValue("margemLucro", Number(margin.toFixed(2)))
      }
    }

    isCalculating.current = false
  }, [valorVenda, valorCusto])

  const handleMarginChange = (newMargin: number) => {
    isCalculating.current = true
    setValue("margemLucro", newMargin)
    if (valorCusto > 0) {
      const newVenda = valorCusto * (1 + newMargin / 100)
      setValue("valorVenda", Number(newVenda.toFixed(2)))
    }
    setTimeout(() => { isCalculating.current = false }, 10)
  }

  React.useEffect(() => {
    if (produto) {
      reset({
        nome: produto.nome,
        codigo: produto.codigo,
        descricao: produto.descricao || "",
        valorCusto: produto.valorCusto,
        valorVenda: produto.valorVenda,
        margemLucro: produto.valorCusto > 0 ? Number((((produto.valorVenda / produto.valorCusto) - 1) * 100).toFixed(2)) : 0,
        categoriaId: produto.categoriaId,
        estoqueMinimo: produto.estoqueMinimo,
        ativo: produto.ativo,
      })

      categoriaProdutoApi.list({ ativo: true }).then(setCategorias).catch(() => {
        toast.error("Erro ao carregar categorias.")
      })
    }
  }, [produto, reset])

  const onSubmit = async (formData: ProdutoRequestDTO) => {
    if (!produto) return
    try {
      const res = await produtoApi.update(produto.id, formData)
      toast.success(res.message || "Produto atualizado com sucesso!")
      onUpdated()
      onOpenChange(false)
    } catch (err: any) {
      toast.error(err?.message ?? "Erro ao atualizar produto.")
    }
  }

  return (
    <Sheet
      open={!!produto}
      onOpenChange={onOpenChange}
    >
      <SheetContent className="sheet-content-standard overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
              <Pencil className="h-5 w-5" />
            </div>
            <div>
              <SheetTitle>Editar Produto</SheetTitle>
              <SheetDescription>
                Altere as informações do produto.
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <form className="mt-6 space-y-4 pb-10" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div className="space-y-0.5">
              <Label>Produto Ativo</Label>
              <p className="text-xs text-muted-foreground">Define se o produto está disponível para uso.</p>
            </div>
            <Switch
              checked={isActive}
              onCheckedChange={(val) => setValue("ativo", val)}
            />
          </div>

          <div className="space-y-2">
            <Label>Nome</Label>
            <Input {...register("nome")} placeholder="Nome do produto" />
            {errors.nome && (
              <p className="text-sm text-destructive">{errors.nome.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Código</Label>
              <Input {...register("codigo")} placeholder="SKU / Código EAN" />
              {errors.codigo && (
                <p className="text-sm text-destructive">{errors.codigo.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Categoria</Label>
              <Controller
                control={control}
                name="categoriaId"
                render={({ field }) => (
                  <CategoriaField
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.categoriaId && (
                <p className="text-sm text-destructive">{errors.categoriaId.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Descrição</Label>
            <Textarea {...register("descricao")} placeholder="Detalhes do produto" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Valor Custo</Label>
              <Controller
                control={control}
                name="valorCusto"
                render={({ field }) => (
                  <NumericInput
                    variant="currency"
                    prefix="R$"
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.valorCusto && (
                <p className="text-sm text-destructive">{errors.valorCusto.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Margem Lucro (%)</Label>
              <NumericInput
                variant="percentage"
                suffix="%"
                value={margemLucro || 0}
                onChange={handleMarginChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label>Valor Venda</Label>
              <Controller
                control={control}
                name="valorVenda"
                render={({ field }) => (
                  <NumericInput
                    variant="currency"
                    prefix="R$"
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.valorVenda && (
                <p className="text-sm text-destructive">{errors.valorVenda.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Estoque Mínimo</Label>
            <Input
              type="number"
              {...register("estoqueMinimo", { valueAsNumber: true })}
            />
            {errors.estoqueMinimo && (
              <p className="text-sm text-destructive">{errors.estoqueMinimo.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Foto do Produto</Label>
            <Controller
              control={control}
              name="foto"
              render={({ field }) => (
                <FileField
                  accept=".jpg, .jpeg, .png, .webp"
                  maxSize={5 * 1024 * 1024}
                  value={field.value as FileData | null}
                  onChange={field.onChange}
                  placeholder="Arraste uma nova imagem ou clique para selecionar"
                  helperText="Anexe uma nova foto para substituir a atual"
                />
              )}
            />
          </div>

          <SheetFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
