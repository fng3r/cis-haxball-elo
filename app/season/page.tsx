import { AllSeasonsView } from "@/components/all-seasons-view"
import { PageTitle } from "@/contexts/page-title-context"
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
    <PageTitle title="Seasons">
      <div className="min-h-screen bg-background">
        <div className="w-full">
          <AllSeasonsView seasons={seasons} />
        </div>
      </div>
    </PageTitle>
  )
}
