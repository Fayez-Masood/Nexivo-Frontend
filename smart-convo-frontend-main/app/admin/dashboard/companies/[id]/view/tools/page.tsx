"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Cookies from "js-cookie"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"
import { Loader2, Globe, Eye, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

function jsonPretty(obj: any) {
  return JSON.stringify(obj, null, 2)
}

function MethodBadge({ method }: { method: string }) {
  const colors: Record<string, string> = {
    GET: "bg-green-100 text-green-700",
    POST: "bg-indigo-100 text-indigo-700",
    PUT: "bg-yellow-100 text-yellow-700",
    PATCH: "bg-purple-100 text-purple-700",
    DELETE: "bg-red-100 text-red-700",
  }
  return (
    <span
      className={`px-2 py-1 rounded-xl text-xs font-semibold whitespace-nowrap ${
        colors[method] || "bg-slate-100 text-slate-700"
      }`}
    >
      {method}
    </span>
  )
}

export default function AdminCompanyTools() {
  const { id } = useParams()
  const [tools, setTools] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTool, setSelectedTool] = useState<any | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (!id) return
    const fetchCompanyTools = async () => {
      setLoading(true)
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/custom_feature/custom-features/?company_id=${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${Cookies.get("adminToken") || ""}`,
            },
          }
        )

        if (!res.ok) throw new Error("Failed to fetch company tools")
        const data = await res.json()
        setTools(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Error fetching company tools:", error)
        toast({
          description: "Failed to load tools for this company.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCompanyTools()
  }, [id])

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-slate-500">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin mb-3" />
        <p className="text-sm font-medium">Loading tools...</p>
      </div>
    )

  if (tools.length === 0)
    return (
      <div className="text-center py-20 text-slate-500 border border-slate-200/60 rounded-2xl bg-slate-50">
        No tools found for this company.
      </div>
    )

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-light text-slate-800">
          Company Tools
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          All custom tools configured by this company.
        </p>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <div
            key={tool.id}
            className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            <div className="p-5">
              <div className="flex flex-wrap items-center justify-between text-lg font-semibold text-slate-800 gap-2">
                <span className="truncate">{tool.name}</span>
                <MethodBadge method={tool.method} />
              </div>
              <p className="text-slate-500 text-sm truncate mt-1">
                {tool.description || "No description"}
              </p>
            </div>

            <div className="px-5 pb-5 flex flex-wrap justify-between gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 sm:flex-none rounded-xl border-slate-200 hover:bg-slate-50"
                onClick={() => setSelectedTool(tool)}
              >
                <Eye className="w-4 h-4 mr-1" /> View
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* View Dialog */}
      <Dialog open={!!selectedTool} onOpenChange={() => setSelectedTool(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl border-0">
          {selectedTool && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between text-slate-800">
                  {selectedTool.name}
                  <MethodBadge method={selectedTool.method} />
                </DialogTitle>
                <DialogDescription className="text-slate-500">
                  {selectedTool.description || "No description"}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4 space-y-4">
                <div className="flex items-center gap-2 text-slate-700">
                  <Globe className="w-4 h-4" />
                  <span className="truncate text-sm">{selectedTool.url}</span>
                </div>

                <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl text-xs overflow-x-auto">
                  {jsonPretty({
                    headers: selectedTool.headers,
                    query: selectedTool.query_template,
                    body: selectedTool.body_template,
                    parameters: selectedTool.parameters,
                    timeout: selectedTool.timeout_ms,
                    speak_during_execution:
                      selectedTool.speak_during_execution,
                  })}
                </pre>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
