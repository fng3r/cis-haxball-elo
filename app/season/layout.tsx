import { TITLE } from "./title"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: `${TITLE} | CIS-HAXBALL ELO`,
}

export default function SeasonLayout({ children }: { children: React.ReactNode }) {
  return children
}
