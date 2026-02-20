import type React from "react"
import type { AllTimeStatsType } from "@/types/types"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"

interface AllTimeStatsProps {
  allTimeData: AllTimeStatsType[]
}

const columns: ColumnDef<AllTimeStatsType>[] = [
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
    enableHiding: false,
  },
  {
    accessorKey: "player",
    header: "Player",
    enableSorting: false,
    enableColumnFilter: false,
    enableHiding: false,
  },
  {
    accessorKey: "totalSeasons",
    header: "Seasons",
    cell: ({ row }) => <Badge variant="outline">{row.original.totalSeasons}</Badge>,
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "totalEloGain",
    header: "Total ELO Gain",
    cell: ({ row }) => <span className="text-blue-600 dark:text-blue-400 font-semibold">{row.original.totalEloGain}</span>,
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "totalElo",
    header: "Total ELO",
    cell: ({ row }) => <span className="text-primary">{row.original.totalElo}</span>,
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
      return <span className={`font-medium ${color}`}>{rate.toFixed(2)}%</span>
    },
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "bestStreak",
    header: "Best Streak",
    cell: ({ row }) => <span className="font-medium">{`${row.original.bestStreak}W`}</span>,
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "worstStreak",
    header: "Worst Streak",
    cell: ({ row }) => <span className="font-medium">{`${row.original.worstStreak}L`}</span>,
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "avgEloPerMatch",
    header: "Avg ELO/Match",
    cell: ({ row }) => (row.original.avgEloPerMatch as number).toFixed(1),
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "avgMatchesPerSeason",
    header: "Avg Matches/Season",
    cell: ({ row }) => (row.original.avgMatchesPerSeason as number).toFixed(0),
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "avgWinsPerSeason",
    header: "Avg Wins/Season",
    cell: ({ row }) => (row.original.avgWinsPerSeason as number).toFixed(0),
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "avgLossesPerSeason",
    header: "Avg Losses/Season",
    cell: ({ row }) => (row.original.avgLossesPerSeason as number).toFixed(0),
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "maxMatchesPerSeason",
    header: "Max Matches/Season",
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "maxWinsPerSeason",
    header: "Max Wins/Season",
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "maxLossesPerSeason",
    header: "Max Losses/Season",
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "totalBans",
    header: "Total Bans",
    cell: ({ row }) => row.original.totalBans ? <span className="text-orange-600 dark:text-orange-400 font-medium">{row.original.totalBans}</span> : "-",
    enableSorting: true,
    enableColumnFilter: true,
  },
]

export default function AllTimeStats(props: AllTimeStatsProps) {
  return (
    <DataTable columns={columns} data={props.allTimeData} filterColumn="player" filterPlaceholder="Find player by name" />
  )
}
