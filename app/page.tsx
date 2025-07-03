"use client"

import type React from "react"
import { useMemo, useState } from "react"
import SeasonStats from "@/components/season-stats"
import AllTimeStats from "@/components/all-time-stats"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import data from "@/seasonStats"
import type { SeasonStatsType, AllTimeStatsType } from "@/types/types"

const Home: React.FC = () => {
  const seasonOptions = useMemo(() => Object.keys(data), [])
  const [selectedSeason, setSelectedSeason] = useState(seasonOptions[0])

  const allTimeData: AllTimeStatsType[] = useMemo(() => {
    const playerStats: { [key: string]: AllTimeStatsType } = {}

    for (const season in data) {
      data[season].forEach((player: SeasonStatsType) => {
        const { nickname, elo, eloGain, matches, wins, losses, highestWinstreak, highestLosestreak, bansFor800Elo } =
          player

        if (playerStats[nickname]) {
          const existing = playerStats[nickname]
          playerStats[nickname] = {
            ...existing,
            totalSeasons: existing.totalSeasons + 1,
            totalElo: existing.totalElo + elo,
            totalEloGain: existing.totalEloGain + eloGain,
            matches: existing.matches + matches,
            wins: existing.wins + wins,
            losses: existing.losses + losses,
            bestStreak: Math.max(existing.bestStreak, highestWinstreak),
            worstStreak: Math.max(existing.worstStreak, highestLosestreak),
            maxMatchesPerSeason: Math.max(existing.maxMatchesPerSeason, matches),
            maxWinsPerSeason: Math.max(existing.maxWinsPerSeason, wins),
            maxLossesPerSeason: Math.max(existing.maxLossesPerSeason, losses),
            totalBans: existing.totalBans + bansFor800Elo,
          }
        } else {
          playerStats[nickname] = {
            player: nickname,
            totalSeasons: 1,
            totalElo: elo,
            totalEloGain: eloGain,
            matches: matches,
            wins: wins,
            losses: losses,
            winrate: 0, // calculated later
            bestStreak: highestWinstreak,
            worstStreak: highestLosestreak,
            avgEloPerMatch: 0, // calculated later
            avgMatchesPerSeason: 0, // calculated later
            avgWinsPerSeason: 0, // calculated later
            avgLossesPerSeason: 0, // calculated later
            maxMatchesPerSeason: matches,
            maxWinsPerSeason: wins,
            maxLossesPerSeason: losses,
            totalBans: bansFor800Elo,
          }
        }
      })
    }

    const allTimeArray = Object.values(playerStats).sort((a, b) => b.totalEloGain - a.totalEloGain)

    return allTimeArray.map((player) => ({
      ...player,
      winrate: player.matches > 0 ? player.wins / player.matches : 0,
      avgEloPerMatch: player.matches > 0 ? player.totalEloGain / player.matches : 0,
      avgMatchesPerSeason: player.totalSeasons > 0 ? player.matches / player.totalSeasons : 0,
      avgWinsPerSeason: player.totalSeasons > 0 ? player.wins / player.totalSeasons : 0,
      avgLossesPerSeason: player.totalSeasons > 0 ? player.losses / player.totalSeasons : 0,
    }))
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">CIS ELO Leaderboard</h1>
            <p className="text-muted-foreground">Competitive gaming statistics and rankings</p>
          </div>
          <ThemeToggle />
        </div>

        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="season" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="season">Season Statistics</TabsTrigger>
                <TabsTrigger value="alltime">All-Time Statistics</TabsTrigger>
              </TabsList>

              <TabsContent value="season" className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label htmlFor="season-select" className="text-sm font-medium">
                    Select Season:
                  </label>
                  <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a season" />
                    </SelectTrigger>
                    <SelectContent>
                      {seasonOptions.map((season) => (
                        <SelectItem key={season} value={season}>
                          {season}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <SeasonStats seasonData={data[selectedSeason]} />
              </TabsContent>

              <TabsContent value="alltime">
                <AllTimeStats allTimeData={allTimeData} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Home
