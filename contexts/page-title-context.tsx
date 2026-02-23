"use client"

import React, { createContext, useCallback, useContext, useState } from "react"

const DEFAULT_TITLE = "Leaderboard"

type PageTitleContextValue = {
  title: string
  setTitle: (title: string) => void
}

const PageTitleContext = createContext<PageTitleContextValue | null>(null)

export function PageTitleProvider({ children }: { children: React.ReactNode }) {
  const [title, setTitleState] = useState(DEFAULT_TITLE)
  const setTitle = useCallback((t: string) => setTitleState(t), [])
  const value = React.useMemo(() => ({ title, setTitle }), [title, setTitle])
  return <PageTitleContext.Provider value={value}>{children}</PageTitleContext.Provider>
}

export function usePageTitle() {
  const ctx = useContext(PageTitleContext)
  if (!ctx) throw new Error("usePageTitle must be used within PageTitleProvider")
  return ctx
}

/** Client component: set the header title when this page is mounted and render children. */
export function PageTitle({ title, children }: { title: string; children: React.ReactNode }) {
  const { setTitle } = usePageTitle()
  React.useEffect(() => {
    setTitle(title)
    return () => setTitle(DEFAULT_TITLE)
  }, [title, setTitle])
  return <>{children}</>
}
