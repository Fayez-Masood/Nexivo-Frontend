"use client"
import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import { Phone, Clock, TrendingUp, Users, Bot } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

interface CallStatsResponse {
  summary: Record<
    string,
    {
      total_calls: number
      total_duration: string
      average_duration_sec: number
      total_duration_sec: number
    }
  >
  daily: {
    date: string
    calls: number
    total_duration_sec: number
  }[]
}

// Voxera pastel tint map
type Tint = "mist" | "sand" | "sage" | "sky" | "blush" | "butter"
const TINT_STYLES: Record<Tint, { bg: string; ink: string }> = {
  mist:   { bg: "var(--mist-bg)",   ink: "var(--mist-ink)"   },
  sand:   { bg: "var(--sand-bg)",   ink: "var(--sand-ink)"   },
  sage:   { bg: "var(--sage-bg)",   ink: "var(--sage-ink)"   },
  sky:    { bg: "var(--sky-bg)",    ink: "var(--sky-ink)"    },
  blush:  { bg: "var(--blush-bg)",  ink: "var(--blush-ink)"  },
  butter: { bg: "var(--butter-bg)", ink: "var(--butter-ink)" },
}

function KpiCard({
  tint,
  icon: Icon,
  value,
  label,
  sublabel,
  onClick,
}: {
  tint: Tint
  icon: React.ElementType
  value: string
  label: string
  sublabel: string
  onClick?: () => void
}) {
  const { bg, ink } = TINT_STYLES[tint]
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "var(--paper)",
        border: `1px solid ${hovered ? "var(--border-2)" : "var(--border-1)"}`,
        borderRadius: "var(--radius-lg)",
        padding: 20,
        boxShadow: hovered ? "var(--shadow-md)" : "var(--shadow-sm)",
        cursor: onClick ? "pointer" : "default",
        transition: "box-shadow var(--dur-base) var(--ease-out), border-color var(--dur-fast) var(--ease-out)",
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      {/* Icon avatar */}
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon style={{ width: 20, height: 20, color: ink }} strokeWidth={1.5} />
      </div>

      {/* Value + labels */}
      <div>
        <div
          style={{
            fontSize: 30,
            fontWeight: 300,
            color: "var(--fg-1)",
            letterSpacing: "-0.035em",
            lineHeight: 1,
            marginBottom: 6,
          }}
        >
          {value}
        </div>
        <div style={{ fontSize: 13, fontWeight: 500, color: "var(--fg-1)", marginBottom: 2 }}>
          {label}
        </div>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.04em",
            color: "var(--fg-4)",
          }}
        >
          {sublabel}
        </div>
      </div>
    </div>
  )
}

export function KPICards() {
  const [totalCalls, setTotalCalls] = useState(0)
  const [totalCallTime, setTotalCallTime] = useState(0)
  const [averageCallTime, setAverageCallTime] = useState(0)
  const [byNumber, setByNumber] = useState<
    Record<string, { calls: number; totalTime: number; avgTime: number }>
  >({})
  const [extraKpis, setExtraKpis] = useState<{ title: string; sublabel: string; value: string; tint: Tint; icon: React.ElementType }[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [activeKpi, setActiveKpi] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/reports/dashboard/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${Cookies.get("Token") || ""}`,
          },
        })
        if (!res.ok) throw new Error()
        const data = await res.json()
        setExtraKpis([
          { title: "Total users", sublabel: "Active accounts", value: String(data.users_in_company ?? 0), tint: "sky",   icon: Users },
          { title: "AI agents",   sublabel: "Deployed",        value: String(data.agents_count ?? 0),     tint: "blush", icon: Bot   },
        ])
      } catch {
        console.error("Error fetching KPIs")
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    async function fetchCallStats() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/conversations/messages/call_stats/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${Cookies.get("Token") || ""}`,
            },
          }
        )
        if (!res.ok) throw new Error()
        const data: CallStatsResponse = await res.json()
        const summary = data.summary || {}
        let totalCallsSum = 0
        let totalDurationSum = 0
        const breakdown: Record<string, { calls: number; totalTime: number; avgTime: number }> = {}

        for (const number in summary) {
          const entry = summary[number]
          if (!entry || typeof entry !== "object") continue
          totalCallsSum += entry.total_calls
          totalDurationSum += entry.total_duration_sec
          breakdown[number] = {
            calls: entry.total_calls,
            totalTime: entry.total_duration_sec,
            avgTime: entry.average_duration_sec,
          }
        }

        setTotalCalls(totalCallsSum)
        setTotalCallTime(totalDurationSum)
        setAverageCallTime(totalCallsSum > 0 ? totalDurationSum / totalCallsSum : 0)
        setByNumber(breakdown)
      } catch {
        console.error("Error fetching call stats")
      } finally {
        setLoading(false)
      }
    }
    fetchCallStats()
  }, [])

  const fmt = (s: number) => {
    const mins = Math.floor(s / 60)
    const secs = Math.floor(s % 60)
    return `${mins}m ${secs}s`
  }

  const callKpis: { key: string; tint: Tint; icon: React.ElementType; value: string; label: string; sublabel: string }[] = [
    { key: "totalCalls", tint: "mist",  icon: Phone,      value: totalCalls.toLocaleString(), label: "Total calls",    sublabel: "All time" },
    { key: "totalTime",  tint: "sand",  icon: Clock,      value: fmt(totalCallTime),           label: "Call duration",  sublabel: "Total time" },
    { key: "avgTime",    tint: "sage",  icon: TrendingUp, value: fmt(averageCallTime),          label: "Avg duration",   sublabel: "Per call" },
  ]

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            style={{
              height: 110,
              borderRadius: "var(--radius-lg)",
              background: "var(--graphite-100)",
              animation: "pulse 1.5s ease-in-out infinite",
              opacity: 1 - i * 0.15,
            }}
          />
        ))}
        <style>{`@keyframes pulse { 0%,100%{opacity:.6} 50%{opacity:.3} }`}</style>
      </div>
    )
  }

  return (
    <>
      {/* Section eyebrow */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
          padding: "0 2px",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--fg-3)",
          }}
        >
          Overview
        </span>
        {/* Live indicator */}
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "0.04em",
            color: "var(--signal-ink)",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--signal)",
              animation: "voxPulse 2s ease-in-out infinite",
              display: "inline-block",
            }}
          />
          live
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {callKpis.map((k) => (
          <KpiCard
            key={k.key}
            tint={k.tint}
            icon={k.icon}
            value={k.value}
            label={k.label}
            sublabel={k.sublabel}
            onClick={() => { setActiveKpi(k.key); setOpen(true) }}
          />
        ))}
        {extraKpis.map((k) => (
          <KpiCard
            key={k.title}
            tint={k.tint}
            icon={k.icon}
            value={k.value}
            label={k.title}
            sublabel={k.sublabel}
          />
        ))}
      </div>

      <style>{`@keyframes voxPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }`}</style>

      {/* Breakdown dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          style={{
            maxWidth: 520,
            borderRadius: "var(--radius-xl)",
            border: "1px solid var(--border-1)",
            background: "var(--paper)",
            boxShadow: "var(--shadow-xl)",
            padding: 28,
          }}
        >
          <DialogHeader>
            <DialogTitle style={{ fontSize: 17, fontWeight: 500, color: "var(--fg-1)" }}>
              {activeKpi === "totalCalls" && "Total calls"}
              {activeKpi === "totalTime"  && "Call duration"}
              {activeKpi === "avgTime"    && "Avg duration"}
            </DialogTitle>
            <DialogDescription style={{ fontSize: 13, color: "var(--fg-3)", marginTop: 2 }}>
              Breakdown by phone number
            </DialogDescription>
          </DialogHeader>

          <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Summary value */}
            <div
              style={{
                padding: "16px 20px",
                borderRadius: "var(--radius-md)",
                background: "var(--graphite-50)",
                border: "1px solid var(--border-1)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "var(--fg-3)",
                  marginBottom: 6,
                }}
              >
                {activeKpi === "totalCalls" && "Total"}
                {activeKpi === "totalTime"  && "Total duration"}
                {activeKpi === "avgTime"    && "Average"}
              </div>
              <div
                style={{
                  fontSize: 36,
                  fontWeight: 300,
                  color: "var(--fg-1)",
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                }}
              >
                {activeKpi === "totalCalls" && totalCalls.toLocaleString()}
                {activeKpi === "totalTime"  && fmt(totalCallTime)}
                {activeKpi === "avgTime"    && fmt(averageCallTime)}
              </div>
            </div>

            {/* Per-number rows */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {Object.entries(byNumber).map(([num, stats]) => (
                <div
                  key={num}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 14px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-1)",
                    background: "var(--paper)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      color: "var(--fg-2)",
                    }}
                  >
                    {num}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      fontWeight: 500,
                      color: "var(--fg-1)",
                    }}
                  >
                    {activeKpi === "totalCalls" && `${stats.calls} calls`}
                    {activeKpi === "totalTime"  && fmt(stats.totalTime)}
                    {activeKpi === "avgTime"    && fmt(stats.avgTime)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
