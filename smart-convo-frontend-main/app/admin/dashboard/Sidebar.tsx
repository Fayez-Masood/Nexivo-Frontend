"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  Home,
  Building2,
  LogOut,
  Phone,
  Bot,
  CreditCard,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
} from "lucide-react"

const sidebarItems = [
  { name: "Dashboard",           href: "/admin/dashboard",                      icon: Home },
  { name: "Companies",           href: "/admin/dashboard/companies",             icon: Building2 },
  { name: "Manage numbers",      href: "/admin/dashboard/numbers",               icon: Phone },
  { name: "Agent configuration", href: "/admin/dashboard/agent-settings",        icon: Bot },
  {
    name: "Billing",
    icon: CreditCard,
    children: [
      { name: "Manage plans",         href: "/admin/dashboard/billing/plans",         icon: CreditCard },
      { name: "Manage subscriptions", href: "/admin/dashboard/billing/subscriptions", icon: CreditCard },
    ],
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>(["Billing"])
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("adminAuth")
    router.push("/admin")
  }

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]
    )
  }

  return (
    <div
      className={cn("flex-shrink-0 transition-all duration-[220ms]", isCollapsed ? "w-[4.5rem]" : "w-[17.5rem]")}
    >
      <div
        className={cn(
          isCollapsed ? "w-[4.5rem]" : "w-[17.5rem]",
          "flex flex-col transition-all duration-[220ms]",
          "fixed top-0 left-0 h-screen z-10",
        )}
        style={{
          background: "var(--paper)",
          borderRight: "1px solid var(--border-1)",
        }}
      >
        {/* Brand */}
        <div
          className={cn(
            "flex items-center justify-between select-none",
            isCollapsed ? "px-3 py-5 justify-center" : "px-5 py-5",
          )}
        >
          {!isCollapsed && (
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  background: "linear-gradient(135deg, var(--mist-bg) 0%, var(--signal-soft) 100%)",
                  border: "1px solid var(--border-1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <ShieldCheck style={{ width: 16, height: 16, color: "var(--signal-ink)" }} strokeWidth={1.5} />
              </div>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 20,
                  color: "var(--ink)",
                  letterSpacing: "-0.025em",
                  lineHeight: 1,
                }}
              >
                Admin
              </span>
            </div>
          )}
          {isCollapsed && (
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: "linear-gradient(135deg, var(--mist-bg) 0%, var(--signal-soft) 100%)",
                border: "1px solid var(--border-1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ShieldCheck style={{ width: 16, height: 16, color: "var(--signal-ink)" }} strokeWidth={1.5} />
            </div>
          )}
          {!isCollapsed && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              style={{
                padding: 4,
                borderRadius: "var(--radius-xs)",
                color: "var(--graphite-400)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                transition: "color var(--dur-fast) var(--ease-out)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--graphite-700)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--graphite-400)")}
            >
              <ChevronRight
                style={{
                  width: 14,
                  height: 14,
                  transform: isCollapsed ? "none" : "rotate(180deg)",
                  transition: "transform var(--dur-base) var(--ease-out)",
                }}
                strokeWidth={1.5}
              />
            </button>
          )}
        </div>

        {/* Divider */}
        <div style={{ margin: "0 16px", height: 1, background: "var(--border-1)" }} />

        {/* Navigation */}
        <nav
          className={cn("flex-1 overflow-y-auto py-3", isCollapsed ? "px-2" : "px-3")}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {sidebarItems.map((item) => (
              <div key={item.name}>
                {item.children ? (
                  <div>
                    <button
                      onClick={() => !isCollapsed && toggleExpanded(item.name)}
                      title={isCollapsed ? item.name : undefined}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "8px 12px",
                        borderRadius: "var(--radius-sm)",
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        fontSize: 13.5,
                        fontWeight: 400,
                        color: "var(--graphite-600)",
                        transition: "background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "var(--graphite-50)"
                        e.currentTarget.style.color = "var(--graphite-900)"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent"
                        e.currentTarget.style.color = "var(--graphite-600)"
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: isCollapsed ? 0 : 11,
                          justifyContent: isCollapsed ? "center" : "flex-start",
                          width: isCollapsed ? "100%" : undefined,
                        }}
                      >
                        <item.icon style={{ width: 18, height: 18, flexShrink: 0 }} strokeWidth={1.5} />
                        {!isCollapsed && <span style={{ fontWeight: 400 }}>{item.name}</span>}
                      </div>
                      {!isCollapsed &&
                        (expandedItems.includes(item.name) ? (
                          <ChevronDown style={{ width: 14, height: 14, flexShrink: 0, color: "var(--graphite-400)" }} strokeWidth={1.5} />
                        ) : (
                          <ChevronRight style={{ width: 14, height: 14, flexShrink: 0, color: "var(--graphite-400)" }} strokeWidth={1.5} />
                        ))}
                    </button>
                    {!isCollapsed && expandedItems.includes(item.name) && (
                      <div style={{ marginLeft: 28, marginTop: 2, display: "flex", flexDirection: "column", gap: 2 }}>
                        {item.children.map((child) => {
                          const isActive = pathname === child.href
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                padding: "6px 12px",
                                borderRadius: "var(--radius-sm)",
                                fontSize: 13,
                                fontWeight: isActive ? 500 : 400,
                                color: isActive ? "var(--ink)" : "var(--graphite-600)",
                                background: isActive ? "var(--mist-bg)" : "transparent",
                                textDecoration: "none",
                                transition: "background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)",
                              }}
                            >
                              <child.icon style={{ width: 15, height: 15, flexShrink: 0 }} strokeWidth={1.5} />
                              <span>{child.name}</span>
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  (() => {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        href={item.href!}
                        title={isCollapsed ? item.name : undefined}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: isCollapsed ? 0 : 11,
                          justifyContent: isCollapsed ? "center" : "flex-start",
                          padding: "8px 12px",
                          borderRadius: "var(--radius-sm)",
                          fontSize: 13.5,
                          fontWeight: isActive ? 500 : 400,
                          color: isActive ? "var(--ink)" : "var(--graphite-600)",
                          background: isActive ? "var(--mist-bg)" : "transparent",
                          textDecoration: "none",
                          transition: "background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)",
                        }}
                      >
                        <item.icon style={{ width: 18, height: 18, flexShrink: 0 }} strokeWidth={1.5} />
                        {!isCollapsed && <span>{item.name}</span>}
                      </Link>
                    )
                  })()
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* Collapse expand button when collapsed */}
        {isCollapsed && (
          <div style={{ padding: "0 8px 12px" }}>
            <button
              onClick={() => setIsCollapsed(false)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 8,
                borderRadius: "var(--radius-sm)",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                color: "var(--graphite-400)",
              }}
            >
              <ChevronRight style={{ width: 14, height: 14 }} strokeWidth={1.5} />
            </button>
          </div>
        )}

        {/* Logout */}
        <div style={{ borderTop: "1px solid var(--border-1)", padding: isCollapsed ? "8px" : "8px 12px" }}>
          <button
            onClick={handleLogout}
            title={isCollapsed ? "Logout" : undefined}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: isCollapsed ? 0 : 11,
              justifyContent: isCollapsed ? "center" : "flex-start",
              padding: "8px 12px",
              borderRadius: "var(--radius-sm)",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontSize: 13.5,
              color: "var(--graphite-600)",
              transition: "background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--danger-soft)"
              e.currentTarget.style.color = "var(--danger)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent"
              e.currentTarget.style.color = "var(--graphite-600)"
            }}
          >
            <LogOut style={{ width: 18, height: 18, flexShrink: 0 }} strokeWidth={1.5} />
            {!isCollapsed && <span style={{ fontWeight: 400 }}>Sign out</span>}
          </button>
        </div>
      </div>
    </div>
  )
}
