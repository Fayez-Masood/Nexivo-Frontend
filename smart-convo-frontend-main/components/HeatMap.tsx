// 'use client'

// import { useEffect, useRef, useState } from 'react'
// import L from 'leaflet'
// import 'leaflet/dist/leaflet.css'
// import { geocodeLocation } from '@/lib/geocode'

// // ─── Types ────────────────────────────────────────────────────────────────────

// interface GeocodedPoint {
//   location: string
//   value: number
//   lat: number
//   lng: number
//   normalized: number
// }

// // ─── Hardcoded data ───────────────────────────────────────────────────────────

// const RAW_DATA: Record<string, number> = {
//   'United States':       9800,
//   'United Kingdom':      8500,
//   'Japan':               8100,
//   'Mumbai, India':       8900,
//   'Paris, France':       7700,
//   'Toronto, Canada':     6300,
//   'Seoul, South Korea':  6700,
//   'Ontario, Canada':     5400,
//   'British Columbia':    3900,
//   'Bavaria, Germany':    2800,
//   'M5V, Toronto':        1200,
//   'SW1A, London':        980,
//   'Lahore, Pakistan':    4800,
//   'Karachi, Pakistan':   6200,
//   'Dubai, UAE':          5100,
//   'São Paulo, Brazil':   5300,
//   'Cairo, Egypt':        3800,
//   'Lagos, Nigeria':      3200,
//   'Sydney, Australia':   5900,
//   'Singapore':           5500,
//   'Bangkok, Thailand':   3700,
// }

// const INITIAL_CENTER: [number, number] = [25, 15]
// const INITIAL_ZOOM = 2

// // ─── Component ────────────────────────────────────────────────────────────────

// export default function HeatMap() {
//   const containerRef = useRef<HTMLDivElement>(null)
//   const mapRef       = useRef<L.Map | null>(null)
//   const [points, setPoints]     = useState<GeocodedPoint[]>([])
//   const [loading, setLoading]   = useState(true)
//   const [progress, setProgress] = useState(0)

//   // ── Geocode ────────────────────────────────────────────────────────────────
//   useEffect(() => {
//     const entries = Object.entries(RAW_DATA)
//     const total   = entries.length
//     let   done    = 0

//     async function run() {
//       setLoading(true)
//       const results: GeocodedPoint[] = []

//       for (const [location, value] of entries) {
//         const coords = await geocodeLocation(location)
//         done++
//         setProgress(Math.round((done / total) * 100))
//         if (coords) results.push({ location, value, ...coords, normalized: 0 })
//         if (done < total) await new Promise((r) => setTimeout(r, 1100))
//       }

//       const max  = Math.max(...results.map((p) => p.value))
//       const min  = Math.min(...results.map((p) => p.value))
//       const span = max - min || 1

//       setPoints(results.map((p) => ({ ...p, normalized: (p.value - min) / span })))
//       setLoading(false)
//     }

//     run()
//   }, [])

//   // ── Init map ───────────────────────────────────────────────────────────────
//   useEffect(() => {
//     if (!containerRef.current || mapRef.current) return

//     const map = L.map(containerRef.current, {
//       center:             INITIAL_CENTER,
//       zoom:               INITIAL_ZOOM,
//       zoomControl:        false,
//       attributionControl: false,
//     })
//     mapRef.current = map

//     // Light minimal tile — no account needed
//     L.tileLayer(
//       'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png',
//       { subdomains: 'abcd', maxZoom: 19 }
//     ).addTo(map)

//     L.control.zoom({ position: 'bottomright' }).addTo(map)

//     return () => { map.remove(); mapRef.current = null }
//   }, [])

//   // ── Heatmap layer ──────────────────────────────────────────────────────────
//   useEffect(() => {
//     if (!mapRef.current || points.length === 0) return

//     const heatData = points.map(
//       (p) => [p.lat, p.lng, p.normalized] as [number, number, number]
//     )

//     import('leaflet.heat').then(() => {
//       if (!mapRef.current) return
//       // @ts-ignore
//       L.heatLayer(heatData, {
//         radius:     55,
//         blur:       45,
//         maxZoom:    10,
//         max:        1.0,
//         minOpacity: 0.3,
//         gradient: {
//           0.00: '#e0f2fe',   // sky-100  — barely visible (lowest)
//           0.25: '#7dd3fc',   // sky-300
//           0.50: '#3b82f6',   // blue-500
//           0.75: '#6366f1',   // indigo-500
//           1.00: '#4f46e5',   // indigo-600 — richest (highest)
//         },
//       }).addTo(mapRef.current)
//     })
//   }, [points])

//   // ── Dot markers ───────────────────────────────────────────────────────────
//   useEffect(() => {
//     if (!mapRef.current || points.length === 0) return

//     points.forEach((p) => {
//       // light blue → deep indigo
//       const r = Math.round(99  - p.normalized * 50)
//       const g = Math.round(102 - p.normalized * 55)
//       const b = Math.round(241 - p.normalized * 10)
//       const fillColor = `rgb(${r},${g},${b})`

//       const marker = L.circleMarker([p.lat, p.lng], {
//         radius:      3 + p.normalized * 6,
//         fillColor,
//         color:       '#ffffff',
//         weight:      1.5,
//         opacity:     0.9,
//         fillOpacity: 0.95,
//       })

//       marker.bindTooltip(
//         `<div style="
//           font-family: system-ui, sans-serif;
//           background: #ffffff;
//           border: 1px solid #e2e8f0;
//           border-radius: 12px;
//           padding: 10px 14px;
//           box-shadow: 0 4px 24px rgba(0,0,0,0.10);
//           min-width: 150px;
//         ">
//           <div style="font-weight:800;font-size:13px;color:#1e293b">
//             ${p.location}
//           </div>
//           <div style="font-size:12px;color:#64748b;margin-top:3px">
//             ${p.value.toLocaleString()} students
//           </div>
//           <div style="
//             margin-top:8px;
//             height:4px;
//             border-radius:99px;
//             background:linear-gradient(to right,#e0f2fe,#4f46e5);
//             position:relative;
//           ">
//             <div style="
//               position:absolute;
//               top:-3px;
//               left:${Math.round(p.normalized * 100)}%;
//               transform:translateX(-50%);
//               width:10px;height:10px;
//               border-radius:50%;
//               background:#4f46e5;
//               border:2px solid white;
//               box-shadow:0 1px 4px rgba(0,0,0,0.2);
//             "></div>
//           </div>
//         </div>`,
//         {
//           sticky:    true,
//           opacity:   1,
//           className: 'leaflet-tooltip-clean',
//         }
//       )

//       marker.addTo(mapRef.current!)
//     })
//   }, [points])

//   const minVal = points.length ? Math.min(...points.map((p) => p.value)) : 0
//   const maxVal = points.length ? Math.max(...points.map((p) => p.value)) : 0

//   return (
//     <div className="relative w-full h-[420px] sm:h-[580px] lg:h-[720px] rounded-3xl overflow-hidden shadow-lg border border-slate-200 bg-slate-50">

//       {/* Map */}
//       <div ref={containerRef} className="w-full h-full" />

//       {/* Loading overlay */}
//       {loading && (
//         <div className="absolute inset-0 z-[2000] flex flex-col items-center justify-center gap-4 bg-white/90 backdrop-blur-sm">
//           <div className="w-10 h-10 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
//           <div className="flex flex-col items-center gap-2">
//             <p className="text-xs font-bold tracking-widest uppercase text-slate-400">
//               Mapping locations
//             </p>
//             <div className="w-40 h-1.5 rounded-full bg-slate-100 overflow-hidden">
//               <div
//                 className="h-full rounded-full bg-indigo-500 transition-all duration-300"
//                 style={{ width: `${progress}%` }}
//               />
//             </div>
//             <p className="text-[11px] text-slate-400">{progress}%</p>
//           </div>
//         </div>
//       )}

//       {/* Title overlay */}
//       {!loading && (
//         <div className="absolute top-4 left-4 z-[1000] pointer-events-none">
//           <div className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl px-4 py-3 shadow-sm">
//             <p className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-400">
//               Global Reach
//             </p>
//             <h3 className="text-base sm:text-xl font-black text-slate-800 leading-tight">
//               Students Worldwide
//             </h3>
//             <p className="text-[11px] text-slate-400 mt-0.5">
//               {points.length} locations mapped
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Legend */}
//       {!loading && (
//         <div className="absolute bottom-4 left-4 z-[1000] pointer-events-none bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl p-3 sm:p-4 shadow-sm">
//           <p className="text-[10px] font-black tracking-widest uppercase text-slate-400 mb-2">
//             Student Density
//           </p>
//           <div
//             className="w-28 sm:w-44 h-2 rounded-full"
//             style={{
//               background: 'linear-gradient(to right, #e0f2fe, #7dd3fc, #3b82f6, #6366f1, #4f46e5)',
//             }}
//           />
//           <div className="flex justify-between mt-1.5">
//             <span className="text-[10px] text-slate-400">
//               {minVal.toLocaleString()}
//             </span>
//             <span className="text-[10px] text-slate-400">
//               {maxVal.toLocaleString()}
//             </span>
//           </div>
//         </div>
//       )}

//       {/* Clean tooltip styles */}
//       <style>{`
//         .leaflet-tooltip-clean {
//           background: transparent !important;
//           border: none !important;
//           box-shadow: none !important;
//           padding: 0 !important;
//         }
//         .leaflet-tooltip-clean::before {
//           display: none !important;
//         }
//         .leaflet-zoom-in,
//         .leaflet-zoom-out {
//           background: white !important;
//           border: 1px solid #e2e8f0 !important;
//           color: #475569 !important;
//           border-radius: 8px !important;
//         }
//       `}</style>
//     </div>
//   )
// }







'use client'



import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import Cookies from 'js-cookie'


const SUMMARY_TRUNCATE = 80


// ─── Types ────────────────────────────────────────────────────────────────────




interface AggregatedPoint {
  postal_code: string
  count: number
  latitude: number
  longitude: number
  normalized: number
  external_case_ids: string[]
  summaries: string[]
}




const INITIAL_CENTER: [number, number] = [45.5, -75.7]
const INITIAL_ZOOM = 10




// ─── Spectrum colour stops (light → dark, multi-hue) ─────────────────────────




const SPECTRUM_STOPS = [
  { stop: 0.00, r: 0,   g: 255, b: 150 }, // neon mint
{ stop: 0.25, r: 0,   g: 120, b: 255 }, // electric blue
{ stop: 0.50, r: 255, g: 0,   b: 90  }, // hot pink
{ stop: 0.75, r: 180, g: 0,   b: 255 }, // neon violet
{ stop: 1.00, r: 80,  g: 0,   b: 200 }  // deep neon purple
]




function spectrumColor(t: number): string {
  for (let i = 1; i < SPECTRUM_STOPS.length; i++) {
    if (t <= SPECTRUM_STOPS[i].stop) {
      const prev  = SPECTRUM_STOPS[i - 1]
      const curr  = SPECTRUM_STOPS[i]
      const local = (t - prev.stop) / (curr.stop - prev.stop)
      return `rgb(${Math.round(prev.r + (curr.r - prev.r) * local)},${Math.round(prev.g + (curr.g - prev.g) * local)},${Math.round(prev.b + (curr.b - prev.b) * local)})`
    }
  }
  const last = SPECTRUM_STOPS[SPECTRUM_STOPS.length - 1]
  return `rgb(${last.r},${last.g},${last.b})`
}



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


// ─── Full-list popup (React) ──────────────────────────────────────────────────

function CaseRow({ id, summary, isFirst }: { id: string; summary: string; isFirst: boolean }) {
  const [expanded, setExpanded] = useState(false)
  const isTruncated = summary.length > SUMMARY_TRUNCATE

  return (
    <div className={`flex items-start gap-3 py-3 ${isFirst ? '' : 'border-t border-slate-100'}`}>
      <span className="flex-shrink-0 text-[10px] font-medium text-violet-700 bg-violet-50 rounded-md px-2 py-0.5 mt-0.5 tracking-wide">
        #{id}
      </span>
      <span className="text-xs font-light text-slate-500 leading-relaxed">
        {expanded || !isTruncated ? summary : summary.slice(0, SUMMARY_TRUNCATE) + '…'}
        {isTruncated && (
          <button
            onClick={() => setExpanded(v => !v)}
            className="ml-1 text-[10px] text-violet-500 hover:text-violet-700 transition-colors"
          >
            {expanded ? 'less' : 'see more'}
          </button>
        )}
      </span>
    </div>
  )
}

function FullListPopup({
  point,
  itemLabel,
  onClose,
}: {
  point: AggregatedPoint
  itemLabel: string
  onClose: () => void
}) {
  const [flashRed, setFlashRed] = useState(false)

  const triggerFlash = () => {
    setFlashRed(true)
    setTimeout(() => setFlashRed(false), 1000)
  }

  // Flash X on Escape instead of closing
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') triggerFlash() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [])

  return (
    <div
      className="absolute inset-0 z-[4000] flex items-center justify-center p-6"
      onClick={triggerFlash}  // backdrop click → flash, NOT close
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-slate-100">
          <div>
            <p className="text-[10px] font-light tracking-[0.2em] uppercase text-slate-400 mb-0.5">
              {itemLabel} list
            </p>
            <h2 className="text-lg font-extralight tracking-tight text-slate-900">
              {point.postal_code}
            </h2>
            <p className="text-xs font-light text-slate-400 mt-0.5">
              {point.count.toLocaleString()} {itemLabel}{point.count !== 1 ? 's' : ''}
            </p>
          </div>
          {/* X button — flashes red on outside click, closes only when directly clicked */}
          <button
            onClick={(e) => { e.stopPropagation(); onClose() }}
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 mt-0.5 ${
              flashRed
                ? 'bg-red-100 scale-110'
                : 'bg-slate-100 hover:bg-slate-200'
            }`}
          >
            <span className={`text-sm leading-none transition-colors duration-200 ${
              flashRed ? 'text-red-500' : 'text-slate-500'
            }`}>✕</span>
          </button>
        </div>

        {/* Spectrum bar */}
        <div className="px-6 py-3 border-b border-slate-100">
          <div className="relative h-1.5 rounded-full" style={{
            background: 'linear-gradient(to right,#c8f0d8,#a0d4f5,#f9c8d4,#c3a0d8,#6b4f8c)',
          }}>
            <div style={{
              position: 'absolute', top: '-3px',
              left: `${Math.round(point.normalized * 100)}%`,
              transform: 'translateX(-50%)',
              width: '10px', height: '10px',
              borderRadius: '50%', background: '#6b4f8c',
              border: '2px solid white',
              boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
            }} />
          </div>
        </div>

        {/* Scrollable list */}
        <div className="overflow-y-auto px-6 py-2" style={{ maxHeight: '400px' }}>
          {point.external_case_ids.map((id, i) => (
            <CaseRow
              key={id}
              id={id}
              summary={point.summaries[i] ?? '—'}
              isFirst={i === 0}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/60">
          <p className="text-[10px] font-light text-slate-400 tracking-wide text-center">
            {point.count} total · press ✕ to close
          </p>
        </div>
      </div>
    </div>
  )
}



// ─── Component ────────────────────────────────────────────────────────────────




export default function HeatMap() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef       = useRef<L.Map | null>(null)
  const [points, setPoints]   = useState<AggregatedPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)
  const [activePoint, setActivePoint] = useState<AggregatedPoint | null>(null)



  // ── Read category from localStorage and derive the item label ─────────────
  const [itemLabel, setItemLabel] = useState<string>('complaint')



  useEffect(() => {
    const category = localStorage.getItem('category')
    setItemLabel(getItemLabel(category))
  }, [])



  const itemLabelCap = itemLabel.charAt(0).toUpperCase() + itemLabel.slice(1)




  // ── Fetch aggregated complaint locations ───────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)


      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/reports/complaint-locations/?aggregate=postal_code`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Token ${Cookies.get('Token') || ''}`,
            },
          }
        )




        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`)




        const data = await res.json()
        const results: {
          postal_code: string
          count: number
          latitude: number
          longitude: number
          external_case_ids: string[]
          summaries: string[]
        }[] = data.results ?? data
        console.log('Fetched complaint locations:', results)




        const valid = results.filter(
          (r) => r.latitude != null && r.longitude != null
        )




        const max  = Math.max(...valid.map((r) => r.count))
        const min  = Math.min(...valid.map((r) => r.count))
        const span = max - min || 1




        setPoints(
          valid.map((r) => ({
            ...r,
            normalized: (r.count - min) / span,
          }))
        )
      } catch (err: any) {
        setError(err.message ?? 'Unknown error')
      } finally {
        setLoading(false)
      }
    }




    fetchData()
  }, [])




  // ── Init map ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return




    const map = L.map(containerRef.current, {
      center:             INITIAL_CENTER,
      zoom:               INITIAL_ZOOM,
      zoomControl:        false,
      attributionControl: false,
    })
    mapRef.current = map




    // ✅ CHANGE 1: switched light_nolabels → light_all to show city/country labels
    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      { subdomains: 'abcd', maxZoom: 19 }
    ).addTo(map)




    L.control.zoom({ position: 'bottomright' }).addTo(map)




    return () => { map.remove(); mapRef.current = null }
  }, [])




  // ── Heatmap layer ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current || points.length === 0) return




    const heatData = points.map(
      (p) => [p.latitude, p.longitude, p.normalized] as [number, number, number]
    )




    import('leaflet.heat').then(() => {
      if (!mapRef.current) return
      // @ts-ignore
      L.heatLayer(heatData, {
        radius:     55,
        blur:       45,
        maxZoom:    10,
        max:        1.0,
        minOpacity: 0.3,
        gradient: {
          0.00: '#c8f0d8', // soft mint
          0.25: '#a0d4f5', // soft periwinkle
          0.50: '#f9c8d4', // blush rose
          0.75: '#c3a0d8', // soft lavender
          1.00: '#6b4f8c', // deep plum
        },
      }).addTo(mapRef.current)
    })
  }, [points])




  // ── Dot markers ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current || points.length === 0) return




    points.forEach((p) => {
      const fillColor = spectrumColor(p.normalized)




      const marker = L.circleMarker([p.latitude, p.longitude], {
        radius:      3 + p.normalized * 6,
        fillColor,
        color:       '#ffffff',
        weight:      1.5,
        opacity:     0.9,
        fillOpacity: 0.95,
      })


      // ── Build the case list rows (max 3, summaries truncated with "…" only) ─
      const PREVIEW_COUNT = 5
      const caseRows = p.external_case_ids
        .slice(0, PREVIEW_COUNT)
        .map((id, i) => {
          const summary = p.summaries[i] ?? '—'
          const display = summary.length > 60 ? summary.slice(0, 60) + '…' : summary
          return `
            <div style="
              display:flex;
              align-items:flex-start;
              gap:10px;
              padding:7px 0;
              ${i !== 0 ? 'border-top:1px solid #f1f5f9;' : ''}
            ">
              <span style="
                flex-shrink:0;
                font-size:10px;
                font-weight:500;
                color:#6b4f8c;
                background:#f3f0f7;
                border-radius:6px;
                padding:2px 7px;
                letter-spacing:0.03em;
                margin-top:1px;
              ">#${id}</span>
              <span style="
                font-size:11px;
                font-weight:300;
                color:#475569;
                line-height:1.5;
                letter-spacing:0.01em;
              ">${display}</span>
            </div>
          `
        }).join('')

      // "Click dot" hint shown only when there are more than 3 cases
      const clickHint = p.external_case_ids.length > PREVIEW_COUNT
        ? `<div style="
            margin-top:8px;
            padding:7px 10px;
            background:#f8f7fc;
            border-radius:8px;
            border:1px solid #ede9f6;
            font-size:10px;
            font-weight:400;
            color:#7c5fbf;
            letter-spacing:0.02em;
            text-align:center;
            cursor:pointer;
          ">
            🖱 Click the dot to see all ${p.external_case_ids.length} ${itemLabel}s
          </div>`
        : ''


      marker.bindTooltip(
        `<div style="
          font-family: system-ui, sans-serif;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 12px 14px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.10);
          min-width: 220px;
          max-width: 300px;
        ">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;">
            <div style="font-weight:400;font-size:13px;color:#0f172a;letter-spacing:0.01em">
              ${p.postal_code}
            </div>
            <div style="font-size:11px;font-weight:300;color:#94a3b8;letter-spacing:0.02em">
              ${p.count.toLocaleString()} ${itemLabel}${p.count !== 1 ? 's' : ''}
            </div>
          </div>


          <div style="
            height:3px;
            border-radius:99px;
            background:linear-gradient(to right,#c8f0d8,#a0d4f5,#f9c8d4,#c3a0d8,#6b4f8c);
            margin-bottom:10px;
            position:relative;
          ">
            <div style="
              position:absolute;
              top:-3px;
              left:${Math.round(p.normalized * 100)}%;
              transform:translateX(-50%);
              width:9px;height:9px;
              border-radius:50%;
              background:#6b4f8c;
              border:2px solid white;
              box-shadow:0 1px 4px rgba(0,0,0,0.2);
            "></div>
          </div>


          <div style="border-top:1px solid #f1f5f9;padding-top:8px;">
            ${caseRows}
            ${clickHint}
          </div>
        </div>`,
        { sticky: true, opacity: 1, className: 'leaflet-tooltip-clean' }
      )

      // ── Open full popup on click ──────────────────────────────────────────
      marker.on('click', () => setActivePoint(p))

      marker.addTo(mapRef.current!)
    })




    // ✅ CHANGE 2: auto-fit the map to show all points as soon as markers render
    const bounds = L.latLngBounds(points.map((p) => [p.latitude, p.longitude]))
    mapRef.current.fitBounds(bounds, { padding: [40, 40] })




  }, [points, itemLabel])




  const minVal = points.length ? Math.min(...points.map((p) => p.count)) : 0
  const maxVal = points.length ? Math.max(...points.map((p) => p.count)) : 0




  return (
    <div className="relative w-full h-[420px] sm:h-[580px] lg:h-[720px] rounded-3xl overflow-hidden shadow-lg border border-slate-200 bg-slate-50">




      {/* Map */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Full-list popup */}
      {activePoint && (
        <FullListPopup
          point={activePoint}
          itemLabel={itemLabel}
          onClose={() => setActivePoint(null)}
        />
      )}


      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 z-[2000] flex flex-col items-center justify-center gap-4 bg-white/90 backdrop-blur-sm">
          <div className="w-10 h-10 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          <p className="text-xs font-light tracking-widest uppercase text-slate-400">
            Loading {itemLabel} locations…
          </p>
        </div>
      )}




      {/* Error overlay */}
      {!loading && error && (
        <div className="absolute inset-0 z-[2000] flex flex-col items-center justify-center gap-2 bg-white/90 backdrop-blur-sm">
          <p className="text-sm font-light tracking-wide text-red-500">Failed to load data</p>
          <p className="text-xs font-light text-slate-400">{error}</p>
        </div>
      )}




      {/* Title overlay */}
      {!loading && !error && (
        <div className="absolute top-4 left-4 z-[1000] pointer-events-none">
          <div className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl px-4 py-3 shadow-sm">
            <p className="text-xs font-light tracking-[0.2em] uppercase text-slate-400">
              {itemLabelCap} Map
            </p>
            <h3 className="text-xl sm:text-2xl font-extralight tracking-tight text-slate-900 leading-tight">
              {itemLabelCap} Locations
            </h3>
            <p className="text-xs font-light text-slate-400 tracking-wide mt-0.5">
              {points.length} postal code{points.length !== 1 ? 's' : ''} mapped
            </p>
          </div>
        </div>
      )}




      {/* Legend */}
      {!loading && !error && points.length > 0 && (
        <div className="absolute bottom-4 left-4 z-[1000] pointer-events-none bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl p-3 sm:p-4 shadow-sm">
          <p className="text-xs font-light tracking-widest uppercase text-slate-400 mb-2">
            {itemLabelCap} Density
          </p>
          <div
            className="w-28 sm:w-44 h-2 rounded-full"
            style={{
              background: 'linear-gradient(to right, #c8f0d8, #a0d4f5, #f9c8d4, #c3a0d8, #6b4f8c)',
            }}
          />
          <div className="flex justify-between mt-1.5">
            <span className="text-xs font-light text-slate-400">{minVal.toLocaleString()}</span>
            <span className="text-xs font-light text-slate-400">{maxVal.toLocaleString()}</span>
          </div>
        </div>
      )}




      {/* Clean tooltip styles */}
      <style>{`
        .leaflet-container {
          background: #ffffff !important;
        }
        .leaflet-tooltip-clean {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .leaflet-tooltip-clean::before { display: none !important; }
        .leaflet-zoom-in,
        .leaflet-zoom-out {
          background: white !important;
          border: 1px solid #e2e8f0 !important;
          color: #475569 !important;
          border-radius: 8px !important;
        }
      `}</style>




    </div>
  )
}
