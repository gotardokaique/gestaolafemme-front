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
      isActive: true,
      items: [
        {
          title: "Fornecedores",
          url: "/fornecedor",
        },
        {
          title: "Clientes",
          url: "/cliente",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Itens",
      url: "#",
      icon: AudioWaveform,
      items: [
        {
          title: "Estoque",
          url: "/estoque",
        },
        {
          title: "Categorias de Produtos",
          url: "/categoria-produto",
        },
        {
          title: "Produtos",
          url: "/produto",
        },
        {
          title: "Compras",
          url: "/compra",
        },
      ],
    },
    {
      title: "Financeiro",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Vendas",
          url: "/venda",
        },
        {
          title: "Finanças",
          url: "/financeiro",
        },
        {
          title: "Dashboard",
          url: "#",
        },
        {
          title: "Movimentações do Estoque",
          url: "/movimentacao-estoque",
        },
      ],
    },
    {
      title: "Configurações",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Geral",
          url: "/configuracoes",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
