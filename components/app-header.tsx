"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import { usePageTitle } from "@/contexts/page-title-context"

export function AppHeader() {
  const { title } = usePageTitle()
  return (
    <header className="flex shrink-0 items-center justify-between py-4">
      <h1 className="text-xl font-bold text-foreground md:text-2xl">{title}</h1>
      <ThemeToggle />
    </header>
  )
}
