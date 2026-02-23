"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import { getPageTitle } from "@/lib/page-titles"
import { usePathname } from "next/navigation"

export function AppHeader() {
  const pathname = usePathname()
  const title = getPageTitle(pathname ?? "")
  return (
    <header className="flex shrink-0 items-center justify-between py-4">
      <h1 className="text-2xl font-bold text-foreground md:text-2xl">{title}</h1>
      <ThemeToggle />
    </header>
  )
}
