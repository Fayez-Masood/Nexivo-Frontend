"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { AddAgentWizard } from "@/components/add-agent-wizard"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Trash2, Bot, Plus, Users, Activity, Settings, Loader2, Wrench, ChevronDown, ChevronUp } from "lucide-react"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"
import { useTutorial } from "@/components/tutorial/TutorialProvider"

interface Agent {
  id: number
  name: string
  status: "Active" | "Inactive"
  persona: string
  primary: boolean
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddAgentWizardOpen, setIsAddAgentWizardOpen] = useState(false)
  const [expandedPersonas, setExpandedPersonas] = useState<Set<number>>(new Set())
  const [primaryDialogOpen, setPrimaryDialogOpen] = useState(false)
  const [selectedAgentId, setSelectedAgentId] = useState<number | null>(null)
  const { toast } = useToast()
  const router = useRouter()
  const pathname = usePathname()
  const isAgentsPage = pathname === "/dashboard/agents"
  const { tutorialSteps, startTutorial, updateTutorialProgress } = useTutorial()
  const { driverRef } = useTutorial()
  const [toolsDialogOpen, setToolsDialogOpen] = useState(false)
  const [assignedTools, setAssignedTools] = useState<any[]>([])
  const [loadingTools, setLoadingTools] = useState(false)

  const fetchAgents = () => {
    setLoading(true)
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/agents/agents/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${Cookies.get("Token") || ""}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const enriched = Array.isArray(data)
          ? data.map((agent) => ({
              id: agent.id,
              name: agent.name,
              status: agent.status === "Active" || agent.status === "active" ? "Active" : "Inactive",
              persona: agent.persona || agent.description || "Not configured",
              primary: agent.primary || false,
            }))
          : []
        setAgents(enriched)
      })
      .catch(() => {
        toast({ title: "Error", description: "Failed to fetch agents", variant: "destructive" })
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchAgents()
  }, [])

  useEffect(() => {
    if (!loading && isAgentsPage && tutorialSteps.length > 0) {
      if (!tutorialSteps.includes(-1) && !tutorialSteps.includes(9)) {
        startTutorial()
      }
    }
  }, [loading, isAgentsPage, tutorialSteps, startTutorial])

  useEffect(() => {
    const checkAndStartTutorial = async () => {
      if (!loading && isAgentsPage) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/companies/get_tutorial/`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${Cookies.get("Token") || ""}`,
            },
          })
          if (!res.ok) throw new Error("Failed to fetch tutorial progress")
          const data = await res.json()
          const tutorialArray: number[] = data.tutorial_setup || []
          if (!tutorialArray.includes(9)) {
            startTutorial()
          }
        } catch (err) {
          console.error("Error checking tutorial progress:", err)
        }
      }
    }
    checkAndStartTutorial()
  }, [loading, isAgentsPage, startTutorial])

  const handleToggleAgentStatus = async (id: number) => {
    const token = Cookies.get("Token") || ""
    const agentToUpdate = agents.find((agent) => agent.id === id)
    if (!agentToUpdate) return

    if (agentToUpdate.primary) {
      toast({
        title: "Action Not Allowed",
        description: "You cannot deactivate the primary agent.",
        variant: "destructive",
      })
      return
    }

    const newStatus = agentToUpdate.status === "Active" ? "Inactive" : "Active"
    setAgents((prev) => prev.map((agent) => (agent.id === id ? { ...agent, status: newStatus } : agent)))

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/agents/agents/${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Token ${token}` },
        body: JSON.stringify({ status: newStatus.toLowerCase() }),
      })
      if (!res.ok) throw new Error("Failed to update agent status")
      toast({ title: "Agent Status Updated", description: `Agent status changed to ${newStatus}.` })
    } catch {
      setAgents((prev) =>
        prev.map((agent) => (agent.id === id ? { ...agent, status: agentToUpdate.status } : agent))
      )
      toast({ title: "Error", description: "Failed to update agent status", variant: "destructive" })
    }
  }

  const handleDeleteAgent = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this agent?")) return
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/agents/agents/${id}/`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Token ${Cookies.get("Token") || ""}` },
      })
      if (res.ok) {
        setAgents((prev) => prev.filter((agent) => agent.id !== id))
        toast({ title: "Agent Deleted", description: "The agent has been successfully deleted.", variant: "destructive" })
      } else throw new Error("Delete failed")
    } catch {
      toast({ title: "Error", description: "Failed to delete agent", variant: "destructive" })
    }
  }

  const handleMakePrimaryClick = (id: number) => {
    setSelectedAgentId(id)
    setPrimaryDialogOpen(true)
  }

  const handleMakePrimary = async () => {
    if (!selectedAgentId) return
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/agents/agents/${selectedAgentId}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Token ${Cookies.get("Token") || ""}` },
        body: JSON.stringify({ primary: true }),
      })
      if (res.ok) {
        setAgents((prev) =>
          prev.map((agent) =>
            agent.id === selectedAgentId ? { ...agent, primary: true } : { ...agent, primary: false }
          )
        )
        toast({ title: "Primary Agent Set", description: "The agent has been set as primary." })
      } else throw new Error("Failed to set primary agent")
    } catch {
      toast({ title: "Error", description: "Failed to set primary agent", variant: "destructive" })
    } finally {
      setPrimaryDialogOpen(false)
      setSelectedAgentId(null)
    }
  }

  const togglePersonaExpansion = (agentId: number) => {
    setExpandedPersonas((prev) => {
      const newSet = new Set(prev)
      newSet.has(agentId) ? newSet.delete(agentId) : newSet.add(agentId)
      return newSet
    })
  }

  const truncatePersona = (persona: string, maxLength = 80) =>
    persona.length <= maxLength ? persona : persona.substring(0, maxLength) + "…"

  const handleViewTools = async (agentId: number) => {
    try {
      setLoadingTools(true)
      setAssignedTools([])
      setToolsDialogOpen(true)
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/agents/agents/${agentId}/`, {
        headers: { "Content-Type": "application/json", Authorization: `Token ${Cookies.get("Token") || ""}` },
      })
      if (!res.ok) throw new Error("Failed to fetch agent tools")
      const data = await res.json()
      setAssignedTools(Array.isArray(data.custom_features) ? data.custom_features : [])
    } catch {
      toast({ title: "Error", description: "Failed to fetch tools for this agent.", variant: "destructive" })
    } finally {
      setLoadingTools(false)
    }
  }

  const activeAgents = agents.filter((a) => a.status === "Active").length
  const totalAgents = agents.length

  // ── Stat card ─────────────────────────────────────────────────────────────
  function StatCard({
    bg, ink, icon: Icon, value, label,
  }: { bg: string; ink: string; icon: React.ElementType; value: number; label: string }) {
    return (
      <div
        style={{
          background: "var(--paper)",
          border: "1px solid var(--border-1)",
          borderRadius: "var(--radius-lg)",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          gap: 14,
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div
          style={{
            width: 40, height: 40, borderRadius: 10,
            background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}
        >
          <Icon style={{ width: 18, height: 18, color: ink }} strokeWidth={1.5} />
        </div>
        <div>
          <div style={{ fontSize: 26, fontWeight: 300, color: "var(--fg-1)", letterSpacing: "-0.03em", lineHeight: 1 }}>
            {value}
          </div>
          <div style={{ fontSize: 12, fontWeight: 500, color: "var(--fg-3)", marginTop: 3 }}>{label}</div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--canvas)", padding: "32px 32px 48px" }}>
      {/* Page header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 28,
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--fg-3)",
              marginBottom: 6,
            }}
          >
            Agents
          </div>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 500,
              color: "var(--fg-1)",
              letterSpacing: "-0.02em",
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            Agents Management
          </h1>
          <p style={{ fontSize: 13, color: "var(--fg-3)", marginTop: 4 }}>
            Manage and monitor your AI agents
          </p>
        </div>

        <Dialog open={isAddAgentWizardOpen} onOpenChange={setIsAddAgentWizardOpen}>
          <DialogTrigger asChild>
            <button
              className="create-agent-button"
              onClick={() => {
                setIsAddAgentWizardOpen(true)
                setTimeout(() => {
                  updateTutorialProgress(1)
                  driverRef.current?.moveNext()
                }, 100)
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                padding: "9px 16px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--ink)",
                background: "var(--ink)",
                color: "var(--canvas)",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                boxShadow: "var(--shadow-sm)",
                transition: "opacity var(--dur-fast) var(--ease-out)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <Plus style={{ width: 15, height: 15 }} strokeWidth={2} />
              Add New Agent
            </button>
          </DialogTrigger>
          <AddAgentWizard
            isOpen={isAddAgentWizardOpen}
            onClose={() => setIsAddAgentWizardOpen(false)}
            onAgentAdded={fetchAgents}
          />
        </Dialog>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 28 }}>
        <StatCard bg="var(--sky-bg)"   ink="var(--sky-ink)"   icon={Users}    value={totalAgents}               label="Total Agents"    />
        <StatCard bg="var(--sage-bg)"  ink="var(--sage-ink)"  icon={Activity} value={activeAgents}              label="Active Agents"   />
        <StatCard bg="var(--sand-bg)"  ink="var(--sand-ink)"  icon={Bot}      value={totalAgents - activeAgents} label="Inactive Agents" />
      </div>

      {/* Section label */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--fg-3)",
          }}
        >
          Your Agents
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--fg-4)",
            background: "var(--graphite-100)",
            padding: "2px 8px",
            borderRadius: "var(--radius-pill)",
          }}
        >
          {totalAgents} {totalAgents === 1 ? "agent" : "agents"}
        </span>
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "80px 0" }}>
          <Loader2 style={{ width: 28, height: 28, color: "var(--signal-ink)", animation: "spin 1s linear infinite" }} />
          <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
        </div>
      ) : agents.length === 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "64px 24px",
            background: "var(--paper)",
            border: "1px dashed var(--border-2)",
            borderRadius: "var(--radius-lg)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 52, height: 52, borderRadius: "50%",
              background: "var(--graphite-100)",
              display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16,
            }}
          >
            <Bot style={{ width: 22, height: 22, color: "var(--fg-4)" }} strokeWidth={1.5} />
          </div>
          <div style={{ fontSize: 15, fontWeight: 500, color: "var(--fg-1)", marginBottom: 6 }}>No agents yet</div>
          <p style={{ fontSize: 13, color: "var(--fg-3)", maxWidth: 340, marginBottom: 20 }}>
            Get started by creating your first AI agent using the button above.
          </p>
          <Dialog open={isAddAgentWizardOpen} onOpenChange={setIsAddAgentWizardOpen}>
            <DialogTrigger asChild>
              <button
                style={{
                  display: "inline-flex", alignItems: "center", gap: 7,
                  padding: "8px 16px", borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border-2)", background: "var(--paper)",
                  color: "var(--fg-1)", fontSize: 13, fontWeight: 500, cursor: "pointer",
                }}
              >
                <Plus style={{ width: 14, height: 14 }} strokeWidth={2} />
                Create Your First Agent
              </button>
            </DialogTrigger>
          </Dialog>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 14,
          }}
        >
          {agents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              expanded={expandedPersonas.has(agent.id)}
              onToggleExpand={() => togglePersonaExpansion(agent.id)}
              onToggleStatus={() => handleToggleAgentStatus(agent.id)}
              onDelete={() => handleDeleteAgent(agent.id)}
              onMakePrimary={() => handleMakePrimaryClick(agent.id)}
              onSettings={() => router.push(`/dashboard/agent-settings/${agent.id}`)}
              onViewTools={() => handleViewTools(agent.id)}
              onViewConfigs={() => router.push(`/dashboard/agents/${agent.id}/configs`)}
              truncate={truncatePersona}
            />
          ))}
        </div>
      )}

      {/* Tools dialog */}
      <Dialog open={toolsDialogOpen} onOpenChange={setToolsDialogOpen}>
        <DialogContent
          style={{
            maxWidth: 560,
            borderRadius: "var(--radius-xl)",
            border: "1px solid var(--border-1)",
            background: "var(--paper)",
            boxShadow: "var(--shadow-xl)",
            padding: 28,
          }}
        >
          <DialogHeader>
            <DialogTitle style={{ fontSize: 17, fontWeight: 500, color: "var(--fg-1)" }}>
              Assigned Tools
            </DialogTitle>
            <DialogDescription style={{ fontSize: 13, color: "var(--fg-3)", marginTop: 2 }}>
              Tools currently assigned to this agent
            </DialogDescription>
          </DialogHeader>

          <div style={{ marginTop: 20 }}>
            {loadingTools ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
                <Loader2 style={{ width: 24, height: 24, color: "var(--signal-ink)", animation: "spin 1s linear infinite" }} />
              </div>
            ) : assignedTools.length === 0 ? (
              <div style={{ textAlign: "center", padding: "32px 0", color: "var(--fg-3)", fontSize: 13 }}>
                No tools assigned to this agent.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {assignedTools.map((tool: any) => (
                  <div
                    key={tool.id}
                    style={{
                      padding: "12px 16px",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border-1)",
                      background: "var(--paper)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: "var(--fg-1)" }}>
                        {tool.name || "Unnamed Tool"}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 10,
                          letterSpacing: "0.04em",
                          padding: "2px 7px",
                          borderRadius: "var(--radius-pill)",
                          background: "var(--mist-bg)",
                          color: "var(--mist-ink)",
                        }}
                      >
                        assigned
                      </span>
                    </div>
                    {tool.description && (
                      <p style={{ fontSize: 12, color: "var(--fg-3)", margin: 0, lineHeight: 1.5 }}>
                        {tool.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter style={{ marginTop: 20 }}>
            <button
              onClick={() => setToolsDialogOpen(false)}
              style={{
                padding: "8px 16px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border-2)",
                background: "var(--paper)",
                color: "var(--fg-1)",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Make Primary confirmation dialog */}
      <Dialog open={primaryDialogOpen} onOpenChange={setPrimaryDialogOpen}>
        <DialogContent
          style={{
            maxWidth: 400,
            borderRadius: "var(--radius-xl)",
            border: "1px solid var(--border-1)",
            background: "var(--paper)",
            boxShadow: "var(--shadow-xl)",
            padding: 28,
          }}
        >
          <DialogHeader>
            <DialogTitle style={{ fontSize: 16, fontWeight: 500, color: "var(--fg-1)" }}>
              Make Agent Primary
            </DialogTitle>
            <DialogDescription style={{ fontSize: 13, color: "var(--fg-3)", marginTop: 4 }}>
              Are you sure you want to make this agent primary?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter style={{ marginTop: 20, gap: 8 }}>
            <button
              onClick={() => setPrimaryDialogOpen(false)}
              style={{
                padding: "8px 16px", borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border-2)", background: "var(--paper)",
                color: "var(--fg-1)", fontSize: 13, cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleMakePrimary}
              style={{
                padding: "8px 16px", borderRadius: "var(--radius-sm)",
                border: "1px solid var(--ink)", background: "var(--ink)",
                color: "var(--canvas)", fontSize: 13, fontWeight: 500, cursor: "pointer",
              }}
            >
              Yes, Make Primary
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ── Agent card ────────────────────────────────────────────────────────────────
function AgentCard({
  agent, expanded, onToggleExpand, onToggleStatus, onDelete,
  onMakePrimary, onSettings, onViewTools, onViewConfigs, truncate,
}: {
  agent: { id: number; name: string; status: "Active" | "Inactive"; persona: string; primary: boolean }
  expanded: boolean
  onToggleExpand: () => void
  onToggleStatus: () => void
  onDelete: () => void
  onMakePrimary: () => void
  onSettings: () => void
  onViewTools: () => void
  onViewConfigs: () => void
  truncate: (s: string, max?: number) => string
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "var(--paper)",
        border: agent.primary
          ? "1px solid var(--signal-soft)"
          : `1px solid ${hovered ? "var(--border-2)" : "var(--border-1)"}`,
        borderRadius: "var(--radius-lg)",
        boxShadow: hovered ? "var(--shadow-md)" : "var(--shadow-sm)",
        overflow: "hidden",
        transition: "box-shadow var(--dur-base) var(--ease-out), border-color var(--dur-fast) var(--ease-out)",
      }}
    >
      {/* Primary banner */}
      {agent.primary && (
        <div
          style={{
            padding: "4px 14px",
            background: "var(--signal-soft)",
            borderBottom: "1px solid var(--signal-soft)",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span
            style={{
              width: 5, height: 5, borderRadius: "50%", background: "var(--signal)", display: "inline-block",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--signal-ink)",
            }}
          >
            Primary Agent
          </span>
        </div>
      )}

      <div style={{ padding: "16px 18px" }}>
        {/* Card header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
            {/* Avatar */}
            <div
              style={{
                width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                background: "var(--mist-bg)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 14, fontWeight: 600,
                  color: "var(--mist-ink)",
                }}
              >
                {agent.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div
                style={{
                  fontSize: 14, fontWeight: 500, color: "var(--fg-1)",
                  letterSpacing: "-0.01em", overflow: "hidden",
                  textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}
              >
                {agent.name}
              </div>
              <div style={{ fontSize: 11, color: "var(--fg-4)", marginTop: 2 }}>
                Conversational AI · #{agent.id}
              </div>
            </div>
          </div>

          {/* Action buttons — always visible on hover via opacity */}
          <div
            style={{
              display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4,
              opacity: hovered ? 1 : 0,
              transition: "opacity var(--dur-fast) var(--ease-out)",
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", gap: 4 }}>
              <ActionBtn onClick={onMakePrimary} title="Make Primary">Primary</ActionBtn>
              <IconBtn onClick={onSettings} title="Settings"><Settings style={{ width: 13, height: 13 }} strokeWidth={1.5} /></IconBtn>
              <IconBtn onClick={onDelete} title="Delete" danger><Trash2 style={{ width: 13, height: 13 }} strokeWidth={1.5} /></IconBtn>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              <ActionBtn onClick={onViewTools} title="View Tools"><Wrench style={{ width: 10, height: 10 }} strokeWidth={2} /> Tools</ActionBtn>
              <ActionBtn onClick={onViewConfigs} title="View Configs">Configs</ActionBtn>
            </div>
          </div>
        </div>

        {/* Status row */}
        <div
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "10px 12px",
            background: "var(--graphite-50)",
            borderRadius: "var(--radius-sm)",
            marginBottom: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                width: 7, height: 7, borderRadius: "50%",
                background: agent.status === "Active" ? "var(--signal)" : "var(--graphite-300)",
                display: "inline-block",
              }}
            />
            <Label
              htmlFor={`status-${agent.id}`}
              style={{ fontSize: 12, fontWeight: 500, color: "var(--fg-2)", cursor: "pointer" }}
            >
              {agent.status}
            </Label>
          </div>
          <Switch
            id={`status-${agent.id}`}
            checked={agent.status === "Active"}
            onCheckedChange={onToggleStatus}
          />
        </div>

        {/* Persona */}
        <div>
          <div
            style={{
              fontSize: 11, fontWeight: 500, color: "var(--fg-4)",
              textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6,
            }}
          >
            Persona
          </div>
          <div
            style={{
              padding: "10px 12px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border-1)",
              borderLeft: "2px solid var(--signal-soft)",
              background: "var(--graphite-50)",
            }}
          >
            <p style={{ fontSize: 12, color: "var(--fg-2)", lineHeight: 1.6, margin: 0 }}>
              {expanded ? agent.persona : truncate(agent.persona)}
            </p>
            {agent.persona.length > 80 && (
              <button
                onClick={onToggleExpand}
                style={{
                  marginTop: 6, display: "inline-flex", alignItems: "center", gap: 4,
                  fontSize: 11, color: "var(--signal-ink)", background: "none",
                  border: "none", cursor: "pointer", padding: 0, fontFamily: "var(--font-mono)",
                }}
              >
                {expanded ? (
                  <><ChevronUp style={{ width: 10, height: 10 }} strokeWidth={2} /> Show less</>
                ) : (
                  <><ChevronDown style={{ width: 10, height: 10 }} strokeWidth={2} /> Read more</>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ActionBtn({ children, onClick, title, danger }: {
  children: React.ReactNode; onClick: () => void; title?: string; danger?: boolean
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        display: "inline-flex", alignItems: "center", gap: 4,
        padding: "3px 8px", borderRadius: "var(--radius-xs)",
        border: `1px solid ${danger ? "var(--danger-soft)" : "var(--border-2)"}`,
        background: danger ? "var(--danger-soft)" : "var(--graphite-50)",
        color: danger ? "var(--danger)" : "var(--fg-2)",
        fontSize: 11, cursor: "pointer",
        transition: "background var(--dur-fast) var(--ease-out)",
      }}
    >
      {children}
    </button>
  )
}

function IconBtn({ children, onClick, title, danger }: {
  children: React.ReactNode; onClick: () => void; title?: string; danger?: boolean
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center",
        borderRadius: "var(--radius-xs)",
        border: `1px solid ${danger ? "var(--danger-soft)" : "var(--border-2)"}`,
        background: danger ? "var(--danger-soft)" : "var(--graphite-50)",
        color: danger ? "var(--danger)" : "var(--fg-3)",
        cursor: "pointer",
        transition: "background var(--dur-fast) var(--ease-out)",
      }}
    >
      {children}
    </button>
  )
}
