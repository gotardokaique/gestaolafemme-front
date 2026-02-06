"use client"

import { ChevronRight, type LucideIcon, Users, Warehouse, Tags, Package, ShoppingBag, ShoppingCart, Wallet, LayoutDashboard, ArrowLeftRight, Settings } from "lucide-react"
import { usePathname } from "next/navigation"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

// Mapeamento de ícones
const iconMap: Record<string, LucideIcon> = {
  Users,
  Warehouse,
  Tags,
  Package,
  ShoppingBag,
  ShoppingCart,
  Wallet,
  LayoutDashboard,
  ArrowLeftRight,
  Settings,
}

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    iconColor?: string
    isActive?: boolean
    items?: {
      title: string
      url: string
      icon?: string
      iconColor?: string
    }[]
  }[]
}) {
  const pathname = usePathname()

  // Verifica se algum subtópico do grupo está ativo baseado na rota atual
  const isGroupActive = (groupItems?: { title: string; url: string }[]) => {
    if (!groupItems) return false
    return groupItems.some((subItem) => pathname.startsWith(subItem.url))
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Gestão</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={true}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon className={item.iconColor} />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => {
                    const isActive = pathname.startsWith(subItem.url)
                    const SubIcon = subItem.icon ? iconMap[subItem.icon] : null
                    return (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <a
                            href={subItem.url}
                            className={
                              isActive
                                ? "bg-rose-100 dark:bg-rose-900/30 border border-rose-300 dark:border-rose-700 rounded-md"
                                : ""
                            }
                          >
                            {SubIcon && (
                              <span className="text-gray-800 dark:text-gray-200">
                                <SubIcon className="h-4 w-4" />
                              </span>
                            )}
                            <span
                              className={
                                isActive
                                  ? "font-semibold text-rose-500 dark:text-rose-300"
                                  : ""
                              }
                            >
                              {subItem.title}
                            </span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    )
                  })}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
