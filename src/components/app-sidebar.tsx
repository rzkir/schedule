"use client"

import * as React from "react"

import {
  BookOpen,
  Bot,
  Command,
  Frame,
  LayoutDashboard,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"

import { NavProjects } from "@/components/nav-projects"

import { NavSecondary } from "@/components/nav-secondary"

import { NavUser } from "@/components/nav-user"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import Link from "next/link"

import { useAuth } from "@/utils/context/AuthContext"

const navData = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Proyek",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Proyek",
          url: "/dashboard/proyek/proyek",
        },
        {
          title: "Category",
          url: "/dashboard/proyek/category",
        },
        {
          title: "Framework",
          url: "/dashboard/proyek/framework",
        },
      ],
    },
    {
      title: "Manajemen Proyek",
      icon: Bot,
      items: [
        {
          title: "Pending",
          url: "/dashboard/manajemen-proyek/pending",
        },
        {
          title: "On Progress",
          url: "/dashboard/manajemen-proyek/progress",
        },
        {
          title: "Revisi",
          url: "/dashboard/manajemen-proyek/revisi",
        },
        {
          title: "Selesai",
          url: "/dashboard/manajemen-proyek/selesai",
        },
      ],
    },
    {
      title: "Documentation",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Management Accounts",
      icon: Settings2,
      items: [
        {
          title: "Home",
          url: "/dashboard/management-accounts/home",
        },
        {
          title: "Type",
          url: "/dashboard/management-accounts/type",
        },
        {
          title: "Billing",
          url: "/dashboard/management-accounts/provider",
        }
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
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
  const { user, logout } = useAuth()

  const userData = user
    ? {
      name: user.displayName,
      email: user.email,
      avatar: user.photo_url || "",
    }
    : { name: "", email: "", avatar: "" }

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Agenda Kita</span>
                  <span className="truncate text-xs">Platform Management</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navData.navMain} />
        <NavProjects projects={navData.projects} />
        <NavSecondary items={navData.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} onLogout={logout} />
      </SidebarFooter>
    </Sidebar>
  )
}
