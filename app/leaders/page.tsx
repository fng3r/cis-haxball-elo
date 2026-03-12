import { AllSeasonsView } from "@/components/all-seasons-view"
import data from "@/seasonStats.json"
import type { SeasonDataWithMeta } from "@/types/types"

const seasonData = data as Record<string, SeasonDataWithMeta>
const seasonKeys = Object.keys(seasonData).sort((a, b) => {
  const na = seasonData[a].seasonNumber
  const nb = seasonData[b].seasonNumber
  if (na !== nb) return nb - na
  return b.localeCompare(a)
})

export default function LeadersPage() {
  const seasons = seasonKeys.map((key) => ({ key, data: seasonData[key] }))

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full">
        <AllSeasonsView seasons={seasons} />
      </div>
    </div>
  )
}
