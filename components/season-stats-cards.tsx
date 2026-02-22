import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { AllTimeStatsCardsProps, SeasonStatsCardsProps } from "@/types/types"
import { Gamepad2, Hash, Users, UsersRound } from "lucide-react"

export function SeasonStatsCards(props: SeasonStatsCardsProps) {
  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <span className="text-sm font-medium text-muted-foreground">Season</span>
          <Hash className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <span className="text-2xl font-bold">{props.seasonNumber}</span>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <span className="text-sm font-medium text-muted-foreground">Games</span>
          <Gamepad2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <span className="text-2xl font-bold">{props.gamesCount}</span>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <span className="text-sm font-medium text-muted-foreground">Players</span>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <span className="text-2xl font-bold">{props.playersCount}</span>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <span className="text-sm font-medium text-muted-foreground">Players (≥20 games)</span>
          <UsersRound className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <span className="text-2xl font-bold">{props.playersWithMinGamesCount}</span>
        </CardContent>
      </Card>
    </div>
  )
}

export function AllTimeStatsCards(props: AllTimeStatsCardsProps) {
  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <span className="text-sm font-medium text-muted-foreground">Total Seasons</span>
          <Hash className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <span className="text-2xl font-bold">{props.totalSeasonsCount}</span>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <span className="text-sm font-medium text-muted-foreground">Games</span>
          <Gamepad2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <span className="text-2xl font-bold">{props.gamesCount}</span>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <span className="text-sm font-medium text-muted-foreground">Players</span>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <span className="text-2xl font-bold">{props.playersCount}</span>
        </CardContent>
      </Card>
    </div>
  )
}
