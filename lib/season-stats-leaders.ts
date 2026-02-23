import type { SeasonStatsType } from "@/types/types"

const MIN_MATCHES_WINRATE = 20

export type StatLeader = { nickname: string; value: number }

export function getMostWins(stats: SeasonStatsType[]): StatLeader[] {
  if (stats.length === 0) return []
  const max = Math.max(...stats.map((p) => p.wins))
  return stats.filter((p) => p.wins === max).map((p) => ({ nickname: p.nickname, value: p.wins }))
}

export function getMostLosses(stats: SeasonStatsType[]): StatLeader[] {
  if (stats.length === 0) return []
  const max = Math.max(...stats.map((p) => p.losses))
  return stats.filter((p) => p.losses === max).map((p) => ({ nickname: p.nickname, value: p.losses }))
}

export function getMostMatches(stats: SeasonStatsType[]): StatLeader[] {
  if (stats.length === 0) return []
  const max = Math.max(...stats.map((p) => p.matches))
  return stats.filter((p) => p.matches === max).map((p) => ({ nickname: p.nickname, value: p.matches }))
}

export function getHighestWinrate(stats: SeasonStatsType[]): StatLeader[] {
  const withMin = stats.filter((p) => p.matches >= MIN_MATCHES_WINRATE)
  if (withMin.length === 0) return []
  const max = Math.max(...withMin.map((p) => p.winrate))
  return withMin
    .filter((p) => p.winrate === max)
    .map((p) => ({ nickname: p.nickname, value: Math.round(p.winrate * 1000) / 1000 }))
}

export function getLowestWinrate(stats: SeasonStatsType[]): StatLeader[] {
  const withMin = stats.filter((p) => p.matches >= MIN_MATCHES_WINRATE)
  if (withMin.length === 0) return []
  const min = Math.min(...withMin.map((p) => p.winrate))
  return withMin
    .filter((p) => p.winrate === min)
    .map((p) => ({ nickname: p.nickname, value: Math.round(p.winrate * 1000) / 1000 }))
}

export function getHighestWinstreak(stats: SeasonStatsType[]): StatLeader[] {
  if (stats.length === 0) return []
  const max = Math.max(...stats.map((p) => p.highestWinstreak))
  return stats
    .filter((p) => p.highestWinstreak === max)
    .map((p) => ({ nickname: p.nickname, value: p.highestWinstreak }))
}

export function getHighestLosestreak(stats: SeasonStatsType[]): StatLeader[] {
  if (stats.length === 0) return []
  const max = Math.max(...stats.map((p) => p.highestLosestreak))
  return stats
    .filter((p) => p.highestLosestreak === max)
    .map((p) => ({ nickname: p.nickname, value: p.highestLosestreak }))
}
