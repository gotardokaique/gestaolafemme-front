"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { toast } from "@/components/ui/sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  FornecedorCreateSchema,
  type FornecedorCreateDTO,
} from "@/services/fornecedor/fornecedor.schemas"
import { fornecedorApi } from "@/services/fornecedor/fornecedor.api"
import { UserPlus } from "lucide-react"

type Props = { onCreated: () => void }

export function FornecedorCreateSheet({ onCreated }: Props) {
  const [open, setOpen] = React.useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<FornecedorCreateDTO>({
    resolver: zodResolver(FornecedorCreateSchema),
    defaultValues: {
      nome: "",
      telefone: "",
      email: "",
      ativo: true,
    },
  })

  const onSubmit = async (formData: FornecedorCreateDTO) => {
    try {
      const res = await fornecedorApi.create(formData)

      setOpen(false)

      const successMsg = (res as any)?.message
      toast.success(successMsg)

      onCreated()
    } catch (err: any) {
      console.error("[CreateFornecedor]", err)
      toast.error(err?.message ?? "Erro ao cadastrar fornecedor.")
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
        <Button>Adicionar fornecedor</Button>
      </SheetTrigger>

      {/* ~50% maior */}
      <SheetContent className="sheet-content-standard">
        <SheetHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <SheetTitle>Novo fornecedor</SheetTitle>
              <SheetDescription>
                Preencha os dados para cadastrar um fornecedor.
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label>Nome</Label>
            <Input {...register("nome")} />
            {errors.nome && (
              <p className="text-sm text-destructive">{errors.nome.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Telefone</Label>
            <Input {...register("telefone")} />
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" {...register("email")} />
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
