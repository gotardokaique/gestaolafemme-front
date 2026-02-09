"use client"

import * as React from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { toast } from "@/components/ui/sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
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
} from "@/services/produto/produto.schemas"
import { produtoApi } from "@/services/produto/produto.api"
import { categoriaProdutoApi } from "@/services/categoria-produto/categoria-produto.api"
import type { CategoriaProduto } from "@/services/categoria-produto/categoria-produto.schemas"
import { NumericInput } from "@/components/ui/numeric-input"
import { PackagePlus } from "lucide-react"
import { FileField, type FileData } from "@/components/fields/file-field"

type Props = { onCreated: () => void }

export function ProdutoCreateSheet({ onCreated }: Props) {
  const [open, setOpen] = React.useState(false)
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
    defaultValues: {
      nome: "",
      codigo: "",
      descricao: "",
      valorCusto: 0,
      valorVenda: 0,
      margemLucro: 0,
      categoriaId: 0,
      estoqueMinimo: 0,
      quantidadeInicial: 0,
      ativo: true,
      foto: null,
    },
  })

  const selectedCategoria = watch("categoriaId")
  const valorCusto = watch("valorCusto")
  const valorVenda = watch("valorVenda")
  const margemLucro = watch("margemLucro")

  // Bidirectional Calculation logic
  const isCalculating = React.useRef(false)

  React.useEffect(() => {
    if (isCalculating.current) return
    isCalculating.current = true

    // Update Margin when Venda or Custo changes
    if (valorCusto > 0) {
      const margin = ((valorVenda / valorCusto) - 1) * 100
      if (Math.abs(margin - (margemLucro || 0)) > 0.01) {
        setValue("margemLucro", Number(margin.toFixed(2)))
      }
    }

    isCalculating.current = false
  }, [valorVenda, valorCusto]) // Triggered when Venda or Custo is edited

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
    if (open) {
      categoriaProdutoApi.list({ ativo: true }).then(setCategorias).catch(() => {
        toast.error("Erro ao carregar categorias.")
      })
    }
  }, [open])

  const onSubmit = async (formData: ProdutoRequestDTO) => {
    try {
      const res = await produtoApi.create(formData)
      setOpen(false)
      toast.success(res.message || "Produto criado com sucesso!")
      onCreated()
    } catch (err: any) {
      toast.error(err?.message ?? "Erro ao criar produto.")
    }
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        setOpen(v)
        if (!v) reset()
      }}
    >
      <SheetTrigger asChild>
        <Button>
          <PackagePlus className="h-4 w-4" />
          Novo Produto
        </Button>
      </SheetTrigger>

      <SheetContent className="sheet-content-standard overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
              <PackagePlus className="h-5 w-5" />
            </div>
            <div>
              <SheetTitle>Novo Produto</SheetTitle>
              <SheetDescription>
                Cadastre um novo produto no sistema.
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <form className="mt-6 space-y-4 pb-10" onSubmit={handleSubmit(onSubmit)}>
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

          <div className="grid grid-cols-2 gap-4">
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
              <Label>Quantidade Inicial</Label>
              <Input
                type="number"
                {...register("quantidadeInicial", { valueAsNumber: true })}
              />
              {errors.quantidadeInicial && (
                <p className="text-sm text-destructive">{errors.quantidadeInicial.message}</p>
              )}
            </div>
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
                  placeholder="Arraste uma imagem ou clique para selecionar"
                  helperText="Imagem do produto para exibição no catálogo"
                />
              )}
            />
          </div>

          <SheetFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
