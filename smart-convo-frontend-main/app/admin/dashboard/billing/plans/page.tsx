"use client"

import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import { motion } from "framer-motion"
import { Plus, Pencil, Trash2, Loader2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

const API_BASE = `${process.env.NEXT_PUBLIC_BASE_URL}/billing`
const PAGE_SIZE = 10

type Plan = {
  id: number
  name: string
  price: number
  cost_per_minute: number
  max_agents: number
  max_minutes_per_month: number
  threshold_minutes: number
  is_custom: boolean
  company: number | null
  created_at: string
}

// helper to attach headers
const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Token ${Cookies.get("adminToken") || ""}`,
})

export default function PlansPage() {
  const { toast } = useToast()
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [formData, setFormData] = useState<Partial<Plan>>({})
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  // Fetch all plans
  const fetchPlans = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API_BASE}/plans/`, {
        method: "GET",
        headers: getHeaders(),
      })
      if (!res.ok) throw new Error("Failed to fetch plans")
      const data = await res.json()
      setPlans(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPlans()
  }, [])

  // Handle create/update
  const handleSubmit = async () => {
    const method = selectedPlan ? "PUT" : "POST"
    const url = selectedPlan
      ? `${API_BASE}/plans/${selectedPlan.id}/`
      : `${API_BASE}/plans/`

    const res = await fetch(url, {
      method,
      headers: getHeaders(),
      body: JSON.stringify(formData),
    })

    if (res.ok) {
      setIsDialogOpen(false)
      setFormData({})
      setSelectedPlan(null)
      fetchPlans()
      toast({
        title: `Plan ${selectedPlan ? "updated" : "created"} successfully`,
      })
    } else {
      console.error("Failed to save plan", await res.text())
      toast({
        title: "Error",
        description: "Failed to save plan",
        variant: "destructive",
      })
    }
  }

  // Handle delete
  const handleDelete = async () => {
    if (!deleteId) return
    const res = await fetch(`${API_BASE}/plans/${deleteId}/`, {
      method: "DELETE",
      headers: getHeaders(),
    })
    if (res.ok) {
      fetchPlans()
      toast({ title: "Plan deleted successfully" })
    } else {
      console.error("Failed to delete plan", await res.text())
      toast({
        title: "Error",
        description: "Failed to delete plan",
        variant: "destructive",
      })
    }
    setIsDeleteDialogOpen(false)
    setDeleteId(null)
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
                <h1 className="text-xl md:text-2xl font-light text-slate-800 tracking-tight">Subscription Plans</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => {
                        setSelectedPlan(null)
                        setFormData({})
                      }}
                      className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 shadow-lg shadow-indigo-500/25"
                    >
                      <Plus className="mr-2 h-4 w-4" /> New Plan
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg rounded-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-lg font-light text-slate-800 tracking-tight">
                        {selectedPlan ? "Edit Plan" : "Create Plan"}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      {[
                        "name",
                        "price",
                        "cost_per_minute",
                        "max_agents",
                        "max_minutes_per_month",
                        "threshold_minutes",
                      ].map((field) => (
                        <div
                          key={field}
                          className="grid grid-cols-4 items-center gap-4"
                        >
                          <Label
                            htmlFor={field}
                            className="text-right capitalize text-sm text-slate-600"
                          >
                            {field.replace(/_/g, " ")}
                          </Label>
                          <Input
                            id={field}
                            type={
                              field.includes("price") ||
                              field.includes("minute") ||
                              field.includes("agents")
                                ? "number"
                                : "text"
                            }
                            value={(formData as any)[field] ?? ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                [field]:
                                  e.target.type === "number"
                                    ? Number(e.target.value)
                                    : e.target.value,
                              })
                            }
                            className="col-span-3 rounded-xl border-slate-200"
                          />
                        </div>
                      ))}
                    </div>
                    <Button onClick={handleSubmit} className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700">
                      {selectedPlan ? "Update" : "Create"}
                    </Button>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-light text-slate-800">Confirm Delete</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-600">Are you sure you want to delete this plan?</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} className="rounded-xl">
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search plans..."
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }}
          className="pl-10 rounded-xl border-slate-200 bg-white h-10 focus:border-indigo-400 focus:ring-indigo-400/20"
        />
      </div>

      {/* Plans grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin mb-3" />
          <p className="text-sm text-slate-500">Loading plans...</p>
        </div>
      ) : (() => {
        const filteredPlans = plans.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
        const totalPages = Math.ceil(filteredPlans.length / PAGE_SIZE)
        const pagedPlans = filteredPlans.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
        return (
          <>
            <motion.div
              layout
              className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {pagedPlans.map((plan) => (
                <motion.div
                  key={plan.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                      <h3 className="text-base font-semibold text-slate-800">
                        {plan.name}
                      </h3>
                      <div className="flex space-x-1">
                        <button
                          className="p-1.5 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          onClick={() => {
                            setSelectedPlan(plan)
                            setFormData(plan)
                            setIsDialogOpen(true)
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          onClick={() => {
                            setDeleteId(plan.id)
                            setIsDeleteDialogOpen(true)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="p-5 space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-slate-500">Price</span><span className="font-medium text-slate-800">${plan.price}/mo</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Cost per min</span><span className="font-medium text-slate-800">${plan.cost_per_minute}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Agents</span><span className="font-medium text-slate-800">{plan.max_agents}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Minutes</span><span className="font-medium text-slate-800">{plan.max_minutes_per_month}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Threshold</span><span className="font-medium text-slate-800">{plan.threshold_minutes}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Custom</span><span className="font-medium text-slate-800">{plan.is_custom ? "Yes" : "No"}</span></div>
                      <p className="text-xs text-slate-400 pt-1">
                        Created: {new Date(plan.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {filteredPlans.length === 0 && (
              <div className="text-center py-16">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
                  <Search className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-slate-500 text-sm">No plans found matching your search.</p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1.5 pt-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
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
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )
      })()}

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  )
}
