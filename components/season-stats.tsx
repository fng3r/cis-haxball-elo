import type React from "react"
import type { SeasonStatsType } from "@/types/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface SeasonStatsProps {
  seasonData: SeasonStatsType[]
}

type Column<T> = {
  key: keyof T
  header: string
  format?: (value: T[keyof T], row: T) => React.ReactNode
}

const columns: Column<SeasonStatsType>[] = [
  {
    key: "rank",
    header: "Rank",
    format: (value, row) => (
      <Badge variant={row.rank <= 3 ? "default" : "secondary"} className="font-bold">
        #{value}
      </Badge>
    ),
  },
  { key: "nickname", header: "Player" },
  {
    key: "elo",
    header: "ELO",
    format: (value) => <span className="font-semibold text-primary">{value}</span>,
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
      const rate = value as number
      const color =
        rate >= 75
          ? "text-green-600 dark:text-green-400"
          : rate >= 60
            ? "text-yellow-600 dark:text-yellow-400"
            : "text-red-600 dark:text-red-400"
      return <span className={`font-medium ${color}`}>{rate.toFixed(1)}%</span>
    },
  },
  { key: "highestWinstreak", header: "Best Streak" },
  { key: "highestLosestreak", header: "Worst Streak" },
  {
    key: "eloGain",
    header: "ELO Gain",
    format: (value) => <span className="text-blue-600 dark:text-blue-400 font-medium">+{value}</span>,
  },
  {
    key: "eloPerMatch",
    header: "ELO/Match",
    format: (value) => (value as number).toFixed(1),
  },
  { key: "bansFor800Elo", header: "Bans" },
]

const SeasonStats: React.FC<SeasonStatsProps> = ({ seasonData }) => {
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
          {seasonData.map((row, index) => (
            <TableRow key={row.nickname} className={index < 3 ? "bg-muted/50" : ""}>
              {columns.map((col) => {
                const raw = row[col.key]
                const rendered = col.format ? col.format(raw, row) : raw
                return <TableCell key={`${row.nickname}-${String(col.key)}`}>{rendered}</TableCell>
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default SeasonStats
