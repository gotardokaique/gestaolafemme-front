"use client"

import * as React from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { toast } from "@/components/ui/sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { VoiceField } from "@/components/fields/voice-field"
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
  CategoriaProdutoCreateSchema,
  type CategoriaProdutoCreateDTO,
} from "@/services/categoria-produto/categoria-produto.schemas"
import { categoriaProdutoApi } from "@/services/categoria-produto/categoria-produto.api"
import { TagIcon } from "lucide-react"

type Props = { onCreated: () => void }

export function CategoriaProdutoCreateSheet({ onCreated }: Props) {
  const [open, setOpen] = React.useState(false)

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting, errors },
  } = useForm<CategoriaProdutoCreateDTO>({
    resolver: zodResolver(CategoriaProdutoCreateSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      ativo: true,
    },
  })

  const onSubmit = async (formData: CategoriaProdutoCreateDTO) => {
    try {
      const res = await categoriaProdutoApi.create(formData)

      setOpen(false)

      const successMsg = (res as any)?.message || "Categoria criada com sucesso!"
      toast.success(successMsg)

      onCreated()
    } catch (err: any) {
      toast.error(err?.message ?? "Erro ao cadastrar categoria.")
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
          <TagIcon className="h-4 w-4" />
          Adicionar categoria
        </Button>
      </SheetTrigger>

      <SheetContent className="sheet-content-standard">
        <SheetHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-violet-500/10 text-violet-500">
              <TagIcon className="h-5 w-5" />
            </div>
            <div>
              <SheetTitle>Nova categoria</SheetTitle>
              <SheetDescription>
                Preencha os dados para cadastrar uma nova categoria de produto.
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label>Nome</Label>
            <Input {...register("nome")} placeholder="Ex: Bebidas" />
            {errors.nome && (
              <p className="text-sm text-destructive">{errors.nome.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Descrição</Label>
            <Controller
              control={control}
              name="descricao"
              render={({ field }) => (
                <VoiceField
                  as="textarea"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder="Descreva a categoria (opcional)"
                  textareaProps={{ rows: 4 }}
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
