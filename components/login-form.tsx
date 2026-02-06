"use client"

import * as React from "react"
import { Eye, EyeOff, Gem } from "lucide-react"
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
import { toast } from "@/components/ui/sonner"
import { AuthServiceError, login } from "@/services/authservice"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "./ui/card"

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  const router = useRouter()

  const handleSubmitLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isLoading) return

    setIsLoading(true)
    try {
      const { token } = await login({ email, password })
      localStorage.setItem("token", token)

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

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmitLogin}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Bem Vindo de Volta!</h1>
                <p className="text-muted-foreground text-balance">
                  Faça login para acessar o sistema Gestão La Femme
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
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
                  <FieldLabel htmlFor="password">Senha</FieldLabel>
                  {/* <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Esqueceu a senha?
                  </a> */}
                </div>
                <div className="relative">
                    <Input 
                        id="password" 
                        type={showPassword ? "text" : "password"} 
                        required 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        className="pr-10"
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
                <Button type="submit" className="w-full" isLoading={isLoading}>Login</Button>
              </Field>
              
              {/* <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator> */}
              
              <FieldDescription className="text-center">
                Não tem uma conta? Peça para o admin.
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/img/bg-login.jpeg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.8]"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        Ao continuar, você concorda com nossos <a href="/termos-de-servico">Termos de Serviço</a>{" "}
        e <a href="/politica-de-privacidade">Política de Privacidade</a>.
      </FieldDescription>
    </div>
  )
}
