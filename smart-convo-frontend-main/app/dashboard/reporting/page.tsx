"use client"


import { useState, useEffect, useMemo } from "react"
import Cookies from "js-cookie"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2, TrendingUp, Activity, CheckCircle2, XCircle, AlertCircle, BarChart3, Check } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"


interface EventData {
  id: number
  event_type: string
  status: string
  status_code: number | null
  metadata: any
  company: number
  created_at: string
}


interface PieSegment {
  eventType: string
  status: string
  count: number
  percentage: number
  color: string
}


const STATUS_COLORS: Record<string, string> = {
  success: "#2d5555",
  failure: "#c0392b",
  pending: "#b8860b",
  error: "#c0392b",
}


const STATUS_DISPLAY: Record<string, string> = {
  error: "failure",
  success: "success",
};


const GRADIENT_COLORS = [
  "#2d5555", "#4a7c6e", "#7b9ea0", "#a8c5b5",
  "#c9a87c", "#d4b896", "#8a9fa0", "#6b8fa0",
  "#5c7a7a", "#3d6b6b", "#92a87a", "#b5c4a0"
]


function PieChart({ segments }: { segments: PieSegment[] }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  
  // If only one segment, render a full circle
  if (segments.length === 1) {
    return (
      <div className="relative w-full max-w-md mx-auto">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="gradient-single" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={segments[0].color} stopOpacity="1" />
              <stop offset="100%" stopColor={segments[0].color} stopOpacity="0.7" />
            </linearGradient>
          </defs>
          <circle 
            cx="50" 
            cy="50" 
            r="40" 
            fill={segments[0].color}
            className="drop-shadow-2xl"
          />
          <circle cx="50" cy="50" r="15" fill="#f8fafc" className="drop-shadow-xl" />
        </svg>
        
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-white/95 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-2xl border border-slate-200">
            <p className="text-slate-900 text-sm font-medium">{segments[0].eventType}</p>
            <p className="text-slate-600 text-xs">{segments[0].status}</p>
            <p className="text-slate-900 text-lg font-bold text-center mt-1">100%</p>
          </div>
        </div>
      </div>
    )
  }
  
  let currentAngle = 0
  const paths = segments.map((segment, index) => {
    const angle = (segment.percentage / 100) * 360
    const startAngle = currentAngle
    const endAngle = currentAngle + angle
    currentAngle = endAngle


    const startRad = (startAngle - 90) * (Math.PI / 180)
    const endRad = (endAngle - 90) * (Math.PI / 180)


    const x1 = 50 + 40 * Math.cos(startRad)
    const y1 = 50 + 40 * Math.sin(startRad)
    const x2 = 50 + 40 * Math.cos(endRad)
    const y2 = 50 + 40 * Math.sin(endRad)


    const largeArc = angle > 180 ? 1 : 0


    const scale = hoveredIndex === index ? 1.05 : 1
    const radius = hoveredIndex === index ? 42 : 40


    const path = `M 50 50 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`


    return (
      <g key={index} transform={`scale(${scale}) translate(${scale === 1.05 ? -2.5 : 0}, ${scale === 1.05 ? -2.5 : 0})`}>
        <path
          d={path}
          fill={segment.color}
          opacity={hoveredIndex === null || hoveredIndex === index ? 1 : 0.4}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          className="cursor-pointer transition-all duration-300"
          style={{
            filter: hoveredIndex === index ? "drop-shadow(0 8px 16px rgba(0,0,0,0.3))" : "none"
          }}
        />
      </g>
    )
  })


  return (
    <div className="relative w-full max-w-md mx-auto">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          {segments.map((segment, index) => (
            <linearGradient key={index} id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={segment.color} stopOpacity="1" />
              <stop offset="100%" stopColor={segment.color} stopOpacity="0.7" />
            </linearGradient>
          ))}
        </defs>
        <circle cx="50" cy="50" r="20" fill="#f8fafc" opacity="0.95" />
        {paths}
        <circle cx="50" cy="50" r="15" fill="#f8fafc" className="drop-shadow-xl" />
      </svg>
      
      {hoveredIndex !== null && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-white/95 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-2xl border border-slate-200">
            <p className="text-slate-900 text-sm font-medium">{segments[hoveredIndex].eventType}</p>
            <p className="text-slate-600 text-xs">{segments[hoveredIndex].status}</p>
            <p className="text-slate-900 text-lg font-bold text-center mt-1">
              {segments[hoveredIndex].percentage.toFixed(1)}%
            </p>
          </div>
        </div>
      )}
    </div>
  )
}


export default function InsightsPage() {
  const { toast } = useToast()
  const [allEvents, setAllEvents] = useState<EventData[]>([])
  const [loading, setLoading] = useState(false)
  const [tempSelectedEventTypes, setTempSelectedEventTypes] = useState<string[]>(["all"])
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>(["all"])
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)


  useEffect(() => {
    fetchEvents()
  }, [])


  const fetchEvents = async () => {
    try {
      setLoading(true)
      const url = "https://apii.pentagonai.co/api/reports/events/"


      const res = await fetch(url, {
        headers: {
          Authorization: `Token ${Cookies.get("Token") || ""}`,
          "Content-Type": "application/json",
        },
      })


      if (!res.ok) throw new Error("Failed to fetch events")
      const data = await res.json()
      setAllEvents(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching events:", error)
      toast({
        title: "Error",
        description: "Failed to load insights data.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }


  const filteredEvents = useMemo(() => {
    return allEvents.filter(event => {
      const eventTypeMatch = selectedEventTypes.includes("all") || selectedEventTypes.includes(event.event_type)
      const statusMatch = selectedStatus === "all" || event.status === selectedStatus
      return eventTypeMatch && statusMatch
    })
  }, [allEvents, selectedEventTypes, selectedStatus])


  const uniqueEventTypes = useMemo(() => {
    const types = new Set(allEvents.map(e => e.event_type))
    return Array.from(types)
  }, [allEvents])


  const uniqueStatuses = useMemo(() => {
    const statuses = new Set(allEvents.map(e => e.status))
    return ["all", ...Array.from(statuses)]
  }, [allEvents])


  const handleEventTypeToggle = (eventType: string) => {
    if (eventType === "all") {
      setTempSelectedEventTypes(["all"])
    } else {
      setTempSelectedEventTypes(prev => {
        const filtered = prev.filter(t => t !== "all")
        if (filtered.includes(eventType)) {
          const newSelection = filtered.filter(t => t !== eventType)
          return newSelection.length === 0 ? ["all"] : newSelection
        } else {
          return [...filtered, eventType]
        }
      })
    }
  }


  const handleApplyEventTypes = () => {
    setSelectedEventTypes(tempSelectedEventTypes)
    setIsPopoverOpen(false)
  }


  const getEventTypeDisplayText = () => {
    if (selectedEventTypes.includes("all")) {
      return "All Events"
    }
    if (selectedEventTypes.length === 1) {
      return selectedEventTypes[0]
    }
    return `${selectedEventTypes.length} events selected`
  }


  const pieSegments = useMemo(() => {
    const groupedData = new Map<string, number>()
    
    // When specific event types are selected (not "all")
    if (!selectedEventTypes.includes("all")) {
      if (selectedEventTypes.length === 1) {
        // Single event type selected - group by status only
        filteredEvents.forEach(event => {
          const key = event.status
          groupedData.set(key, (groupedData.get(key) || 0) + 1)
        })


        const total = filteredEvents.length
        const segments: PieSegment[] = []
        let colorIndex = 0


        groupedData.forEach((count, status) => {
          segments.push({
            eventType: selectedEventTypes[0],
            status,
            count,
            percentage: (count / total) * 100,
            color: GRADIENT_COLORS[colorIndex % GRADIENT_COLORS.length],
          })
          colorIndex++
        })


        return segments.sort((a, b) => b.count - a.count)
      } else {
        // Multiple event types selected - group by event type and status
        filteredEvents.forEach(event => {
          const key = `${event.event_type}|${event.status}`
          groupedData.set(key, (groupedData.get(key) || 0) + 1)
        })


        const total = filteredEvents.length
        const segments: PieSegment[] = []
        let colorIndex = 0


        groupedData.forEach((count, key) => {
          const [eventType, status] = key.split("|")
          segments.push({
            eventType,
            status,
            count,
            percentage: (count / total) * 100,
            color: GRADIENT_COLORS[colorIndex % GRADIENT_COLORS.length],
          })
          colorIndex++
        })


        return segments.sort((a, b) => b.count - a.count)
      }
    }
    
    // When "all" event types are selected - original behavior
    filteredEvents.forEach(event => {
      const key = `${event.event_type}|${event.status}`
      groupedData.set(key, (groupedData.get(key) || 0) + 1)
    })


    const total = filteredEvents.length
    const segments: PieSegment[] = []
    let colorIndex = 0


    groupedData.forEach((count, key) => {
      const [eventType, status] = key.split("|")
      segments.push({
        eventType,
        status,
        count,
        percentage: (count / total) * 100,
        color: GRADIENT_COLORS[colorIndex % GRADIENT_COLORS.length],
      })
      colorIndex++
    })


    return segments.sort((a, b) => b.count - a.count)
  }, [filteredEvents, selectedEventTypes])


  const statusStats = useMemo(() => {
    const stats = {
      success: 0,
      failure: 0,
      pending: 0,
      other: 0,
    }
    filteredEvents.forEach(event => {
      if (event.status === "success") stats.success++
      else if (event.status === "error") stats.failure++
      else if (event.status === "pending") stats.pending++
      else stats.other++
    })
    return stats
  }, [filteredEvents])

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--canvas)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
        <div style={{ width: 28, height: 28, border: "2px solid var(--border-2)", borderTopColor: "var(--signal)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <span style={{ fontSize: 13, color: "var(--fg-3)", fontFamily: "var(--font-mono)", letterSpacing: "0.04em" }}>Loading insights…</span>
        <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      </div>
    )
  }


  return (
    <div style={{ minHeight: "100vh", background: "var(--canvas)" }}>
      {/* Page header */}
      <div style={{ background: "var(--paper)", borderBottom: "1px solid var(--border-1)", padding: "28px 32px" }}>
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--fg-3)", marginBottom: 6 }}>
            Reporting
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--fg-1)", letterSpacing: "-0.02em", margin: 0, lineHeight: 1.2 }}>
            Insights & Analytics
          </h1>
          <p style={{ fontSize: 13, color: "var(--fg-3)", marginTop: 4 }}>
            Real-time event monitoring and performance metrics
          </p>
        </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-20">
            {[
              { bg: "var(--sage-bg)",  ink: "var(--sage-ink)",  icon: CheckCircle2, value: statusStats.success,      label: "Success" },
              { bg: "var(--blush-bg)", ink: "var(--blush-ink)", icon: XCircle,      value: statusStats.failure,      label: "Failure" },
              { bg: "var(--butter-bg)",ink: "var(--butter-ink)",icon: AlertCircle,  value: statusStats.pending,      label: "Pending" },
              { bg: "var(--sky-bg)",   ink: "var(--sky-ink)",   icon: Activity,     value: filteredEvents.length,    label: "Total Events" },
            ].map(({ bg, ink, icon: Icon, value, label }) => (
              <div key={label} style={{ background: "var(--paper)", border: "1px solid var(--border-1)", borderRadius: "var(--radius-lg)", padding: "16px 18px", display: "flex", alignItems: "center", gap: 12, boxShadow: "var(--shadow-sm)" }}>
                <div style={{ width: 38, height: 38, borderRadius: 9, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon style={{ width: 17, height: 17, color: ink }} strokeWidth={1.5} />
                </div>
                <div>
                  <div style={{ fontSize: 26, fontWeight: 300, color: "var(--fg-1)", letterSpacing: "-0.03em", lineHeight: 1 }}>{value}</div>
                  <div style={{ fontSize: 11, fontWeight: 500, color: "var(--fg-4)", marginTop: 3, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      <div className="max-w-7xl mx-auto px-8 py-12 space-y-8">
        {/* Filters */}
        <div style={{ background: "var(--paper)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-1)", overflow: "hidden" }}>
          <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border-1)", display: "flex", alignItems: "center", gap: 8 }}>
            <TrendingUp style={{ width: 16, height: 16, color: "var(--fg-3)" }} strokeWidth={1.5} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: "var(--fg-1)" }}>Filter Analytics</div>
              <div style={{ fontSize: 12, color: "var(--fg-3)", marginTop: 2 }}>Refine your insights by event type and status</div>
            </div>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-light text-slate-700">Event Type</label>
                <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full justify-between bg-white border-slate-200 text-slate-900 hover:bg-slate-50 rounded-xl font-light"
                    >
                      {getEventTypeDisplayText()}
                      <span className="ml-2">▼</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0 rounded-xl" align="start">
                    <div className="p-3 space-y-2 max-h-80 overflow-y-auto">
                      <div className="flex items-center space-x-2 p-2 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors">
                        <Checkbox
                          id="event-all"
                          checked={tempSelectedEventTypes.includes("all")}
                          onCheckedChange={() => handleEventTypeToggle("all")}
                        />
                        <label
                          htmlFor="event-all"
                          className="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                        >
                          All Events
                        </label>
                      </div>
                      {uniqueEventTypes.map(type => (
                        <div key={type} className="flex items-center space-x-2 p-2 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors">
                          <Checkbox
                            id={`event-${type}`}
                            checked={tempSelectedEventTypes.includes(type) && !tempSelectedEventTypes.includes("all")}
                            onCheckedChange={() => handleEventTypeToggle(type)}
                          />
                          <label
                            htmlFor={`event-${type}`}
                            className="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                          >
                            {type}
                          </label>
                        </div>
                      ))}
                    </div>
                    <div className="border-t p-3">
                      <button 
                        onClick={handleApplyEventTypes}
                        className="w-full px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-all duration-200 text-sm font-light"
                      >
                        Apply
                      </button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-light text-slate-700">Status</label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="bg-white border-slate-200 text-slate-900 rounded-xl font-light">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200 rounded-xl">
                    {uniqueStatuses.map(status => (
                      <SelectItem key={status} value={status} className="text-slate-900 font-light">
                        {status === "all" ? "All Statuses" : (STATUS_DISPLAY[status] || status)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        {filteredEvents.length === 0 ? (
          <div style={{ background: "var(--paper)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-1)", padding: "48px 24px", textAlign: "center" }}>
            <p style={{ fontSize: 14, color: "var(--fg-3)" }}>No events found matching your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pie Chart */}
            <div style={{ background: "var(--paper)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-1)", overflow: "hidden" }}>
              <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border-1)" }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: "var(--fg-1)", textAlign: "center" }}>Event Distribution</div>
                <div style={{ fontSize: 12, color: "var(--fg-3)", textAlign: "center", marginTop: 2 }}>
                  {selectedEventTypes.includes("all")
                    ? "Visual breakdown by event type and status"
                    : selectedEventTypes.length === 1
                    ? `Status breakdown for ${selectedEventTypes[0]}`
                    : "Visual breakdown by selected event types and status"}
                </div>
              </div>
              <div className="py-8 px-6">
                <PieChart segments={pieSegments} />
              </div>
            </div>

            {/* Legend */}
            <div style={{ background: "var(--paper)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-1)", overflow: "hidden" }}>
              <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border-1)" }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: "var(--fg-1)" }}>Legend</div>
                <div style={{ fontSize: 12, color: "var(--fg-3)", marginTop: 2 }}>Detailed segment breakdown</div>
              </div>
              <div className="p-6">
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {pieSegments.map((segment, index) => (
                    <div
                      key={index}
                      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderRadius: "var(--radius-md)", background: "var(--graphite-50)", border: "1px solid var(--border-1)" }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 10, height: 10, borderRadius: "50%", flexShrink: 0, background: segment.color }} />
                        <div>
                          <p style={{ fontSize: 13, color: "var(--fg-1)", margin: 0 }}>{segment.eventType}</p>
                          <p style={{ fontSize: 11, color: "var(--fg-3)", margin: 0 }}>{STATUS_DISPLAY[segment.status] || segment.status}</p>
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ fontSize: 18, fontWeight: 300, color: "var(--fg-1)", letterSpacing: "-0.03em", margin: 0 }}>{segment.count}</p>
                        <p style={{ fontSize: 11, color: "var(--fg-3)", fontFamily: "var(--font-mono)", margin: 0 }}>{segment.percentage.toFixed(1)}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div style={{ height: 32 }} />
      </div>
    </div>
  )
}
