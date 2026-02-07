"use client"

import * as React from "react"
import { Eye, EyeOff, Gem, AlertTriangle, Lock, Mail } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/sonner"
import { AuthServiceError, login } from "@/services/authservice"
import { api } from "@/lib/api"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "./ui/card"

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  // Estados para modal de troca de senha
  const [showTrocarSenha, setShowTrocarSenha] = React.useState(false)
  const [trocandoSenha, setTrocandoSenha] = React.useState(false)
  const [senhaAtual, setSenhaAtual] = React.useState("")
  const [senhaNova, setSenhaNova] = React.useState("")
  const [senhaNovaConfirmacao, setSenhaNovaConfirmacao] = React.useState("")
  const [showSenhaAtual, setShowSenhaAtual] = React.useState(false)
  const [showSenhaNova, setShowSenhaNova] = React.useState(false)
  const [showSenhaConfirmacao, setShowSenhaConfirmacao] = React.useState(false)

  const router = useRouter()

  const handleSubmitLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isLoading) return

    setIsLoading(true)
    try {
      const { token } = await login({ email, password })
      localStorage.setItem("token", token)

      // Verifica se o usuário precisa trocar a senha
      try {
        const checkResponse = await api.get("/users/check-trocar-senha")

        if (checkResponse.success && (checkResponse.data as any)?.precisaTrocarSenha) {
          // Usuário precisa trocar senha
          toast.warning("Você precisa alterar sua senha por questões de segurança")
          setShowTrocarSenha(true)
          setIsLoading(false)
          return // Não redireciona ainda
        }
      } catch (checkError) {
        // Continua com o login mesmo se a verificação falhar
      }

      toast.success("Login realizado com sucesso!")
      router.push("/dashboard")
    } catch (error: unknown) {
      if (error instanceof AuthServiceError) {
        toast.error(error.message)
      } else {
        toast.error("Não foi possível conectar ao servidor.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleTrocarSenha = async () => {
    if (!senhaAtual || !senhaNova || !senhaNovaConfirmacao) {
      toast.error("Preencha todos os campos")
      return
    }

    if (senhaNova !== senhaNovaConfirmacao) {
      toast.error("As senhas novas não coincidem")
      return
    }

    setTrocandoSenha(true)
    try {
      const response = await api.post("/users/trocar-senha", {
        body: {
          senhaAtual,
          senhaNova,
          senhaNovaConfirmacao,
        },
      })

      if (response.success) {
        toast.success("Senha alterada com sucesso!")
        setShowTrocarSenha(false)
        router.push("/dashboard")
      } else {
        toast.error(response.message || "Erro ao trocar senha")
      }
    } catch (error: any) {
      toast.error(error?.message ?? "Erro ao trocar senha")
    } finally {
      setTrocandoSenha(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 w-full max-w-md mx-auto">
        <CardContent className="p-0">
          <form className="p-6 md:p-8 bg-background" onSubmit={handleSubmitLogin}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <Gem className="w-8 h-8 items-center text-rose-500" />
                <h1 className="text-2xl font-bold">Bem-vindo de volta!</h1>
                <p className="text-muted-foreground text-balance">
                  Faça login para acessar o sistema Gestão La Femme
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="email"><Mail className="w-4 h-4 items-center" /> Email </FieldLabel>
                <Input
                  id="email"
                  className="bg-gray-50 border-rose-200 border-1"
                  type="email"
                  placeholder="admin@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password"><Lock className="w-4 h-4 items-center" /> Senha</FieldLabel>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="pr-10 bg-gray-50 border-rose-200 border-1"
                  />
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-foreground absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword((v) => !v)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </Field>
              <Field>
                <Button
                  type="submit"
                  className="w-full bg-rose-100 text-rose-900 border-2 border-rose-300 hover:bg-rose-200 hover:border-rose-400 shadow-sm"
                  isLoading={isLoading}
                >
                  <Gem className="h-4 w-4" />
                  Login
                </Button>
              </Field>

              {/* <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator> */}

              <FieldDescription className="text-center">
                Não tem uma conta? Peça para o admin.
              </FieldDescription>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        Ao continuar, você concorda com nossos <a href="/termos-de-servico">Termos de Serviço</a>{" "}
        e <a href="/politica-de-privacidade">Política de Privacidade</a>.
      </FieldDescription>

      {/* Dialog de Troca Obrigatória de Senha */}
      <Dialog open={showTrocarSenha} onOpenChange={() => { }}>
        <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Troca de Senha Obrigatória
            </DialogTitle>
            <DialogDescription>
              Por questões de segurança, você precisa alterar sua senha antes de continuar.
              Escolha uma senha forte com no mínimo 8 caracteres, incluindo letras maiúsculas, minúsculas e números.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="senhaAtual">Senha Atual (Temporária)</Label>
              <div className="relative">
                <Input
                  id="senhaAtual"
                  type={showSenhaAtual ? "text" : "password"}
                  value={senhaAtual}
                  onChange={(e) => setSenhaAtual(e.target.value)}
                  disabled={trocandoSenha}
                  className="pr-10"
                  placeholder="Digite sua senha temporária"
                />
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowSenhaAtual((v) => !v)}
                  disabled={trocandoSenha}
                >
                  {showSenhaAtual ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="senhaNova">Nova Senha</Label>
              <div className="relative">
                <Input
                  id="senhaNova"
                  type={showSenhaNova ? "text" : "password"}
                  value={senhaNova}
                  onChange={(e) => setSenhaNova(e.target.value)}
                  disabled={trocandoSenha}
                  className="pr-10"
                  placeholder="Mínimo 8 caracteres"
                />
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowSenhaNova((v) => !v)}
                  disabled={trocandoSenha}
                >
                  {showSenhaNova ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="senhaNovaConfirmacao">Confirmar Nova Senha</Label>
              <div className="relative">
                <Input
                  id="senhaNovaConfirmacao"
                  type={showSenhaConfirmacao ? "text" : "password"}
                  value={senhaNovaConfirmacao}
                  onChange={(e) => setSenhaNovaConfirmacao(e.target.value)}
                  disabled={trocandoSenha}
                  className="pr-10"
                  placeholder="Digite a senha novamente"
                />
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowSenhaConfirmacao((v) => !v)}
                  disabled={trocandoSenha}
                >
                  {showSenhaConfirmacao ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <div className="rounded-md bg-blue-50 dark:bg-blue-950/20 p-3 border border-blue-200 dark:border-blue-900">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <Lock className="inline h-4 w-4 mr-1" />
                Sua senha deve ter no mínimo 8 caracteres, incluindo letras maiúsculas, minúsculas e números.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleTrocarSenha} disabled={trocandoSenha} className="w-full">
              {trocandoSenha ? "Alterando..." : "Alterar Senha"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
