// app/(public)/politica-de-privacidade/page.tsx
import * as React from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

type Section = {
  id: string
  title: string
  content: React.ReactNode
}

const SYSTEM_NAME = "Gestão La Femme"
const LAST_UPDATED = "05/02/2026"

const CONTROLLER = {
  name: "LA FEMME (Controladora)",
  email: "gestaolafemme@gmail.com",
  address: "Endereço comercial a definir",
  country: "Brasil",
}

function InlineAnchor({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      className="font-medium text-foreground underline underline-offset-4 hover:opacity-80"
    >
      {children}
    </a>
  )
}

export default function PoliticaDePrivacidadePage() {
  const sections: Section[] = [
    {
      id: "introducao",
      title: "1. Introdução",
      content: (
        <>
          <p>
            Esta Política de Privacidade descreve como a plataforma{" "}
            <strong>{SYSTEM_NAME}</strong> (“<strong>Plataforma</strong>”) trata
            dados pessoais em conformidade com a Lei nº 13.709/2018 (Lei Geral de
            Proteção de Dados – <strong>LGPD</strong>) e demais normas aplicáveis.
          </p>
          <p>
            Ao utilizar a Plataforma, você declara ter lido e compreendido esta
            Política. Quando aplicável, o uso pode exigir aceite expresso.
          </p>
        </>
      ),
    },
    {
      id: "definicoes",
      title: "2. Definições",
      content: (
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Dado pessoal:</strong> informação relacionada a pessoa natural
            identificada ou identificável.
          </li>
          <li>
            <strong>Titular:</strong> pessoa natural a quem os dados pessoais se
            referem.
          </li>
          <li>
            <strong>Tratamento:</strong> toda operação realizada com dados pessoais,
            como coleta, produção, recepção, classificação, utilização, acesso,
            reprodução, transmissão, distribuição, processamento, arquivamento,
            armazenamento, eliminação, avaliação, controle, modificação,
            comunicação, transferência, difusão ou extração.
          </li>
          <li>
            <strong>Controladora:</strong> quem toma decisões sobre o tratamento de
            dados pessoais.
          </li>
          <li>
            <strong>Operadora:</strong> quem realiza tratamento de dados pessoais
            em nome da Controladora.
          </li>
          <li>
            <strong>Encarregado (DPO):</strong> canal de comunicação entre
            Controladora, Titulares e a ANPD, quando aplicável.
          </li>
        </ul>
      ),
    },
    {
      id: "controladora",
      title: "3. Quem é a Controladora",
      content: (
        <>
          <p>
            A Controladora do tratamento de dados pessoais relacionados ao uso da
            Plataforma é <strong>{CONTROLLER.name}</strong>.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>E-mail:</strong>{" "}
              <a
                className="font-medium text-foreground underline underline-offset-4 hover:opacity-80"
                href={`mailto:${CONTROLLER.email}`}
              >
                {CONTROLLER.email}
              </a>
            </li>
            <li>
              <strong>Endereço:</strong> {CONTROLLER.address} – {CONTROLLER.country}
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "dados-coletados",
      title: "4. Dados pessoais que coletamos",
      content: (
        <>
          <p>Podemos coletar e tratar as seguintes categorias de dados pessoais:</p>
          <div className="space-y-4">
            <div className="rounded-md border p-4">
              <p className="font-medium text-foreground">4.1. Dados de conta</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>nome</li>
                <li>e-mail</li>
                <li>credenciais de autenticação (ex.: senha em formato criptografado/hasheado)</li>
                <li>status de acesso (ex.: ativo/inativo)</li>
                <li>data e hora de criação/atualização da conta</li>
              </ul>
            </div>

            <div className="rounded-md border p-4">
              <p className="font-medium text-foreground">
                4.2. Dados operacionais inseridos pelo Usuário
              </p>
              <p>
                A Plataforma permite o registro e processamento de informações de
                gestão. Dependendo do uso, esses registros podem conter dados
                pessoais de terceiros informados pelo Usuário (ex.: contato de
                fornecedor).
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  dados de fornecedores (ex.: nome, telefone, e-mail), quando
                  cadastrados
                </li>
                <li>
                  informações de compras, vendas, movimentações de estoque e
                  lançamentos financeiros associados ao usuário que executa a ação
                </li>
              </ul>
            </div>

            <div className="rounded-md border p-4">
              <p className="font-medium text-foreground">4.3. Dados técnicos e de uso</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>registros de acesso e eventos (logs)</li>
                <li>endereços IP e informações do dispositivo/navegador</li>
                <li>data/hora, sessão e identificadores de autenticação</li>
                <li>métricas de performance e segurança</li>
              </ul>
            </div>

            <div className="rounded-md border p-4">
              <p className="font-medium text-foreground">4.4. Cookies e tecnologias similares</p>
              <p>
                Podemos utilizar cookies estritamente necessários para autenticação,
                segurança e funcionamento. Cookies de análise/marketing, quando
                aplicáveis, poderão exigir consentimento conforme legislação.
              </p>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "finalidades-bases",
      title: "5. Finalidades e bases legais",
      content: (
        <>
          <p>
            Tratamos dados pessoais para finalidades legítimas, utilizando bases
            legais previstas na LGPD. Exemplos:
          </p>
          <div className="space-y-4">
            <div className="rounded-md border p-4">
              <p className="font-medium text-foreground">
                5.1. Execução de contrato e procedimentos preliminares
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>criar e gerenciar conta</li>
                <li>autenticar acesso e manter sessão</li>
                <li>fornecer funcionalidades de gestão (produtos, estoque, compras, vendas e financeiro)</li>
                <li>suporte e atendimento</li>
              </ul>
            </div>

            <div className="rounded-md border p-4">
              <p className="font-medium text-foreground">
                5.2. Cumprimento de obrigação legal/regulatória
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>manter registros mínimos quando exigidos por lei</li>
                <li>atender solicitações de autoridades competentes</li>
              </ul>
            </div>

            <div className="rounded-md border p-4">
              <p className="font-medium text-foreground">5.3. Legítimo interesse</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>prevenção a fraudes e segurança</li>
                <li>melhoria e estabilidade da Plataforma</li>
                <li>auditoria, monitoramento e integridade do serviço</li>
              </ul>
            </div>

            <div className="rounded-md border p-4">
              <p className="font-medium text-foreground">5.4. Consentimento</p>
              <p>
                Quando aplicável, poderemos solicitar consentimento para
                finalidades específicas (ex.: comunicações promocionais, cookies
                não essenciais). O consentimento pode ser revogado a qualquer
                momento, sem afetar tratamentos anteriores.
              </p>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "compartilhamento",
      title: "6. Compartilhamento de dados",
      content: (
        <>
          <p>
            Podemos compartilhar dados pessoais nas hipóteses abaixo, sempre
            observando princípios de necessidade, segurança e finalidade:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Prestadores de serviço (operadores):</strong> hospedagem,
              infraestrutura, monitoramento, segurança, envio de e-mails e suporte.
            </li>
            <li>
              <strong>Autoridades competentes:</strong> mediante obrigação legal,
              regulatória ou ordem judicial.
            </li>
            <li>
              <strong>Operações societárias:</strong> em caso de reorganização,
              fusão, aquisição ou transferência de ativos, observada a continuidade
              da proteção e transparência adequada.
            </li>
          </ul>
          <p>
            Não vendemos dados pessoais. Caso a Plataforma venha a integrar
            serviços de terceiros por decisão do Usuário, o tratamento poderá ser
            regido pelas políticas desses terceiros.
          </p>
        </>
      ),
    },
    {
      id: "transferencia",
      title: "7. Transferência internacional",
      content: (
        <>
          <p>
            A Plataforma pode utilizar provedores de infraestrutura e serviços
            que operem no Brasil ou no exterior. Nesses casos, a transferência
            internacional de dados poderá ocorrer, observadas as salvaguardas
            previstas na LGPD e medidas contratuais/organizacionais adequadas.
          </p>
        </>
      ),
    },
    {
      id: "retencao",
      title: "8. Retenção e eliminação",
      content: (
        <>
          <p>
            Mantemos dados pessoais pelo tempo necessário para cumprir as
            finalidades descritas nesta Política, incluindo obrigações legais,
            resolução de disputas e cumprimento de contratos.
          </p>
          <p>
            A eliminação poderá ser realizada quando encerrada a relação e
            esgotadas as necessidades e obrigações, ressalvadas hipóteses legais
            de retenção.
          </p>
        </>
      ),
    },
    {
      id: "seguranca",
      title: "9. Segurança da informação",
      content: (
        <>
          <p>
            Adotamos medidas técnicas e organizacionais voltadas à proteção de
            dados pessoais contra acessos não autorizados e situações acidentais
            ou ilícitas de destruição, perda, alteração, comunicação ou difusão.
          </p>
          <p>
            Ainda assim, nenhuma tecnologia é absolutamente imune a riscos. O
            Usuário também deve adotar boas práticas, como manter senha forte,
            não compartilhar credenciais e utilizar dispositivos confiáveis.
          </p>
        </>
      ),
    },
    {
      id: "direitos",
      title: "10. Direitos do titular",
      content: (
        <>
          <p>
            O titular de dados pessoais pode solicitar, nos termos da LGPD, entre
            outros:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>confirmação da existência de tratamento</li>
            <li>acesso aos dados</li>
            <li>correção de dados incompletos, inexatos ou desatualizados</li>
            <li>anonimização, bloqueio ou eliminação, quando cabível</li>
            <li>portabilidade, quando aplicável e regulamentada</li>
            <li>informações sobre compartilhamento</li>
            <li>revogação de consentimento, quando o tratamento se basear nele</li>
            <li>oposição a tratamento baseado em legítimo interesse, quando cabível</li>
          </ul>
          <p>
            Para exercer seus direitos, utilize os canais indicados em{" "}
            <InlineAnchor href="#contato">Contato</InlineAnchor>. Poderemos
            solicitar informações adicionais para confirmar identidade e proteger
            o titular contra fraudes.
          </p>
        </>
      ),
    },
    {
      id: "cookies",
      title: "11. Cookies e tecnologias similares",
      content: (
        <>
          <p>
            Cookies estritamente necessários podem ser utilizados para autenticação,
            segurança e funcionamento da Plataforma. Cookies de análise ou outras
            finalidades poderão ser usados conforme disponibilidade e, quando
            aplicável, com consentimento.
          </p>
          <p>
            O Usuário pode gerenciar cookies pelo navegador. A desativação de
            cookies essenciais pode impactar o funcionamento do serviço.
          </p>
        </>
      ),
    },
    {
      id: "criancas",
      title: "12. Crianças e adolescentes",
      content: (
        <>
          <p>
            A Plataforma não é destinada ao uso por crianças. Caso haja
            tratamento de dados de menores em hipóteses específicas, isso deverá
            observar as exigências legais aplicáveis.
          </p>
        </>
      ),
    },
    {
      id: "responsabilidade-usuario",
      title: "13. Responsabilidade do Usuário quanto a dados de terceiros",
      content: (
        <>
          <p>
            O Usuário pode inserir dados de terceiros (ex.: fornecedores) na
            Plataforma. Nesses casos, o Usuário declara que possui base legal
            apropriada para o tratamento e que fornecerá as informações necessárias
            aos titulares, quando exigido.
          </p>
          <p>
            A Prestadora trata esses dados conforme instruções do Usuário, no
            contexto de fornecimento da Plataforma, podendo atuar como operadora
            quando aplicável.
          </p>
        </>
      ),
    },
    {
      id: "alteracoes",
      title: "14. Alterações desta Política",
      content: (
        <>
          <p>
            Esta Política poderá ser atualizada para refletir mudanças legais,
            regulatórias, operacionais ou de segurança. A versão vigente estará
            sempre disponível nesta página, com a data da última atualização.
          </p>
        </>
      ),
    },
    {
      id: "termos-relacionados",
      title: "15. Documentos relacionados",
      content: (
        <>
          <p>
            Esta Política deve ser lida em conjunto com os{" "}
            <Link
              href="/termos-de-servico"
              className="font-medium text-foreground underline underline-offset-4 hover:opacity-80"
            >
              Termos de Serviço
            </Link>{" "}
            da Plataforma.
          </p>
        </>
      ),
    },
    {
      id: "contato",
      title: "16. Contato (Privacidade)",
      content: (
        <>
          <p>
            Para dúvidas, solicitações ou exercício de direitos relacionados a
            dados pessoais, utilize:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>E-mail:</strong>{" "}
              <a
                className="font-medium text-foreground underline underline-offset-4 hover:opacity-80"
                href={`mailto:${CONTROLLER.email}`}
              >
                {CONTROLLER.email}
              </a>
            </li>
            <li>
              <strong>Endereço:</strong> {CONTROLLER.address} – {CONTROLLER.country}
            </li>
            <li>
              <strong>Controladora:</strong> {CONTROLLER.name}
            </li>
          </ul>
        </>
      ),
    },
  ]

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8 space-y-3">
        <Link 
          href="/login" 
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-4"
        >
          ← Voltar para login
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            Política de Privacidade
          </h1>
          <Badge variant="secondary">{SYSTEM_NAME}</Badge>
        </div>

        <p className="text-sm text-muted-foreground">
          Última atualização: <span className="font-medium">{LAST_UPDATED}</span>
        </p>

        <p className="text-sm text-muted-foreground">
          Este documento descreve como tratamos dados pessoais na plataforma{" "}
          <strong className="text-foreground">{SYSTEM_NAME}</strong>, em
          conformidade com a LGPD.
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Sumário</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm">
          <ul className="grid gap-2 sm:grid-cols-2">
            {sections.map((s) => (
              <li key={s.id} className="min-w-0">
                <a
                  href={`#${s.id}`}
                  className="block truncate rounded-md px-2 py-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {sections.map((s, idx) => (
          <Card key={s.id} id={s.id} className="scroll-mt-24">
            <CardHeader className="space-y-2">
              <div className="flex items-start justify-between gap-4">
                <CardTitle className="text-xl">{s.title}</CardTitle>
                <a
                  href="#top"
                  className="hidden text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground sm:inline"
                  aria-label="Voltar ao topo"
                >
                  Voltar ao topo
                </a>
              </div>
              {idx === 0 ? null : <Separator />}
            </CardHeader>

            <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              {s.content}
            </CardContent>
          </Card>
        ))}
      </div>

      <div id="top" className="mt-10 rounded-lg border p-4">
        <p className="text-sm text-muted-foreground">
          Ao utilizar a Plataforma, você concorda com os documentos legais
          aplicáveis e reconhece seus direitos como titular de dados pessoais.
        </p>
      </div>
    </div>
  )
}
