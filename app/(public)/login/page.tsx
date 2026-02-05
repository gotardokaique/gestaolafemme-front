import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="bg-background min-h-svh grid grid-cols-1 lg:grid-cols-3">
      <div className="flex items-center justify-center p-6 md:p-10 lg:justify-start lg:px-16">
        <LoginForm />
      </div>
      <div className="col-span-2 p-2 pb-2 border border-solid border-border rounded-md">
        <img className="bg-cover bg-center  " alt="Login background" src="/img/bg-login.png" />

      </div>
    </div>
  )
}
