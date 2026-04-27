"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import Cookies from "js-cookie"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const { toast } = useToast()
  const router = useRouter()

  const fetchCompanies = useCallback(async () => {
    const token = Cookies.get("adminToken")
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/companies/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token || ""}`,
        },
      })
      const data = await res.json()
      if (Array.isArray(data)) setCompanies(data)
      else if (Array.isArray(data.results)) setCompanies(data.results)
    } catch (err) {
      console.error("Failed to fetch companies", err)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load companies",
      })
    }
  }, [toast])

  useEffect(() => {
    fetchCompanies()
  }, [fetchCompanies])

  const filteredCompanies = companies
    .filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "date":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        default:
          return 0
      }
    })

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="sticky top-2 md:top-4 z-40">
        <div className="relative overflow-hidden rounded-xl md:rounded-2xl">
          <div className="absolute -inset-[1px] bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 rounded-xl md:rounded-2xl opacity-60 blur-[2px] animate-[gradient_3s_ease_infinite] bg-[length:200%_100%]" />
          <div className="relative bg-white/70 backdrop-blur-xl border border-white/20 rounded-xl md:rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-violet-500/5 to-purple-500/10" />
            <div className="relative px-4 md:px-6 py-3 md:py-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h1 className="text-xl md:text-2xl font-light text-slate-800 tracking-tight">Agent Configuration</h1>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                      placeholder="Search companies..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64 rounded-xl border-slate-200 bg-white/80 h-10 focus:border-indigo-400"
                    />
                  </div>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40 rounded-xl border-slate-200 bg-white/80 h-10">
                      <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="name">Sort by Name</SelectItem>
                      <SelectItem value="date">Sort by Date</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {filteredCompanies.map((company) => (
          <div
            key={company.id}
            onClick={() =>
                router.push(`/admin/dashboard/agent-settings/agents?companyId=${company.id}`)
            }
            className="group cursor-pointer bg-white rounded-2xl border border-slate-200/60 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            >
            <div className="p-5 flex flex-col items-center text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center">
                  <span className="text-lg font-semibold text-indigo-600">{company.name?.charAt(0) || "C"}</span>
                </div>
                <h3 className="font-semibold text-base text-slate-800">{company.name}</h3>
                <p className="text-sm text-slate-500">{company.industry}</p>
                <p className="text-xs text-slate-400">
                  Added: {new Date(company.created_at).toLocaleDateString()}
                </p>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  )
}
