import type React from "react"
import type { SeasonStatsType } from "@/types/types"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"

interface SeasonStatsProps {
  seasonData: SeasonStatsType[]
}

const columns: ColumnDef<SeasonStatsType>[] = [
  {
    accessorKey: "rank",
    header: "Rank",
    cell: ({ row }) => (
      <Badge variant={row.original.rank <= 3 ? "default" : "secondary"} className="font-bold">
        #{row.original.rank}
      </Badge>
    ),
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "nickname",
    header: "Player",
    enableSorting: false,
    enableColumnFilter: false,
  },
  {
    accessorKey: "elo",
    header: "ELO",
    cell: ({ row }) => <span className="text-blue-600 dark:text-blue-400 font-semibold">{row.original.elo}</span>,
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "matches",
    header: "Matches",
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "wins",
    header: "Wins",
    cell: ({ row }) => <span className="text-green-600 dark:text-green-400 font-medium">{row.original.wins}</span>,
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "losses",
    header: "Losses",
    cell: ({ row }) => <span className="text-red-600 dark:text-red-400 font-medium">{row.original.losses}</span>,
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "winrate",
    header: "Winrate",
    cell: ({ row }) => {
      const rate = row.original.winrate * 100
      const color = rate >= 50 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
      return <span className={`font-medium ${color}`}>{rate.toFixed(1)}%</span>
    },
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "highestWinstreak",
    header: "Best Streak",
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "highestLosestreak",
    header: "Worst Streak",
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "eloGain",
    header: "ELO Gain",
    cell: ({ row }) => <span className="font-medium">{row.original.eloGain}</span>,
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "eloPerMatch",
    header: "ELO/Match",
    cell: ({ row }) => (row.original.eloPerMatch as number).toFixed(1),
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "bansFor800Elo",
    header: "Bans",
    cell: ({ row }) => row.original.bansFor800Elo ? <span className="text-orange-600 dark:text-orange-400 font-medium">{row.original.bansFor800Elo}</span> : "-",
    enableSorting: true,
    enableColumnFilter: true,
  },
]

const SeasonStats: React.FC<SeasonStatsProps> = ({ seasonData }) => {
  return (
    <DataTable columns={columns} data={seasonData} filterColumn="nickname" filterPlaceholder="Find player by name" />
  )
}

export default SeasonStats
