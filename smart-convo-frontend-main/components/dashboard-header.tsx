"use client"

import { useEffect, useState } from "react"
import { Bell, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import { useToast } from "@/hooks/use-toast"

interface ActionLog {
  id: number
  content_type: string
  user: string
  action: string
  timestamp: string
  object_id: string
  description: string
}

export function DashboardHeader() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [primaryAgentName, setPrimaryAgentName] = useState<string | null>(null)
  const [logs, setLogs] = useState<ActionLog[]>([])
  const [userName, setUserName] = useState("")

  // Fetch user name from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser)
          setUserName(userData.name || "")
        } catch {
          setUserName("")
        }
      }
    }
  }, [])

  // Fetch Primary Agent
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/agents/agents/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${Cookies.get("Token") || ""}`,
          },
        })
        if (!res.ok) throw new Error("Failed to fetch agents")
        const data = await res.json()
        if (Array.isArray(data)) {
          const primary = data.find((a) => a.primary === true)
          if (primary) setPrimaryAgentName(primary.name)
        }
      } catch (err: any) {
        toast({ title: "Error", description: err.message || "Failed to fetch agents", variant: "destructive" })
      }
    }
    fetchAgents()
  }, [toast])

  // Fetch Logs
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/reports/action-logs/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${Cookies.get("Token") || ""}`,
          },
        })
        if (!res.ok) throw new Error("Failed to fetch logs")
        const data = await res.json()
        const sorted = [...data].sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
        setLogs(sorted.slice(0, 5))
      } catch (err: any) {
        toast({ title: "Error", description: err.message || "Failed to fetch logs", variant: "destructive" })
      }
    }
    fetchLogs()
  }, [toast])

  const handleLogout = () => {
    Cookies.remove("Token")
    Cookies.remove("adminToken")
    Cookies.remove("TempToken")
    localStorage.removeItem("user")
    localStorage.removeItem("userAuth")
    localStorage.removeItem("loginType")
    localStorage.removeItem("tutorial_setup")
    logout()
    router.push("/login")
  }

  const initials = (userName || user?.name || user?.email || "U")
    .split(" ")
    .map((w: string) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <header
      style={{
        height: 60,
        borderBottom: "1px solid var(--border-1)",
        padding: "0 28px",
        background: "var(--paper)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
        position: "sticky",
        top: 0,
        zIndex: 40,
      }}
    >
      {/* Left — page greeting */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div>
          <div
            style={{
              fontSize: 17,
              fontWeight: 500,
              color: "var(--fg-1)",
              letterSpacing: "-0.01em",
              lineHeight: 1.2,
            }}
          >
            {userName ? `Welcome, ${userName}` : "Dashboard"}
          </div>
          {primaryAgentName && (
            <div
              style={{
                marginTop: 2,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {/* Live dot */}
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "var(--signal)",
                  display: "inline-block",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  letterSpacing: "0.04em",
                  color: "var(--signal-ink)",
                }}
              >
                {primaryAgentName}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Right — actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {/* Activity log bell */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              style={{
                position: "relative",
                width: 36,
                height: 36,
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border-2)",
                background: "var(--paper)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "var(--fg-2)",
                transition: "background var(--dur-fast) var(--ease-out)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--graphite-50)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--paper)")}
            >
              <Bell style={{ width: 15, height: 15 }} strokeWidth={1.5} />
              {logs.length > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: 6,
                    right: 6,
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "var(--signal)",
                    border: "1.5px solid var(--paper)",
                  }}
                />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            style={{
              width: 320,
              padding: 12,
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--border-1)",
              background: "var(--paper)",
              boxShadow: "var(--shadow-md)",
            }}
          >
            {/* Header row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 8,
                padding: "0 4px",
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
                Recent activity
              </span>
              {logs.length > 0 && (
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: "var(--signal-ink)",
                    background: "var(--signal-soft)",
                    padding: "2px 8px",
                    borderRadius: "var(--radius-pill)",
                  }}
                >
                  {logs.length}
                </span>
              )}
            </div>
            <DropdownMenuSeparator style={{ background: "var(--border-1)", margin: "0 0 8px" }} />

            {logs.length > 0 ? (
              <div style={{ maxHeight: 280, overflowY: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
                {logs.map((log) => {
                  const actionColor =
                    log.action === "create"
                      ? { bg: "var(--success-soft)", ink: "var(--success)" }
                      : log.action === "delete"
                      ? { bg: "var(--danger-soft)", ink: "var(--danger)" }
                      : { bg: "var(--graphite-100)", ink: "var(--graphite-700)" }

                  return (
                    <DropdownMenuItem
                      key={log.id}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        padding: "10px 12px",
                        borderRadius: "var(--radius-md)",
                        cursor: "default",
                        gap: 6,
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", width: "100%", gap: 8 }}>
                        <span style={{ fontSize: 13, color: "var(--fg-1)", lineHeight: 1.4, flex: 1 }}>
                          {log.description}
                        </span>
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 10,
                            letterSpacing: "0.04em",
                            padding: "2px 7px",
                            borderRadius: "var(--radius-pill)",
                            background: actionColor.bg,
                            color: actionColor.ink,
                            flexShrink: 0,
                            alignSelf: "flex-start",
                          }}
                        >
                          {log.action}
                        </span>
                      </div>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 10,
                          color: "var(--fg-4)",
                          letterSpacing: "0.02em",
                        }}
                      >
                        {new Date(log.timestamp).toLocaleString()} · {log.user}
                      </span>
                    </DropdownMenuItem>
                  )
                })}
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "24px 0",
                  gap: 8,
                }}
              >
                <Bell style={{ width: 18, height: 18, color: "var(--fg-4)" }} strokeWidth={1.5} />
                <p style={{ fontSize: 13, color: "var(--fg-3)", margin: 0 }}>No recent activity</p>
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Divider */}
        <div
          style={{
            width: 1,
            height: 20,
            background: "var(--border-1)",
            margin: "0 4px",
          }}
        />

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "5px 10px 5px 6px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-2)",
                background: "var(--paper)",
                cursor: "pointer",
                transition: "background var(--dur-fast) var(--ease-out)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--graphite-50)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--paper)")}
            >
              {/* Avatar */}
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: "var(--sand-bg)",
                  color: "var(--sand-ink)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  fontWeight: 500,
                  flexShrink: 0,
                }}
              >
                {initials}
              </div>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--fg-1)",
                  maxWidth: 120,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user?.email}
              </span>
              <ChevronDown style={{ width: 13, height: 13, color: "var(--fg-4)" }} strokeWidth={1.5} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            style={{
              width: 200,
              padding: 6,
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--border-1)",
              background: "var(--paper)",
              boxShadow: "var(--shadow-md)",
            }}
          >
            <DropdownMenuItem
              onClick={() => router.push("/dashboard/account-settings/billing")}
              style={{
                padding: "8px 12px",
                borderRadius: "var(--radius-sm)",
                fontSize: 13,
                color: "var(--fg-1)",
                cursor: "pointer",
              }}
            >
              Billing
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push("/dashboard/account-settings/personal-settings")}
              style={{
                padding: "8px 12px",
                borderRadius: "var(--radius-sm)",
                fontSize: 13,
                color: "var(--fg-1)",
                cursor: "pointer",
              }}
            >
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator style={{ background: "var(--border-1)", margin: "4px 0" }} />
            <DropdownMenuItem
              onClick={handleLogout}
              style={{
                padding: "8px 12px",
                borderRadius: "var(--radius-sm)",
                fontSize: 13,
                color: "var(--danger)",
                cursor: "pointer",
              }}
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
