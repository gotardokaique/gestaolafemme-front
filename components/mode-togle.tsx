"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Evita hydration mismatch — só renderiza o ícone correto no cliente
  React.useEffect(() => setMounted(true), [])

  const toggle = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggle}
      aria-label="Alternar tema"
      className="h-9 w-9 rounded-md border-primary/50 hover:border-primary transition-colors"
    >
      {mounted ? (
        resolvedTheme === "dark" ? (
          <Sun className="h-[1.1rem] w-[1.1rem] transition-all" />
        ) : (
          <Moon className="h-[1.1rem] w-[1.1rem] transition-all" />
        )
      ) : (
        <span className="h-[1.1rem] w-[1.1rem]" />
      )}
    </Button>
  )
}
