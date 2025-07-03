import type React from "react"
import type { AllTimeStatsType } from "@/types/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface AllTimeStatsProps {
  allTimeData: AllTimeStatsType[]
}

type Column<T> = {
  key: keyof T
  header: string
  format?: (value: T[keyof T], row: T) => React.ReactNode
}

const columns: Column<AllTimeStatsType>[] = [
  { key: "player", header: "Player" },
  {
    key: "totalSeasons",
    header: "Seasons",
    format: (value) => <Badge variant="outline">{value}</Badge>,
  },
  {
    key: "totalEloGain",
    header: "Total ELO Gain",
    format: (value) => <span className="text-blue-600 dark:text-blue-400 font-semibold">{value}</span>,
  },
  {
    key: "totalElo",
    header: "Total ELO",
    format: (value) => <span className="text-primary">{value}</span>,
  },
  { key: "matches", header: "Matches" },
  {
    key: "wins",
    header: "Wins",
    format: (value) => <span className="text-green-600 dark:text-green-400 font-medium">{value}</span>,
  },
  {
    key: "losses",
    header: "Losses",
    format: (value) => <span className="text-red-600 dark:text-red-400 font-medium">{value}</span>,
  },
  {
    key: "winrate",
    header: "Winrate",
    format: (value) => {
      const rate = (value as number) * 100
      const color =
        rate >= 50
          ? "text-green-600 dark:text-green-400"
          : "text-red-600 dark:text-red-400"
      return <span className={`font-medium ${color}`}>{rate.toFixed(2)}%</span>
    },
  },
  { key: "bestStreak", header: "Best Streak" },
  { key: "worstStreak", header: "Worst Streak" },
  {
    key: "avgEloPerMatch",
    header: "Avg ELO/Match",
    format: (v) => (v as number).toFixed(1),
  },
  {
    key: "avgMatchesPerSeason",
    header: "Avg Matches/Season",
    format: (v) => (v as number).toFixed(0),
  },
  {
    key: "avgWinsPerSeason",
    header: "Avg Wins/Season",
    format: (v) => (v as number).toFixed(0),
  },
  {
    key: "avgLossesPerSeason",
    header: "Avg Losses/Season",
    format: (v) => (v as number).toFixed(0),
  },
  { key: "maxMatchesPerSeason", header: "Max Matches/Season" },
  { key: "maxWinsPerSeason", header: "Max Wins/Season" },
  { key: "maxLossesPerSeason", header: "Max Losses/Season" },
  {
    key: "totalBans",
    header: "Total Bans",
    format: (value) => (value ? <span className="text-orange-600 dark:text-orange-400 font-medium">{value}</span> : "-"),
  },
]

const AllTimeStats: React.FC<AllTimeStatsProps> = ({ allTimeData }) => {
  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={String(col.key)} className="font-semibold">
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {allTimeData.map((row, index) => (
            <TableRow key={row.player} className={index < 3 ? "bg-muted/50" : ""}>
              {columns.map((col) => {
                const raw = row[col.key]
                const rendered = col.format ? col.format(raw, row) : raw
                return <TableCell key={`${row.player}-${String(col.key)}`}>{rendered}</TableCell>
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default AllTimeStats
