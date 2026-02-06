// app/(public)/termos-de-servico/page.tsx
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

const LAST_UPDATED = "05/02/2026" 
const SYSTEM_NAME = "Gestão La Femme"

const LEGAL = {
  providerName: "LA FEMME (Prestadora do Serviço)", 
  tradeName: "La Femme Pratas",
  email: "kaiquecgotardo@gmail.com",
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

export default function TermosDeServicoPage() {
  const sections: Section[] = [
    {
      id: "aceite",
      title: "1. Aceite e validade jurídica",
      content: (
        <>
          <p>
            Estes Termos de Serviço (“<strong>Termos</strong>”) regulam o acesso
            e o uso do sistema <strong>{SYSTEM_NAME}</strong> (“
            <strong>Plataforma</strong>”), disponibilizado pela{" "}
            <strong>{LEGAL.providerName}</strong> (“
            <strong>Prestadora</strong>”).
          </p>
          <p>
            Ao criar conta, acessar, navegar, contratar ou utilizar qualquer
            funcionalidade da Plataforma, você declara ter lido, compreendido e
            concordado integralmente com estes Termos. Se você não concordar,
            não utilize a Plataforma.
          </p>
          <p>
            Caso você utilize a Plataforma em nome de pessoa jurídica, você
            declara possuir poderes para vinculá-la a estes Termos.
          </p>
        </>
      ),
    },
    {
      id: "definicoes",
      title: "2. Definições",
      content: (
        <>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Usuário:</strong> pessoa física ou jurídica que acessa ou
              utiliza a Plataforma.
            </li>
            <li>
              <strong>Conta:</strong> credenciais de autenticação do Usuário,
              incluindo login, senha e demais meios de acesso.
            </li>
            <li>
              <strong>Dados do Usuário:</strong> dados inseridos, importados,
              gerados ou processados pelo Usuário na Plataforma (ex.: produtos,
              estoque, compras, vendas, fornecedores, lançamentos financeiros).
            </li>
            <li>
              <strong>Conteúdo:</strong> textos, imagens, informações e demais
              elementos exibidos na Plataforma.
            </li>
            <li>
              <strong>Plano/Assinatura:</strong> modalidade de contratação que
              pode envolver pagamento recorrente, limites e recursos.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "objeto",
      title: "3. Objeto e escopo do serviço",
      content: (
        <>
          <p>
            A Plataforma é um software de gestão que permite ao Usuário
            administrar operações relacionadas a <strong>produtos</strong>,{" "}
            <strong>categorias</strong>, <strong>estoque</strong> (incluindo
            movimentações de entrada/saída/ajuste),{" "}
            <strong>fornecedores</strong>, <strong>compras</strong>,{" "}
            <strong>vendas</strong> e <strong>financeiro</strong> (entradas e
            saídas correlatas).
          </p>
          <p>
            A Prestadora poderá alterar, evoluir, descontinuar ou substituir
            funcionalidades, desde que mantida a finalidade principal do
            serviço, observados os direitos do Usuário e a legislação aplicável.
          </p>
          <p className="text-muted-foreground">
            <strong>Observação:</strong> a Plataforma não se destina a substituir
            obrigações legais, fiscais ou contábeis do Usuário. É uma ferramenta
            de apoio à gestão.
          </p>
        </>
      ),
    },
    {
      id: "elegibilidade",
      title: "4. Elegibilidade e conformidade",
      content: (
        <>
          <p>
            Para utilizar a Plataforma, o Usuário deve ter capacidade civil e
            aceitar integralmente estes Termos. A utilização deve observar as
            leis e regulamentos aplicáveis, inclusive normas consumeristas,
            trabalhistas, tributárias e de proteção de dados, quando pertinentes.
          </p>
          <p>
            É vedada a utilização da Plataforma para fins ilícitos, fraudulentos
            ou que violem direitos de terceiros.
          </p>
        </>
      ),
    },
    {
      id: "cadastro-conta",
      title: "5. Cadastro, conta e segurança",
      content: (
        <>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              O Usuário deverá fornecer informações verdadeiras, completas e
              atualizadas, responsabilizando-se por quaisquer danos decorrentes
              de inexatidões.
            </li>
            <li>
              O Usuário é responsável por manter a confidencialidade de suas
              credenciais e por toda atividade realizada em sua Conta.
            </li>
            <li>
              Em caso de suspeita de acesso indevido, o Usuário deve comunicar
              imediatamente a Prestadora pelo canal indicado em{" "}
              <InlineAnchor href="#contato">Contato</InlineAnchor>.
            </li>
          </ul>
          <p>
            A Prestadora poderá implementar medidas de segurança (ex.: exigência
            de senha forte, expiração de sessão, bloqueios por tentativas, etc.)
            para proteção da Conta e do serviço.
          </p>
        </>
      ),
    },
    {
      id: "uso-aceitavel",
      title: "6. Uso aceitável e condutas proibidas",
      content: (
        <>
          <p>O Usuário compromete-se a:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>utilizar a Plataforma conforme sua finalidade;</li>
            <li>
              não explorar falhas, realizar engenharia reversa, interferir na
              integridade, segurança ou performance do serviço;
            </li>
            <li>
              não inserir conteúdo malicioso (vírus, malware, scripts de ataque)
              ou automatizar acessos de forma abusiva;
            </li>
            <li>
              não violar direitos de propriedade intelectual ou confidencialidade
              de terceiros;
            </li>
            <li>
              não utilizar a Plataforma para práticas que possam caracterizar
              fraude, lavagem de dinheiro ou atividades ilícitas.
            </li>
          </ul>
          <p>
            A violação destas regras poderá resultar em suspensão ou encerramento
            de Conta, sem prejuízo de medidas legais cabíveis.
          </p>
        </>
      ),
    },
    {
      id: "dados-responsabilidade",
      title: "7. Dados do Usuário e responsabilidade sobre registros",
      content: (
        <>
          <p>
            O Usuário é o único responsável pelos <strong>Dados do Usuário</strong>{" "}
            inseridos, importados, processados ou gerados por meio da Plataforma,
            incluindo sua veracidade, integridade, legalidade, qualidade e
            atualização.
          </p>
          <p>
            O Usuário reconhece que decisões operacionais e gerenciais tomadas
            com base em informações da Plataforma dependem da correta inserção e
            manutenção dos dados.
          </p>
          <p className="text-muted-foreground">
            Ex.: preços, estoque disponível, lançamentos financeiros, cadastro de
            fornecedores e movimentações são controlos gerenciais e requerem
            conferência do Usuário.
          </p>
        </>
      ),
    },
    {
      id: "financeiro-estoque",
      title: "8. Regras operacionais (estoque e financeiro)",
      content: (
        <>
          <p>
            A Plataforma pode automatizar registros a partir de operações do
            Usuário (ex.: compras geram movimentação de estoque e lançamento
            financeiro; vendas reduzem estoque e podem gerar entrada financeira).
          </p>

          <div className="rounded-md border p-4 space-y-2">
            <p className="font-medium text-foreground">Regras gerais:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                O Usuário deve cadastrar produtos e categorias antes de operar
                compras/vendas/movimentações.
              </li>
              <li>
                A Plataforma pode bloquear ou alertar quando não houver estoque
                suficiente para venda, conforme configuração e regras internas.
              </li>
              <li>
                Movimentações de <strong>entrada</strong>, <strong>saída</strong>{" "}
                e <strong>ajuste</strong> impactam o estoque conforme a operação
                registrada.
              </li>
              <li>
                Lançamentos financeiros são registros gerenciais e não substituem
                escrituração contábil.
              </li>
            </ul>
          </div>

          <p>
            O Usuário entende e aceita que inconsistências podem ocorrer se dados
            forem inseridos incorretamente, se houver operações externas não
            registradas ou se forem realizadas alterações manuais indevidas.
          </p>
        </>
      ),
    },
    {
      id: "planos-pagamentos",
      title: "9. Planos, pagamentos e faturamento",
      content: (
        <>
          <p>
            A Prestadora poderá oferecer a Plataforma em planos gratuitos e/ou
            pagos, com recursos, limites, preços, periodicidade e condições
            informadas no momento da contratação.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Pagamentos (quando aplicável) podem ser recorrentes, conforme o
              plano selecionado.
            </li>
            <li>
              A falta de pagamento pode resultar em suspensão do acesso, limitação
              de recursos e/ou encerramento da Conta, conforme regras do plano e
              comunicação prévia quando aplicável.
            </li>
            <li>
              Tributos incidentes, quando aplicáveis, poderão ser repassados ao
              Usuário conforme a legislação.
            </li>
          </ul>
          <p className="text-muted-foreground">
            Se você ainda não definiu planos, mantenha esta seção — ela cobre
            tanto gratuito quanto pago e evita lacunas legais.
          </p>
        </>
      ),
    },
    {
      id: "suporte-sla",
      title: "10. Suporte, manutenção e disponibilidade",
      content: (
        <>
          <p>
            A Prestadora poderá oferecer suporte por canais oficiais (e-mail,
            chat, painel), com prazos e níveis compatíveis com o plano do Usuário.
          </p>
          <p>
            A Plataforma pode passar por manutenções corretivas e evolutivas, que
            podem ocasionar indisponibilidade temporária. Sempre que possível,
            a Prestadora buscará comunicar manutenções programadas.
          </p>
          <p>
            Salvo disposição expressa em contrato específico, não há garantia de
            disponibilidade ininterrupta (“100% uptime”).
          </p>
        </>
      ),
    },
    {
      id: "propriedade-intelectual",
      title: "11. Propriedade intelectual",
      content: (
        <>
          <p>
            A Plataforma, seu código, design, marcas, logotipos, layout, textos e
            demais componentes são de titularidade da Prestadora e/ou de seus
            licenciantes, sendo protegidos por leis de propriedade intelectual.
          </p>
          <p>
            O Usuário recebe uma licença limitada, revogável, não exclusiva e
            intransferível para uso da Plataforma conforme estes Termos.
          </p>
        </>
      ),
    },
    {
      id: "privacidade-lgpd",
      title: "12. Privacidade e proteção de dados (LGPD)",
      content: (
        <>
          <p>
            O tratamento de dados pessoais relacionado ao uso da Plataforma deve
            observar a Lei nº 13.709/2018 (Lei Geral de Proteção de Dados – LGPD),
            bem como demais normas aplicáveis.
          </p>
          <p>
            Recomenda-se que o Usuário consulte a{" "}
            <Link
              href="/politica-de-privacidade"
              className="font-medium text-foreground underline underline-offset-4 hover:opacity-80"
            >
              Política de Privacidade
            </Link>{" "}
            (quando disponível), que detalha bases legais, finalidades e direitos
            do titular.
          </p>
          <p className="text-muted-foreground">
            Se ainda não existe a página de privacidade, mantenha o link e crie
            depois — é padrão oficial em SaaS.
          </p>
        </>
      ),
    },
    {
      id: "limitacao",
      title: "13. Limitação de responsabilidade",
      content: (
        <>
          <p>
            Na máxima extensão permitida pela lei, a Prestadora não se
            responsabiliza por:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              perdas de lucro, receita, oportunidade, fundo de comércio ou danos
              indiretos decorrentes do uso da Plataforma;
            </li>
            <li>
              falhas decorrentes de terceiros, como indisponibilidades de rede,
              energia, provedores, integrações externas ou dispositivos do Usuário;
            </li>
            <li>
              inconsistências originadas por dados inseridos incorretamente, uso
              indevido, má configuração, ou operações realizadas fora da Plataforma.
            </li>
          </ul>
          <p>
            A Plataforma é fornecida “no estado em que se encontra” (“as is”),
            podendo sofrer melhorias contínuas.
          </p>
        </>
      ),
    },
    {
      id: "suspensao-encerramento",
      title: "14. Suspensão, encerramento e medidas de contenção",
      content: (
        <>
          <p>
            A Prestadora poderá suspender, limitar ou encerrar o acesso do Usuário
            à Plataforma, com ou sem aviso prévio, quando:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>houver violação destes Termos;</li>
            <li>for identificado risco à segurança da Plataforma;</li>
            <li>existirem indícios de fraude, abuso ou uso ilícito;</li>
            <li>houver inadimplemento, quando aplicável.</li>
          </ul>
          <p>
            O Usuário poderá solicitar encerramento da Conta pelos canais oficiais,
            observadas obrigações pendentes.
          </p>
        </>
      ),
    },
    {
      id: "alteracoes",
      title: "15. Alterações destes Termos",
      content: (
        <>
          <p>
            A Prestadora poderá atualizar estes Termos a qualquer momento para
            refletir alterações legais, de segurança, operacionais ou de serviço.
          </p>
          <p>
            A continuidade do uso da Plataforma após a publicação da versão
            atualizada implica concordância com as novas condições.
          </p>
        </>
      ),
    },
    {
      id: "lei-foro",
      title: "16. Lei aplicável e foro",
      content: (
        <>
          <p>
            Estes Termos são regidos pelas leis da República Federativa do Brasil.
          </p>
          <p>
            Fica eleito o foro da comarca do domicílio da Prestadora, salvo
            competência diversa prevista em lei (inclusive regras consumeristas
            quando aplicáveis).
          </p>
        </>
      ),
    },
    {
      id: "contato",
      title: "17. Contato",
      content: (
        <>
          <p>
            Para dúvidas, solicitações, suporte e comunicações formais, utilize:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>E-mail:</strong>{" "}
              <a
                className="font-medium text-foreground underline underline-offset-4 hover:opacity-80"
                href={`mailto:${LEGAL.email}`}
              >
                {LEGAL.email}
              </a>
            </li>
           
            <li>
              <strong>Nome empresarial:</strong> {LEGAL.providerName} ({" "}
              {LEGAL.tradeName} )
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
            Termos de Serviço
          </h1>
          <Badge variant="secondary">{SYSTEM_NAME}</Badge>
        </div>

        <p className="text-sm text-muted-foreground">
          Última atualização: <span className="font-medium">{LAST_UPDATED}</span>
        </p>

        <p className="text-sm text-muted-foreground">
          Este documento estabelece as regras de uso da plataforma{" "}
          <strong className="text-foreground">{SYSTEM_NAME}</strong>. Recomendamos
          a leitura integral.
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

      
    </div>
  )
}
