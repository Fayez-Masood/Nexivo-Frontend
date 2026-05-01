"use client"

import React, { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Trash2,
  Download,
  X,
  Phone,
  Clock,
  MessageSquare,
  Filter,
  Calendar,
  Hash,
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type Message = {
  id: number
  user: number
  timestamp: string
  session_id: string
  type: string
  user_question: string
  assistant_response: string
  summary: string
  phonenumber: string
  caller_number: string
}

const Cookies = {
  get: (key: string) => {
    if (typeof document !== "undefined") {
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${key}=`)
      if (parts.length === 2) return parts.pop()?.split(";").shift()
    }
    return ""
  },
}

function CallsTab() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [pageLoading, setPageLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [conversationTotalPages, setConversationTotalPages] = useState(1)
  const [selectedSession, setSelectedSession] = useState<string | null>(null)
  const [viewType, setViewType] = useState<"transcript" | "summary" | null>(null)

  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState<"7days" | "10days" | "30days" | "custom" | "all">("all")
  const [customStart, setCustomStart] = useState("")
  const [customEnd, setCustomEnd] = useState("")
  const [triggerSearch, setTriggerSearch] = useState(0)
  const [showFilters, setShowFilters] = useState(false)

  const [assignedNumbers, setAssignedNumbers] = useState<string[]>([])
  const [numbersLoading, setNumbersLoading] = useState(false)
  const [selectedNumber, setSelectedNumber] = useState<string>("")

  const [pageInput, setPageInput] = useState("")

  const { toast } = useToast()

  const format = (d: Date) => d.toISOString().split("T")[0]

  const handleDelete = async (session_id: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/conversations/messages/delete-by-session/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${Cookies.get("Token") || ""}`,
          },
          body: JSON.stringify({ session_id }),
        }
      )
      if (!res.ok) throw new Error("Failed to delete conversation")
      setMessages((prev) => prev.filter((m) => m.session_id !== session_id))
      toast({ title: "Conversation deleted", description: `Session ${session_id} was removed.` })
    } catch (err: any) {
      toast({ title: "Error deleting conversation", description: err.message, variant: "destructive" })
    }
  }

  const exportCSV = () => {
    if (!messages || messages.length === 0) {
      toast({ title: "No data to export", description: "There are no messages to download.", variant: "destructive" })
      return
    }

    const grouped: Record<string, Message[]> = messages.reduce((acc, m) => {
      if (!acc[m.session_id]) acc[m.session_id] = []
      acc[m.session_id].push(m)
      return acc
    }, {} as Record<string, Message[]>)

    const headers = ["id", "session_id", "timestamp", "type", "user_question", "assistant_response", "summary", "phonenumber", "caller_number"]
    const rows: string[] = []

    Object.entries(grouped)
      .sort((a, b) => new Date(a[1][0].timestamp).getTime() - new Date(b[1][0].timestamp).getTime())
      .forEach(([session_id, msgs]) => {
        const sortedMsgs = msgs.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
        const firstMsg = sortedMsgs[0]
        const summaryMsg = sortedMsgs.find((m) => m.type === "summary")
        const phoneNumber = firstMsg.phonenumber || "Unknown"
        const callerNumber = firstMsg.caller_number || "N/A"
        const startedAt = firstMsg.timestamp
        const callDuration = summaryMsg
          ? Math.floor((new Date(summaryMsg.timestamp).getTime() - new Date(firstMsg.timestamp).getTime()) / 1000) + "s"
          : "N/A"

        rows.push(
          [`"Session Info"`, `"${session_id}"`, `"${startedAt}"`, `"${callDuration}"`, `"${phoneNumber}"`, `"${callerNumber}"`, `"Summary: ${summaryMsg?.summary?.replace(/"/g, '""') || "N/A"}"`, "", ""].join(",")
        )
        sortedMsgs.forEach((m) => {
          rows.push(headers.map((h) => {
            let val = (m as any)[h] ?? ""
            if (typeof val === "string") val = val.replace(/"/g, '""')
            return `"${val}"`
          }).join(","))
        })
        rows.push("")
      })

    const blob = new Blob([[headers.join(","), ...rows].join("\n")], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `conversations_export_${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast({ title: "Exported successfully", description: "Your CSV file is ready." })
  }

  const handlePageInputSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const pageNum = parseInt(pageInput)
      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= conversationTotalPages) {
        setCurrentPage(pageNum)
        setPageInput("")
      } else {
        toast({ title: "Invalid page number", description: `Enter 1–${conversationTotalPages}`, variant: "destructive" })
      }
    }
  }

  useEffect(() => {
    async function fetchNumbers() {
      try {
        setNumbersLoading(true)
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/public/company/get-twilio-phones`, {
          headers: { "Content-Type": "application/json", Authorization: `Token ${Cookies.get("Token") || ""}` },
        })
        const data = await res.json()
        setAssignedNumbers(data?.twilio_phone_numbers || [])
      } catch { /* silent */ } finally {
        setNumbersLoading(false)
      }
    }
    fetchNumbers()
  }, [])

  useEffect(() => {
    async function fetchMessages() {
      try {
        if (currentPage === 1) setLoading(true)
        else setPageLoading(true)

        const params = new URLSearchParams()
        params.append("page", currentPage.toString())
        if (searchTerm.trim()) params.append("search", searchTerm.trim())

        const today = new Date()
        if (dateFilter === "7days")  { const d = new Date(today); d.setDate(d.getDate() - 7);  params.append("date_from", format(d)); params.append("date_to", format(today)) }
        if (dateFilter === "10days") { const d = new Date(today); d.setDate(d.getDate() - 10); params.append("date_from", format(d)); params.append("date_to", format(today)) }
        if (dateFilter === "30days") { const d = new Date(today); d.setDate(d.getDate() - 30); params.append("date_from", format(d)); params.append("date_to", format(today)) }
        if (dateFilter === "custom" && customStart && customEnd) { params.append("date_from", customStart); params.append("date_to", customEnd) }
        if (selectedNumber) params.append("search", selectedNumber)

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/conversations/messages/conversations/?${params.toString()}`,
          { headers: { "Content-Type": "application/json", Authorization: `Token ${Cookies.get("Token") || ""}` } }
        )
        if (!res.ok) throw new Error("Failed to fetch messages")
        const data = await res.json()
        setMessages(data.results ? Object.values(data.results).flat() as Message[] : [])
        setConversationTotalPages(data.total_pages || 1)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
        setPageLoading(false)
      }
    }
    fetchMessages()
  }, [currentPage, triggerSearch, dateFilter, customStart, customEnd, selectedNumber])

  const grouped = messages.reduce<Record<string, Message[]>>((acc, msg) => {
    if (!acc[msg.session_id]) acc[msg.session_id] = []
    acc[msg.session_id].push(msg)
    return acc
  }, {})

  const sortedSessions = Object.entries(grouped).sort(
    (a, b) => new Date(b[1][0].timestamp).getTime() - new Date(a[1][0].timestamp).getTime()
  )

  const selectedMessages = selectedSession ? grouped[selectedSession] : null
  const latestSummary = selectedMessages?.find((m) => m.type === "summary") || null

  const formatDuration = (ms: number) => {
    const totalSec = Math.floor(ms / 1000)
    return `${Math.floor(totalSec / 60)}m ${totalSec % 60}s`
  }

  const formatTime = (ts: string) =>
    new Date(ts).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })

  if (loading)
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", background: "var(--canvas)", gap: 12 }}>
        <div style={{ width: 28, height: 28, border: "2px solid var(--border-2)", borderTopColor: "var(--signal)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <span style={{ fontSize: 13, color: "var(--fg-3)", fontFamily: "var(--font-mono)", letterSpacing: "0.04em" }}>Loading conversations…</span>
        <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      </div>
    )

  if (error)
    return <div style={{ padding: 32, color: "var(--danger)", fontSize: 14 }}>Error: {error}</div>

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "var(--canvas)" }}>
      {/* ── Left panel ── */}
      <div
        style={{
          width: selectedSession ? "40%" : "100%",
          display: "flex",
          flexDirection: "column",
          background: "var(--paper)",
          borderRight: "1px solid var(--border-1)",
          transition: "width var(--dur-base) var(--ease-out)",
          flexShrink: 0,
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 20px 0",
            borderBottom: "1px solid var(--border-1)",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--fg-3)", marginBottom: 2 }}>
                Conversations
              </div>
              <div style={{ fontSize: 15, fontWeight: 500, color: "var(--fg-1)", letterSpacing: "-0.01em" }}>
                Call History
              </div>
              <div style={{ fontSize: 12, color: "var(--fg-4)", marginTop: 2 }}>
                {sortedSessions.length} sessions
              </div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button
                onClick={exportCSV}
                title="Export CSV"
                style={{
                  width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center",
                  borderRadius: "var(--radius-sm)", border: "1px solid var(--border-2)",
                  background: "var(--paper)", cursor: "pointer", color: "var(--fg-2)",
                }}
              >
                <Download style={{ width: 14, height: 14 }} strokeWidth={1.5} />
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                title="Filters"
                style={{
                  width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center",
                  borderRadius: "var(--radius-sm)",
                  border: `1px solid ${showFilters ? "var(--signal-soft)" : "var(--border-2)"}`,
                  background: showFilters ? "var(--signal-soft)" : "var(--paper)",
                  cursor: "pointer",
                  color: showFilters ? "var(--signal-ink)" : "var(--fg-2)",
                }}
              >
                <Filter style={{ width: 14, height: 14 }} strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {/* Search */}
          <div style={{ position: "relative", marginBottom: 14 }}>
            <Search style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", width: 14, height: 14, color: "var(--fg-4)" }} strokeWidth={1.5} />
            <input
              style={{
                width: "100%", paddingLeft: 34, paddingRight: 12, paddingTop: 9, paddingBottom: 9,
                borderRadius: "var(--radius-sm)", border: "1px solid var(--border-1)",
                background: "var(--graphite-50)", fontSize: 13, color: "var(--fg-1)",
                outline: "none", boxSizing: "border-box",
              }}
              placeholder="Search conversations…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && setTriggerSearch((x) => x + 1)}
            />
          </div>

          {/* Filters panel */}
          {showFilters && (
            <div style={{ paddingBottom: 14, display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--fg-4)", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "var(--font-mono)", marginBottom: 5 }}>
                    <Hash style={{ width: 10, height: 10 }} strokeWidth={1.5} /> Phone
                  </div>
                  <select
                    value={selectedNumber}
                    onChange={(e) => { setSelectedNumber(e.target.value); setTriggerSearch((x) => x + 1) }}
                    style={{
                      width: "100%", padding: "8px 10px", borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--border-1)", background: "var(--graphite-50)",
                      fontSize: 12, color: "var(--fg-1)", outline: "none",
                    }}
                  >
                    <option value="">All Numbers</option>
                    {assignedNumbers.map((num, i) => <option key={i} value={num}>{num}</option>)}
                  </select>
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--fg-4)", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "var(--font-mono)", marginBottom: 5 }}>
                    <Calendar style={{ width: 10, height: 10 }} strokeWidth={1.5} /> Period
                  </div>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value as any)}
                    style={{
                      width: "100%", padding: "8px 10px", borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--border-1)", background: "var(--graphite-50)",
                      fontSize: 12, color: "var(--fg-1)", outline: "none",
                    }}
                  >
                    <option value="all">All Time</option>
                    <option value="7days">Last 7 Days</option>
                    <option value="10days">Last 10 Days</option>
                    <option value="30days">Last 30 Days</option>
                    <option value="custom">Custom Range</option>
                  </select>
                </div>
              </div>
              {dateFilter === "custom" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <input type="date" value={customStart} onChange={(e) => setCustomStart(e.target.value)}
                    style={{ padding: "8px 10px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-1)", background: "var(--graphite-50)", fontSize: 12, color: "var(--fg-1)", outline: "none" }} />
                  <input type="date" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)}
                    style={{ padding: "8px 10px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-1)", background: "var(--graphite-50)", fontSize: 12, color: "var(--fg-1)", outline: "none" }} />
                </div>
              )}
              <button
                onClick={() => { setSearchTerm(""); setDateFilter("all"); setCustomStart(""); setCustomEnd(""); setSelectedNumber(""); setTriggerSearch((x) => x + 1) }}
                style={{
                  padding: "7px 12px", borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border-2)", background: "var(--paper)",
                  fontSize: 12, color: "var(--fg-2)", cursor: "pointer", alignSelf: "flex-start",
                }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Session list */}
        <div style={{ flex: 1, overflowY: "auto", position: "relative" }}>
          {pageLoading && (
            <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
              <div style={{ width: 22, height: 22, border: "2px solid var(--border-2)", borderTopColor: "var(--signal)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            </div>
          )}
          <div style={{ padding: "8px 10px", display: "flex", flexDirection: "column", gap: 4 }}>
            {sortedSessions.map(([session_id, msgs]) => {
              const sortedMsgs = [...msgs].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
              const startedAt = new Date(sortedMsgs[0].timestamp)
              const summaryMsg = sortedMsgs.find((m) => m.type === "summary")
              const endedAtMs = summaryMsg
                ? new Date(summaryMsg.timestamp).getTime() + 15000
                : new Date(sortedMsgs[sortedMsgs.length - 1].timestamp).getTime()
              const callDuration = formatDuration(endedAtMs - startedAt.getTime())
              const phoneNumber = msgs[0]?.phonenumber || "Unknown"
              const callerNumber = msgs.find((m) => m.caller_number)?.caller_number || "N/A"
              const previewText = summaryMsg
                ? summaryMsg.summary.split(" ").slice(0, 8).join(" ") + "…"
                : "Tap to view transcript"
              const isSelected = selectedSession === session_id

              return (
                <SessionRow
                  key={session_id}
                  session_id={session_id}
                  callerNumber={callerNumber}
                  phoneNumber={phoneNumber}
                  previewText={previewText}
                  callDuration={callDuration}
                  msgCount={msgs.length}
                  time={formatTime(sortedMsgs[0].timestamp)}
                  isSelected={isSelected}
                  onSelect={() => { setSelectedSession(session_id); setViewType("transcript") }}
                  onDelete={() => handleDelete(session_id)}
                />
              )
            })}
          </div>
        </div>

        {/* Pagination */}
        <div style={{ borderTop: "1px solid var(--border-1)", padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, flexShrink: 0 }}>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            style={{
              padding: 6, borderRadius: "var(--radius-xs)", border: "1px solid var(--border-1)",
              background: "var(--paper)", cursor: currentPage === 1 ? "not-allowed" : "pointer",
              opacity: currentPage === 1 ? 0.35 : 1, color: "var(--fg-2)", display: "flex",
            }}
          >
            <ChevronLeft style={{ width: 14, height: 14 }} strokeWidth={1.5} />
          </button>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg-2)" }}>
            {currentPage} / {conversationTotalPages}
          </span>
          <input
            type="text"
            value={pageInput}
            onChange={(e) => setPageInput(e.target.value)}
            onKeyDown={handlePageInputSubmit}
            placeholder="Go to"
            style={{
              width: 56, padding: "5px 8px", textAlign: "center",
              borderRadius: "var(--radius-xs)", border: "1px solid var(--border-1)",
              fontSize: 12, color: "var(--fg-1)", outline: "none",
              fontFamily: "var(--font-mono)",
            }}
          />
          <button
            disabled={currentPage === conversationTotalPages}
            onClick={() => setCurrentPage((p) => Math.min(conversationTotalPages, p + 1))}
            style={{
              padding: 6, borderRadius: "var(--radius-xs)", border: "1px solid var(--border-1)",
              background: "var(--paper)", cursor: currentPage === conversationTotalPages ? "not-allowed" : "pointer",
              opacity: currentPage === conversationTotalPages ? 0.35 : 1, color: "var(--fg-2)", display: "flex",
            }}
          >
            <ChevronRight style={{ width: 14, height: 14 }} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* ── Right panel ── */}
      {selectedSession && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "var(--canvas)", overflow: "hidden" }}>
          {/* Panel header */}
          <div
            style={{
              padding: "14px 20px",
              borderBottom: "1px solid var(--border-1)",
              background: "var(--paper)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 36, height: 36, borderRadius: 9, background: "var(--mist-bg)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <Phone style={{ width: 16, height: 16, color: "var(--mist-ink)" }} strokeWidth={1.5} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: "var(--fg-1)" }}>
                  {selectedMessages?.find((m) => m.caller_number)?.caller_number || "Unknown"}
                </div>
                <div style={{ fontSize: 11, color: "var(--fg-4)", fontFamily: "var(--font-mono)" }}>
                  {selectedMessages?.[0]?.phonenumber || "Unknown"}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {(["transcript", "summary"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setViewType(t)}
                  style={{
                    padding: "6px 14px", borderRadius: "var(--radius-sm)",
                    border: `1px solid ${viewType === t ? "var(--signal-soft)" : "var(--border-1)"}`,
                    background: viewType === t ? "var(--signal-soft)" : "transparent",
                    color: viewType === t ? "var(--signal-ink)" : "var(--fg-3)",
                    fontSize: 12, fontWeight: 500, cursor: "pointer",
                    transition: "all var(--dur-fast) var(--ease-out)",
                  }}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
              <button
                onClick={() => { setSelectedSession(null); setViewType(null) }}
                style={{
                  width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center",
                  borderRadius: "var(--radius-xs)", border: "1px solid var(--border-1)",
                  background: "var(--paper)", cursor: "pointer", color: "var(--fg-3)", marginLeft: 4,
                }}
              >
                <X style={{ width: 13, height: 13 }} strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {/* Messages / Summary */}
          <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px", display: "flex", flexDirection: "column", gap: 16 }}>
            {viewType === "transcript" && (() => {
              const nonSummaryMsgs = selectedMessages
                ?.filter((m) => m.type !== "summary")
                .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

              if (!nonSummaryMsgs || nonSummaryMsgs.length === 0)
                return (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, gap: 10, color: "var(--fg-3)" }}>
                    <MessageSquare style={{ width: 28, height: 28, color: "var(--fg-4)" }} strokeWidth={1.5} />
                    <span style={{ fontSize: 13 }}>No transcript available</span>
                  </div>
                )

              return nonSummaryMsgs.map((m) => (
                <div key={m.id} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {/* User bubble */}
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <div style={{ maxWidth: "68%" }}>
                      <div
                        style={{
                          background: "var(--signal-soft)",
                          borderRadius: "var(--radius-lg)",
                          borderBottomRightRadius: 4,
                          padding: "10px 14px",
                          border: "1px solid var(--border-1)",
                        }}
                      >
                        <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--fg-1)", margin: 0 }}>{m.user_question}</p>
                      </div>
                      <div style={{ fontSize: 11, color: "var(--fg-4)", textAlign: "right", marginTop: 4, fontFamily: "var(--font-mono)" }}>
                        {formatTime(m.timestamp)}
                      </div>
                    </div>
                  </div>
                  {/* Assistant bubble */}
                  <div style={{ display: "flex", justifyContent: "flex-start" }}>
                    <div style={{ maxWidth: "68%" }}>
                      <div
                        style={{
                          background: "var(--paper)",
                          borderRadius: "var(--radius-lg)",
                          borderBottomLeftRadius: 4,
                          padding: "10px 14px",
                          border: "1px solid var(--border-1)",
                          boxShadow: "var(--shadow-sm)",
                        }}
                      >
                        <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--fg-1)", margin: 0 }}>{m.assistant_response}</p>
                      </div>
                      <div style={{ fontSize: 11, color: "var(--fg-4)", marginTop: 4, fontFamily: "var(--font-mono)" }}>
                        {formatTime(m.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            })()}

            {viewType === "summary" && (
              latestSummary ? (
                <div
                  style={{
                    maxWidth: 600, width: "100%", margin: "0 auto",
                    background: "var(--paper)", borderRadius: "var(--radius-lg)",
                    border: "1px solid var(--border-1)", padding: "24px 28px",
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 9, background: "var(--sand-bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <MessageSquare style={{ width: 16, height: 16, color: "var(--sand-ink)" }} strokeWidth={1.5} />
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: "var(--fg-1)" }}>Call Summary</div>
                      <div style={{ fontSize: 11, color: "var(--fg-4)", fontFamily: "var(--font-mono)" }}>
                        {new Date(latestSummary.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--fg-2)", whiteSpace: "pre-wrap", margin: 0 }}>
                    {latestSummary.summary}
                  </p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, gap: 10, color: "var(--fg-3)" }}>
                  <MessageSquare style={{ width: 28, height: 28, color: "var(--fg-4)" }} strokeWidth={1.5} />
                  <span style={{ fontSize: 13 }}>No summary available yet</span>
                </div>
              )
            )}
          </div>
        </div>
      )}

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

function SessionRow({
  session_id, callerNumber, phoneNumber, previewText, callDuration, msgCount, time, isSelected, onSelect, onDelete,
}: {
  session_id: string; callerNumber: string; phoneNumber: string; previewText: string
  callDuration: string; msgCount: number; time: string; isSelected: boolean
  onSelect: () => void; onDelete: () => void
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "10px 12px", borderRadius: "var(--radius-md)", cursor: "pointer",
        background: isSelected ? "var(--mist-bg)" : hovered ? "var(--graphite-50)" : "transparent",
        border: `1px solid ${isSelected ? "var(--signal-soft)" : hovered ? "var(--border-2)" : "var(--border-1)"}`,
        transition: "background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        <div
          style={{
            width: 34, height: 34, borderRadius: 8, flexShrink: 0,
            background: isSelected ? "var(--signal-soft)" : "var(--graphite-100)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <Phone style={{ width: 14, height: 14, color: isSelected ? "var(--signal-ink)" : "var(--fg-4)" }} strokeWidth={1.5} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: "var(--fg-1)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {callerNumber}
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-4)", flexShrink: 0, marginLeft: 8 }}>{time}</span>
          </div>
          <div style={{ fontSize: 11, color: "var(--fg-4)", marginBottom: 3, fontFamily: "var(--font-mono)" }}>{phoneNumber}</div>
          <div style={{ fontSize: 12, color: "var(--fg-3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 5 }}>{previewText}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--fg-4)", fontFamily: "var(--font-mono)" }}>
              <Clock style={{ width: 10, height: 10 }} strokeWidth={1.5} />{callDuration}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--fg-4)", fontFamily: "var(--font-mono)" }}>
              <MessageSquare style={{ width: 10, height: 10 }} strokeWidth={1.5} />{msgCount}
            </span>
          </div>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild onClick={(e) => e.stopPropagation()}>
            <button
              style={{
                width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center",
                borderRadius: "var(--radius-xs)", border: "1px solid transparent", background: "transparent",
                cursor: "pointer", color: "var(--fg-4)", flexShrink: 0,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--danger-soft)"; e.currentTarget.style.color = "var(--danger)" }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--fg-4)" }}
            >
              <Trash2 style={{ width: 12, height: 12 }} strokeWidth={1.5} />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent style={{ background: "var(--paper)", border: "1px solid var(--border-1)", borderRadius: "var(--radius-xl)" }}>
            <AlertDialogHeader>
              <AlertDialogTitle style={{ color: "var(--fg-1)", fontSize: 16 }}>Delete this conversation?</AlertDialogTitle>
              <AlertDialogDescription style={{ color: "var(--fg-3)", fontSize: 13 }}>
                This will permanently delete all messages under this session.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel style={{ background: "var(--paper)", border: "1px solid var(--border-2)", color: "var(--fg-1)" }}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete} style={{ background: "var(--danger)", border: "1px solid var(--danger)", color: "#fff" }}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}

export default CallsTab
