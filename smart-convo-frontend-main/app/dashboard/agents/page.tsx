"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { Trash2, Bot, Plus, Users, Activity, FileText, Settings, Loader2 } from "lucide-react"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation";
import { useTutorial } from "@/components/tutorial/TutorialProvider";

interface Agent {
  id: number
  name: string
  status: "Active" | "Inactive"
  persona: string
  primary: boolean
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true) // 👈 Loading state
  const [isAddAgentWizardOpen, setIsAddAgentWizardOpen] = useState(false)
  const [expandedPersonas, setExpandedPersonas] = useState<Set<number>>(new Set())
  const [primaryDialogOpen, setPrimaryDialogOpen] = useState(false)
  const [selectedAgentId, setSelectedAgentId] = useState<number | null>(null)
  const { toast } = useToast()
  const router = useRouter()
  const pathname = usePathname();
  const isAgentsPage = pathname === "/dashboard/agents";
  const { tutorialSteps, startTutorial, updateTutorialProgress } = useTutorial();
  const { driverRef } = useTutorial();
  const [toolsDialogOpen, setToolsDialogOpen] = useState(false)
  const [selectedAgentTools, setSelectedAgentTools] = useState<string[]>([])
const [assignedTools, setAssignedTools] = useState<any[]>([])
const [loadingTools, setLoadingTools] = useState(false)


  const fetchAgents = () => {
   
    setLoading(true) // start loading
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/agents/agents/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${Cookies.get("Token") || ""}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        const enriched = Array.isArray(data)
          ? data.map((agent) => ({
              id: agent.id,
              name: agent.name,
              status: agent.status === "Active" || agent.status === "active" ? "Active" : "Inactive",
              persona: agent.persona || "Unknown",
              primary: agent.primary || false,
            }))
          : []
        setAgents(enriched)
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to fetch agents",
          variant: "destructive",
        })
      })
      .finally(() => setLoading(false)) // stop loading
  }

  useEffect(() => {
    fetchAgents()
  }, [])

    useEffect(() => {
      
      // updateTutorialProgress(1);
  if (!loading && isAgentsPage && tutorialSteps.length > 0) {
    // don't start if skipped or finished
    if (!tutorialSteps.includes(-1) && !tutorialSteps.includes(9)) {
      startTutorial();
    }
  }
}, [loading, isAgentsPage, tutorialSteps, startTutorial]);


//   useEffect(() => {
//   if (!loading && isAgentsPage) {
//     startTutorial(); // Start tutorial once data loaded and page is Agents
//   }
// }, [loading, isAgentsPage, startTutorial]);

useEffect(() => {
  const checkAndStartTutorial = async () => {
    if (!loading && isAgentsPage) {
      try {
        const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
        const token = Cookies.get("Token") || "";
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        };

        const res = await fetch(`${BASE_URL}/companies/get_tutorial/`, { method: "GET", headers });
        if (!res.ok) throw new Error("Failed to fetch tutorial progress");

        const data = await res.json();
        const tutorialArray: number[] = data.tutorial_setup || [];

        // Only start tutorial if "9" is NOT in the array
        if (!tutorialArray.includes(9)) {
          startTutorial();
        }
      } catch (err) {
        console.error("Error checking tutorial progress:", err);
      }
    }
  };

  checkAndStartTutorial();
}, [loading, isAgentsPage, startTutorial]);






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
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ status: newStatus.toLowerCase() }),
      })

      if (!res.ok) throw new Error("Failed to update agent status")

      toast({
        title: "Agent Status Updated",
        description: `Agent status changed to ${newStatus}.`,
      })
    } catch (error) {
      setAgents((prev) =>
        prev.map((agent) => (agent.id === id ? { ...agent, status: agentToUpdate.status } : agent))
      )
      toast({
        title: "Error",
        description: "Failed to update agent status",
        variant: "destructive",
      })
    }
  }

  const handleDeleteAgent = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this agent?")) return

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/agents/agents/${id}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${Cookies.get("Token") || ""}`,
        },
      })

      if (res.ok) {
        setAgents((prev) => prev.filter((agent) => agent.id !== id))
        toast({
          title: "Agent Deleted",
          description: "The agent has been successfully deleted.",
          variant: "destructive",
        })
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
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${Cookies.get("Token") || ""}`,
        },
        body: JSON.stringify({ primary: true }),
      })

      if (res.ok) {
        setAgents((prevAgents) =>
          prevAgents.map((agent) =>
            agent.id === selectedAgentId ? { ...agent, primary: true } : { ...agent, primary: false }
          )
        )

        toast({
          title: "Primary Agent Set",
          description: "The agent has been set as primary.",
        })
      } else throw new Error("Failed to set primary agent")
    } catch {
      toast({
        title: "Error",
        description: "Failed to set primary agent",
        variant: "destructive",
      })
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

  const truncatePersona = (persona: string, maxLength = 60) => {
    return persona.length <= maxLength ? persona : persona.substring(0, maxLength) + "..."
  }

  const activeAgents = agents.filter((agent) => agent.status === "Active").length
  const totalAgents = agents.length
const handleViewTools = async (agentId: number) => {
  try {
    setLoadingTools(true)
    setAssignedTools([])
    setToolsDialogOpen(true)

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/agents/agents/${agentId}/`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${Cookies.get("Token") || ""}`,
        },
      }
    )

    if (!res.ok) throw new Error("Failed to fetch agent tools")

    const data = await res.json()

    // The backend returns an array of custom features / tools assigned
    const tools = Array.isArray(data.custom_features)
      ? data.custom_features
      : []

    setAssignedTools(tools)
  } catch (err) {
    console.error("Error fetching tools:", err)
    toast({
      title: "Error",
      description: "Failed to fetch tools for this agent.",
      variant: "destructive",
    })
  } finally {
    setLoadingTools(false)
  }
}


  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-slate-900">Agents Management</h1>
              <p className="text-slate-600 text-lg">Manage and monitor your AI agents in one centralized dashboard</p>
            </div>
            <Dialog open={isAddAgentWizardOpen} onOpenChange={setIsAddAgentWizardOpen}>
              <DialogTrigger asChild>
  <Button
    size="lg"
    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl create-agent-button"
    onClick={() => {
      setIsAddAgentWizardOpen(true); // open modal first

      // wait until modal is rendered
      setTimeout(() => {
        updateTutorialProgress(1);      // mark step complete
        driverRef.current?.moveNext();  // move to next tutorial step
      }, 100); // 100ms usually enough; increase if modal takes longer
    }}
  >
    <Plus className="w-5 h-5 mr-2" />
    Add New Agent
  </Button>
</DialogTrigger>

              <AddAgentWizard
                isOpen={isAddAgentWizardOpen}
                onClose={() => setIsAddAgentWizardOpen(false)}
                onAgentAdded={fetchAgents}
              />
            </Dialog>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card className="bg-white backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Agents</p>
                    <p className="text-2xl font-bold text-slate-900">{totalAgents}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <Activity className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Active Agents</p>
                    <p className="text-2xl font-bold text-slate-900">{activeAgents}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-orange-100 rounded-xl">
                    <Bot className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Inactive Agents</p>
                    <p className="text-2xl font-bold text-slate-900">{totalAgents - activeAgents}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Agents Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-slate-800">Your Agents</h2>
            <Badge variant="secondary" className="text-sm px-3 py-1">
              {totalAgents} {totalAgents === 1 ? "Agent" : "Agents"}
            </Badge>
          </div>

            {loading ? (
            // 👇 Spinner while loading
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
          ) : 
          agents.length === 0 ? (
            <Card className="bg-white backdrop-blur-sm border-2 border-dashed border-slate-200 shadow-lg">
              <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                  <Bot className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-700 mb-2">No agents found</h3>
                <p className="text-slate-500 mb-6 max-w-md">
                  Get started by creating your first AI agent. Click the "Add New Agent" button to begin.
                </p>
                <Dialog open={isAddAgentWizardOpen} onOpenChange={setIsAddAgentWizardOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Agent
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.map((agent) => (
                <Card
                  key={agent.id}
                  className={`group bg-white backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 rounded-2xl overflow-hidden min-w-[320px] ${
                    agent.primary ? "ring-2 ring-amber-400 bg-gradient-to-br from-amber-50 to-white" : ""
                  }`}
                >
                  {agent.primary && (
                    <div className="bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-semibold px-3 py-1 text-center">
                      ⭐ PRIMARY AGENT
                    </div>
                  )}
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <Avatar className="w-12 h-12 bg-blue-500 flex-shrink-0">
                          <AvatarFallback className="bg-blue-500 text-white font-semibold">
                            {agent.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <CardTitle className="text-lg font-semibold text-slate-800 group-hover:text-slate-900 transition-colors truncate">
                            {agent.name}
                          </CardTitle>
                          <p className="text-sm text-slate-500">AI Assistant</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-1 flex-shrink-0">
  {/* First row: Make Primary, Settings, Delete */}
  <div className="flex flex-row items-center space-x-2">
    <Button
      size="sm"
      variant="outline"
      onClick={() => handleMakePrimaryClick(agent.id)}
      className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 text-xs px-2 py-1 h-6"
      title="Make Primary Agent"
    >
      Make Primary
    </Button>

    <Button
      size="icon"
      variant="ghost"
      onClick={() => router.push(`/dashboard/agent-settings/${agent.id}`)}
      className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg h-6 w-6"
      title="Agent Settings"
    >
      <Settings className="h-3 w-3" />
    </Button>

    <Button
      size="icon"
      variant="ghost"
      onClick={() => handleDeleteAgent(agent.id)}
      className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg h-6 w-6"
      title="Delete Agent"
    >
      <Trash2 className="h-3 w-3" />
    </Button>
  </div>

  {/* Second row: View Tools button (aligned under AI Assistant) */}
  <div className="flex gap-3">
<Button
  size="sm"
  variant="outline"
  onClick={() => handleViewTools(agent.id)}
  className="opacity-0 group-hover:opacity-100 transition-opacity text-purple-600 hover:text-purple-700 hover:bg-purple-50 border-purple-200 text-xs px-2 py-1 h-6 mt-1 self-start"
  title="View Tools"
>
  View Tools
</Button>

<Button
  size="sm"
  variant="outline"
  className="opacity-0 group-hover:opacity-100 transition-opacity 
             text-orange-600 hover:text-orange-700 hover:bg-orange-50 
             border-orange-200 text-xs px-2 py-1 h-6 mt-1 self-start"
  onClick={() => router.push(`/dashboard/agents/${agent.id}/configs`)}
>
  View Configs
</Button>

</div>

</div>


                    </div>
                  </CardHeader>

                  <CardContent className="pt-0 space-y-4">
                    {/* Status Section */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            agent.status === "Active" ? "bg-green-500" : "bg-slate-400"
                          }`}
                        />
                        <Label
                          htmlFor={`status-toggle-${agent.id}`}
                          className="text-sm font-medium text-slate-700 cursor-pointer"
                        >
                          {agent.status}
                        </Label>
                      </div>
                      <Switch
                        id={`status-toggle-${agent.id}`}
                        checked={agent.status === "Active"}
                        onCheckedChange={() => handleToggleAgentStatus(agent.id)}
                        className="data-[state=checked]:bg-green-500"
                      />
                    </div>

                    {/* Agent Details */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">Agent ID</span>
                        <Badge variant="outline" className="text-xs">
                          #{agent.id}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">Type</span>
                        <span className="text-slate-700 font-medium">Conversational AI</span>
                      </div>

                      {/* Persona Section */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 text-sm">Persona</span>
                          <FileText className="w-4 h-4 text-slate-400" />
                        </div>
                        <div className="bg-slate-50 rounded-lg p-3 border-l-4 border-blue-500">
                          <p className="text-sm text-slate-700 leading-relaxed">
                            {expandedPersonas.has(agent.id) ? agent.persona : truncatePersona(agent.persona)}
                          </p>
                          {agent.persona.length > 60 && (
                            <button
                              onClick={() => togglePersonaExpansion(agent.id)}
                              className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                            >
                              {expandedPersonas.has(agent.id) ? "Show less" : "Read more"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            )}
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-slate-200">
          <div className="text-center space-y-2">
            <div className="text-sm text-slate-500 font-medium">© 2025 All rights reserved.</div>
            <div className="text-xs text-slate-400 flex items-center justify-center space-x-2">
              <span>Session ID: f4f2fc7d-7161-4d53-ae5f-6bd14515f55b</span>
              <span className="text-green-500">🔒</span>
            </div>
          </div>
        </div>
      </div>

<Dialog open={toolsDialogOpen} onOpenChange={setToolsDialogOpen}>
  <DialogContent className="max-w-4xl rounded-2xl backdrop-blur-md bg-white/90 dark:bg-slate-900/80 shadow-2xl max-h-[80vh] overflow-y-auto">
    <DialogHeader className="text-center space-y-2">
      <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
        Assigned Tools
      </DialogTitle>
      <DialogDescription className="text-slate-600 dark:text-slate-400">
        These are the tools currently assigned to this agent.
      </DialogDescription>
    </DialogHeader>

    {/* Loader */}
    {loadingTools ? (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-400 border-t-transparent"></div>
      </div>
    ) : assignedTools.length === 0 ? (
      <div className="text-center text-slate-500 italic py-10">
        No tools assigned to this agent.
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {assignedTools.map((tool: any) => (
          <div key={tool.id} className="relative group">
            <Card
              className="rounded-2xl backdrop-blur-md bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 
              transition-all duration-300 hover:shadow-xl hover:scale-[1.02] flex flex-col overflow-hidden cursor-pointer"
            >
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-lg font-semibold truncate">
                  <span
                    className="bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent truncate max-w-[70%]"
                  >
                    {tool.name || "Unnamed Tool"}
                  </span>
                  <span className="ml-2 text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full whitespace-nowrap">
                    Assigned
                  </span>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-2 flex-1 overflow-hidden">
                <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-3 break-words">
                  {tool.description || "No description available."}
                </p>
              </CardContent>
            </Card>

            {/* Tooltip on hover (all grey text) */}
            <div
              className="absolute z-50 hidden group-hover:flex flex-col max-w-xs p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl 
              text-sm text-slate-700 dark:text-slate-300 top-full mt-2 left-1/2 -translate-x-1/2"
            >
              <p className="font-semibold text-slate-700 dark:text-slate-300">
                {tool.name || "Unnamed Tool"}
              </p>
              <p className="mt-1 text-slate-700 dark:text-slate-300 whitespace-pre-line break-words">
                {tool.description || "No description available."}
              </p>
            </div>
          </div>
        ))}
      </div>
    )}

    <DialogFooter className="mt-8">
      <Button variant="outline" onClick={() => setToolsDialogOpen(false)}>
        Close
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>





      {/* Make Primary Confirmation Dialog */}
      <Dialog open={primaryDialogOpen} onOpenChange={setPrimaryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Make Agent Primary</DialogTitle>
            <DialogDescription>Are you sure you want to make this agent primary?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPrimaryDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleMakePrimary} className="bg-blue-600 hover:bg-blue-700 text-white">
              Yes, Make Primary
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


// "use client"

// import { useEffect, useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import {
//   Dialog,
//   DialogTrigger,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
// } from "@/components/ui/dialog"
// import { AddAgentWizard } from "@/components/add-agent-wizard"
// import { Switch } from "@/components/ui/switch"
// import { Label } from "@/components/ui/label"
// import { Badge } from "@/components/ui/badge"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// import { useToast } from "@/hooks/use-toast"
// import { Trash2, Bot, Plus, Users, Activity, FileText, Settings, Loader2 } from "lucide-react"
// import Cookies from "js-cookie"
// import { useRouter } from "next/navigation"

// interface Agent {
//   id: number
//   name: string
//   status: "Active" | "Inactive"
//   persona: string
//   primary: boolean
// }

// export default function AgentsPage() {
//   const [agents, setAgents] = useState<Agent[]>([])
//   const [loading, setLoading] = useState(true)
//   const [isAddAgentWizardOpen, setIsAddAgentWizardOpen] = useState(false)
//   const [expandedPersonas, setExpandedPersonas] = useState<Set<number>>(new Set())
//   const { toast } = useToast()
//   const router = useRouter()

//   const fetchAgents = () => {
//     setLoading(true)
//     fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/agents/agents/`, {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Token ${Cookies.get("Token") || ""}`,
//       },
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         const enriched = Array.isArray(data)
//           ? data.map((agent) => ({
//               id: agent.id,
//               name: agent.name,
//               status: agent.status === "Active" || agent.status === "active" ? "Active" : "Inactive",
//               persona: agent.persona || "Unknown",
//               primary: agent.primary || false,
//             }))
//           : []
//         setAgents(enriched)
//       })
//       .catch(() => {
//         toast({
//           title: "Error",
//           description: "Failed to fetch agents",
//           variant: "destructive",
//         })
//       })
//       .finally(() => setLoading(false))
//   }

//   useEffect(() => {
//     fetchAgents()
//   }, [])

//   const handleToggleAgentStatus = async (id: number) => {
//     const token = Cookies.get("Token") || ""
//     const agentToUpdate = agents.find((agent) => agent.id === id)
//     if (!agentToUpdate) return

//     if (agentToUpdate.primary) {
//       toast({
//         title: "Action Not Allowed",
//         description: "You cannot deactivate the primary agent.",
//         variant: "destructive",
//       })
//       return
//     }

//     const newStatus = agentToUpdate.status === "Active" ? "Inactive" : "Active"
//     setAgents((prev) => prev.map((agent) => (agent.id === id ? { ...agent, status: newStatus } : agent)))

//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/agents/agents/${id}/`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Token ${token}`,
//         },
//         body: JSON.stringify({ status: newStatus.toLowerCase() }),
//       })
//       if (!res.ok) throw new Error("Failed to update agent status")

//       toast({
//         title: "Agent Status Updated",
//         description: `Agent status changed to ${newStatus}.`,
//       })
//     } catch {
//       setAgents((prev) =>
//         prev.map((agent) => (agent.id === id ? { ...agent, status: agentToUpdate.status } : agent))
//       )
//       toast({
//         title: "Error",
//         description: "Failed to update agent status",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleDeleteAgent = async (id: number) => {
//     if (!window.confirm("Are you sure you want to delete this agent?")) return

//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/agents/agents/${id}/`, {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Token ${Cookies.get("Token") || ""}`,
//         },
//       })

//       if (res.ok) {
//         setAgents((prev) => prev.filter((agent) => agent.id !== id))
//         toast({
//           title: "Agent Deleted",
//           description: "The agent has been successfully deleted.",
//           variant: "destructive",
//         })
//       } else throw new Error("Delete failed")
//     } catch {
//       toast({ title: "Error", description: "Failed to delete agent", variant: "destructive" })
//     }
//   }

//   const togglePersonaExpansion = (agentId: number) => {
//     setExpandedPersonas((prev) => {
//       const newSet = new Set(prev)
//       newSet.has(agentId) ? newSet.delete(agentId) : newSet.add(agentId)
//       return newSet
//     })
//   }

//   const truncatePersona = (persona: string, maxLength = 60) => {
//     return persona.length <= maxLength ? persona : persona.substring(0, maxLength) + "..."
//   }

//   const activeAgents = agents.filter((agent) => agent.status === "Active").length
//   const totalAgents = agents.length

//   return (
//     <div className="min-h-screen bg-slate-50">
//       <div className="container mx-auto px-6 py-8 max-w-7xl">
//         {/* Header */}
//         <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
//           <div className="space-y-2">
//             <h1 className="text-4xl font-bold text-slate-900">Agents Management</h1>
//             <p className="text-slate-600 text-lg">Manage and monitor your AI agents in one centralized dashboard</p>
//           </div>
//           <Dialog open={isAddAgentWizardOpen} onOpenChange={setIsAddAgentWizardOpen}>
//             <DialogTrigger asChild>
//               <Button
//                 size="lg"
//                 className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl"
//               >
//                 <Plus className="w-5 h-5 mr-2" />
//                 Create Primary Agent
//               </Button>
//             </DialogTrigger>
//             <AddAgentWizard
//               isOpen={isAddAgentWizardOpen}
//               onClose={() => setIsAddAgentWizardOpen(false)}
//               onAgentAdded={fetchAgents}
//             />
//           </Dialog>
//         </div>

//         {/* Agents Grid */}
//         <div className="space-y-6">
//           {loading ? (
//             <div className="flex justify-center items-center py-20">
//               <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
//             </div>
//           ) : agents.length === 0 ? (
//             <Card className="bg-white border-2 border-dashed border-slate-200 shadow-lg">
//               <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
//                 <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
//                   <Bot className="w-10 h-10 text-slate-400" />
//                 </div>
//                 <h3 className="text-xl font-semibold text-slate-700 mb-2">No agents found</h3>
//                 <p className="text-slate-500 mb-6 max-w-md">
//                   Get started by creating your first AI agent. Click the "Create Primary Agent" button to begin.
//                 </p>
//               </CardContent>
//             </Card>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {agents.map((agent) => (
//                 <Card
//                   key={agent.id}
//                   className={`group bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 rounded-2xl overflow-hidden min-w-[320px] ${
//                     agent.primary ? "ring-2 ring-amber-400 bg-gradient-to-br from-amber-50 to-white" : ""
//                   }`}
//                 >
//                   {agent.primary && (
//                     <div className="bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-semibold px-3 py-1 text-center">
//                       ⭐ PRIMARY AGENT
//                     </div>
//                   )}
//                   <CardHeader className="pb-4">
//                     <div className="flex items-start justify-between">
//                       <div className="flex items-center space-x-3 flex-1 min-w-0">
//                         <Avatar className="w-12 h-12 bg-blue-500 flex-shrink-0">
//                           <AvatarFallback className="bg-blue-500 text-white font-semibold">
//                             {agent.name.charAt(0).toUpperCase()}
//                           </AvatarFallback>
//                         </Avatar>
//                         <div className="min-w-0 flex-1">
//                           <CardTitle className="text-lg font-semibold text-slate-800 group-hover:text-slate-900 truncate">
//                             {agent.name}
//                           </CardTitle>
//                           <p className="text-sm text-slate-500">AI Assistant</p>
//                         </div>
//                       </div>
//                       <div className="flex flex-row items-center space-x-2 flex-shrink-0">
//                         {/* Manage Worker Agents */}
//                         <Button
//                           size="sm"
//                           variant="outline"
//                           onClick={() => router.push(`/dashboard/agents/workers/${agent.id}/`)}
//                           className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-xs px-2 py-1 h-6"
//                         >
//                           Manage Worker Agents
//                         </Button>

//                         {/* Settings Button */}
//                         <Button
//                           size="icon"
//                           variant="ghost"
//                           onClick={() => router.push(`/dashboard/agent-settings`)}
//                           className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg h-6 w-6"
//                           title="Agent Settings"
//                         >
//                           <Settings className="h-3 w-3" />
//                         </Button>

//                         {/* Delete Button */}
//                         <Button
//                           size="icon"
//                           variant="ghost"
//                           onClick={() => handleDeleteAgent(agent.id)}
//                           className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg h-6 w-6"
//                           title="Delete Agent"
//                         >
//                           <Trash2 className="h-3 w-3" />
//                         </Button>
//                       </div>
//                     </div>
//                   </CardHeader>

//                   <CardContent className="pt-0 space-y-4">
//                     {/* Status Section */}
//                     <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
//                       <div className="flex items-center space-x-3">
//                         <div
//                           className={`w-3 h-3 rounded-full ${
//                             agent.status === "Active" ? "bg-green-500" : "bg-slate-400"
//                           }`}
//                         />
//                         <Label className="text-sm font-medium text-slate-700 cursor-pointer">
//                           {agent.status}
//                         </Label>
//                       </div>
//                       <Switch
//                         checked={agent.status === "Active"}
//                         onCheckedChange={() => handleToggleAgentStatus(agent.id)}
//                         className="data-[state=checked]:bg-green-500"
//                       />
//                     </div>

//                     {/* Agent Details */}
//                     <div className="space-y-3">
//                       <div className="flex justify-between items-center text-sm">
//                         <span className="text-slate-500">Agent ID</span>
//                         <Badge variant="outline" className="text-xs">
//                           #{agent.id}
//                         </Badge>
//                       </div>
//                       <div className="flex justify-between items-center text-sm">
//                         <span className="text-slate-500">Type</span>
//                         <span className="text-slate-700 font-medium">Conversational AI</span>
//                       </div>

//                       {/* Persona */}
//                       <div className="space-y-2">
//                         <div className="flex items-center justify-between">
//                           <span className="text-slate-500 text-sm">Persona</span>
//                           <FileText className="w-4 h-4 text-slate-400" />
//                         </div>
//                         <div className="bg-slate-50 rounded-lg p-3 border-l-4 border-blue-500">
//                           <p className="text-sm text-slate-700 leading-relaxed">
//                             {expandedPersonas.has(agent.id) ? agent.persona : truncatePersona(agent.persona)}
//                           </p>
//                           {agent.persona.length > 60 && (
//                             <button
//                               onClick={() => togglePersonaExpansion(agent.id)}
//                               className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
//                             >
//                               {expandedPersonas.has(agent.id) ? "Show less" : "Read more"}
//                             </button>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }