"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  UserRoundCheck,
  UserStar,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "La Femme Pratas",
      logo: UserRoundCheck,
      plan: "Desde de 2026",
    },

  ],
  navMain: [
    {
      title: "Pessoas",
      url: "#",
      icon: UserStar,
      iconColor: "text-blue-500",
      isActive: true,
      items: [
        {
          title: "Fornecedores",
          url: "/fornecedor",
          icon: "Users",
          iconColor: "text-blue-500",
        },
      ],
    },
    {
      title: "Itens",
      url: "#",
      icon: AudioWaveform,
      iconColor: "text-purple-500",
      items: [
        {
          title: "Estoque",
          url: "/estoque",
          icon: "Warehouse",
          iconColor: "text-purple-500",
        },
        {
          title: "Categorias de Produtos",
          url: "/categoria-produto",
          icon: "Tags",
          iconColor: "text-violet-500",
        },
        {
          title: "Produtos",
          url: "/produto",
          icon: "Package",
          iconColor: "text-purple-500",
        },
        {
          title: "Compras",
          url: "/compra",
          icon: "ShoppingBag",
          iconColor: "text-amber-500",
        },
      ],
    },
    {
      title: "Financeiro",
      url: "#",
      icon: BookOpen,
      iconColor: "text-emerald-500",
      items: [
        {
          title: "Vendas",
          url: "/venda",
          icon: "ShoppingCart",
          iconColor: "text-emerald-500",
        },
        {
          title: "Finanças",
          url: "/financeiro",
          icon: "Wallet",
          iconColor: "text-emerald-500",
        },
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: "LayoutDashboard",
          iconColor: "text-cyan-500",
        },
        {
          title: "Movimentações do Estoque",
          url: "/movimentacao-estoque",
          icon: "ArrowLeftRight",
          iconColor: "text-teal-500",
        },
      ],
    },
    {
      title: "Configurações",
      url: "#",
      icon: Settings2,
      iconColor: "text-slate-500",
      items: [
        {
          title: "Geral",
          url: "/configuracoes",
          icon: "Settings",
          iconColor: "text-slate-500",
        },
      ],
    },
  ],
  // projects: [
  //   {
  //     name: "Design Engineering",
  //     url: "#",
  //     icon: Frame,
  //   },
  //   {
  //     name: "Sales & Marketing",
  //     url: "#",
  //     icon: PieChart,
  //   },
  //   {
  //     name: "Travel",
  //     url: "#",
  //     icon: Map,
  //   },
  // ],
}

import { userApi } from "@/services/user/user.api"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState({
    name: "Usuário",
    email: "...",
    avatar: "",
  })

  React.useEffect(() => {
    userApi.getMe().then((u) => {
      setUser({
        name: u.nome,
        email: u.email,
        avatar: "",
      })
    }).catch(() => {
      // Ignorar erro, mantém default
    })
  }, [])

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
