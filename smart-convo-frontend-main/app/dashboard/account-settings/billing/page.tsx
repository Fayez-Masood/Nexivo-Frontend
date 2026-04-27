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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-slate-900 rounded-full border-t-transparent animate-spin"></div>
            <div className="absolute inset-2 border-4 border-slate-100 rounded-full"></div>
            <div className="absolute inset-2 border-4 border-slate-400 rounded-full border-b-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <div className="space-y-2">
            <p className="text-slate-900 text-xl font-light tracking-wider">Loading billing data</p>
            <div className="flex items-center justify-center gap-1">
              <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0 }} className="w-2 h-2 bg-slate-900 rounded-full"></motion.div>
              <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }} className="w-2 h-2 bg-slate-600 rounded-full"></motion.div>
              <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }} className="w-2 h-2 bg-slate-900 rounded-full"></motion.div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-red-50 border border-red-200 rounded-3xl p-8"
        >
          <p className="text-red-600 font-light text-lg">{error}</p>
        </motion.div>
      </div>
    )
  }

  if (!usage) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-slate-500 font-light text-lg">No usage found</p>
      </div>
    )
  }


  const activeSub = subscriptions.find((s) => s.company === usage.company && s.is_active)
  const activePlan = plans.find((p) => p.id === activeSub?.plan)


  return (
    <div className="min-h-screen bg-white">
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
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-amber-200"
            >
              {/* Header */}
              <div className="relative bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-8 text-white">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                        <AlertTriangle className="w-8 h-8 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full animate-ping"></div>
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
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
                  <div className="flex items-start gap-3 mb-4">
                    {/* <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" /> */}
                    <p className="text-slate-900 font-light leading-relaxed">
                      Your monthly subscription quota has been fully utilized. Additional usage will incur charges based on per-minute pricing.
                    </p>
                  </div>
                  
                  <div className="relative mt-6 bg-white rounded-xl p-5 border border-amber-300 shadow-sm">
                    <div className="absolute -top-3 left-4 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-sm">
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
                  className="group relative w-full px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl transition-all duration-300 font-light shadow-lg hover:shadow-xl hover:scale-[1.02] overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  <span className="relative flex items-center justify-center gap-2">
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
      <div className="relative border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-8 py-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-6"
          >
            <div className="w-1.5 h-28 bg-gradient-to-b from-slate-900 via-slate-400 to-slate-200 rounded-full"></div>
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
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-slate-50 to-white px-8 py-6 border-b border-slate-200">
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
                  <div className="group relative bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-9 h-9 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                      </div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Plan Name</p>
                    </div>
                    <p className="text-2xl text-slate-900 font-light">{activePlan.name}</p>
                  </div>

                  <div className="group relative bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-green-600" />
                      </div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Monthly Price</p>
                    </div>
                    <p className="text-2xl text-slate-900 font-light">${activePlan.price}</p>
                  </div>

                  <div className="group relative bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-purple-600" />
                      </div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Max Agents</p>
                    </div>
                    <p className="text-2xl text-slate-900 font-light">{activePlan.max_agents}</p>
                  </div>

                  <div className="group relative bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-9 h-9 bg-cyan-100 rounded-lg flex items-center justify-center">
                        <Clock className="w-5 h-5 text-cyan-600" />
                      </div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Max Minutes</p>
                    </div>
                    <p className="text-2xl text-slate-900 font-light">{activePlan.max_minutes_per_month}</p>
                  </div>

                  <div className="group relative bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-amber-600" />
                      </div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Cost Per Minute</p>
                    </div>
                    <p className="text-2xl text-slate-900 font-light">${activePlan.cost_per_minute}</p>
                  </div>

                  <div className="group relative bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-9 h-9 bg-rose-100 rounded-lg flex items-center justify-center">
                        <Zap className="w-5 h-5 text-rose-600" />
                      </div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Threshold Minutes</p>
                    </div>
                    <p className="text-2xl text-slate-900 font-light">{activePlan.threshold_minutes}</p>
                  </div>
                </div>

                {/* Subscription Timeline */}
                <div className="mt-8 p-8 bg-slate-50 rounded-2xl border border-slate-200">
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
                      className={`absolute left-0 top-0 h-4 ${
                        activeSub.end_date ? "bg-gradient-to-r from-indigo-500 to-purple-500" : "bg-gradient-to-r from-green-500 to-emerald-500"
                      }`}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-slate-600 mt-4 font-light">
                    <span>{new Date(activeSub.start_date).toLocaleDateString()}</span>
                    {activeSub.end_date ? (
                      <span>{new Date(activeSub.end_date).toLocaleDateString()}</span>
                    ) : (
                      <span className="px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-light border border-green-200">
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
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-50 to-white px-8 py-6 border-b border-slate-200">
              <h2 className="text-xl font-light text-slate-900">Current Usage</h2>
              <p className="text-sm text-slate-600 font-light mt-0.5">
                Breakdown of current consumption
              </p>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <motion.div 
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="relative group p-7 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Current Agents</p>
                  </div>
                  <p className="text-4xl font-extralight text-slate-900">{usage.current_agents}</p>
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="relative group p-7 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Minutes Used</p>
                  </div>
                  <p className="text-4xl font-extralight text-slate-900">{usage.current_minutes_used}</p>
                </motion.div>

                {/* 🆕 Remaining Minutes Card */}
                <motion.div 
                  whileHover={{ scale: 1.02, y: -5 }}
                  className={`relative group p-7 rounded-2xl border hover:shadow-md transition-all duration-300 ${
                    usage.remaining_minutes < 50 ? "bg-red-50 border-red-200 hover:border-red-300" : "bg-green-50 border-green-200 hover:border-green-300"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      usage.remaining_minutes < 50 ? "bg-red-100" : "bg-green-100"
                    }`}>
                      <Zap className={`w-5 h-5 ${
                        usage.remaining_minutes < 50 ? "text-red-600" : "text-green-600"
                      }`} />
                    </div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Remaining Minutes</p>
                  </div>
                  <p
                    className={`text-4xl font-extralight ${
                      usage.remaining_minutes < 50 ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {usage.remaining_minutes}
                  </p>
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="relative group p-7 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                      <Clock className="w-5 h-5 text-amber-600" />
                    </div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Extra Minutes</p>
                  </div>
                  <p className="text-4xl font-extralight text-slate-900">{usage.extra_minutes}</p>
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 1.02, y: -5 }}
                  className={`relative group p-7 rounded-2xl border hover:shadow-md transition-all duration-300 ${
                    usage.extra_cost > 0 ? "bg-red-50 border-red-200 hover:border-red-300" : "bg-slate-50 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      usage.extra_cost > 0 ? "bg-red-100" : "bg-slate-100"
                    }`}>
                      <CreditCard className={`w-5 h-5 ${
                        usage.extra_cost > 0 ? "text-red-600" : "text-slate-600"
                      }`} />
                    </div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Extra Cost</p>
                  </div>
                  {usage.extra_cost > 0 ? (
                    <p className="text-4xl font-extralight text-red-600">${usage.extra_cost.toFixed(2)}</p>
                  ) : (
                    <p className="text-lg font-light text-slate-500">No extra charges</p>
                  )}
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="relative group p-7 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center">
                      <Clock className="w-5 h-5 text-cyan-600" />
                    </div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Last Reset</p>
                  </div>
                  <p className="text-xl font-light text-slate-900">{new Date(usage.last_reset).toLocaleDateString()}</p>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-20 flex items-center justify-center gap-3">
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-1.5 h-1.5 bg-slate-400 rounded-full"></motion.div>
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 0.3 }} className="w-1.5 h-1.5 bg-slate-300 rounded-full"></motion.div>
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 0.6 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full"></motion.div>
        </div>
      </div>
    </div>
  )
}
