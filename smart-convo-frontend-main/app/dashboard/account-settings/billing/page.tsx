"use client"


import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import { motion, AnimatePresence } from "framer-motion"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { AlertTriangle, CheckCircle2, Clock, CreditCard, TrendingUp, Users, Zap, X, DollarSign, Sparkles } from "lucide-react"


const API_BASE = process.env.NEXT_PUBLIC_BASE_URL


// Types
interface CompanyUsage {
  id: number
  company: number
  current_agents: number
  current_minutes_used: number
  remaining_minutes: number
  last_reset: string
  extra_minutes: number
  extra_cost: number
}


interface Plan {
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


interface Subscription {
  id: number
  company: number
  plan: number
  is_active: boolean
  start_date: string
  end_date: string | null
  stripe_subscription_id: string
}


export default function BillingPage() {
  const [usage, setUsage] = useState<CompanyUsage | null>(null)
  const [plans, setPlans] = useState<Plan[]>([])
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCostWarning, setShowCostWarning] = useState(false)


  const token = Cookies.get("Token") || ""


  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        }


        const [usageRes, plansRes, subsRes] = await Promise.all([
          fetch(`${API_BASE}/billing/usage/my_usage/`, { headers }),
          fetch(`${API_BASE}/billing/plans/`, { headers }),
          fetch(`${API_BASE}/billing/subscriptions/`, { headers }),
        ])


        if (!usageRes.ok) throw new Error("Failed to fetch usage")
        if (!plansRes.ok) throw new Error("Failed to fetch plans")
        if (!subsRes.ok) throw new Error("Failed to fetch subscriptions")


        setUsage(await usageRes.json())
        setPlans(await plansRes.json())
        setSubscriptions(await subsRes.json())



      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }


    fetchData()
  }, [token])

  useEffect(() => {
    if (usage && usage.remaining_minutes === 0 && usage.extra_cost > 0) {
      const hasSeenWarning = localStorage.getItem("billingCostWarningAcknowledged")
      if (!hasSeenWarning) {
        setShowCostWarning(true)
      }
    }
  }, [usage])

  const handleAcknowledgeCostWarning = () => {
    localStorage.setItem("billingCostWarningAcknowledged", "true")
    setShowCostWarning(false)
  }


  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--canvas)" }} className="flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div style={{ width: 48, height: 48, borderRadius: "50%", border: "3px solid var(--border-1)", borderTopColor: "var(--signal)", animation: "spin 0.8s linear infinite" }} />
          </div>
          <p style={{ color: "var(--fg-3)" }}>Loading billing data…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--canvas)" }} className="flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ background: "var(--danger-soft)", border: "1px solid var(--danger)", borderRadius: "var(--radius-lg)", padding: 32 }}
          className="text-center"
        >
          <p style={{ color: "var(--danger)" }} className="font-light text-lg">{error}</p>
        </motion.div>
      </div>
    )
  }

  if (!usage) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--canvas)" }} className="flex items-center justify-center">
        <p className="text-slate-500 font-light text-lg">No usage found</p>
      </div>
    )
  }


  const activeSub = subscriptions.find((s) => s.company === usage.company && s.is_active)
  const activePlan = plans.find((p) => p.id === activeSub?.plan)


  return (
    <div style={{ minHeight: "100vh", background: "var(--canvas)" }}>
      {/* Cost Warning Modal */}
      <AnimatePresence>
        {showCostWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
              style={{ background: "rgba(10,10,10,0.55)" }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
              style={{ border: "1px solid var(--border-1)" }}
            >
              {/* Header */}
              <div className="relative px-8 py-8 text-white" style={{ background: "var(--ink)" }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center shadow-lg">
                        <AlertTriangle className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-2xl font-light tracking-tight mb-1">Quota Exceeded</h2>
                      <p className="text-white/80 text-sm font-light">Overage charges will apply</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="relative p-8 space-y-6">
                <div style={{ background: "var(--butter-bg)", border: "1px solid var(--border-1)", borderRadius: "var(--radius-md)", padding: 24 }}>
                  <div className="flex items-start gap-3 mb-4">
                    <p className="text-slate-900 font-light leading-relaxed">
                      Your monthly subscription quota has been fully utilized. Additional usage will incur charges based on per-minute pricing.
                    </p>
                  </div>

                  <div className="relative mt-6 bg-white rounded-xl p-5 border border-amber-300 shadow-sm">
                    <div className="absolute -top-3 left-4 px-3 py-1 rounded-full shadow-sm" style={{ background: "var(--ink)" }}>
                      <span className="text-xs text-white font-medium uppercase tracking-wider">Overage Rate</span>
                    </div>
                    <div className="flex items-center justify-center gap-3 mt-2">
                      <DollarSign className="w-7 h-7 text-amber-600" />
                      <span className="text-5xl font-extralight text-slate-900">{activePlan?.cost_per_minute || "0.10"}</span>
                      <span className="text-slate-600 font-light text-lg">/ minute</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleAcknowledgeCostWarning}
                  className="w-full px-6 py-4 text-white rounded-xl transition-all duration-300 font-light shadow-lg hover:opacity-90 hover:scale-[1.02]"
                  style={{ background: "var(--signal)" }}
                >
                  <span className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    I Understand & Acknowledge
                  </span>
                </button>

                <p className="text-center text-slate-500 text-xs font-light">
                  This notice will not appear again once acknowledged
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <div className="relative border-b border-slate-200" style={{ background: "var(--paper)" }}>
        <div className="max-w-7xl mx-auto px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-6"
          >
            <div className="w-1.5 h-28 rounded-full" style={{ background: "var(--ink)" }}></div>
            <div>
              <h1 className="text-6xl font-extralight tracking-tight text-slate-900 mb-3">
                Billing & Usage
              </h1>
              <p className="text-xl text-slate-600 font-light tracking-wide flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-slate-500" />
                Monitor your subscription, usage, and costs
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12 space-y-8">
        {/* Active Plan & Subscription */}
        {activePlan && activeSub && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-200" style={{ background: "var(--graphite-50)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-slate-700" />
                  </div>
                  <div>
                    <h2 className="text-xl font-light text-slate-900">Current Subscription</h2>
                    <p className="text-sm text-slate-600 font-light mt-0.5">
                      Active plan details for your company
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="group relative rounded-2xl p-6 hover:shadow-md transition-all duration-300" style={{ background: "var(--graphite-50)", border: "1px solid var(--border-1)" }}>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "var(--mist-bg)" }}>
                        <CheckCircle2 className="w-5 h-5" style={{ color: "var(--signal-ink)" }} />
                      </div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Plan Name</p>
                    </div>
                    <p className="text-2xl text-slate-900 font-light">{activePlan.name}</p>
                  </div>

                  <div className="group relative rounded-2xl p-6 hover:shadow-md transition-all duration-300" style={{ background: "var(--graphite-50)", border: "1px solid var(--border-1)" }}>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "var(--sage-bg)" }}>
                        <CreditCard className="w-5 h-5" style={{ color: "var(--sage-ink)" }} />
                      </div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Monthly Price</p>
                    </div>
                    <p className="text-2xl text-slate-900 font-light">${activePlan.price}</p>
                  </div>

                  <div className="group relative rounded-2xl p-6 hover:shadow-md transition-all duration-300" style={{ background: "var(--graphite-50)", border: "1px solid var(--border-1)" }}>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "var(--sky-bg)" }}>
                        <Users className="w-5 h-5" style={{ color: "var(--sky-ink)" }} />
                      </div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Max Agents</p>
                    </div>
                    <p className="text-2xl text-slate-900 font-light">{activePlan.max_agents}</p>
                  </div>

                  <div className="group relative rounded-2xl p-6 hover:shadow-md transition-all duration-300" style={{ background: "var(--graphite-50)", border: "1px solid var(--border-1)" }}>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "var(--mist-bg)" }}>
                        <Clock className="w-5 h-5" style={{ color: "var(--signal-ink)" }} />
                      </div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Max Minutes</p>
                    </div>
                    <p className="text-2xl text-slate-900 font-light">{activePlan.max_minutes_per_month}</p>
                  </div>

                  <div className="group relative rounded-2xl p-6 hover:shadow-md transition-all duration-300" style={{ background: "var(--graphite-50)", border: "1px solid var(--border-1)" }}>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "var(--sand-bg)" }}>
                        <CreditCard className="w-5 h-5" style={{ color: "var(--sand-ink)" }} />
                      </div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Cost Per Minute</p>
                    </div>
                    <p className="text-2xl text-slate-900 font-light">${activePlan.cost_per_minute}</p>
                  </div>

                  <div className="group relative rounded-2xl p-6 hover:shadow-md transition-all duration-300" style={{ background: "var(--graphite-50)", border: "1px solid var(--border-1)" }}>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "var(--blush-bg)" }}>
                        <Zap className="w-5 h-5" style={{ color: "var(--blush-ink)" }} />
                      </div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Threshold Minutes</p>
                    </div>
                    <p className="text-2xl text-slate-900 font-light">{activePlan.threshold_minutes}</p>
                  </div>
                </div>

                {/* Subscription Timeline */}
                <div style={{ background: "var(--graphite-50)", borderRadius: "var(--radius-lg)", padding: 32, border: "1px solid var(--border-1)" }}>
                  <p className="mb-6 font-light text-slate-900 text-lg flex items-center gap-2">
                    <Clock className="w-5 h-5 text-slate-600" />
                    Subscription Timeline
                  </p>
                  <div className="relative w-full h-4 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: activeSub.end_date
                          ? `${Math.min(
                              ((new Date().getTime() - new Date(activeSub.start_date).getTime()) /
                                (new Date(activeSub.end_date).getTime() - new Date(activeSub.start_date).getTime())) *
                                100,
                              100
                            ).toFixed(2)}%`
                          : "100%"
                      }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="absolute left-0 top-0 h-4"
                      style={{ background: "var(--signal)" }}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-slate-600 mt-4 font-light">
                    <span>{new Date(activeSub.start_date).toLocaleDateString()}</span>
                    {activeSub.end_date ? (
                      <span>{new Date(activeSub.end_date).toLocaleDateString()}</span>
                    ) : (
                      <span className="px-4 py-1.5 rounded-full text-xs font-light" style={{ background: "var(--success-soft)", color: "var(--success)", border: "1px solid var(--success)" }}>
                        ● Active
                      </span>
                    )}
                  </div>
                  <p className="mt-5 text-sm text-slate-500 font-light flex items-center gap-2">
                    <span className="text-slate-600">Stripe ID:</span>
                    <span className="font-mono text-slate-700">{activeSub.stripe_subscription_id}</span>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Current Usage Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-200" style={{ background: "var(--graphite-50)" }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--mist-bg)" }}>
                  <TrendingUp className="w-5 h-5" style={{ color: "var(--signal-ink)" }} />
                </div>
                <div>
                  <h2 className="text-xl font-light text-slate-900">Current Usage</h2>
                  <p className="text-sm text-slate-600 font-light mt-0.5">
                    Breakdown of current consumption
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="relative group p-7 rounded-2xl hover:shadow-md transition-all duration-300"
                  style={{ background: "var(--graphite-50)", border: "1px solid var(--border-1)" }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--sky-bg)" }}>
                      <Users className="w-5 h-5" style={{ color: "var(--sky-ink)" }} />
                    </div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Current Agents</p>
                  </div>
                  <p className="text-4xl font-extralight text-slate-900">{usage.current_agents}</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="relative group p-7 rounded-2xl hover:shadow-md transition-all duration-300"
                  style={{ background: "var(--graphite-50)", border: "1px solid var(--border-1)" }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--sky-bg)" }}>
                      <Clock className="w-5 h-5" style={{ color: "var(--sky-ink)" }} />
                    </div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Minutes Used</p>
                  </div>
                  <p className="text-4xl font-extralight text-slate-900">{usage.current_minutes_used}</p>
                </motion.div>

                {/* Remaining Minutes Card */}
                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="relative group p-7 rounded-2xl hover:shadow-md transition-all duration-300"
                  style={
                    usage.remaining_minutes < 50
                      ? { background: "var(--danger-soft)", border: "1px solid var(--danger)" }
                      : { background: "var(--success-soft)", border: "1px solid var(--success)" }
                  }
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={usage.remaining_minutes < 50 ? { background: "var(--danger-soft)" } : { background: "var(--success-soft)" }}
                    >
                      <Zap
                        className="w-5 h-5"
                        style={{ color: usage.remaining_minutes < 50 ? "var(--danger)" : "var(--success)" }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Remaining Minutes</p>
                  </div>
                  <p
                    className="text-4xl font-extralight"
                    style={{ color: usage.remaining_minutes < 50 ? "var(--danger)" : "var(--success)" }}
                  >
                    {usage.remaining_minutes}
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="relative group p-7 rounded-2xl hover:shadow-md transition-all duration-300"
                  style={{ background: "var(--graphite-50)", border: "1px solid var(--border-1)" }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--sand-bg)" }}>
                      <Clock className="w-5 h-5" style={{ color: "var(--sand-ink)" }} />
                    </div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Extra Minutes</p>
                  </div>
                  <p className="text-4xl font-extralight text-slate-900">{usage.extra_minutes}</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="relative group p-7 rounded-2xl hover:shadow-md transition-all duration-300"
                  style={
                    usage.extra_cost > 0
                      ? { background: "var(--danger-soft)", border: "1px solid var(--danger)" }
                      : { background: "var(--graphite-50)", border: "1px solid var(--border-1)" }
                  }
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={usage.extra_cost > 0 ? { background: "var(--danger-soft)" } : { background: "var(--graphite-50)" }}
                    >
                      <CreditCard
                        className="w-5 h-5"
                        style={{ color: usage.extra_cost > 0 ? "var(--danger)" : "var(--fg-3)" }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Extra Cost</p>
                  </div>
                  {usage.extra_cost > 0 ? (
                    <p className="text-4xl font-extralight" style={{ color: "var(--danger)" }}>${usage.extra_cost.toFixed(2)}</p>
                  ) : (
                    <p className="text-lg font-light text-slate-500">No extra charges</p>
                  )}
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="relative group p-7 rounded-2xl hover:shadow-md transition-all duration-300"
                  style={{ background: "var(--graphite-50)", border: "1px solid var(--border-1)" }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--mist-bg)" }}>
                      <Clock className="w-5 h-5" style={{ color: "var(--signal-ink)" }} />
                    </div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Last Reset</p>
                  </div>
                  <p className="text-xl font-light text-slate-900">{new Date(usage.last_reset).toLocaleDateString()}</p>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
