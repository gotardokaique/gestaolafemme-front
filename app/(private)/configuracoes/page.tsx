// app/(private)/configuracoes/page.tsx
import { Suspense } from "react"
import ConfiguracoesContent from "./ConfiguracoesContent"

export default function ConfiguracoesPage() {
    return (
        <Suspense fallback={null}>
            <ConfiguracoesContent />
        </Suspense>
    )
}