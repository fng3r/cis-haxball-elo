import { AppHeader } from "@/components/app-header"
import { AppSidebar } from "@/components/app-sidebar"
import type { Metadata } from "next"
import { ThemeProvider } from "next-themes"
import { Inter } from "next/font/google"
import type React from "react"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CIS-HAXBALL ELO",
  description: "CIS-HAXBALL ELO Leaderboard",
  icons: "/cis-logo.png",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="max-w-7xl mx-auto px-4 pb-6 flex flex-1 flex-col">
            <AppSidebar>
              <AppHeader />
              {children}
            </AppSidebar>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
