"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { usePathname } from "next/navigation"

export default function AgentConfigReadOnlyPage() {
  const pathname = usePathname()
  const router = useRouter()

  const segments = pathname.split("/")
  const agentId = segments[3]

  const [loading, setLoading] = useState(true)
  const [agentName, setAgentName] = useState("")
  const [config, setConfig] = useState<any>(null)

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true)

        const token = Cookies.get("Token") || ""

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/agents/agents/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        })

        if (!res.ok) {
          throw new Error("Failed to fetch agents")
        }

        const data = await res.json()
        const agent = data.find((a: any) => String(a.id) === String(agentId))

        if (!agent) {
          console.warn("No agent found for id:", agentId)
          setAgentName("Unknown Agent")
          setConfig(null)
          return
        }

        setAgentName(agent.name || "")
        setConfig(agent.agent_config || {})
      } catch (err) {
        console.error("Failed to load config", err)
        setConfig(null)
      } finally {
        setLoading(false)
      }
    }

    fetchConfig()
  }, [agentId])

  const formatKey = (key: string) => key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())

  const renderField = (key: string, value: any) => {
    if (typeof value === "string" || typeof value === "number" || value === null) {
      return (
        <div className="group flex justify-between items-center" style={{ background: "var(--graphite-50)", border: "1px solid var(--border-1)", borderRadius: "var(--radius-sm)", padding: 16 }}>
          <Label className="font-medium text-slate-700 text-sm group-hover:text-slate-900 transition-colors">
            {formatKey(key)}
          </Label>
          <span className="text-sm text-slate-500 font-light group-hover:text-slate-600 transition-colors">
            {value ?? "—"}
          </span>
        </div>
      )
    }

    if (typeof value === "boolean") {
      return (
        <div className="group flex justify-between items-center" style={{ background: "var(--graphite-50)", border: "1px solid var(--border-1)", borderRadius: "var(--radius-sm)", padding: 16 }}>
          <Label className="font-medium text-slate-700 text-sm group-hover:text-slate-900 transition-colors">
            {formatKey(key)}
          </Label>
          <span
            className="text-sm font-light px-2.5 py-1 rounded-md"
            style={value ? { background: "var(--success-soft)", color: "var(--success)" } : { background: "var(--graphite-50)", color: "var(--fg-3)" }}
          >
            {value ? "True" : "False"}
          </span>
        </div>
      )
    }

    if (typeof value === "object") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(value).map(([subKey, subVal]) => (
            <div key={subKey}>{renderField(subKey, subVal)}</div>
          ))}
        </div>
      )
    }

    return null
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--canvas)" }}>
      {/* Header */}
      <div style={{ background: "var(--paper)", borderBottom: "1px solid var(--border-1)" }} className="sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-8 py-6 flex items-center justify-between">
          <div className="flex-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Agent Configuration</p>
            <h1 className="text-4xl font-light text-slate-900 tracking-tight">{agentName || "Loading..."}</h1>
          </div>
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-slate-500 hover:text-slate-900 transition-colors"
          >
            ← Back
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-8 py-12">
        {loading ? (
          <div className="flex justify-center items-center min-h-96">
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 border border-slate-200 rounded-full"></div>
                <div className="absolute inset-0 border-t border-slate-400 rounded-full animate-spin"></div>
              </div>
              <p className="text-slate-400 text-sm font-light">Loading configuration...</p>
            </div>
          </div>
        ) : !config ? (
          <div className="text-center py-16">
            <p className="text-slate-400 font-light text-base">No configuration available.</p>
          </div>
        ) : (
          <Card className="border border-slate-200 rounded-xl shadow-sm bg-white overflow-hidden">
            <CardHeader className="pb-6 border-b border-slate-100" style={{ background: "var(--graphite-50)" }}>
              <CardTitle className="text-lg font-semibold text-slate-900">Configuration Details</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Accordion type="single" collapsible className="space-y-3">
                {Object.entries(config).map(([sectionKey, value]) => (
                  <AccordionItem
                    key={sectionKey}
                    value={sectionKey}
                    className="border border-slate-200 rounded-lg overflow-hidden hover:border-slate-300 transition-all duration-200 data-[state=open]:border-[var(--border-2)] data-[state=open]:shadow-md"
                  >
                    <AccordionTrigger className="px-6 py-4 hover:bg-slate-50 data-[state=open]:bg-[var(--mist-bg)] transition-all duration-200 [&[data-state=open]]:text-slate-900">
                      <span className="text-sm font-medium text-slate-900 capitalize">
                        {sectionKey.replace(/_/g, " ")}
                      </span>
                    </AccordionTrigger>

                    <AccordionContent>
                      <div className="space-y-3 px-6 py-5" style={{ background: "var(--graphite-50)", borderTop: "1px solid var(--border-1)" }}>
                        {typeof value === "object" ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {Object.entries(value).map(([subKey, subVal]) => (
                              <div key={subKey}>{renderField(subKey, subVal)}</div>
                            ))}
                          </div>
                        ) : (
                          renderField(sectionKey, value)
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
