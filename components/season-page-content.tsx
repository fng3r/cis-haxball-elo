"use client"

import { Card, CardContent } from "@/components/ui/card"
import {
  getHighestLosestreak,
  getHighestWinrate,
  getHighestWinstreak,
  getLowestWinrate,
  getMostLosses,
  getMostMatches,
  getMostWins,
} from "@/lib/season-stats-leaders"
import { cn } from "@/lib/utils"
import type { SeasonStatsType } from "@/types/types"
import { Trophy } from "lucide-react"
import Image from "next/image"

interface SeasonPageContentProps {
  seasonLabel: string
  stats: SeasonStatsType[]
}

function formatWinrate(value: number) {
  return `${(value * 100).toFixed(1)}%`
}

type StatLeader = { nickname: string; value: number }

function StatCard({
  title,
  leaders,
  valueFormat = (v) => String(v),
  valueClassName,
}: {
  title: string
  leaders: StatLeader[]
  valueFormat?: (v: number) => string
  valueClassName?: string
}) {
  if (leaders.length === 0) return null
  const value = valueFormat(leaders[0].value)
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-muted-foreground text-sm font-medium mb-1">{title}</p>
        <p className={cn("text-2xl font-bold tabular-nums mb-2", valueClassName)}>{value}</p>
        <div className="flex flex-wrap gap-x-2 gap-y-0.5 text-sm">
          {leaders.map((l) => (
            <span key={l.nickname} className="font-medium">
              {l.nickname}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function SeasonPageContent({ seasonLabel, stats }: SeasonPageContentProps) {
  const prizers = stats.filter((p) => p.rank >= 1 && p.rank <= 3).sort((a, b) => a.rank - b.rank)
  const mostWins = getMostWins(stats)
  const mostLosses = getMostLosses(stats)
  const mostMatches = getMostMatches(stats)
  const highestWinrate = getHighestWinrate(stats)
  const lowestWinrate = getLowestWinrate(stats)
  const highestWinstreak = getHighestWinstreak(stats)
  const highestLosestreak = getHighestLosestreak(stats)
  const medalImage = (rank: number): string => {
    switch (rank) {
      case 1:
        return "/medals/elo_gold.png"
      case 2:
        return "/medals/elo_silver.png"
      case 3:
        return "/medals/elo_bronze.png"
      default:
        return "/medals/default.png"
    }
  }

  return (
    <div className="flex flex-col gap-4" aria-labelledby={`season-${seasonLabel.replace(/\s/g, "-")}`}>
      <h2 id={`season-${seasonLabel.replace(/\s/g, "-")}`} className="sr-only">
        {seasonLabel}
      </h2>
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Podium
        </h3>
        <div className="grid gap-4 sm:grid-cols-3">
          {prizers.map((p) => (
            <div
              key={p.nickname}
              className="flex flex-row items-center gap-4 rounded-lg border bg-card p-5"
            >
              <Image
                src={medalImage(p.rank)}
                alt={`Rank ${p.rank}`}
                width={80}
                height={80}
                className="h-20 w-20 shrink-0 object-contain"
              />
              <div className="flex min-w-0 flex-col">
                <span className="text-xl font-semibold">{p.nickname}</span>
                <span className="text-lg text-blue-600 dark:text-blue-400 font-medium">
                  {p.elo} ELO
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">📊 Season stats</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard title="Most matches" leaders={mostMatches} valueClassName="text-amber-500 dark:text-amber-300" />
          <StatCard title="Most wins" leaders={mostWins} valueClassName="text-emerald-600 dark:text-emerald-400" />
          <StatCard title="Most losses" leaders={mostLosses} valueClassName="text-rose-600 dark:text-rose-400" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Highest winrate (≥20 matches)"
            leaders={highestWinrate}
            valueFormat={formatWinrate}
            valueClassName="text-green-600 dark:text-green-400"
          />
          <StatCard
            title="Lowest winrate (≥20 matches)"
            leaders={lowestWinrate}
            valueFormat={formatWinrate}
            valueClassName="text-red-600 dark:text-red-400"
          />
          <StatCard
            title="Highest winstreak"
            leaders={highestWinstreak}
            valueClassName="text-green-600 dark:text-green-400"
          />
          <StatCard
            title="Highest losestreak"
            leaders={highestLosestreak}
            valueClassName="text-red-600 dark:text-red-400"
          />
        </div>
      </div>
    </div>
  )
}
