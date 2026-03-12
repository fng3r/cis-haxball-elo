"use client"

import { SeasonPageContent } from "@/components/season-page-content"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import type { SeasonDataWithMeta } from "@/types/types"
import { ChevronDown } from "lucide-react"

type SeasonEntry = { key: string; data: SeasonDataWithMeta }

export function AllSeasonsView({ seasons }: { seasons: SeasonEntry[] }) {
  return (
    <div className="space-y-4">
      {seasons.map(({ key, data: season }) => (
        <Collapsible key={key} defaultOpen={true}>
          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border bg-card px-4 py-3 text-left font-semibold hover:bg-muted/50 transition-colors [&[data-state=open]>svg]:rotate-180">
            {key}
            <ChevronDown className="h-4 w-4 shrink-0 transition-transform" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="border-x border-b rounded-b-lg border-border bg-background px-4 py-4">
              <SeasonPageContent seasonLabel={key} stats={season.stats} />
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  )
}
