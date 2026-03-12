"use client"

import { cn } from "@/lib/utils"
import { BarChart3, Medal } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

const NAV_ITEMS = [
  { href: "/", icon: BarChart3, label: "Stats" },
  { href: "/leaders", icon: Medal, label: "Leaders" },
] as const

export function AppSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-svh w-full justify-center">
      <div className="flex min-h-svh w-full max-w-7xl gap-4">
        {/* Logo + nav column (left of main content) */}
        <aside className="flex w-20 shrink-0 flex-col">
          <div className="flex shrink-0 items-center justify-center my-3">
            <Image
              src="/elo.png"
              alt="CIS"
              width={48}
              height={48}
              className="h-12 w-12 object-contain"
            />
          </div>
          <nav className="flex flex-1 flex-col gap-2">
            {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
              const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href)
              return (
                <Link
                  key={href}
                  href={href}
                  title={label}
                  className={cn(
                    "flex flex-col items-center justify-center gap-0.5 rounded-lg px-2 py-2.5 transition-colors",
                    "hover:bg-muted hover:text-foreground",
                    isActive
                      ? "bg-muted text-foreground font-medium ring-2 ring-primary/50"
                      : "text-muted-foreground",
                  )}
                >
                  <Icon className="h-9 w-9 shrink-0" />
                  <span className="text-[10px] font-medium leading-tight truncate max-w-full text-center">
                    {label}
                  </span>
                </Link>
              )
            })}
          </nav>
        </aside>
        {/* Main content column */}
        <main className="min-w-0 flex-1 flex flex-col bg-background">{children}</main>
      </div>
    </div>
  )
}
