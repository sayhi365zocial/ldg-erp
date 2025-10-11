"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Building2,
  Users,
  UserCog,
  Briefcase,
  FolderKanban,
  FileText,
  Calendar,
  Settings,
  TrendingUp,
  CheckSquare,
  X,
} from "lucide-react"

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Calendar",
    href: "/dashboard/calendar",
    icon: Calendar,
  },
  {
    title: "Companies",
    href: "/dashboard/companies",
    icon: Building2,
  },
  {
    title: "Contacts",
    href: "/dashboard/contacts",
    icon: Users,
  },
  {
    title: "Tasks",
    href: "/dashboard/tasks",
    icon: CheckSquare,
  },
  {
    title: "Deals",
    href: "/dashboard/deals",
    icon: TrendingUp,
  },
  {
    title: "Projects",
    href: "/dashboard/projects",
    icon: FolderKanban,
  },
  {
    title: "Invoices",
    href: "/dashboard/invoices",
    icon: FileText,
  },
  {
    title: "Activities",
    href: "/dashboard/activities",
    icon: Briefcase,
  },
  {
    title: "Users",
    href: "/dashboard/users",
    icon: UserCog,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

interface SidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen w-72 bg-white border-r dark:bg-gray-950 transition-transform duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between gap-2 px-6 py-5 border-b">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="relative h-10 w-10 rounded-lg overflow-hidden">
              <Image
                src="/logo.png"
                alt="LDG Logo"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold">LDG ERP</h1>
              <p className="text-xs text-muted-foreground">Management System</p>
            </div>
          </Link>

          {/* Close button for mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-accent rounded-md"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-4">
          <div>
            <h3 className="mb-4 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              MENU
            </h3>
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "group flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </nav>
      </aside>
    </>
  )
}
