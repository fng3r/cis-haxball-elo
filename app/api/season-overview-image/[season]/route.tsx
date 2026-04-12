import {
  getHighestLosestreak,
  getHighestWinrate,
  getHighestWinstreak,
  getLowestWinrate,
  getMostLosses,
  getMostMatches,
  getMostWins,
  type StatLeader,
} from "@/lib/season-stats-leaders"
import data from "@/seasonStats.json"
import type { SeasonDataWithMeta, SeasonStatsType } from "@/types/types"
import { ImageResponse } from "next/og"

const seasonData = data as Record<string, SeasonDataWithMeta>

export const runtime = "edge"

const fontPromise = fetch(new URL("./fonts/DejaVuSans-OverviewSubset.woff", import.meta.url)).then((response) =>
  response.arrayBuffer()
)

function formatWinrate(value: number) {
  return `${(value * 100).toFixed(1)}%`
}

function formatLeaderNames(leaders: StatLeader[]) {
  return leaders.map((leader) => leader.nickname).join(" • ")
}

function seasonGamesCount(stats: SeasonStatsType[]) {
  return Math.floor(stats.reduce((sum, player) => sum + player.matches, 0) / 8)
}

function getMedalImage(rank: number, origin: string) {
  switch (rank) {
    case 1:
      return `${origin}/medals/elo_gold.png`
    case 2:
      return `${origin}/medals/elo_silver.png`
    case 3:
      return `${origin}/medals/elo_bronze.png`
    default:
      return ""
  }
}

function getCisLogo(origin: string) {
  return `${origin}/cis-logo-full.png`
}

function getPublicOrigin(request: Request) {
  const forwardedHost = request.headers.get("x-forwarded-host")
  const forwardedProto = request.headers.get("x-forwarded-proto")

  if (forwardedHost) {
    return `${forwardedProto ?? "https"}://${forwardedHost}`
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  return new URL(request.url).origin
}

function statCard(title: string, value: string, names: string, accent: string, subtitle?: string) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        gap: 12,
        padding: "20px 22px",
        borderRadius: 22,
        background: "rgba(9, 16, 33, 0.82)",
        border: "1px solid rgba(255,255,255,0.08)",
        width: "100%",
        minHeight: 142,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <div
          style={{
            display: "flex",
            fontSize: 17,
            color: "rgba(226,232,240,0.68)",
            textTransform: "uppercase",
            letterSpacing: 1.1,
          }}
        >
          {title}
        </div>
        {subtitle ? (
          <div
            style={{
              display: "flex",
              fontSize: 13,
              color: "rgba(147,197,253,0.78)",
            }}
          >
            {subtitle}
          </div>
        ) : null}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ display: "flex", fontSize: 38, fontWeight: 800, color: accent }}>{value}</div>
        <div style={{ display: "flex", fontSize: 20, color: "#f8fafc", lineHeight: 1.18 }}>{names}</div>
      </div>
    </div>
  )
}

export async function GET(request: Request, context: { params: Promise<{ season: string }> }) {
  try {
    const fontData = await fontPromise
    const { season } = await context.params
    const seasonKey = decodeURIComponent(season)
    const selectedSeason = seasonData[seasonKey]
    const origin = getPublicOrigin(request)

    if (!selectedSeason) {
      return new Response("Season not found", { status: 404 })
    }

    const stats = selectedSeason.stats
    const qualifiedPlayersCount = stats.filter((player) => player.matches >= 20).length
    const gamesCount = seasonGamesCount(stats)
    const podium = stats.filter((player) => player.rank >= 1 && player.rank <= 3).sort((a, b) => a.rank - b.rank)

    const leaderGroups = [
      { title: "Most matches", leaders: getMostMatches(stats), format: (value: number) => String(value), accent: "#fde68a" },
      { title: "Most wins", leaders: getMostWins(stats), format: (value: number) => String(value), accent: "#4ade80" },
      { title: "Most losses", leaders: getMostLosses(stats), format: (value: number) => String(value), accent: "#fb7185" },
      { title: "Highest winrate", subtitle: ">= 20 matches", leaders: getHighestWinrate(stats), format: formatWinrate, accent: "#4ade80" },
      { title: "Lowest winrate", subtitle: ">= 20 matches", leaders: getLowestWinrate(stats), format: formatWinrate, accent: "#fb7185" },
      { title: "Highest winstreak", leaders: getHighestWinstreak(stats), format: (value: number) => `${value}W`, accent: "#4ade80" },
      { title: "Highest losestreak", leaders: getHighestLosestreak(stats), format: (value: number) => `${value}L`, accent: "#fb7185" },
    ].filter((group) => group.leaders.length > 0)

    const leaderRows = [
      leaderGroups.filter((group) => ["Most matches", "Most wins", "Most losses"].includes(group.title)),
      leaderGroups.filter((group) => ["Highest winrate", "Lowest winrate"].includes(group.title)),
      leaderGroups.filter((group) => ["Highest winstreak", "Highest losestreak"].includes(group.title)),
    ]

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            padding: "28px 30px",
            color: "white",
            background: "linear-gradient(135deg, #020617 0%, #0f172a 55%, #111827 100%)",
            fontFamily: "DejaVu Sans",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 14,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div
                style={{
                  display: "flex",
                  fontSize: 14,
                  letterSpacing: 2.4,
                  textTransform: "uppercase",
                  color: "rgba(226,232,240,0.72)",
                }}
              >
                CIS HaxBall Elo
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                <span style={{ display: "flex", fontSize: 46, fontWeight: 900, color: "#f8fafc" }}>{seasonKey}</span>
              </div>
            </div>
            <img
              src={getCisLogo(origin)}
              alt="CIS logo"
              width="86"
              height="84"
              style={{ display: "flex", width: 86, height: 84, objectFit: "contain" }}
            />
          </div>

          <div style={{ display: "flex", gap: 18, flex: 1 }}>
            <div style={{ display: "flex", flexDirection: "column", width: "32%", gap: 14 }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {[
                  { label: "Season", value: String(selectedSeason.seasonNumber), accent: "#f8fafc" },
                  { label: "Games", value: String(gamesCount), accent: "#fde68a" },
                  { label: "Players", value: String(stats.length), accent: "#93c5fd" },
                  { label: "Players (>= 20 matches)", value: String(qualifiedPlayersCount), accent: "#c4b5fd" },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 4,
                      width: "48%",
                      padding: "12px 14px",
                      borderRadius: 18,
                      background: "rgba(15, 23, 42, 0.82)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        fontSize: 12,
                        color: "rgba(226,232,240,0.68)",
                        textTransform: "uppercase",
                        letterSpacing: 0.9,
                      }}
                    >
                      {item.label}
                    </span>
                    <span style={{ display: "flex", fontSize: 30, fontWeight: 800, color: item.accent }}>{item.value}</span>
                  </div>
                ))}
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                  flex: 1,
                  padding: "18px 20px",
                  borderRadius: 22,
                  background: "rgba(15,23,42,0.82)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  overflow: "hidden",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ display: "flex", fontSize: 22, fontWeight: 800 }}>Podium</span>
                  <span style={{ display: "flex", fontSize: 13, color: "rgba(226,232,240,0.68)" }}>Top 3 by ELO</span>
                </div>

                {podium.map((player, index) => (
                  <div
                    key={player.nickname}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "14px 16px",
                      borderRadius: 16,
                      background:
                        index === 0
                          ? "rgba(250, 204, 21, 0.12)"
                          : index === 1
                            ? "rgba(203, 213, 225, 0.12)"
                            : "rgba(251, 146, 60, 0.12)",
                      border: `1px solid ${
                        index === 0
                          ? "rgba(250, 204, 21, 0.34)"
                          : index === 1
                            ? "rgba(203, 213, 225, 0.28)"
                            : "rgba(251, 146, 60, 0.3)"
                      }`,
                      flex: 1,
                    }}
                  >
                    <img
                      src={getMedalImage(player.rank, origin)}
                      alt={`Rank ${player.rank}`}
                      width="100"
                      height="100"
                      style={{ display: "flex", width: 100, height: 100 }}
                    />
                    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                      <span style={{ display: "flex", fontSize: 28, fontWeight: 800 }}>{player.nickname}</span>
                      <span style={{ display: "flex", fontSize: 22, color: "#93c5fd" }}>{player.elo} ELO</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", width: "68%", gap: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ display: "flex", fontSize: 22, fontWeight: 800 }}>Season leaders</span>
                </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
                {leaderRows.map((row, index) => (
                  <div key={index} style={{ display: "flex", gap: 14, flex: 1 }}>
                    {row.map((group) => (
                      <div
                        key={group.title}
                        style={{
                          display: "flex",
                          width: row.length === 3 ? "32.4%" : "49%",
                        }}
                      >
                        {statCard(
                          group.title,
                          group.format(group.leaders[0].value),
                          formatLeaderNames(group.leaders),
                          group.accent,
                          group.subtitle
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1600,
        height: 900,
        fonts: [
          {
            name: "DejaVu Sans",
            data: fontData,
            style: "normal",
            weight: 400,
          },
        ],
      }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown image generation error"
    return new Response(`Season overview image error: ${message}`, {
      status: 500,
      headers: { "content-type": "text/plain; charset=utf-8" },
    })
  }
}
