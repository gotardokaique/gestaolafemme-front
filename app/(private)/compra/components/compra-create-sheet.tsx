"use client"

import * as React from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { toast } from "@/components/ui/sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DatePicker } from "@/components/ui/date-picker"
import { FornecedorField } from "@/components/fields/fornecedor-field"
import { ProdutoField } from "@/components/fields/produto-field"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  CompraCreateSchema,
  type CompraCreateDTO,
} from "@/services/compra/compra.schemas"
import { compraApi } from "@/services/compra/compra.api"
import { fornecedorApi } from "@/services/fornecedor/fornecedor.api"
import { produtoApi } from "@/services/produto/produto.api"
import type { Fornecedor } from "@/services/fornecedor/fornecedor.schemas"
import type { Produto } from "@/services/produto/produto.schemas"

type Props = { onCreated: () => void }

export function CompraCreateSheet({ onCreated }: Props) {
  const [open, setOpen] = React.useState(false)
  const [fornecedores, setFornecedores] = React.useState<Fornecedor[]>([])
  const [produtos, setProdutos] = React.useState<Produto[]>([])

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { isSubmitting, errors },
  } = useForm<CompraCreateDTO>({
    resolver: zodResolver(CompraCreateSchema),
    defaultValues: {
      fornecedorId: 0,
      formaPagamento: "",
      quantidade: 1,
      produtoIds: [],
      observacao: "",
      dataCompra: new Date().toISOString().split('T')[0],
    },
  })

  const selectedFornecedor = watch("fornecedorId")
  const selectedProductIds = watch("produtoIds")

  React.useEffect(() => {
    if (open) {
      Promise.all([
        fornecedorApi.list({ ativo: true }),
        produtoApi.list(true)
      ]).then(([fornList, prodList]) => {
        setFornecedores(fornList)
        setProdutos(prodList)
      }).catch(err => {
        console.error("[LoadData]", err)
        toast.error("Erro ao carregar dados auxiliares.")
      })
    }
  }, [open])

  const onSubmit = async (formData: CompraCreateDTO) => {
    try {
      const res = await compraApi.create(formData)

      setOpen(false)
      toast.success(res.message || "Compra registrada com sucesso!")
      onCreated()
    } catch (err: any) {
      console.error("[CreateCompra]", err)
      toast.error(err?.message ?? "Erro ao registrar compra.")
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
        <Button>Registrar Compra</Button>
      </SheetTrigger>

      <SheetContent className="sheet-content-standard overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Nova Compra</SheetTitle>
          <SheetDescription>
            Registre a entrada de mercadorias no estoque.
          </SheetDescription>
        </SheetHeader>

        <form className="mt-6 space-y-4 pb-10" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label>Fornecedor</Label>
            <Controller
              control={control}
              name="fornecedorId"
              render={({ field }) => (
                <FornecedorField
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.fornecedorId && (
              <p className="text-sm text-destructive">{errors.fornecedorId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Produto</Label>
            <Controller
              control={control}
              name="produtoIds"
              render={({ field }) => (
                <ProdutoField
                  value={field.value?.[0]}
                  onChange={(val) => field.onChange(val ? [val] : [])}
                />
              )}
            />
            {errors.produtoIds && (
              <p className="text-sm text-destructive">{errors.produtoIds.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Quantidade</Label>
              <Input 
                type="number" 
                {...register("quantidade", { valueAsNumber: true })} 
              />
              {errors.quantidade && (
                <p className="text-sm text-destructive">{errors.quantidade.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Data da Compra</Label>
              <Controller
                control={control}
                name="dataCompra"
                render={({ field }) => (
                  <DatePicker
                    value={field.value ? new Date(field.value) : undefined}
                    onChange={(date) => field.onChange(date?.toISOString().split('T')[0])}
                  />
                )}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Forma de Pagamento</Label>
            <Input {...register("formaPagamento")} placeholder="Ex: Boleto, Pix" />
            {errors.formaPagamento && (
              <p className="text-sm text-destructive">{errors.formaPagamento.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Observação</Label>
            <Textarea {...register("observacao")} placeholder="Opcional" />
          </div>

          <SheetFooter>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Salvando..." : "Salvar Compra"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
