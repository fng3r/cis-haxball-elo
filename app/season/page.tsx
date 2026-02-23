import { AllSeasonsView } from "@/components/all-seasons-view"
import { ThemeToggle } from "@/components/theme-toggle"
import data from "@/seasonStats.json"
import type { SeasonDataWithMeta } from "@/types/types"

const seasonData = data as Record<string, SeasonDataWithMeta>
const seasonKeys = Object.keys(seasonData).sort((a, b) => {
  const na = seasonData[a].seasonNumber
  const nb = seasonData[b].seasonNumber
  if (na !== nb) return na - nb
  return a.localeCompare(b)
})

export default function SeasonPage() {
  const seasons = seasonKeys.map((key) => ({ key, data: seasonData[key] }))

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-foreground">Seasons</h1>
          <ThemeToggle />
        </div>
        <AllSeasonsView seasons={seasons} />
      </div>
    </div>
  )
}
