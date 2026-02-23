"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar"
import { Calendar, Trophy } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function AppSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isSeasonsPage = pathname.startsWith("/season")

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar collapsible="icon" side="left">
        <SidebarHeader className="border-b border-sidebar-border">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/"} tooltip="Leaderboard">
                <Link href="/">
                  <Trophy className="h-4 w-4" />
                  <span>Leaderboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isSeasonsPage} tooltip="Seasons">
                <Link href="/season">
                  <Calendar className="h-4 w-4" />
                  <span>Seasons</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent />
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}
