"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Edit, Eye } from "lucide-react"
import { Loader2 } from "lucide-react"

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [filterCategory, setFilterCategory] = useState("all")
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const PAGE_SIZE = 12
  const router = useRouter()

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true)
      const token = Cookies.get("adminToken")
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/companies/`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${token || ""}`
          },
        })
        const data = await res.json()
        console.log(data)
        if (Array.isArray(data)) {
          setCompanies(data)
        } else if (Array.isArray(data.results)) {
          // paginated response (DRF style)
          setCompanies(data.results)
        } else {
          console.error("Invalid companies response format", data)
        }
      } catch (err) {
        console.error("Failed to fetch companies", err)
      } finally {
      setLoading(false)
    }

    }
    fetchCompanies()
  }, [])

  const handleViewCompany = (companyId: number) => {
    router.push(`/admin/dashboard/companies/${companyId}/view/profile`)
  }

  const handleEditCompany = (companyId: number) => {
    router.push(`/admin/dashboard/companies/${companyId}/edit/profile`)
  }

  const handleApproveCompany = async (companyId: number) => {
    const token = Cookies.get("adminToken")
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/companies/${companyId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token || ""}`
        },
        body: JSON.stringify({ status: "active" }),
      })
      setCompanies((prev) =>
        prev.map((c) => (c.id === companyId ? { ...c, status: "active" } : c))
      )
    } catch (err) {
      console.error("Approval failed", err)
    }
  }

  const handleRejectCompany = async (companyId: number) => {
    const token = Cookies.get("adminToken")
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/companies/${companyId}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token || ""}`
        },
      })
      setCompanies((prev) => prev.filter((c) => c.id !== companyId))
    } catch (err) {
      console.error("Rejection failed", err)
    }
  }

  const filteredCompanies = Array.isArray(companies)
    ? companies
        .filter(
          (company) =>
            company.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (filterCategory === "all" || company.category === filterCategory)
        )
        .sort((a, b) => {
          switch (sortBy) {
            case "name":
              return a.name.localeCompare(b.name)
            case "dateAdded":
              return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
            case "users":
              return b.users - a.users
            default:
              return 0
          }
        })
    : []
  
  const categories = [
    "all",
    ...Array.from(new Set(companies.map((c) => c.category).filter(Boolean)))
  ]

  const activeOrinactive = filteredCompanies.filter((c) => c.status === "active" || c.status === "inactive")
  const pending = filteredCompanies.filter((c) => c.status === "pending")
  const totalActivePages = Math.ceil(activeOrinactive.length / PAGE_SIZE)
  const pagedActiveOrInactive = activeOrinactive.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const renderCompanyCard = (company: any) => (
    <div key={company.id} className="group relative bg-white rounded-2xl border border-slate-200/60 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
      <div className="p-5">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center">
            <span className="text-lg font-semibold text-indigo-600">{company.name?.charAt(0) || "C"}</span>
          </div>
          <div>
            <h3 className="font-semibold text-base text-slate-800">{company.name}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{company.category}</p>
          </div>

          <div className="flex items-center space-x-2 max-w-full overflow-hidden">
            <Badge
              className={`text-xs font-medium border-0 rounded-full ${
                company.status === "active"
                  ? "bg-emerald-100 text-emerald-700"
                  : company.status === "inactive"
                  ? "bg-slate-100 text-slate-600"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {company.status}
            </Badge>
            <span className="text-xs text-slate-400 truncate" title={`${company.users?.length || 0} users`}>
              {company.users?.length || 0} users
            </span>
          </div>

          <div className="text-xs text-slate-400">
            Added: {new Date(company.created_at).toLocaleDateString()}
          </div>
          <div className="flex space-x-2 w-full">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 rounded-xl border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-600 transition-colors"
              onClick={() => handleViewCompany(company.id)}
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            {company.status === "pending" ? (
              <>
                <Button
                  size="sm"
                  className="flex-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 shadow-none"
                  onClick={() => handleApproveCompany(company.id)}
                >
                  Approve
                </Button>
                <Button
                  size="sm"
                  className="flex-1 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 shadow-none"
                  onClick={() => handleRejectCompany(company.id)}
                >
                  Reject
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                className="flex-1 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 hover:bg-indigo-100 shadow-none"
                onClick={() => handleEditCompany(company.id)}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )

if (loading) {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-slate-500">
      <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin mb-3" />
      <p className="text-sm font-medium">Loading companies...</p>
    </div>
  )
}

  return (
    <div className="space-y-6 p-4 md:p-6">
      
      {/* Header */}
      <div className="sticky top-2 md:top-4 z-40">
        <div className="relative overflow-hidden rounded-xl md:rounded-2xl">
          <div className="absolute -inset-[1px] bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 rounded-xl md:rounded-2xl opacity-60 blur-[2px] animate-[gradient_3s_ease_infinite] bg-[length:200%_100%]" />
          <div className="relative bg-white/70 backdrop-blur-xl border border-white/20 rounded-xl md:rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-violet-500/5 to-purple-500/10" />
            <div className="relative px-4 md:px-6 py-3 md:py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl md:text-2xl font-light text-slate-800 tracking-tight">Companies</h1>
                  <p className="text-xs md:text-sm text-slate-500 font-light">Manage all registered companies on your platform</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Search companies..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }}
            className="pl-10 rounded-xl border-slate-200 bg-white h-11 focus:border-indigo-400 focus:ring-indigo-400/20"
          />
        </div>
        <Select value={sortBy} onValueChange={(v) => { setSortBy(v); setCurrentPage(1) }}>
          <SelectTrigger className="w-48 rounded-xl border-slate-200 bg-white h-11">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="name">Sort by Name</SelectItem>
            <SelectItem value="dateAdded">Sort by Date Added</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterCategory} onValueChange={(v) => { setFilterCategory(v); setCurrentPage(1) }}>
          <SelectTrigger className="w-48 rounded-xl border-slate-200 bg-white h-11">
            <SelectValue placeholder="Filter by Category" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {categories.map((category, idx) => (
              <SelectItem key={`${category}-${idx}`} value={category}>
                {category === "all" ? "All Categories" : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Active & Inactive Companies */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {pagedActiveOrInactive.map(renderCompanyCard)}
      </div>

      {/* Pagination for active/inactive */}
      {totalActivePages > 1 && (
        <div className="flex items-center justify-center gap-1.5 pt-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          {Array.from({ length: totalActivePages }, (_, i) => i + 1)
            .filter(p => p === 1 || p === totalActivePages || Math.abs(p - currentPage) <= 1)
            .reduce<(number | "…")[]>((acc, p, idx, arr) => {
              if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) acc.push("…")
              acc.push(p)
              return acc
            }, [])
            .map((p, idx) =>
              p === "…" ? (
                <span key={`ellipsis-${idx}`} className="px-1 text-slate-400 text-xs">…</span>
              ) : (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p as number)}
                  className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                    currentPage === p
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {p}
                </button>
              )
            )}
          <button
            onClick={() => setCurrentPage(p => Math.min(totalActivePages, p + 1))}
            disabled={currentPage === totalActivePages}
            className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* Pending Companies Section */}
      {pending.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-slate-800">Pending Companies</h2>
            <Badge className="bg-amber-100 text-amber-700 border-0 rounded-full text-xs">{pending.length}</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {pending.map(renderCompanyCard)}
          </div>
        </div>
      )}

      {filteredCompanies.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <Search className="w-7 h-7 text-slate-400" />
          </div>
          <p className="text-slate-500 font-medium">No companies found matching your criteria.</p>
        </div>
      )}

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  )
}
