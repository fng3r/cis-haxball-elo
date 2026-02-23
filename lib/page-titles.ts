/** Route pathname → header title. Known at build/request time, no client state. */
export const PAGE_TITLES: Record<string, string> = {
  "/": "Statistics",
  "/leaders": "Leaders",
}

export const DEFAULT_PAGE_TITLE = "Statistics"

export function getPageTitle(pathname: string): string {
  if (pathname in PAGE_TITLES) return PAGE_TITLES[pathname]
  return DEFAULT_PAGE_TITLE
}
