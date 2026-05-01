'use client'

import dynamic from 'next/dynamic'

const HeatMap = dynamic(() => import('@/components/HeatMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[420px] sm:h-[580px] lg:h-[720px] rounded-3xl bg-[var(--graphite-50)] animate-pulse" />
  ),
})

export default function Page() {
  return (
    <main className="p-6 min-h-screen" style={{ background: "var(--canvas)" }}>
      <HeatMap />
    </main>
  )
}
