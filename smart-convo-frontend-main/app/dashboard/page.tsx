"use client"


import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import Cookies from "js-cookie"
import { MetricsGrid } from "@/components/metrics-grid"
import { KPICards } from "@/components/kpi-cards"
import { MetricsHeader } from "@/components/metrics-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, Copy, CheckCircle2, Map, X, Maximize2, Users, ExternalLink, ChevronRight, ChevronLeft, Building2, ArrowLeft, ArrowRight, PhoneForwarded, Calendar, AlertTriangle } from "lucide-react"
import { useTutorial } from "@/components/tutorial/TutorialProvider"



// ─── Dynamic import — disables SSR for Leaflet (window is not defined on server) ───
const HeatMap = dynamic(() => import("@/components/HeatMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[420px] sm:h-[580px] lg:h-[720px] rounded-3xl bg-white animate-pulse" />
  ),
})



// ─── Category → item label mapping ───────────────────────────────────────────



function getItemLabel(category: string | null): string {
  if (!category) return 'complaint'
  const normalized = category.trim().toLowerCase()
  if (normalized === 'municipal services') return 'complaint'
  if (
    normalized === 'food & beverage' ||
    normalized === 'food production' ||
    normalized === 'hospitality' ||
    normalized === 'restaurant'
  ) return 'order'
  return 'complaint'
}



function CursorGlow() {
  const [position, setPosition] = useState({ x: 0, y: 0 })


  useEffect(() => {
    const updateMouse = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", updateMouse)
    return () => window.removeEventListener("mousemove", updateMouse)
  }, [])


  return (
    <div
      className="fixed inset-0 z-20 pointer-events-none transition-opacity duration-500"
      style={{
        background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(251, 191, 36, 0.02), transparent 70%)`,
      }}
    />
  )
}



// ─── Map Dialog ───────────────────────────────────────────────────────────────



function MapDialog({
  open,
  onClose,
  itemLabelCap,
}: {
  open: boolean
  onClose: () => void
  itemLabelCap: string
}) {
  const [flashRed, setFlashRed] = useState(false)                    // ← ADD


  const triggerFlash = () => {                                        // ← ADD
    setFlashRed(true)
    setTimeout(() => setFlashRed(false), 1000)
  }


  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') triggerFlash()                          // ← CHANGE: was onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open])


  if (!open) return null


  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8"
      onClick={triggerFlash}                                          // ← CHANGE: was onClose
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" />


      {/* Dialog panel */}
      <div
        className="relative z-10 w-full max-w-6xl animate-in fade-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden">
          {/* Dialog header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl flex items-center justify-center border border-indigo-100">
                <Map className="h-4 w-4 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-lg font-extralight tracking-tight text-slate-900">{itemLabelCap} Map</h2>
                <p className="text-xs text-slate-500 font-light tracking-wide mt-0.5">
                  Geographic distribution of {itemLabelCap.toLowerCase()} locations
                </p>
              </div>
            </div>


            {/* X button — flashes red on outside click, closes only when directly clicked */}
            <button
              onClick={(e) => { e.stopPropagation(); onClose() }}     // ← CHANGE: added stopPropagation
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 group ${
                flashRed
                  ? 'bg-red-100 scale-110'
                  : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              <X className={`h-4 w-4 transition-colors duration-200 ${
                flashRed ? 'text-red-500' : 'text-slate-500 group-hover:text-slate-700'
              }`} />
            </button>
          </div>


          {/* Map lives here */}
          <div className="p-4">
            <HeatMap />
          </div>
        </div>
      </div>
    </div>
  )
}




// ─── Map Preview Banner ────────────────────────────────────────────────────────



function MapPreviewBanner({
  onOpen,
  itemLabelCap,
}: {
  onOpen: () => void
  itemLabelCap: string
}) {
  return (
    <div
      className="group relative w-full cursor-pointer overflow-hidden rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-lg transition-all duration-300"
      onClick={onOpen}
      role="button"
      aria-label={`Open ${itemLabelCap.toLowerCase()} map`}
    >
      {/* ── Live map preview — pointer-events disabled so clicks fall through to the overlay ── */}
      <div className="relative w-full h-72 sm:h-96 overflow-hidden rounded-3xl pointer-events-none select-none">


        {/* Scale the full HeatMap down to fit the preview height */}
        <div
          className="absolute inset-0 origin-top-left"
          style={{ transform: 'scale(0.50)', width: '200%', height: '200%' }}
        >
          <HeatMap />
        </div>


        {/* Soft vignette fade around edges so it looks intentionally cropped */}
        <div className="absolute inset-0 rounded-3xl"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 40%, rgba(248,250,252,0.7) 80%, rgba(248,250,252,0.95) 100%)',
          }}
        />
      </div>


      {/* ── Hover overlay — text only now ── */}
        <div className="absolute inset-0 rounded-3xl flex items-end px-5 pb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent">
          <div>
            <p className="text-xs font-light tracking-[0.2em] uppercase text-white/80 mb-0.5">
              Interactive
            </p>
            <h3 className="text-lg font-extralight tracking-tight text-white leading-tight drop-shadow">
              {itemLabelCap} Location Map
            </h3>
          </div>
        </div>


        {/* ── Always-visible Expand button ── */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-white border border-indigo-200 rounded-2xl px-4 py-2 shadow-md group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-all duration-300">
          <Maximize2 className="h-4 w-4 text-indigo-600 group-hover:text-white transition-colors duration-300" />
          <span className="text-sm font-light text-indigo-600 group-hover:text-white transition-colors duration-300">Expand Map</span>
        </div>


      {/* ── Always-visible bottom bar with label + spectrum ── */}
      <div className="absolute bottom-0 left-0 right-0 rounded-b-3xl px-5 py-2.5 flex items-center justify-between bg-white/80 backdrop-blur-sm border-t border-slate-200/60">
        <div className="flex items-center gap-2">
          <Map className="h-3.5 w-3.5 text-indigo-500" />
          <span className="text-xs font-light tracking-wide text-slate-600">
            {itemLabelCap} Map
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
        </div>
        <div
          className="w-24 sm:w-32 h-1.5 rounded-full"
          style={{
            background: "linear-gradient(to right, #c8f0d8, #a0d4f5, #f9c8d4, #c3a0d8, #6b4f8c)",
          }}
        />
      </div>
    </div>
  )
}



// ─── Food / restaurant categories ────────────────────────────────────────────

const FOOD_CATEGORIES = new Set([
  'food & beverage',
  'food production',
  'hospitality',
  'restaurant',
])

// ─── Calendar helpers & types ─────────────────────────────────────────────────

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]
const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

interface CalendarEvent {
  date: string
  count: number
  external_case_ids: string[]
  summaries: string[]
  orderDetails?: {
    id: number
    external_order_id: string
    event_type: string
    postal_code: string
    summary: string
    total_price: number | null
    created_at: string
    order_date: string
  }[]
}

// ─── Calendar Preview Banner ──────────────────────────────────────────────────

function CalendarPreviewBanner({
  onOpen,
  itemLabelCap,
}: {
  onOpen: () => void
  itemLabelCap: string
}) {
  const today = new Date()
  const year  = today.getFullYear()
  const month = today.getMonth()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay    = getFirstDayOfMonth(year, month)
  const todayDate   = today.getDate()

  // Real event counts keyed by "YYYY-MM-DD"
  const [previewEvents, setPreviewEvents] = useState<Record<string, number>>({})

  useEffect(() => {
    const lastDay = daysInMonth
    const dateFrom = `${year}-${String(month + 1).padStart(2, '0')}-01`
    const dateTo   = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`
    fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/reports/total-orders/?aggregate=overview&date_from=${dateFrom}&date_to=${dateTo}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${Cookies.get('Token') || ''}`,
        },
      }
    )
      .then(r => r.json())
      .then(data => {
        const all: any[] = [
          ...(data?.current_orders?.details ?? []),
          ...(data?.total_orders?.details ?? []),
        ]
        const counts: Record<string, number> = {}
        for (const order of all) {
          const key = (order.order_date ?? order.created_at ?? '').split('T')[0]
          if (key) counts[key] = (counts[key] ?? 0) + 1
        }
        setPreviewEvents(counts)
      })
      .catch(() => {})
  }, [])

  const cells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <div
      className="group relative w-full cursor-pointer overflow-hidden rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-lg transition-all duration-300"
      onClick={onOpen}
      role="button"
      aria-label={`Open ${itemLabelCap.toLowerCase()} calendar`}
    >
      {/* Mini calendar preview */}
      <div className="relative bg-white px-6 pt-5 pb-10 pointer-events-none select-none">
        {/* Header row */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-50 rounded-xl flex items-center justify-center border border-indigo-100">
              <Calendar className="h-3.5 w-3.5 text-indigo-500" />
            </div>
            <span className="text-sm font-light text-slate-800">{MONTH_NAMES[month]} {year}</span>
          </div>
          <span className="text-xs font-light text-slate-400 tracking-wide">{itemLabelCap} Calendar</span>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-1">
          {DAY_NAMES.map(d => (
            <div key={d} className="text-center text-[10px] font-medium text-slate-400 pb-1">{d}</div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 gap-y-1">
          {cells.map((day, i) => (
            <div key={i} className="flex flex-col items-center py-0.5">
              {day !== null && (
                <>
                  <span className={`text-[11px] font-light rounded-full w-6 h-6 flex items-center justify-center
                    ${day === todayDate ? 'bg-indigo-600 text-white font-medium' : 'text-slate-500'}`}>
                    {day}
                  </span>
                  {(() => {
                    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                    const count = previewEvents[key] ?? 0
                    if (count === 0) return null
                    // Show 1–3 dots based on quantity
                    const dots = count >= 5 ? 3 : count >= 2 ? 2 : 1
                    return (
                      <div className="flex gap-0.5 mt-0.5">
                        {Array.from({ length: dots }).map((_, di) => (
                          <div key={di} className="w-1 h-1 rounded-full bg-indigo-500" />
                        ))}
                      </div>
                    )
                  })()}
                </>
              )}
            </div>
          ))}
        </div>

        {/* Fade at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-white to-transparent" />
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 rounded-3xl flex items-end px-5 pb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-slate-900/25 via-transparent to-transparent">
        <div>
          <p className="text-xs font-light tracking-[0.2em] uppercase text-white/80 mb-0.5">Interactive</p>
          <h3 className="text-lg font-extralight tracking-tight text-white leading-tight drop-shadow">{itemLabelCap} Calendar</h3>
        </div>
      </div>

      {/* Expand button */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-white border border-indigo-200 rounded-2xl px-4 py-2 shadow-md group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-all duration-300">
        <Maximize2 className="h-4 w-4 text-indigo-600 group-hover:text-white transition-colors duration-300" />
        <span className="text-sm font-light text-indigo-600 group-hover:text-white transition-colors duration-300">Expand Calendar</span>
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 rounded-b-3xl px-5 py-2.5 flex items-center justify-between bg-white/80 backdrop-blur-sm border-t border-slate-200/60">
        <div className="flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5 text-indigo-500" />
          <span className="text-xs font-light tracking-wide text-slate-600">{itemLabelCap} Calendar</span>
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
        </div>
        <div className="w-24 sm:w-32 h-1.5 rounded-full" style={{ background: 'linear-gradient(to right, #e0e7ff, #a5b4fc, #6366f1)' }} />
      </div>
    </div>
  )
}

// ─── Calendar Modal ───────────────────────────────────────────────────────────

function CalendarModal({
  open,
  onClose,
  itemLabelCap,
}: {
  open: boolean
  onClose: () => void
  itemLabelCap: string
}) {
  const today  = new Date()
  const [year, setYear]   = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [events, setEvents]           = useState<CalendarEvent[]>([])
  const [loadingEvents, setLoadingEvents] = useState(false)
  const [selectedDay, setSelectedDay] = useState<CalendarEvent | null>(null)

  // Fetch orders for current month view
  useEffect(() => {
    if (!open) return
    setLoadingEvents(true)
    setSelectedDay(null)

    const lastDay = getDaysInMonth(year, month)
    const dateFrom = `${year}-${String(month + 1).padStart(2, '0')}-01`
    const dateTo   = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`

    const go = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/reports/total-orders/?aggregate=overview&date_from=${dateFrom}&date_to=${dateTo}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Token ${Cookies.get('Token') || ''}`,
            },
          }
        )
        const data = await res.json()

        // Combine current_orders + total_orders details
        const allDetails: any[] = [
          ...(data?.current_orders?.details ?? []),
          ...(data?.total_orders?.details ?? []),
        ]

        // Group by date (YYYY-MM-DD from order_date or created_at)
        const grouped: Record<string, { ids: string[]; summaries: string[]; details: any[] }> = {}
        for (const order of allDetails) {
          const raw = order.order_date ?? order.created_at ?? ''
          const dateKey = raw.split('T')[0]
          if (!dateKey) continue
          if (!grouped[dateKey]) grouped[dateKey] = { ids: [], summaries: [], details: [] }
          grouped[dateKey].ids.push(order.external_order_id ?? String(order.id))
          grouped[dateKey].summaries.push(order.summary ?? order.external_order_id ?? '—')
          grouped[dateKey].details.push(order)
        }

        setEvents(
          Object.entries(grouped).map(([date, g]) => ({
            date,
            count: g.ids.length,
            external_case_ids: g.ids,
            summaries: g.summaries,
            orderDetails: g.details,
          }))
        )
      } catch (err) {
        console.error('Error fetching calendar events:', err)
      } finally {
        setLoadingEvents(false)
      }
    }
    go()
  }, [open, year, month])

  // Escape to close
  useEffect(() => {
    if (!open) return
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [open, onClose])

  if (!open) return null

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay    = getFirstDayOfMonth(year, month)
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month

  // map events by date string "YYYY-MM-DD"
  const eventMap: Record<string, CalendarEvent> = {}
  events.forEach(ev => { eventMap[ev.date] = ev })

  const cells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)

  const toKey = (d: number) =>
    `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`

  const isToday     = (d: number) => isCurrentMonth && d === today.getDate()
  const isPastDay   = (d: number) => new Date(year, month, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate())

  const prevMonth = () => { setSelectedDay(null); if (month === 0) { setYear(y => y - 1); setMonth(11) } else setMonth(m => m - 1) }
  const nextMonth = () => { setSelectedDay(null); if (month === 11) { setYear(y => y + 1); setMonth(0) } else setMonth(m => m + 1) }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" />

      <div
        className="relative z-10 w-full max-w-5xl animate-in fade-in zoom-in-95 duration-300"
        style={{ maxHeight: '90vh' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col" style={{ maxHeight: '90vh' }}>

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl flex items-center justify-center border border-indigo-100">
                <Calendar className="h-4 w-4 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-lg font-extralight tracking-tight text-slate-900">{itemLabelCap} Calendar</h2>
                <p className="text-xs text-slate-500 font-light tracking-wide mt-0.5">
                  {events.length} recorded date{events.length !== 1 ? 's' : ''} · click a highlighted day for details
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all duration-200 group"
            >
              <X className="h-4 w-4 text-slate-500 group-hover:text-slate-700" />
            </button>
          </div>

          {/* Body */}
          <div className="flex flex-1 min-h-0 overflow-hidden">

            {/* Calendar grid pane */}
            <div className="flex-1 flex flex-col p-6 overflow-auto">

              {/* Month / year navigation */}
              <div className="flex items-center justify-between mb-5 shrink-0">
                <button onClick={prevMonth} className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
                  <ArrowLeft className="h-4 w-4 text-slate-500" />
                </button>
                <h3 className="text-lg font-extralight tracking-tight text-slate-800">
                  {MONTH_NAMES[month]} <span className="text-slate-400">{year}</span>
                </h3>
                <button onClick={nextMonth} className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
                  <ArrowRight className="h-4 w-4 text-slate-500" />
                </button>
              </div>

              {loadingEvents ? (
                <div className="flex-1 flex items-center justify-center py-16">
                  <div className="relative w-10 h-10">
                    <div className="absolute inset-0 border-2 border-slate-100 rounded-full" />
                    <div className="absolute inset-0 border-2 border-indigo-500 rounded-full border-t-transparent animate-spin" />
                  </div>
                </div>
              ) : (
                <>
                  {/* Day-of-week headers */}
                  <div className="grid grid-cols-7 mb-2 shrink-0">
                    {DAY_NAMES.map(d => (
                      <div key={d} className="text-center text-xs font-medium text-slate-400 py-1">{d}</div>
                    ))}
                  </div>

                  {/* Day cells */}
                  <div className="grid grid-cols-7 gap-1">
                    {cells.map((day, i) => {
                      if (day === null) return <div key={`e-${i}`} className="min-h-[64px]" />
                      const key = toKey(day)
                      const ev  = eventMap[key]
                      const todayCell = isToday(day)
                      const past      = isPastDay(day)
                      const selected  = selectedDay?.date === key

                      return (
                        <button
                          key={key}
                          onClick={() => setSelectedDay(ev ?? null)}
                          disabled={!ev}
                          className={`relative flex flex-col items-center pt-1.5 pb-2 px-1 rounded-2xl transition-all duration-200 min-h-[64px]
                            ${selected      ? 'bg-indigo-600 shadow-md ring-2 ring-indigo-300' :
                              todayCell     ? 'bg-indigo-50 border border-indigo-200' :
                              ev            ? 'bg-slate-50/80 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 cursor-pointer' :
                                             'cursor-default'}
                            ${past && !todayCell && !ev ? 'opacity-35' : ''}`}
                        >
                          <span className={`text-sm font-light w-7 h-7 flex items-center justify-center rounded-full transition-colors
                            ${selected  ? 'bg-white/20 text-white font-medium' :
                              todayCell ? 'bg-indigo-600 text-white font-medium' :
                              ev        ? 'text-slate-800' : 'text-slate-400'}`}>
                            {day}
                          </span>
                          {ev && (
                            <div className="w-full mt-1 px-0.5 space-y-0.5">
                              <div className={`text-[9px] font-medium rounded-md px-1 py-0.5 text-center truncate leading-tight
                                ${selected ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-700'}`}>
                                {ev.count} {itemLabelCap.toLowerCase()}{ev.count !== 1 ? 's' : ''}
                              </div>
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Right detail panel */}
            {selectedDay ? (
              <div className="w-80 border-l border-slate-100 flex flex-col overflow-hidden min-h-0 shrink-0">
                <div className="px-5 py-4 border-b border-slate-100 shrink-0">
                  <p className="text-[10px] font-light tracking-[0.15em] uppercase text-slate-400 mb-0.5">{itemLabelCap} details</p>
                  <h3 className="text-base font-extralight text-slate-900">
                    {new Date(selectedDay.date + 'T12:00:00').toLocaleDateString('en-US', {
                      weekday: 'long', month: 'long', day: 'numeric',
                    })}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5 font-light">
                    {selectedDay.count} {itemLabelCap.toLowerCase()}{selectedDay.count !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="overflow-y-auto flex-1 p-4 space-y-2">
                  {(selectedDay.orderDetails ?? []).length > 0 ? (
                    selectedDay.orderDetails!.map((order, i) => (
                      <div
                        key={order.id ?? i}
                        className="bg-slate-50 hover:bg-white border border-slate-200/60 hover:border-indigo-200/60 rounded-2xl p-3 transition-all duration-200"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-medium text-indigo-700 bg-indigo-50 rounded-md px-1.5 py-0.5">
                            #{order.external_order_id}
                          </span>
                          <span className={`text-[10px] font-medium rounded-md px-1.5 py-0.5
                            ${order.event_type === 'sent'
                              ? 'bg-amber-50 text-amber-700'
                              : order.event_type === 'completed'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-slate-100 text-slate-600'}`}>
                            {order.event_type}
                          </span>
                        </div>
                        {order.total_price !== null && (
                          <p className="text-sm font-medium text-slate-800 mb-1">
                            ${Number(order.total_price).toFixed(2)}
                          </p>
                        )}
                        <p className="text-xs font-light text-slate-500 leading-relaxed">
                          {order.summary ?? '—'}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1 font-light">
                          {new Date(order.order_date ?? order.created_at).toLocaleTimeString('en-US', {
                            hour: '2-digit', minute: '2-digit',
                          })}
                          {order.postal_code && order.postal_code !== 'PICKUP' ? ` · ${order.postal_code}` : order.postal_code === 'PICKUP' ? ' · Pickup' : ''}
                        </p>
                      </div>
                    ))
                  ) : selectedDay.external_case_ids.length > 0 ? (
                    selectedDay.external_case_ids.map((id, i) => (
                      <div
                        key={id}
                        className="bg-slate-50 hover:bg-white border border-slate-200/60 hover:border-indigo-200/60 rounded-2xl p-3 transition-all duration-200"
                      >
                        <div className="mb-1.5">
                          <span className="text-[10px] font-medium text-indigo-700 bg-indigo-50 rounded-md px-1.5 py-0.5">
                            #{id}
                          </span>
                        </div>
                        <p className="text-xs font-light text-slate-500 leading-relaxed">
                          {selectedDay.summaries[i] ?? '—'}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 font-light text-center py-6">No details available</p>
                  )}
                </div>
              </div>
            ) : (
              !loadingEvents && (
                <div className="w-80 border-l border-slate-100 flex flex-col items-center justify-center p-6 shrink-0 text-center">
                  <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100 mb-3">
                    <Calendar className="h-5 w-5 text-indigo-300" />
                  </div>
                  <p className="text-sm text-slate-400 font-light">
                    Click a highlighted date to view {itemLabelCap.toLowerCase()} details
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Order Record type + Orders Modal + Food Orders Section ──────────────────



interface OrderRecord {
  id: number
  external_order_id: string
  event_type: string
  postal_code: string
  summary: string
  total_price: number | null
  latitude: number | null
  longitude: number | null
  created_at: string
  active_until: string
}

function OrdersModal({
  open,
  onClose,
  records,
  loading,
  title,
  subtitle,
  accentColor = 'amber',
}: {
  open: boolean
  onClose: () => void
  records: OrderRecord[]
  loading: boolean
  title: string
  subtitle: string
  accentColor?: 'amber' | 'emerald'
}) {
  useEffect(() => {
    if (!open) return
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [open, onClose])

  if (!open) return null

  const iconBg   = accentColor === 'emerald' ? 'from-emerald-50 to-teal-50 border-emerald-100' : 'from-amber-50 to-orange-50 border-amber-100'
  const iconColor= accentColor === 'emerald' ? 'text-emerald-600' : 'text-amber-600'
  const spinBorder = accentColor === 'emerald' ? 'border-emerald-500' : 'border-amber-500'
  const emptyBg  = accentColor === 'emerald' ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'
  const emptyIcon= accentColor === 'emerald' ? 'text-emerald-300' : 'text-amber-300'
  const badgeBg  = accentColor === 'emerald' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
  const hoverBorder = accentColor === 'emerald' ? 'hover:border-emerald-200/60' : 'hover:border-amber-200/60'

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" />
      <div
        className="relative z-10 w-full max-w-2xl max-h-[80vh] flex flex-col animate-in fade-in zoom-in-95 duration-300"
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col max-h-[80vh]">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 bg-gradient-to-br ${iconBg} rounded-xl flex items-center justify-center border`}>
                <ChevronRight className={`h-4 w-4 ${iconColor}`} />
              </div>
              <div>
                <h2 className="text-lg font-extralight tracking-tight text-slate-900">{title}</h2>
                <p className="text-xs text-slate-500 font-light tracking-wide mt-0.5">{subtitle}</p>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all duration-200 group">
              <X className="h-4 w-4 text-slate-500 group-hover:text-slate-700" />
            </button>
          </div>
          {/* Body */}
          <div className="overflow-y-auto flex-1 p-6 space-y-3">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="relative w-10 h-10">
                  <div className="absolute inset-0 border-2 border-slate-100 rounded-full" />
                  <div className={`absolute inset-0 border-2 ${spinBorder} rounded-full border-t-transparent animate-spin`} />
                </div>
              </div>
            ) : records.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-3">
                <div className={`w-14 h-14 ${emptyBg} rounded-2xl flex items-center justify-center border`}>
                  <ChevronRight className={`h-6 w-6 ${emptyIcon}`} />
                </div>
                <p className="text-sm text-slate-400 font-light">No orders found</p>
              </div>
            ) : (
              records.map((order, idx) => (
                <div
                  key={order.id}
                  className={`group/row bg-slate-50/70 hover:bg-white border border-slate-200/60 ${hoverBorder} hover:shadow-sm rounded-2xl p-4 transition-all duration-200 animate-in fade-in slide-in-from-bottom-1`}
                  style={{ animationDelay: `${idx * 25}ms` }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`text-[10px] font-medium ${badgeBg} rounded-md px-1.5 py-0.5`}>
                          #{order.external_order_id}
                        </span>
                        <span className={`text-[10px] font-medium rounded-md px-1.5 py-0.5
                          ${order.event_type === 'sent'    ? 'bg-amber-50 text-amber-700' :
                            order.event_type === 'completed' ? 'bg-emerald-50 text-emerald-700' :
                            'bg-slate-100 text-slate-600'}`}>
                          {order.event_type}
                        </span>
                        {order.postal_code && (
                          <span className="text-[10px] font-light text-slate-400">
                            {order.postal_code === 'PICKUP' ? '📦 Pickup' : order.postal_code}
                          </span>
                        )}
                      </div>
                      {order.total_price !== null && (
                        <p className="text-sm font-medium text-slate-800 mb-1">${Number(order.total_price).toFixed(2)}</p>
                      )}
                      <p className="text-xs text-slate-500 font-light">{order.summary ?? '—'}</p>
                    </div>
                    <div className="text-right shrink-0 space-y-1">
                      <p className="text-[10px] text-slate-400 font-light">
                        {new Date(order.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="text-[10px] text-slate-400 font-light">
                        {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function FoodOrdersSection() {
  const [currentCount,  setCurrentCount]  = useState<number | null>(null)
  const [totalCount,    setTotalCount]    = useState<number | null>(null)
  const [loadingCurrent, setLoadingCurrent] = useState(true)
  const [loadingTotal,   setLoadingTotal]   = useState(true)

  const [currentRecords,  setCurrentRecords]  = useState<OrderRecord[]>([])
  const [totalRecords,    setTotalRecords]    = useState<OrderRecord[]>([])
  const [loadingCurrentRec, setLoadingCurrentRec] = useState(false)
  const [loadingTotalRec,   setLoadingTotalRec]   = useState(false)

  const [currentModalOpen, setCurrentModalOpen] = useState(false)
  const [totalModalOpen,   setTotalModalOpen]   = useState(false)

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Token ${Cookies.get('Token') || ''}`,
  }

  // Fetch counts on mount
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/reports/order-locations/?aggregate=count`, { headers: authHeaders })
      .then(r => r.json()).then(d => { if (typeof d.count === 'number') setCurrentCount(d.count) })
      .catch(() => {}).finally(() => setLoadingCurrent(false))

    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/reports/total-orders/?aggregate=count`, { headers: authHeaders })
      .then(r => r.json()).then(d => { if (typeof d.count === 'number') setTotalCount(d.count) })
      .catch(() => {}).finally(() => setLoadingTotal(false))
  }, [])

  const handleCurrentClick = async () => {
    setCurrentModalOpen(true)
    if (currentRecords.length > 0) return
    setLoadingCurrentRec(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/reports/order-locations/`, { headers: authHeaders })
      const data = await res.json()
      if (Array.isArray(data)) setCurrentRecords(data)
    } catch {} finally { setLoadingCurrentRec(false) }
  }

  const handleTotalClick = async () => {
    setTotalModalOpen(true)
    if (totalRecords.length > 0) return
    setLoadingTotalRec(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/reports/total-orders/`, { headers: authHeaders })
      const data = await res.json()
      if (Array.isArray(data)) setTotalRecords(data)
      else if (Array.isArray(data?.results)) setTotalRecords(data.results)
    } catch {} finally { setLoadingTotalRec(false) }
  }

  return (
    <>
      <OrdersModal
        open={currentModalOpen} onClose={() => setCurrentModalOpen(false)}
        records={currentRecords} loading={loadingCurrentRec}
        title="Current Orders" subtitle="Active orders at this moment"
        accentColor="amber"
      />
      <OrdersModal
        open={totalModalOpen} onClose={() => setTotalModalOpen(false)}
        records={totalRecords} loading={loadingTotalRec}
        title="All Orders" subtitle="Complete order history"
        accentColor="emerald"
      />

      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        {/* Section label */}
        <div className="flex items-center gap-2 mb-4">
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-xs font-light tracking-[0.15em] uppercase text-slate-400">Order Intelligence</span>
          <div className="flex-1 h-px bg-slate-200/70" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Current Orders */}
          <button
            onClick={handleCurrentClick}
            className="group relative text-left w-full overflow-hidden bg-white hover:bg-slate-50/80 border border-slate-200/60 hover:border-amber-300/60 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.01]"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-amber-400/8 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-start justify-between">
              <div className="space-y-4">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl flex items-center justify-center border border-amber-100">
                  <ChevronRight className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs font-light tracking-wide text-slate-500 mb-1">Current Orders</p>
                  {loadingCurrent ? (
                    <div className="h-9 w-16 bg-slate-100 rounded-xl animate-pulse" />
                  ) : (
                    <p className="text-4xl font-extralight text-slate-900 tracking-tight">{currentCount ?? '—'}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-amber-50 group-hover:bg-amber-100 border border-amber-100 group-hover:border-amber-200 rounded-xl px-3 py-1.5 transition-all duration-200">
                <span className="text-xs font-light text-amber-600">View all</span>
                <ChevronRight className="h-3 w-3 text-amber-500 group-hover:translate-x-0.5 transition-transform duration-200" />
              </div>
            </div>
            <div className="relative mt-5 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <div className="flex-1 h-px bg-gradient-to-r from-amber-200/60 to-transparent" />
              <span className="text-[10px] font-light text-slate-400 tracking-wide">Click to explore orders</span>
            </div>
          </button>

          {/* Total Orders */}
          <button
            onClick={handleTotalClick}
            className="group relative text-left w-full overflow-hidden bg-white hover:bg-slate-50/80 border border-slate-200/60 hover:border-emerald-300/60 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.01]"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-400/8 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-start justify-between">
              <div className="space-y-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl flex items-center justify-center border border-emerald-100">
                  <ChevronRight className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-light tracking-wide text-slate-500 mb-1">Total Orders</p>
                  {loadingTotal ? (
                    <div className="h-9 w-16 bg-slate-100 rounded-xl animate-pulse" />
                  ) : (
                    <p className="text-4xl font-extralight text-slate-900 tracking-tight">{totalCount ?? '—'}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-emerald-50 group-hover:bg-emerald-100 border border-emerald-100 group-hover:border-emerald-200 rounded-xl px-3 py-1.5 transition-all duration-200">
                <span className="text-xs font-light text-emerald-600">View all</span>
                <ChevronRight className="h-3 w-3 text-emerald-500 group-hover:translate-x-0.5 transition-transform duration-200" />
              </div>
            </div>
            <div className="relative mt-5 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <div className="flex-1 h-px bg-gradient-to-r from-emerald-200/60 to-transparent" />
              <span className="text-[10px] font-light text-slate-400 tracking-wide">Click to explore orders</span>
            </div>
          </button>

        </div>
      </div>
    </>
  )
}

// ─── Contact Record type ──────────────────────────────────────────────────────



interface ContactRecord {
  id: number
  external_contact_id: string
  name: string
  email: string | null
  phone_number: string
  address: string
  postal_code: string
  created_at: string
}

interface Accesse11Contact {
  id: string
  contactFullName: string
  contactType: string
  given_name: string
  additional_name: string | null
  family_name: string
  street_address: string
  preferred_email_address: string
  preferred_phone_number: string
  expired: string | null
}



// ─── Contacts Modal ───────────────────────────────────────────────────────────



function ContactsModal({
  open,
  onClose,
  records,
  loadingRecords,
  title = "New Contacts",
  subtitle = "All recently created contact records",
}: {
  open: boolean
  onClose: () => void
  records: ContactRecord[]
  loadingRecords: boolean
  title?: string
  subtitle?: string
}) {
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])


  if (!open) return null


  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" />


      {/* Dialog panel */}
      <div
        className="relative z-10 w-full max-w-3xl max-h-[80vh] flex flex-col animate-in fade-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col">

          {/* Modal header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-violet-50 to-indigo-50 rounded-xl flex items-center justify-center border border-violet-100">
                <Users className="h-4 w-4 text-violet-600" />
              </div>
              <div>
                <h2 className="text-lg font-extralight tracking-tight text-slate-900">{title}</h2>
                <p className="text-xs text-slate-500 font-light tracking-wide mt-0.5">
                  {subtitle}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all duration-200 group"
            >
              <X className="h-4 w-4 text-slate-500 group-hover:text-slate-700 transition-colors duration-200" />
            </button>
          </div>


          {/* Modal body — scrollable */}
          <div className="overflow-y-auto flex-1 p-6 space-y-3">
            {loadingRecords ? (
              <div className="flex items-center justify-center py-16">
                <div className="relative w-10 h-10">
                  <div className="absolute inset-0 border-2 border-slate-100 rounded-full" />
                  <div className="absolute inset-0 border-2 border-violet-500 rounded-full border-t-transparent animate-spin" />
                </div>
              </div>
            ) : records.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-3">
                <div className="w-14 h-14 bg-violet-50 rounded-2xl flex items-center justify-center border border-violet-100">
                  <Users className="h-6 w-6 text-violet-300" />
                </div>
                <p className="text-sm text-slate-400 font-light">No contact records found</p>
              </div>
            ) : (
              records.map((record, idx) => (
                <div
                  key={record.id}
                  className="group/row bg-slate-50/70 hover:bg-white border border-slate-200/60 hover:border-violet-200/60 hover:shadow-sm rounded-2xl p-4 transition-all duration-200 animate-in fade-in slide-in-from-bottom-1"
                  style={{ animationDelay: `${idx * 30}ms` }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Avatar */}
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 border border-violet-200/50 flex items-center justify-center shrink-0">
                        <span className="text-xs font-medium text-violet-600">
                          {record.name.trim().charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{record.name.trim()}</p>
                        <p className="text-xs text-slate-400 font-light truncate mt-0.5">{record.address}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 space-y-1">
                      <p className="text-xs font-mono text-slate-600">{record.phone_number}</p>
                      {record.email && (
                        <p className="text-xs text-violet-500 font-light">{record.email}</p>
                      )}
                      <p className="text-[10px] text-slate-400 font-light">
                        {new Date(record.created_at).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric',
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}



// ─── Accesse11 Contacts Modal ─────────────────────────────────────────────────



function Accesse11ContactsModal({
  open,
  onClose,
  records,
  loadingRecords,
  totalCount,
}: {
  open: boolean
  onClose: () => void
  records: Accesse11Contact[]
  loadingRecords: boolean
  totalCount: number | null
}) {
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" />
      <div
        className="relative z-10 w-full max-w-3xl max-h-[80vh] flex flex-col animate-in fade-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl flex items-center justify-center border border-emerald-100">
                <Users className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-lg font-extralight tracking-tight text-slate-900">Accesse11 Contacts</h2>
                <p className="text-xs text-slate-500 font-light tracking-wide mt-0.5">
                  {totalCount !== null ? `${totalCount} total contacts` : 'All contacts'} synced from Accesse11
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all duration-200 group"
            >
              <X className="h-4 w-4 text-slate-500 group-hover:text-slate-700 transition-colors duration-200" />
            </button>
          </div>

          {/* Body */}
          <div className="overflow-y-auto flex-1 p-6 space-y-3">
            {loadingRecords ? (
              <div className="flex items-center justify-center py-16">
                <div className="relative w-10 h-10">
                  <div className="absolute inset-0 border-2 border-slate-100 rounded-full" />
                  <div className="absolute inset-0 border-2 border-emerald-500 rounded-full border-t-transparent animate-spin" />
                </div>
              </div>
            ) : records.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-3">
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100">
                  <Users className="h-6 w-6 text-emerald-300" />
                </div>
                <p className="text-sm text-slate-400 font-light">No contacts found</p>
              </div>
            ) : (
              records.map((record, idx) => (
                <div
                  key={record.id}
                  className="group/row bg-slate-50/70 hover:bg-white border border-slate-200/60 hover:border-emerald-200/60 hover:shadow-sm rounded-2xl p-4 transition-all duration-200 animate-in fade-in slide-in-from-bottom-1"
                  style={{ animationDelay: `${idx * 20}ms` }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 border border-emerald-200/50 flex items-center justify-center shrink-0">
                        <span className="text-xs font-medium text-emerald-700">
                          {record.given_name.trim().charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{record.contactFullName}</p>
                        <p className="text-xs text-slate-400 font-light truncate mt-0.5">{record.street_address}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 space-y-1">
                      <p className="text-xs font-mono text-slate-600">{record.preferred_phone_number || '—'}</p>
                      {record.preferred_email_address && (
                        <p className="text-xs text-emerald-600 font-light">{record.preferred_email_address}</p>
                      )}
                      <span className="inline-block text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-md px-1.5 py-0.5 font-light capitalize">
                        {record.contactType}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}



// ─── Municipal Contacts Section ───────────────────────────────────────────────



function MunicipalContactsSection() {
  const [newContactCount, setNewContactCount] = useState<number | null>(null)
  const [accessCount, setAccessCount] = useState<number | null>(null)
  const [contactRecords, setContactRecords] = useState<ContactRecord[]>([])
  const [loadingCount, setLoadingCount] = useState(true)
  const [loadingAccess, setLoadingAccess] = useState(true)
  const [loadingRecords, setLoadingRecords] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [accesse11Records, setAccesse11Records] = useState<Accesse11Contact[]>([])
  const [loadingAccesse11Records, setLoadingAccesse11Records] = useState(false)
  const [accesse11ModalOpen, setAccesse11ModalOpen] = useState(false)


  // ── Fetch new-contact count ───────────────────────────────────────────────
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/reports/contact-creation-records/?aggregate=count`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${Cookies.get("Token") || ""}`,
            },
          }
        )
        const data = await res.json()
        if (typeof data.count === 'number') setNewContactCount(data.count)
      } catch (err) {
        console.error("Error fetching contact creation count:", err)
      } finally {
        setLoadingCount(false)
      }
    }
    fetchCount()
  }, [])


  // ── Fetch Accesse11 total contact count ───────────────────────────────────
  useEffect(() => {
    const fetchAccessCount = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/integrations/accesse11/contacts/count/`, {
          headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${Cookies.get("Token") || ""}`,
            },
        })
        const data = await res.json()
        if (typeof data.count === 'number') setAccessCount(data.count)
      } catch (err) {
        console.error("Error fetching Accesse11 contact count:", err)
      } finally {
        setLoadingAccess(false)
      }
    }
    fetchAccessCount()
  }, [])


  // ── Fetch Accesse11 contact details on card click ────────────────────────
  const handleAccesse11Click = async () => {
    setAccesse11ModalOpen(true)
    if (accesse11Records.length > 0) return
    setLoadingAccesse11Records(true)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/integrations/accesse11/contacts/details/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${Cookies.get("Token") || ""}`,
          },
        }
      )
      const data = await res.json()
      const results = data?.data?.results
      if (Array.isArray(results)) setAccesse11Records(results)
    } catch (err) {
      console.error("Error fetching Accesse11 contact details:", err)
    } finally {
      setLoadingAccesse11Records(false)
    }
  }

  // ── Fetch full records list on card click ─────────────────────────────────
  const handleCardClick = async () => {
    setModalOpen(true)
    if (contactRecords.length > 0) return  // already fetched, no refetch needed
    setLoadingRecords(true)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/reports/contact-creation-records/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${Cookies.get("Token") || ""}`,
          },
        }
      )
      const data = await res.json()
      if (Array.isArray(data)) setContactRecords(data)
    } catch (err) {
      console.error("Error fetching contact records:", err)
    } finally {
      setLoadingRecords(false)
    }
  }


  return (
    <>
      <ContactsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        records={contactRecords}
        loadingRecords={loadingRecords}
      />
      <Accesse11ContactsModal
        open={accesse11ModalOpen}
        onClose={() => setAccesse11ModalOpen(false)}
        records={accesse11Records}
        loadingRecords={loadingAccesse11Records}
        totalCount={accessCount}
      />


      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">

        {/* Section label */}
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-xs font-light tracking-[0.15em] uppercase text-slate-400">
            Municipal Contact Intelligence
          </span>
          <div className="flex-1 h-px bg-slate-200/70" />
        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* ── Card 1: New Contacts Created (clickable → modal) ── */}
          <button
            onClick={handleCardClick}
            className="group relative text-left w-full overflow-hidden bg-white hover:bg-slate-50/80 border border-slate-200/60 hover:border-violet-300/60 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.01]"
          >
            {/* Glow */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-violet-400/8 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative flex items-start justify-between">
              <div className="space-y-4">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-50 to-indigo-50 rounded-2xl flex items-center justify-center border border-violet-100">
                  <Users className="h-4.5 w-4.5 text-violet-600" />
                </div>
                <div>
                  <p className="text-xs font-light tracking-wide text-slate-500 mb-1">New Contacts Created</p>
                  {loadingCount ? (
                    <div className="h-9 w-16 bg-slate-100 rounded-xl animate-pulse" />
                  ) : (
                    <p className="text-4xl font-extralight text-slate-900 tracking-tight">
                      {newContactCount ?? '—'}
                    </p>
                  )}
                </div>
              </div>

              {/* Click hint */}
              <div className="flex items-center gap-1.5 bg-violet-50 group-hover:bg-violet-100 border border-violet-100 group-hover:border-violet-200 rounded-xl px-3 py-1.5 transition-all duration-200">
                <span className="text-xs font-light text-violet-600">View all</span>
                <ChevronRight className="h-3 w-3 text-violet-500 group-hover:translate-x-0.5 transition-transform duration-200" />
              </div>
            </div>

            {/* Bottom pulse indicator */}
            <div className="relative mt-5 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              <div className="flex-1 h-px bg-gradient-to-r from-violet-200/60 to-transparent" />
              <span className="text-[10px] font-light text-slate-400 tracking-wide">Click to explore records</span>
            </div>
          </button>


          {/* ── Card 2: Total Accesse11 Contacts (clickable → modal) ── */}
          <button
            onClick={handleAccesse11Click}
            className="group relative text-left w-full overflow-hidden bg-white hover:bg-slate-50/80 border border-slate-200/60 hover:border-emerald-300/60 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.01]"
          >
            {/* Glow */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-400/8 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative flex items-start justify-between">
              <div className="space-y-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl flex items-center justify-center border border-emerald-100">
                  <ExternalLink className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-light tracking-wide text-slate-500 mb-1">Total Contacts on Accesse11</p>
                  {loadingAccess ? (
                    <div className="h-9 w-16 bg-slate-100 rounded-xl animate-pulse" />
                  ) : (
                    <p className="text-4xl font-extralight text-slate-900 tracking-tight">
                      {accessCount ?? '—'}
                    </p>
                  )}
                </div>
              </div>

              {/* Click hint */}
              <div className="flex items-center gap-1.5 bg-emerald-50 group-hover:bg-emerald-100 border border-emerald-100 group-hover:border-emerald-200 rounded-xl px-3 py-1.5 transition-all duration-200">
                <span className="text-xs font-light text-emerald-600">View all</span>
                <ChevronRight className="h-3 w-3 text-emerald-500 group-hover:translate-x-0.5 transition-transform duration-200" />
              </div>
            </div>

            <div className="relative mt-5 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <div className="flex-1 h-px bg-gradient-to-r from-emerald-200/60 to-transparent" />
              <span className="text-[10px] font-light text-slate-400 tracking-wide">Click to explore records</span>
            </div>
          </button>

        </div>
      </div>
    </>
  )
}



// ─── Phone Numbers Modal ─────────────────────────────────────────────────────



function PhoneNumbersModal({
  open,
  onClose,
  numbers,
  copiedIndex,
  onCopy,
}: {
  open: boolean
  onClose: () => void
  numbers: string[]
  copiedIndex: number | null
  onCopy: (num: string, idx: number) => void
}) {
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" />
      <div
        className="relative z-10 w-full max-w-md animate-in fade-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl flex items-center justify-center border border-amber-100">
                <Phone className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <h2 className="text-lg font-extralight tracking-tight text-slate-900">Phone Numbers</h2>
                <p className="text-xs text-slate-500 font-light tracking-wide mt-0.5">
                  {numbers.length} active {numbers.length === 1 ? 'number' : 'numbers'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all duration-200 group"
            >
              <X className="h-4 w-4 text-slate-500 group-hover:text-slate-700" />
            </button>
          </div>
          <div className="overflow-y-auto max-h-[60vh] p-4 space-y-2">
            {numbers.map((num, idx) => (
              <div
                key={num}
                className="flex items-center justify-between bg-slate-50 hover:bg-amber-50/50 border border-slate-200/60 hover:border-amber-200/60 rounded-2xl px-4 py-3 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-medium text-slate-400 w-5">#{idx + 1}</span>
                  <p className="text-sm font-mono font-medium text-slate-800 tracking-wide">{num}</p>
                </div>
                <button
                  onClick={() => onCopy(num, idx)}
                  className="w-7 h-7 bg-white hover:bg-amber-50 rounded-lg border border-slate-200/50 flex items-center justify-center transition-colors"
                >
                  {copiedIndex === idx ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-amber-600" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 text-slate-400 hover:text-amber-600" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}



// ─── Call Transfer types & components ────────────────────────────────────────



interface CallTransferRecord {
  id: number
  company: number
  call_id: string
  external_agent_id: string | null
  caller_phone_number: string | null
  transfer_to_phone_number: string | null
  transfer_reason: string
  unresolved_query: string
  call_status: string
  transfer_triggered_at: string | null
  metadata: Record<string, unknown>
  created_at: string
}



function CallTransfersModal({
  open,
  onClose,
  records,
  loading,
}: {
  open: boolean
  onClose: () => void
  records: CallTransferRecord[]
  loading: boolean
}) {
  const [selected, setSelected] = useState<CallTransferRecord | null>(null)

  // Reset selection when modal closes
  useEffect(() => {
    if (!open) setSelected(null)
  }, [open])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  const detailFields: { label: string; value: string | null }[] = selected ? [
    { label: 'Call ID', value: selected.call_id },
    { label: 'Status', value: selected.call_status },
    { label: 'Transfer Reason', value: selected.transfer_reason },
    { label: 'Unresolved Query', value: selected.unresolved_query },
    { label: 'Caller', value: selected.caller_phone_number },
    { label: 'Transfer To', value: selected.transfer_to_phone_number },
    { label: 'Triggered At', value: selected.transfer_triggered_at },
    {
      label: 'Created',
      value: new Date(selected.created_at).toLocaleString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      }),
    },
  ] : []

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" />
      <div
        className="relative z-10 w-full max-w-3xl max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col h-full">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-violet-50 to-indigo-50 rounded-xl flex items-center justify-center border border-violet-100">
                <PhoneForwarded className="h-4 w-4 text-violet-500" />
              </div>
              <div>
                <h2 className="text-lg font-extralight tracking-tight text-slate-900">Call Transfers</h2>
                <p className="text-xs text-slate-500 font-light tracking-wide mt-0.5">
                  {records.length} AI → human escalation{records.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all duration-200 group"
            >
              <X className="h-4 w-4 text-slate-500 group-hover:text-slate-700" />
            </button>
          </div>

          {/* Body — two columns */}
          <div className="flex flex-1 min-h-0">

            {/* ── Left: list ── */}
            <div className="w-[45%] border-r border-slate-100 flex flex-col min-h-0">
              <div className="overflow-y-auto flex-1 p-3 space-y-1.5">
                {loading ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="relative w-8 h-8">
                      <div className="absolute inset-0 border-2 border-slate-100 rounded-full" />
                      <div className="absolute inset-0 border-2 border-violet-400 rounded-full border-t-transparent animate-spin" />
                    </div>
                  </div>
                ) : records.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 space-y-3">
                    <div className="w-12 h-12 bg-violet-50 rounded-2xl flex items-center justify-center border border-violet-100">
                      <PhoneForwarded className="h-5 w-5 text-violet-300" />
                    </div>
                    <p className="text-sm text-slate-400 font-light">No transfers yet</p>
                  </div>
                ) : (
                  records.map((rec, idx) => (
                    <button
                      key={rec.id}
                      onClick={() => setSelected(rec)}
                      className={`w-full text-left rounded-2xl px-3.5 py-3 transition-all duration-150 animate-in fade-in slide-in-from-bottom-1 ${
                        selected?.id === rec.id
                          ? 'bg-violet-50 border border-violet-200'
                          : 'bg-slate-50/60 hover:bg-white border border-transparent hover:border-slate-200/80 hover:shadow-sm'
                      }`}
                      style={{ animationDelay: `${idx * 25}ms` }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-[11px] font-mono text-slate-400 truncate">{rec.call_id}</p>
                          <p className="text-xs font-light text-slate-700 truncate mt-0.5 leading-snug">{rec.transfer_reason}</p>
                        </div>
                        <span className={`shrink-0 text-[10px] font-medium rounded-lg px-2 py-0.5 ${
                          selected?.id === rec.id
                            ? 'bg-violet-100 text-violet-700 border border-violet-200'
                            : 'bg-slate-100 text-slate-500 border border-slate-200/60'
                        }`}>
                          {rec.call_status}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-light mt-1.5">
                        {new Date(rec.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* ── Right: detail ── */}
            <div className="flex-1 flex flex-col min-h-0">
              {selected ? (
                <div className="overflow-y-auto flex-1 p-5 space-y-3 animate-in fade-in slide-in-from-right-2 duration-200">
                  {/* Detail header */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-7 h-7 bg-gradient-to-br from-violet-50 to-indigo-50 rounded-lg flex items-center justify-center border border-violet-100">
                      <PhoneForwarded className="h-3.5 w-3.5 text-violet-500" />
                    </div>
                    <div>
                      <p className="text-xs font-light text-slate-800">Transfer Detail</p>
                      <p className="text-[10px] font-mono text-slate-400">{selected.call_id}</p>
                    </div>
                  </div>

                  {/* Fields */}
                  {detailFields.map(({ label, value }) =>
                    value ? (
                      <div key={label}>
                        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide mb-0.5">{label}</p>
                        <p className="text-sm text-slate-700 font-light leading-snug">{value}</p>
                      </div>
                    ) : null
                  )}

                  {/* Metadata tags */}
                  {selected.metadata && Object.keys(selected.metadata).length > 0 && (
                    <div>
                      <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide mb-1.5">Metadata</p>
                      <div className="flex flex-wrap gap-1.5">
                        {Object.entries(selected.metadata).map(([k, v]) => (
                          <span key={k} className="bg-indigo-50 text-indigo-600 text-[10px] font-mono border border-indigo-100 rounded-lg px-2 py-0.5">
                            {k}: {String(v)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8 text-center">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-200">
                    <ChevronRight className="h-5 w-5 text-slate-300" />
                  </div>
                  <p className="text-sm text-slate-400 font-light">Select a transfer to view details</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}



function CallTransfersSection() {
  const [records, setRecords] = useState<CallTransferRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    const fetchTransfers = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/reports/voice-agent-transfer-webhooks/`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Token ${Cookies.get('Token') || ''}`,
            },
          }
        )
        const data = await res.json()
        if (Array.isArray(data)) setRecords(data)
      } catch (err) {
        console.error('Error fetching call transfers:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchTransfers()
  }, [])

  return (
    <>
      <CallTransfersModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        records={records}
        loading={loading}
      />

      <button
        onClick={() => setModalOpen(true)}
        className="group relative w-full text-left overflow-hidden bg-white border border-violet-100 hover:border-violet-300/70 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all duration-300"
      >
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-violet-400/10 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-50 to-indigo-50 rounded-2xl flex items-center justify-center border border-violet-100 shrink-0">
              <PhoneForwarded className="h-4 w-4 text-violet-500" />
            </div>
            <div>
              <p className="text-xs font-light tracking-wide text-slate-500">Calls Transferred to Human</p>
              {loading ? (
                <div className="h-8 w-12 bg-slate-100 rounded-lg animate-pulse mt-0.5" />
              ) : (
                <p className="text-3xl font-extralight text-slate-900 tracking-tight">
                  {records.length}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-violet-50 group-hover:bg-violet-100 border border-violet-100 group-hover:border-violet-200 rounded-xl px-3 py-1.5 transition-all duration-200">
            <span className="text-xs font-light text-violet-600">View all</span>
            <ChevronRight className="h-3 w-3 text-violet-500 group-hover:translate-x-0.5 transition-transform duration-200" />
          </div>
        </div>

        <div className="relative mt-4 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          <div className="flex-1 h-px bg-gradient-to-r from-violet-200/60 to-transparent" />
          <span className="text-[10px] font-light text-slate-400 tracking-wide">AI → Human escalations · click to explore</span>
        </div>
      </button>
    </>
  )
}



// ─── AI Agent Failures types & components ────────────────────────────────────

interface AIFailureRecord {
  id: number
  event_type: string
  status: string
  status_code: number | null
  metadata: {
    error?: string
    model?: string
    details?: string
    agent_id?: number
    provider?: string
    conversation_id?: string
    [key: string]: unknown
  }
  company: number
  created_at: string
}

function AIFailuresModal({
  open,
  onClose,
  records,
  loading,
}: {
  open: boolean
  onClose: () => void
  records: AIFailureRecord[]
  loading: boolean
}) {
  const [selected, setSelected] = useState<AIFailureRecord | null>(null)

  useEffect(() => {
    if (!open) setSelected(null)
  }, [open])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  const detailFields: { label: string; value: string | null }[] = selected ? [
    { label: 'Event Type', value: selected.event_type },
    { label: 'Status', value: selected.status },
    { label: 'Status Code', value: selected.status_code != null ? String(selected.status_code) : null },
    { label: 'Error', value: selected.metadata?.error || null },
    { label: 'Model', value: selected.metadata?.model || null },
    { label: 'Provider', value: selected.metadata?.provider || null },
    { label: 'Details', value: selected.metadata?.details || null },
    { label: 'Agent ID', value: selected.metadata?.agent_id != null ? String(selected.metadata.agent_id) : null },
    { label: 'Conversation', value: selected.metadata?.conversation_id || null },
    {
      label: 'Created',
      value: new Date(selected.created_at).toLocaleString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      }),
    },
  ] : []

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" />
      <div
        className="relative z-10 w-full max-w-3xl max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col h-full">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-rose-50 to-red-50 rounded-xl flex items-center justify-center border border-rose-100">
                <AlertTriangle className="h-4 w-4 text-rose-500" />
              </div>
              <div>
                <h2 className="text-lg font-extralight tracking-tight text-slate-900">AI Agent Failures</h2>
                <p className="text-xs text-slate-500 font-light tracking-wide mt-0.5">
                  {records.length} failure{records.length !== 1 ? 's' : ''} recorded
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all duration-200 group"
            >
              <X className="h-4 w-4 text-slate-500 group-hover:text-slate-700" />
            </button>
          </div>

          {/* Body — two columns */}
          <div className="flex flex-1 min-h-0">

            {/* Left: list */}
            <div className="w-[45%] border-r border-slate-100 flex flex-col min-h-0">
              <div className="overflow-y-auto flex-1 p-3 space-y-1.5">
                {loading ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="relative w-8 h-8">
                      <div className="absolute inset-0 border-2 border-slate-100 rounded-full" />
                      <div className="absolute inset-0 border-2 border-rose-400 rounded-full border-t-transparent animate-spin" />
                    </div>
                  </div>
                ) : records.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 space-y-3">
                    <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center border border-rose-100">
                      <AlertTriangle className="h-5 w-5 text-rose-300" />
                    </div>
                    <p className="text-sm text-slate-400 font-light">No failures recorded</p>
                  </div>
                ) : (
                  records.map((rec, idx) => (
                    <button
                      key={rec.id}
                      onClick={() => setSelected(rec)}
                      className={`w-full text-left rounded-2xl px-3.5 py-3 transition-all duration-150 animate-in fade-in slide-in-from-bottom-1 ${
                        selected?.id === rec.id
                          ? 'bg-rose-50 border border-rose-200'
                          : 'bg-slate-50/60 hover:bg-white border border-transparent hover:border-slate-200/80 hover:shadow-sm'
                      }`}
                      style={{ animationDelay: `${idx * 25}ms` }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-[11px] font-mono text-slate-400 truncate">{rec.metadata?.error || rec.event_type}</p>
                          <p className="text-xs font-light text-slate-700 truncate mt-0.5 leading-snug">{rec.metadata?.model || rec.status}</p>
                        </div>
                        <span className={`shrink-0 text-[10px] font-medium rounded-lg px-2 py-0.5 ${
                          selected?.id === rec.id
                            ? 'bg-rose-100 text-rose-700 border border-rose-200'
                            : 'bg-slate-100 text-slate-500 border border-slate-200/60'
                        }`}>
                          {rec.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-light mt-1.5">
                        {new Date(rec.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Right: detail */}
            <div className="flex-1 flex flex-col min-h-0">
              {selected ? (
                <div className="overflow-y-auto flex-1 p-5 space-y-3 animate-in fade-in slide-in-from-right-2 duration-200">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-7 h-7 bg-gradient-to-br from-rose-50 to-red-50 rounded-lg flex items-center justify-center border border-rose-100">
                      <AlertTriangle className="h-3.5 w-3.5 text-rose-500" />
                    </div>
                    <div>
                      <p className="text-xs font-light text-slate-800">Failure Detail</p>
                      <p className="text-[10px] font-mono text-slate-400">ID: {selected.id}</p>
                    </div>
                  </div>

                  {detailFields.map(({ label, value }) =>
                    value ? (
                      <div key={label}>
                        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide mb-0.5">{label}</p>
                        <p className="text-sm text-slate-700 font-light leading-snug break-all">{value}</p>
                      </div>
                    ) : null
                  )}

                  {/* Extra metadata tags */}
                  {selected.metadata && Object.keys(selected.metadata).filter(k => !['error','model','details','agent_id','provider','conversation_id'].includes(k)).length > 0 && (
                    <div>
                      <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide mb-1.5">Additional Metadata</p>
                      <div className="flex flex-wrap gap-1.5">
                        {Object.entries(selected.metadata)
                          .filter(([k]) => !['error','model','details','agent_id','provider','conversation_id'].includes(k))
                          .map(([k, v]) => (
                            <span key={k} className="bg-rose-50 text-rose-600 text-[10px] font-mono border border-rose-100 rounded-lg px-2 py-0.5">
                              {k}: {String(v)}
                            </span>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8 text-center">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-200">
                    <ChevronRight className="h-5 w-5 text-slate-300" />
                  </div>
                  <p className="text-sm text-slate-400 font-light">Select a failure to view details</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

function AIFailuresSection() {
  const [records, setRecords] = useState<AIFailureRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    const fetchFailures = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/reports/ai-agent-failures/`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Token ${Cookies.get('Token') || ''}`,
            },
          }
        )
        const data = await res.json()
        if (Array.isArray(data)) setRecords(data)
      } catch (err) {
        console.error('Error fetching AI failures:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchFailures()
  }, [])

  return (
    <>
      <AIFailuresModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        records={records}
        loading={loading}
      />

      <button
        onClick={() => setModalOpen(true)}
        className="group relative w-full text-left overflow-hidden bg-white border border-rose-100 hover:border-rose-300/70 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all duration-300"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-rose-400/10 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-50 to-red-50 rounded-2xl flex items-center justify-center border border-rose-100 shrink-0">
              <AlertTriangle className="h-4 w-4 text-rose-500" />
            </div>
            <div>
              <p className="text-xs font-light tracking-wide text-slate-500">AI Agent Failures</p>
              {loading ? (
                <div className="h-8 w-12 bg-slate-100 rounded-lg animate-pulse mt-0.5" />
              ) : (
                <p className="text-3xl font-extralight text-slate-900 tracking-tight">
                  {records.length}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-rose-50 group-hover:bg-rose-100 border border-rose-100 group-hover:border-rose-200 rounded-xl px-3 py-1.5 transition-all duration-200">
            <span className="text-xs font-light text-rose-600">View all</span>
            <ChevronRight className="h-3 w-3 text-rose-500 group-hover:translate-x-0.5 transition-transform duration-200" />
          </div>
        </div>

        <div className="relative mt-4 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
          <div className="flex-1 h-px bg-gradient-to-r from-rose-200/60 to-transparent" />
          <span className="text-[10px] font-light text-slate-400 tracking-wide">Error logs · click to explore</span>
        </div>
      </button>
    </>
  )
}


// ─── Page ─────────────────────────────────────────────────────────────────────



// ─── Recent Activity Section ──────────────────────────────────────────────────

type RecentConv = {
  session_id: string
  caller_number: string
  phonenumber: string
  start_time: string
  duration_sec: number | null
  summary: string | null
}

function RecentActivitySection() {
  const [convs, setConvs] = useState<RecentConv[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    setLoading(true)
    async function load() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/conversations/messages/conversations/?page=${currentPage}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${Cookies.get("Token") || ""}`,
            },
          }
        )
        if (!res.ok) return
        const data = await res.json()
        setTotalPages(data.total_pages || 1)
        const allMsgs: any[] = data.results ? (Object.values(data.results) as any[][]).flat() : []

        const bySession: Record<string, any[]> = {}
        for (const msg of allMsgs) {
          if (!bySession[msg.session_id]) bySession[msg.session_id] = []
          bySession[msg.session_id].push(msg)
        }

        const sorted = Object.entries(bySession)
          .filter(([, msgs]) => Array.isArray(msgs) && msgs.length > 0 && msgs[0]?.timestamp)
          .sort((a, b) => {
            const tA = new Date(a[1][0].timestamp).getTime()
            const tB = new Date(b[1][0].timestamp).getTime()
            return tB - tA
          })
          .map(([session_id, msgs]) => {
            const chronological = [...msgs].sort(
              (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
            )
            const first = chronological[0]
            const summaryMsg = chronological.find((m) => m.type === "summary")
            const duration_sec = summaryMsg
              ? Math.floor(
                  (new Date(summaryMsg.timestamp).getTime() - new Date(first.timestamp).getTime()) / 1000
                )
              : null
            return {
              session_id,
              caller_number: first.caller_number || "Unknown",
              phonenumber: first.phonenumber || "",
              start_time: first.timestamp,
              duration_sec,
              summary: summaryMsg?.summary || null,
            }
          })

        setConvs(sorted)
      } catch (err) {
        console.error("Recent activity fetch error:", err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [currentPage])

  if (!loading && convs.length === 0) return null

  return (
    <div className="group relative overflow-hidden bg-white border border-indigo-100 shadow-sm hover:shadow-md rounded-3xl transition-all duration-300 flex flex-col">
      {/* Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-400/8 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Header strip */}
      <div className="relative flex items-center justify-between px-5 py-4 bg-indigo-50 rounded-t-3xl border-b border-indigo-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white rounded-2xl flex items-center justify-center border border-indigo-100">
            <Phone className="h-4 w-4 text-indigo-500" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-800">Recent Activity</h3>
            <p className="text-xs text-slate-400 font-light">
              {loading ? "Loading…" : `${convs.length} recent call${convs.length !== 1 ? "s" : ""}`}
            </p>
          </div>
        </div>
        <a
          href="/conversations"
          className="flex items-center gap-1.5 bg-white hover:bg-indigo-100 border border-indigo-100 rounded-xl px-3 py-1.5 transition-colors duration-200"
        >
          <span className="text-xs font-light text-indigo-600">View all</span>
          <ChevronRight className="h-3 w-3 text-indigo-500" />
        </a>
      </div>

        {/* Scrollable list */}
        <div className="overflow-y-auto" style={{ maxHeight: "18rem" }}>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-100/60 last:border-0 animate-pulse">
                <div className="w-9 h-9 rounded-2xl bg-slate-100 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-slate-100 rounded-full w-28" />
                  <div className="h-2.5 bg-slate-50 rounded-full w-44" />
                </div>
                <div className="space-y-1.5 text-right">
                  <div className="h-2.5 bg-slate-100 rounded-full w-10" />
                  <div className="h-2 bg-slate-50 rounded-full w-14" />
                </div>
              </div>
            ))
          ) : (
            convs.map((conv, idx) => {
              const date = new Date(conv.start_time)
              const timeStr = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
              const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
              const durStr =
                conv.duration_sec != null
                  ? conv.duration_sec < 60
                    ? `${conv.duration_sec}s`
                    : `${Math.floor(conv.duration_sec / 60)}m ${conv.duration_sec % 60}s`
                  : null

              return (
                <div
                  key={conv.session_id}
                  className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-100/60 last:border-0 hover:bg-slate-50/70 transition-colors duration-150 animate-in fade-in slide-in-from-bottom-1"
                  style={{ animationDelay: `${idx * 35}ms` }}
                >
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100/60 flex items-center justify-center shrink-0">
                    <Phone className="h-3.5 w-3.5 text-indigo-400" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate">
                      {conv.caller_number}
                    </p>
                    <p className="text-xs text-slate-400 font-light truncate">
                      {conv.phonenumber ? `→ ${conv.phonenumber}` : ""}
                      {typeof conv.summary === "string" && conv.summary.length > 0
                        ? `${conv.phonenumber ? " · " : ""}${conv.summary.slice(0, 55)}${conv.summary.length > 55 ? "…" : ""}`
                        : ""}
                    </p>
                  </div>

                  {/* Meta */}
                  <div className="text-right shrink-0 space-y-0.5">
                    <p className="text-xs text-slate-500 font-light">{timeStr}</p>
                    <p className="text-[10px] text-slate-400 font-light">{dateStr}</p>
                    {durStr && (
                      <p className="text-[10px] font-medium text-indigo-400">{durStr}</p>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && !loading && (
          <div className="px-5 py-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="inline-flex items-center gap-1.5 text-xs font-light text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:text-slate-800 transition-colors"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Previous
            </button>

            <span className="text-[10px] font-light text-slate-400 tracking-wide">
              Page {currentPage} of {totalPages}
            </span>

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="inline-flex items-center gap-1.5 text-xs font-light text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:text-slate-800 transition-colors"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Bottom bar */}
        {!loading && convs.length > 0 && (
          <div className="relative px-5 py-2.5 border-t border-slate-100/60 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            <div className="flex-1 h-px bg-gradient-to-r from-indigo-200/50 to-transparent" />
            <span className="text-[10px] font-light text-slate-400 tracking-wide">
              Showing latest {convs.length} calls
            </span>
          </div>
        )}
      </div>
  )
}



export default function DashboardPage() {
  const [twilioNumbers, setTwilioNumbers] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [mapOpen, setMapOpen] = useState(false)
  const [currentPhoneIdx, setCurrentPhoneIdx] = useState(0)
  const [phoneModalOpen, setPhoneModalOpen] = useState(false)
  const { startTutorial } = useTutorial()


  // ── Read category from localStorage and derive the item label ─────────────
  const [itemLabel, setItemLabel] = useState<string>('complaint')
  const [isMunicipal, setIsMunicipal] = useState(false)
  const [isFood, setIsFood] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)


  useEffect(() => {
    const category = localStorage.getItem('category')
    setItemLabel(getItemLabel(category))
    const norm = category?.trim().toLowerCase() ?? ''
    setIsMunicipal(norm === 'municipal services')
    setIsFood(FOOD_CATEGORIES.has(norm))
  }, [])


  const itemLabelCap = itemLabel.charAt(0).toUpperCase() + itemLabel.slice(1)


  useEffect(() => {
    const checkAndStartTutorial = async () => {
      try {
        const tutorialSetup = localStorage.getItem("tutorial_setup")
        const tutorialArray: number[] = tutorialSetup ? JSON.parse(tutorialSetup) : []
       
        if (tutorialArray.includes(1) && !tutorialArray.includes(9)) {
          window.location.href = "/dashboard/agents"
          return
        }


        if (!tutorialArray || !tutorialArray.includes(9)) {
          void startTutorial().catch((e) => console.error("Tutorial start failed:", e))
        }
      } catch (err) {
        console.error("Error checking tutorial progress:", err)
      }
    }


    checkAndStartTutorial()
    // Intentionally once on mount; startTutorial is stable enough for initial dashboard tour
  }, [])


  useEffect(() => {
    const fetchTwilioPhones = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/public/company/get-twilio-phones`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${Cookies.get("Token") || ""}`,
            },
          }
        )


        const data = await res.json()


        if (Array.isArray(data.twilio_phone_numbers)) {
          setTwilioNumbers(data.twilio_phone_numbers)
        }
      } catch (error) {
        console.error("Error fetching Twilio numbers:", error)
      } finally {
        setLoading(false)
      }
    }


    fetchTwilioPhones()
  }, [])


  const handleCopy = (number: string, index: number) => {
    navigator.clipboard.writeText(number)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }


  return (
    <div className="relative min-h-screen" style={{ background: "var(--canvas)" }}>


      {/* Map dialog — rendered at root level so it sits above everything */}
      <MapDialog open={mapOpen} onClose={() => setMapOpen(false)} itemLabelCap={itemLabelCap} />

      {/* Calendar modal — rendered at root level */}
      <CalendarModal open={calendarOpen} onClose={() => setCalendarOpen(false)} itemLabelCap={itemLabelCap} />


      <div className="relative z-30 max-w-[1600px] mx-auto px-6 py-8 space-y-6">
        <div className="animate-in fade-in slide-in-from-top-2 duration-500">
          <MetricsHeader />
        </div>


        {/* Map preview banner + Municipal contacts — only visible for 'municipal services' */}
        {isMunicipal && (
          <>
            <div className="animate-in fade-in slide-in-from-top-2 duration-500 delay-50">
              <MapPreviewBanner onOpen={() => setMapOpen(true)} itemLabelCap={itemLabelCap} />
            </div>
            <MunicipalContactsSection />
          </>
        )}

        {/* Calendar preview banner + Food Order KPIs — only visible for food / restaurant categories */}
        {isFood && (
          <>
            <div className="animate-in fade-in slide-in-from-top-2 duration-500 delay-50">
              <CalendarPreviewBanner onOpen={() => setCalendarOpen(true)} itemLabelCap={itemLabelCap} />
            </div>
            <FoodOrdersSection />
          </>
        )}

        {/* Phone Numbers modal — hidden dialog, rendered at root level */}
        <PhoneNumbersModal
          open={phoneModalOpen}
          onClose={() => setPhoneModalOpen(false)}
          numbers={twilioNumbers}
          copiedIndex={copiedIndex}
          onCopy={handleCopy}
        />

        <div className="grid grid-cols-12 gap-6 animate-in fade-in duration-500 delay-75">

          {/* ── Left column: KPI cards only ── */}
          <div className="col-span-12 lg:col-span-4 xl:col-span-3">
            <KPICards />
          </div>

          {/* ── Right column: Metrics + [Calls+Phone | Recent Activity] ── */}
          <div className="col-span-12 lg:col-span-8 xl:col-span-9 flex flex-col gap-6">
            <MetricsGrid />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">

              {/* Left stack: Calls Transferred + AI Failures + Phone Numbers */}
              <div className="flex flex-col gap-5">

                {/* Calls Transferred — violet */}
                <div><CallTransfersSection /></div>

                {/* AI Agent Failures — rose */}
                <div><AIFailuresSection /></div>

                {/* Phone Numbers — amber */}
                <Card className="group relative overflow-hidden border shadow-sm hover:shadow-md rounded-2xl transition-all duration-300" style={{ background: "var(--paper)", borderColor: "var(--border-1)" }}>
                  <CardHeader className="relative pb-2 pt-4 px-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative w-9 h-9 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl flex items-center justify-center border border-amber-200/60">
                          <Phone className="h-4 w-4 text-amber-600" />
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                        </div>
                        <div>
                          <CardTitle className="text-sm font-medium text-slate-800">Phone Numbers</CardTitle>
                          <p className="text-xs text-amber-500/80 mt-0.5">
                            {twilioNumbers.length} active {twilioNumbers.length === 1 ? 'number' : 'numbers'}
                          </p>
                        </div>
                      </div>
                      {twilioNumbers.length > 1 && (
                        <button
                          onClick={() => setPhoneModalOpen(true)}
                          className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl px-3 py-1.5 transition-colors"
                        >
                          <span className="text-xs font-light text-amber-700">View all</span>
                          <ExternalLink className="h-3 w-3 text-amber-600" />
                        </button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="relative pt-0 px-5 pb-4">
                    {loading ? (
                      <div className="flex items-center justify-center py-4">
                        <div className="relative w-7 h-7">
                          <div className="absolute inset-0 border-2 border-amber-100 rounded-full" />
                          <div className="absolute inset-0 border-2 border-amber-500 rounded-full border-t-transparent animate-spin" />
                        </div>
                      </div>
                    ) : twilioNumbers.length === 0 ? (
                      <div className="flex items-center gap-3 py-3">
                        <Phone className="h-4 w-4 text-amber-300" />
                        <p className="text-sm text-slate-400 font-light">No numbers assigned yet</p>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setCurrentPhoneIdx(i => (i - 1 + twilioNumbers.length) % twilioNumbers.length)}
                            disabled={twilioNumbers.length <= 1}
                            className="w-8 h-8 shrink-0 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200/60 flex items-center justify-center transition-colors disabled:opacity-30"
                          >
                            <ArrowLeft className="h-3.5 w-3.5 text-amber-600" />
                          </button>
                          <div className="flex-1 flex items-center justify-between bg-amber-50/60 rounded-xl px-4 py-2.5 border border-amber-200/50 min-w-0">
                            <p className="text-sm font-mono font-medium text-slate-800 tracking-wide truncate">
                              {twilioNumbers[currentPhoneIdx]}
                            </p>
                            <div className="flex items-center gap-2 shrink-0 ml-3">
                              {twilioNumbers.length > 1 && (
                                <span className="text-[10px] text-amber-400">{currentPhoneIdx + 1}/{twilioNumbers.length}</span>
                              )}
                              <button
                                onClick={() => handleCopy(twilioNumbers[currentPhoneIdx], currentPhoneIdx)}
                                className="w-6 h-6 bg-white hover:bg-amber-50 rounded-lg border border-amber-200/50 flex items-center justify-center transition-colors"
                              >
                                {copiedIndex === currentPhoneIdx ? (
                                  <CheckCircle2 className="h-3 w-3 text-amber-600" />
                                ) : (
                                  <Copy className="h-3 w-3 text-amber-400 hover:text-amber-600" />
                                )}
                              </button>
                            </div>
                          </div>
                          <button
                            onClick={() => setCurrentPhoneIdx(i => (i + 1) % twilioNumbers.length)}
                            disabled={twilioNumbers.length <= 1}
                            className="w-8 h-8 shrink-0 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200/60 flex items-center justify-center transition-colors disabled:opacity-30"
                          >
                            <ArrowRight className="h-3.5 w-3.5 text-amber-600" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                          <div className="flex-1 h-px bg-gradient-to-r from-amber-200/60 to-transparent" />
                          <span className="text-[10px] font-light text-amber-400 tracking-wide">Active & ready</span>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right: Recent Activity — indigo, full height */}
              <RecentActivitySection />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
