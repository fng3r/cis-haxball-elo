export type SeasonStatsType = {
  rank: number
  nickname: string
  elo: number
  matches: number
  wins: number
  losses: number
  wlr: number
  winrate: number
  highestWinstreak: number
  highestLosestreak: number
  eloGain: number
  eloPerMatch: number
  bansFor800Elo: number
}

export type AllTimeStatsType = {
  rank: number
  player: string
  totalSeasons: number
  totalElo: number
  totalEloGain: number
  matches: number
  wins: number
  losses: number
  winrate: number
  bestStreak: number
  worstStreak: number
  avgEloPerMatch: number
  avgMatchesPerSeason: number
  avgWinsPerSeason: number
  avgLossesPerSeason: number
  maxMatchesPerSeason: number
  maxWinsPerSeason: number
  maxLossesPerSeason: number
  totalBans: number
}
