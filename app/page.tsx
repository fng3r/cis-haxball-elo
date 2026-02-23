"use client"

import AllTimeStats from "@/components/all-time-stats"
import SeasonStats from "@/components/season-stats"
import { AllTimeStatsCards, SeasonStatsCards } from "@/components/season-stats-cards"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import data from "@/seasonStats.json"
import type { AllTimeStatsType, SeasonDataWithMeta, SeasonStatsType } from "@/types/types"
import type React from "react"
import { useMemo, useState } from "react"

const seasonData = data as Record<string, SeasonDataWithMeta>

const Home: React.FC = () => {
  const seasonOptions = useMemo(() => Object.keys(seasonData), [])
  const [selectedSeason, setSelectedSeason] = useState(seasonOptions[seasonOptions.length - 1])

  const allTimeData: AllTimeStatsType[] = useMemo(() => {
    const playerStats: { [key: string]: AllTimeStatsType } = {}

    for (const seasonKey in seasonData) {
      const season = seasonData[seasonKey]
      season.stats.forEach((player: SeasonStatsType) => {
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
            totalBans: existing.totalBans + (bansFor800Elo || 0),
          }
        } else {
          playerStats[nickname] = {
            rank: 0, // calculated later
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
            totalBans: bansFor800Elo || 0,
          }
        }
      })
    }

    const allTimeArray = Object.values(playerStats).sort((a, b) => b.totalEloGain - a.totalEloGain)

    return allTimeArray.map((player, idx) => ({
      ...player,
      rank: idx + 1,
      winrate: player.matches > 0 ? player.wins / player.matches : 0,
      avgEloPerMatch: player.matches > 0 ? player.totalEloGain / player.matches : 0,
      avgMatchesPerSeason: player.totalSeasons > 0 ? player.matches / player.totalSeasons : 0,
      avgWinsPerSeason: player.totalSeasons > 0 ? player.wins / player.totalSeasons : 0,
      avgLossesPerSeason: player.totalSeasons > 0 ? player.losses / player.totalSeasons : 0,
    }))
  }, [])

  const totalSeasonsCount = useMemo(() => {
    const numbers = Object.values(seasonData).map((s) => s.seasonNumber)
    return new Set(numbers).size
  }, [])

  const allTimeGamesCount = useMemo(() => {
    let totalMatches = 0
    for (const seasonKey in seasonData) {
      for (const player of seasonData[seasonKey].stats) {
        totalMatches += player.matches
      }
    }
    return Math.floor(totalMatches / 8)
  }, [])

  const selectedSeasonMeta = seasonData[selectedSeason]
  const seasonGamesCount = useMemo(() => {
    const totalMatches = selectedSeasonMeta.stats.reduce((sum, p) => sum + p.matches, 0)
    return Math.floor(totalMatches / 8)
  }, [selectedSeasonMeta.stats])
  const seasonPlayersWithMinGames = useMemo(
    () => selectedSeasonMeta.stats.filter((p) => p.matches >= 20).length,
    [selectedSeasonMeta.stats]
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full">
        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="season" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="season">Season Statistics</TabsTrigger>
                <TabsTrigger value="alltime">All-Time Statistics</TabsTrigger>
              </TabsList>

              <TabsContent value="season" className="space-y-4 mt-2">
                <div className="flex items-center space-x-4">
                  <Label htmlFor="season-select" className="text-sm font-medium">
                    Select Season:
                  </Label>
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
                <SeasonStatsCards
                  seasonNumber={selectedSeasonMeta.seasonNumber}
                  gamesCount={seasonGamesCount}
                  playersCount={selectedSeasonMeta.stats.length}
                  playersWithMinGamesCount={seasonPlayersWithMinGames}
                />
                <SeasonStats seasonData={selectedSeasonMeta.stats} />
              </TabsContent>

              <TabsContent value="alltime" className="space-y-4 mt-4">
                <AllTimeStatsCards
                  totalSeasonsCount={totalSeasonsCount}
                  gamesCount={allTimeGamesCount}
                  playersCount={allTimeData.length}
                />
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
