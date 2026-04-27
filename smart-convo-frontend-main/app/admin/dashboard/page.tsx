"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, Activity, DollarSign, TrendingUp, ShieldCheck } from "lucide-react"



export default function AdminDashboard() {
  const stats = [
    {
      title: "Total Companies",
      value: "24",
      change: "+12%",
      icon: Building2,
      gradient: "from-indigo-500 to-violet-600",
      shadow: "shadow-indigo-500/25",
    },
    {
      title: "Active Users",
      value: "1,234",
      change: "+8%",
      icon: Users,
      gradient: "from-cyan-500 to-blue-600",
      shadow: "shadow-cyan-500/25",
    },
    {
      title: "Monthly Revenue",
      value: "$45,678",
      change: "+23%",
      icon: DollarSign,
      gradient: "from-amber-500 to-orange-600",
      shadow: "shadow-amber-500/25",
    },
    {
      title: "System Uptime",
      value: "99.9%",
      change: "+0.1%",
      icon: Activity,
      gradient: "from-emerald-500 to-teal-600",
      shadow: "shadow-emerald-500/25",
    },
  ]

  const recentActivity = [
    { company: "Acme Corp", action: "Upgraded to Pro Plan", time: "2 hours ago", status: "success" },
    { company: "TechStart Inc", action: "New user registered", time: "4 hours ago", status: "info" },
    { company: "Global Solutions", action: "Payment failed", time: "6 hours ago", status: "error" },
    { company: "Innovation Labs", action: "Support ticket created", time: "8 hours ago", status: "warning" },
  ]

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
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                    <ShieldCheck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl md:text-2xl font-light text-slate-800 tracking-tight">Dashboard Overview</h1>
                    <p className="text-xs md:text-sm text-slate-500 font-light">Welcome back! Here&apos;s what&apos;s happening with your platform.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="group relative bg-white rounded-2xl border border-slate-200/60 p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg ${stat.shadow}`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                <TrendingUp className="h-3 w-3 mr-1" />
                {stat.change}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">{stat.title}</p>
              <p className="text-2xl font-semibold text-slate-800 tracking-tight">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity & System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden hover:shadow-lg transition-all duration-300">
          <div className="p-5 border-b border-slate-100">
            <h3 className="text-base font-semibold text-slate-800">Recent Activity</h3>
            <p className="text-xs text-slate-500 mt-0.5">Latest actions across all companies</p>
          </div>
          <div className="p-5">
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-700">{activity.company}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{activity.action}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      className={`text-xs font-medium border-0 rounded-full ${
                        activity.status === "success"
                          ? "bg-emerald-100 text-emerald-700"
                          : activity.status === "error"
                            ? "bg-rose-100 text-rose-700"
                            : activity.status === "warning"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-indigo-100 text-indigo-700"
                      }`}
                    >
                      {activity.status}
                    </Badge>
                    <span className="text-xs text-slate-400">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden hover:shadow-lg transition-all duration-300">
          <div className="p-5 border-b border-slate-100">
            <h3 className="text-base font-semibold text-slate-800">System Status</h3>
            <p className="text-xs text-slate-500 mt-0.5">Current system health and alerts</p>
          </div>
          <div className="p-5">
            <div className="space-y-3">
              {[
                { label: "API Response Time", status: "Normal", color: "bg-emerald-100 text-emerald-700" },
                { label: "Database Performance", status: "Optimal", color: "bg-emerald-100 text-emerald-700" },
                { label: "Server Load", status: "Medium", color: "bg-amber-100 text-amber-700" },
                { label: "Backup Status", status: "Complete", color: "bg-emerald-100 text-emerald-700" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <span className="text-sm font-medium text-slate-700">{item.label}</span>
                  <Badge className={`text-xs font-medium border-0 rounded-full ${item.color}`}>
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
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
