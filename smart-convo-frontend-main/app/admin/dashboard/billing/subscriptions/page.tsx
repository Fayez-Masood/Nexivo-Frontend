"use client"

import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import { motion } from "framer-motion"
import { Plus, Pencil, Trash2, Loader2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

const API_BASE = `${process.env.NEXT_PUBLIC_BASE_URL}/billing`
const PAGE_SIZE = 10

type Subscription = {
  id: number
  company: number
  plan: number
  start_date: string
  end_date: string
  is_active: boolean
  stripe_subscription_id: string
}

type Company = { id: number; name: string }
type Plan = { id: number; name: string }

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Token ${Cookies.get("adminToken") || ""}`,
})

export default function SubscriptionsPage() {
  const { toast } = useToast()
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null)
  const [formData, setFormData] = useState<Partial<Subscription>>({})
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [companies, setCompanies] = useState<Company[]>([])
  const [plans, setPlans] = useState<Plan[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  // API Calls
  const fetchSubscriptions = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API_BASE}/subscriptions/`, { headers: getHeaders() })
      if (!res.ok) throw new Error("Failed to fetch subscriptions")
      setSubscriptions(await res.json())
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchCompanies = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/companies/`, {
        headers: getHeaders(),
      })
      if (res.ok) setCompanies(await res.json())
    } catch (err) {
      console.error("Failed to fetch companies", err)
    }
  }

  const fetchPlans = async () => {
    try {
      const res = await fetch(`${API_BASE}/plans/`, { headers: getHeaders() })
      if (res.ok) setPlans(await res.json())
    } catch (err) {
      console.error("Failed to fetch plans", err)
    }
  }

  const fetchSubscriptionById = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE}/subscriptions/${id}/`, {
        headers: getHeaders(),
      })
      if (res.ok) {
        const sub = await res.json()
        setSelectedSub(sub)
        setFormData(sub)
        setIsDialogOpen(true)
        fetchCompanies()
        fetchPlans()
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  useEffect(() => {
    if (isDialogOpen) {
      fetchCompanies()
      fetchPlans()
    }
  }, [isDialogOpen])

  // Validation & Submit
  const handleSubmit = async () => {
    const { company, plan, start_date, end_date, stripe_subscription_id } = formData

    if (!company || !plan || !start_date || !end_date || !stripe_subscription_id) {
      toast({ title: "Error", description: "All fields are required.", variant: "destructive" })
      return
    }

    const today = new Date().toISOString().split("T")[0]
    if (start_date < today) {
      toast({ title: "Error", description: "Start date cannot be before today.", variant: "destructive" })
      return
    }

    if (end_date <= start_date) {
      toast({ title: "Error", description: "End date must be after start date.", variant: "destructive" })
      return
    }

    const method = selectedSub ? "PUT" : "POST"
    const url = selectedSub
      ? `${API_BASE}/subscriptions/${selectedSub.id}/`
      : `${API_BASE}/subscriptions/`

    const res = await fetch(url, {
      method,
      headers: getHeaders(),
      body: JSON.stringify(formData),
    })

    if (res.ok) {
      setIsDialogOpen(false)
      setFormData({})
      setSelectedSub(null)
      fetchSubscriptions()
      toast({
        title: "Success",
        description: `Subscription ${selectedSub ? "updated" : "created"} successfully.`,
      })
    } else {
      toast({ title: "Error", description: "Failed to save subscription.", variant: "destructive" })
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    const res = await fetch(`${API_BASE}/subscriptions/${deleteId}/`, {
      method: "DELETE",
      headers: getHeaders(),
    })
    if (res.ok) {
      fetchSubscriptions()
      toast({ title: "Deleted", description: "Subscription deleted successfully." })
    } else {
      toast({ title: "Error", description: "Failed to delete subscription.", variant: "destructive" })
    }
    setIsConfirmOpen(false)
    setDeleteId(null)
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="sticky top-2 md:top-4 z-40 mx-0 mb-2">
        <div className="relative overflow-hidden rounded-xl md:rounded-2xl">
          <div className="absolute -inset-[1px] bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 rounded-xl md:rounded-2xl opacity-60 blur-[2px] animate-[gradient_3s_ease_infinite] bg-[length:200%_100%]" />
          <div className="relative bg-white/70 backdrop-blur-xl border border-white/20 rounded-xl md:rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-violet-500/5 to-purple-500/10" />
            <div className="relative px-4 md:px-6 py-3 md:py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl md:text-2xl font-light text-slate-800 tracking-tight">Subscriptions</h1>
                  <p className="text-slate-500 text-sm mt-0.5">Manage company billing subscriptions</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => {
                        setSelectedSub(null)
                        setFormData({})
                      }}
                      className="rounded-xl shadow-lg bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 shadow-indigo-500/25"
                    >
                      <Plus className="mr-2 h-4 w-4" /> New Subscription
                    </Button>
                  </DialogTrigger>
          <DialogContent className="sm:max-w-md rounded-2xl p-0 overflow-hidden shadow-2xl border-0">
            {/* Modal header strip */}
            <div className="px-6 pt-6 pb-4 border-b border-slate-100">
              <DialogTitle className="text-base font-semibold text-slate-800 tracking-tight">
                {selectedSub ? "Edit Subscription" : "New Subscription"}
              </DialogTitle>
              <p className="text-xs text-slate-400 mt-0.5">
                {selectedSub ? "Update the subscription details below." : "Fill in the details to create a subscription."}
              </p>
            </div>

            {/* Form body */}
            <div className="px-6 py-5 space-y-4">
              {/* Company */}
              <div className="space-y-1.5">
                <Label htmlFor="company" className="text-xs font-medium text-slate-600 uppercase tracking-wide">Company</Label>
                <select
                  id="company"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-colors"
                  value={formData.company ?? ""}
                  onChange={(e) => setFormData({ ...formData, company: Number(e.target.value) })}
                >
                  <option value="">Select a company…</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Plan */}
              <div className="space-y-1.5">
                <Label htmlFor="plan" className="text-xs font-medium text-slate-600 uppercase tracking-wide">Plan</Label>
                <select
                  id="plan"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-colors"
                  value={formData.plan ?? ""}
                  onChange={(e) => setFormData({ ...formData, plan: Number(e.target.value) })}
                >
                  <option value="">Select a plan…</option>
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="start_date" className="text-xs font-medium text-slate-600 uppercase tracking-wide">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date ?? ""}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="rounded-xl border-slate-200 text-sm focus:border-indigo-400 focus:ring-indigo-400/20"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="end_date" className="text-xs font-medium text-slate-600 uppercase tracking-wide">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date ?? ""}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="rounded-xl border-slate-200 text-sm focus:border-indigo-400 focus:ring-indigo-400/20"
                  />
                </div>
              </div>

              {/* Stripe ID */}
              <div className="space-y-1.5">
                <Label htmlFor="stripe_subscription_id" className="text-xs font-medium text-slate-600 uppercase tracking-wide">Stripe Subscription ID</Label>
                <Input
                  id="stripe_subscription_id"
                  type="text"
                  placeholder="sub_..."
                  value={formData.stripe_subscription_id ?? ""}
                  onChange={(e) => setFormData({ ...formData, stripe_subscription_id: e.target.value })}
                  className="rounded-xl border-slate-200 text-sm focus:border-indigo-400 focus:ring-indigo-400/20"
                />
              </div>

              {/* Active toggle */}
              <div className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-slate-700">Active</p>
                  <p className="text-xs text-slate-400">Enable this subscription immediately</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={formData.is_active ?? false}
                  onClick={() => setFormData({ ...formData, is_active: !(formData.is_active ?? false) })}
                  className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                    formData.is_active ? "bg-indigo-500" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${
                      formData.is_active ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 pb-6 flex gap-2">
              <Button
                variant="outline"
                className="flex-1 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-1 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 shadow-sm shadow-indigo-500/20"
              >
                {selectedSub ? "Save Changes" : "Create"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search by Stripe ID..."
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }}
          className="pl-10 rounded-xl border-slate-200 bg-white h-10 focus:border-indigo-400 focus:ring-indigo-400/20"
        />
      </div>

      {/* Subscriptions Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin mb-3" />
          <p className="text-sm text-slate-500">Loading subscriptions...</p>
        </div>
      ) : (() => {
        const filteredSubs = subscriptions.filter(sub =>
          sub.stripe_subscription_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          String(sub.id).includes(searchTerm)
        )
        const totalPages = Math.ceil(filteredSubs.length / PAGE_SIZE)
        const pagedSubs = filteredSubs.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
        return (
          <>
            <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pagedSubs.map((sub) => (
                <motion.div
                  key={sub.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-semibold text-slate-800">Sub #{sub.id}</h3>
                        <span className={`inline-flex items-center text-xs font-medium mt-0.5 ${sub.is_active ? "text-emerald-600" : "text-slate-400"}`}>
                          {sub.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          className="p-1.5 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          onClick={() => fetchSubscriptionById(sub.id)}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          onClick={() => {
                            setDeleteId(sub.id)
                            setIsConfirmOpen(true)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="p-5 space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-slate-500">Company</span><span className="font-medium text-slate-800">{sub.company}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Plan</span><span className="font-medium text-slate-800">{sub.plan}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Start</span><span className="font-medium text-slate-800">{new Date(sub.start_date).toLocaleDateString()}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">End</span><span className="font-medium text-slate-800">{new Date(sub.end_date).toLocaleDateString()}</span></div>
                      <p className="text-xs text-slate-400 pt-1 truncate" title={sub.stripe_subscription_id}>
                        Stripe: {sub.stripe_subscription_id}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {filteredSubs.length === 0 && (
              <div className="text-center py-16">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
                  <Search className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-slate-500 text-sm">No subscriptions found.</p>
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

      {/* Delete Confirm */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="sm:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this subscription?</p>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  )
}



// "use client"

// import { useEffect, useState } from "react"
// import Cookies from "js-cookie"
// import { motion } from "framer-motion"
// import { Plus, Pencil, Trash2, Loader2 } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// const API_BASE = `${process.env.NEXT_PUBLIC_BASE_URL}/billing`

// type Subscription = {
//   id: number
//   company: number
//   plan: number
//   start_date: string
//   end_date: string | null
//   is_active: boolean
//   stripe_subscription_id: string
// }

// type Company = { // ⭐ NEW
//   id: number
//   name: string
// }

// // helper headers
// const getHeaders = () => ({
//   "Content-Type": "application/json",
//   Authorization: `Token ${Cookies.get("adminToken") || ""}`,
// })

// export default function SubscriptionsPage() {
//   const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
//   const [loading, setLoading] = useState(true)
//   const [selectedSub, setSelectedSub] = useState<Subscription | null>(null)
//   const [formData, setFormData] = useState<Partial<Subscription>>({})
//   const [isDialogOpen, setIsDialogOpen] = useState(false)
//   const [companies, setCompanies] = useState<Company[]>([]) // ⭐ NEW

//   // List all subscriptions
//   const fetchSubscriptions = async () => {
//     try {
//       setLoading(true)
//       const res = await fetch(`${API_BASE}/subscriptions/`, {
//         headers: getHeaders(),
//       })
//       if (!res.ok) throw new Error("Failed to fetch subscriptions")
//       const data = await res.json()
//       setSubscriptions(data)
//     } catch (err) {
//       console.error(err)
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Fetch companies ⭐ NEW
//   const fetchCompanies = async () => {
//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/companies/`, {
//         headers: getHeaders(),
//       })
//       if (res.ok) {
//         const data = await res.json()
//         setCompanies(data)
//       }
//     } catch (err) {
//       console.error("Failed to fetch companies", err)
//     }
//   }

//   // Get by ID (for edit)
//   const fetchSubscriptionById = async (id: number) => {
//     try {
//       const res = await fetch(`${API_BASE}/subscriptions/${id}/`, {
//         headers: getHeaders(),
//       })
//       if (res.ok) {
//         const sub = await res.json()
//         setSelectedSub(sub)
//         setFormData(sub)
//         setIsDialogOpen(true)
//         fetchCompanies() // ⭐ fetch companies when editing too
//       } else {
//         console.error("Failed to fetch subscription", await res.text())
//       }
//     } catch (err) {
//       console.error(err)
//     }
//   }

//   useEffect(() => {
//     fetchSubscriptions()
//   }, [])

//   // ⭐ Fetch companies whenever dialog opens
//   useEffect(() => {
//     if (isDialogOpen) fetchCompanies()
//   }, [isDialogOpen])

//   // Create / Update
//   const handleSubmit = async () => {
//     const method = selectedSub ? "PUT" : "POST"
//     const url = selectedSub
//       ? `${API_BASE}/subscriptions/${selectedSub.id}/`
//       : `${API_BASE}/subscriptions/`

//     const res = await fetch(url, {
//       method,
//       headers: getHeaders(),
//       body: JSON.stringify(formData),
//     })

//     if (res.ok) {
//       setIsDialogOpen(false)
//       setFormData({})
//       setSelectedSub(null)
//       fetchSubscriptions()
//     } else {
//       console.error("Failed to save subscription", await res.text())
//     }
//   }

//   // Delete
//   const handleDelete = async (id: number) => {
//     if (!confirm("Are you sure you want to delete this subscription?")) return
//     const res = await fetch(`${API_BASE}/subscriptions/${id}/`, {
//       method: "DELETE",
//       headers: getHeaders(),
//     })
//     if (res.ok) fetchSubscriptions()
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <h1 className="text-3xl font-bold text-slate-800">Subscriptions</h1>
//         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//           <DialogTrigger asChild>
//             <Button
//               onClick={() => {
//                 setSelectedSub(null)
//                 setFormData({})
//               }}
//             >
//               <Plus className="mr-2 h-4 w-4" /> New Subscription
//             </Button>
//           </DialogTrigger>
//           <DialogContent className="sm:max-w-lg">
//             <DialogHeader>
//               <DialogTitle>
//                 {selectedSub ? "Edit Subscription" : "Create Subscription"}
//               </DialogTitle>
//             </DialogHeader>
//             <div className="grid gap-4 py-4">
//               {/* Company dropdown ⭐ NEW */}
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="company" className="text-right">Company</Label>
//                 <select
//                   id="company"
//                   className="col-span-3 border rounded p-2"
//                   value={formData.company ?? ""}
//                   onChange={(e) =>
//                     setFormData({ ...formData, company: Number(e.target.value) })
//                   }
//                 >
//                   <option value="">Select a company</option>
//                   {companies.map((c) => (
//                     <option key={c.id} value={c.id}>
//                       {c.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Other fields remain Input */}
//               {["plan", "start_date", "end_date", "is_active", "stripe_subscription_id"].map((field) => (
//                 <div key={field} className="grid grid-cols-4 items-center gap-4">
//                   <Label htmlFor={field} className="text-right capitalize">
//                     {field.replace(/_/g, " ")}
//                   </Label>
//                   <Input
//                     id={field}
//                     type={
//                       field.includes("date")
//                         ? "date"
//                         : field === "is_active"
//                         ? "checkbox"
//                         : "text"
//                     }
//                     checked={
//                       field === "is_active"
//                         ? (formData as any)[field] ?? false
//                         : undefined
//                     }
//                     value={
//                       field === "is_active"
//                         ? undefined
//                         : (formData as any)[field] ?? ""
//                     }
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         [field]:
//                           field === "is_active"
//                             ? e.target.checked
//                             : e.target.value,
//                       })
//                     }
//                     className="col-span-3"
//                   />
//                 </div>
//               ))}
//             </div>
//             <Button onClick={handleSubmit} className="w-full">
//               {selectedSub ? "Update" : "Create"}
//             </Button>
//           </DialogContent>
//         </Dialog>
//       </div>

//       {/* Subscriptions grid (unchanged) */}
//       {loading ? (
//         <div className="flex justify-center py-20">
//           <Loader2 className="animate-spin h-8 w-8 text-slate-500" />
//         </div>
//       ) : (
//         <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//           {subscriptions.map((sub) => (
//             <motion.div key={sub.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
//               <Card className="shadow-md hover:shadow-xl transition-all rounded-2xl">
//                 <CardHeader className="flex flex-row items-center justify-between">
//                   <CardTitle className="text-xl font-semibold">Sub #{sub.id}</CardTitle>
//                   <div className="flex space-x-2">
//                     <Button variant="ghost" size="sm" onClick={() => fetchSubscriptionById(sub.id)}>
//                       <Pencil className="h-4 w-4" />
//                     </Button>
//                     <Button variant="ghost" size="sm" onClick={() => handleDelete(sub.id)}>
//                       <Trash2 className="h-4 w-4 text-red-500" />
//                     </Button>
//                   </div>
//                 </CardHeader>
//                 <CardContent className="space-y-2 text-sm text-slate-600">
//                   <p><strong>Company:</strong> {sub.company}</p>
//                   <p><strong>Plan:</strong> {sub.plan}</p>
//                   <p><strong>Start:</strong> {new Date(sub.start_date).toLocaleDateString()}</p>
//                   <p><strong>End:</strong> {sub.end_date ? new Date(sub.end_date).toLocaleDateString() : "Ongoing"}</p>
//                   <p><strong>Active:</strong> {sub.is_active ? "Yes" : "No"}</p>
//                   <p className="text-xs text-slate-400">Stripe ID: {sub.stripe_subscription_id}</p>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           ))}
//         </motion.div>
//       )}
//     </div>
//   )
// }
