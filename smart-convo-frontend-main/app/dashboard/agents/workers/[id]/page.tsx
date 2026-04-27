// "use client"

// import { useEffect, useState } from "react"
// import { useParams } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Dialog, DialogTrigger } from "@/components/ui/dialog"
// import { Switch } from "@/components/ui/switch"
// import { Label } from "@/components/ui/label"
// import { Badge } from "@/components/ui/badge"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// import { useToast } from "@/hooks/use-toast"
// import { Plus, Trash2, Loader2, Bot, Settings, FileText } from "lucide-react"
// import Cookies from "js-cookie"

// interface Worker {
//   id: number
//   name: string
//   status: "Active" | "Inactive"
//   role: string
//   persona: string
// }

// interface Agent {
//   id: number
//   name: string
//   status: "Active" | "Inactive"
//   persona: string
//   primary: boolean
//   worker_agents: Worker[]
// }

// export default function WorkersPage() {
//   const { id } = useParams()
//   const [workers, setWorkers] = useState<Worker[]>([])
//   const [agent, setAgent] = useState<Agent | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [expandedPersonas, setExpandedPersonas] = useState<Set<number>>(new Set())
//   const { toast } = useToast()

//   const fetchAgent = () => {
//     setLoading(true)
//     fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/agents/${id}/`, {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Token ${Cookies.get("Token") || ""}`,
//       },
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         const enrichedAgent: Agent = {
//           id: data.id,
//           name: data.name,
//           status: data.status === "Active" || data.status === "active" ? "Active" : "Inactive",
//           persona: data.persona || "Unknown",
//           primary: data.primary || false,
//           worker_agents: Array.isArray(data.worker_agents)
//             ? data.worker_agents.map((w: any) => ({
//                 id: w.id,
//                 name: w.name,
//                 status: w.status === "Active" ? "Active" : "Inactive",
//                 role: w.role || "Support Agent",
//                 persona: w.persona || "Unknown",
//               }))
//             : [],
//         }
//         setAgent(enrichedAgent)
//         setWorkers(enrichedAgent.worker_agents)
//       })
//       .catch(() =>
//         toast({ title: "Error", description: "Failed to fetch agent details", variant: "destructive" })
//       )
//       .finally(() => setLoading(false))
//   }

//   useEffect(() => {
//     fetchAgent()
//   }, [id])

//   const handleToggleWorker = async (workerId: number) => {
//     const workerToUpdate = workers.find((w) => w.id === workerId)
//     if (!workerToUpdate) return

//     const newStatus = workerToUpdate.status === "Active" ? "Inactive" : "Active"
//     setWorkers((prev) => prev.map((w) => (w.id === workerId ? { ...w, status: newStatus } : w)))

//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/agents/${id}/workers/${workerId}/`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Token ${Cookies.get("Token") || ""}`,
//         },
//         body: JSON.stringify({ status: newStatus.toLowerCase() }),
//       })
//       if (!res.ok) throw new Error("Failed")
//       toast({ title: "Worker Updated", description: `Status set to ${newStatus}.` })
//     } catch {
//       // rollback
//       setWorkers((prev) => prev.map((w) => (w.id === workerId ? { ...w, status: workerToUpdate.status } : w)))
//       toast({ title: "Error", description: "Failed to update worker", variant: "destructive" })
//     }
//   }

//   const handleDeleteWorker = async (workerId: number) => {
//     if (!window.confirm("Delete this worker?")) return
//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/agents/${id}/workers/${workerId}/`, {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Token ${Cookies.get("Token") || ""}`,
//         },
//       })
//       if (res.ok) {
//         setWorkers((prev) => prev.filter((w) => w.id !== workerId))
//         toast({ title: "Worker Deleted", description: "Worker removed successfully.", variant: "destructive" })
//       } else throw new Error()
//     } catch {
//       toast({ title: "Error", description: "Failed to delete worker", variant: "destructive" })
//     }
//   }

//   const togglePersonaExpansion = (workerId: number) => {
//     setExpandedPersonas((prev) => {
//       const newSet = new Set(prev)
//       newSet.has(workerId) ? newSet.delete(workerId) : newSet.add(workerId)
//       return newSet
//     })
//   }

//   const truncatePersona = (persona: string, maxLength = 60) =>
//     persona.length <= maxLength ? persona : persona.substring(0, maxLength) + "..."

//   return (
//     <div className="min-h-screen bg-white text-gray-900 font-[Poppins]">
//       <div className="container mx-auto px-6 py-14 max-w-7xl">
//         {/* Cinematic Header */}
//         <div className="mb-14 text-center space-y-4">
//           <h1 className="text-5xl font-extrabold tracking-tight drop-shadow-sm">
//             {agent ? `${agent.name} Agent Page` : "Agent Page"}
//           </h1>
//           <p className="text-lg text-gray-600">
//             Manage and monitor worker agents linked to this primary agent.
//           </p>
//         </div>

//         {/* Add Worker Button */}
//         <div className="flex justify-center mb-12">
//           <Dialog>
//             <DialogTrigger asChild>
//               <Button
//                 size="lg"
//                 className="bg-black hover:bg-gray-800 text-white px-8 py-3 text-base font-semibold shadow-md hover:shadow-xl transition-all duration-300 rounded-xl"
//               >
//                 <Plus className="w-5 h-5 mr-2" />
//                 Add Worker
//               </Button>
//             </DialogTrigger>
//           </Dialog>
//         </div>

//         {/* Workers Grid */}
//         {loading ? (
//           <div className="flex justify-center items-center py-20">
//             <Loader2 className="w-12 h-12 text-gray-500 animate-spin" />
//           </div>
//         ) : workers.length === 0 ? (
//           <Card className="bg-gray-50 border-2 border-dashed border-gray-200 shadow-sm">
//             <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
//               <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-6">
//                 <Bot className="w-10 h-10 text-gray-500" />
//               </div>
//               <h3 className="text-xl font-semibold mb-2">No workers found</h3>
//               <p className="text-gray-500 max-w-md">
//                 Start by adding your first worker agent. Click <span className="font-medium">“Add Worker”</span> above.
//               </p>
//             </CardContent>
//           </Card>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {workers.map((worker) => (
//               <Card
//                 key={worker.id}
//                 className="group bg-white border border-gray-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden"
//               >
//                 <CardHeader className="pb-4">
//                   <div className="flex items-start justify-between">
//                     <div className="flex items-center space-x-3 flex-1 min-w-0">
//                       <Avatar className="w-12 h-12 bg-black text-white flex-shrink-0">
//                         <AvatarFallback className="bg-black text-white font-semibold">
//                           {worker.name.charAt(0).toUpperCase()}
//                         </AvatarFallback>
//                       </Avatar>
//                       <div className="min-w-0 flex-1">
//                         <CardTitle className="text-lg font-semibold truncate">
//                           {worker.name}
//                         </CardTitle>
//                         <p className="text-sm text-gray-500">{worker.role}</p>
//                       </div>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       {/* Settings */}
//                       <Button
//                         size="icon"
//                         variant="ghost"
//                         className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg h-6 w-6"
//                         title="Settings"
//                       >
//                         <Settings className="h-3 w-3" />
//                       </Button>

//                       {/* Delete */}
//                       <Button
//                         size="icon"
//                         variant="ghost"
//                         onClick={() => handleDeleteWorker(worker.id)}
//                         className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded-lg h-6 w-6"
//                         title="Delete Worker"
//                       >
//                         <Trash2 className="h-3 w-3" />
//                       </Button>
//                     </div>
//                   </div>
//                 </CardHeader>

//                 <CardContent className="pt-0 space-y-4">
//                   {/* Status */}
//                   <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
//                     <div className="flex items-center space-x-3">
//                       <div
//                         className={`w-3 h-3 rounded-full ${
//                           worker.status === "Active" ? "bg-green-500" : "bg-gray-400"
//                         }`}
//                       />
//                       <Label className="text-sm font-medium">{worker.status}</Label>
//                     </div>
//                     <Switch
//                       checked={worker.status === "Active"}
//                       onCheckedChange={() => handleToggleWorker(worker.id)}
//                       className="data-[state=checked]:bg-green-600"
//                     />
//                   </div>

//                   {/* Details */}
//                   <div className="space-y-3 text-sm">
//                     <div className="flex justify-between">
//                       <span className="text-gray-500">Worker ID</span>
//                       <Badge variant="outline" className="text-xs border-gray-300 text-gray-700">
//                         #{worker.id}
//                       </Badge>
//                     </div>
//                     <div className="space-y-2">
//                       <div className="flex items-center justify-between">
//                         <span className="text-gray-500">Persona</span>
//                         <FileText className="w-4 h-4 text-gray-400" />
//                       </div>
//                       <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-black">
//                         <p className="text-sm leading-relaxed text-gray-800">
//                           {expandedPersonas.has(worker.id)
//                             ? worker.persona
//                             : truncatePersona(worker.persona)}
//                         </p>
//                         {worker.persona.length > 60 && (
//                           <button
//                             onClick={() => togglePersonaExpansion(worker.id)}
//                             className="mt-2 text-xs text-black hover:text-gray-700 font-medium transition-colors"
//                           >
//                             {expandedPersonas.has(worker.id) ? "Show less" : "Read more"}
//                           </button>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { Loader2, ArrowLeft, Settings, Phone, Activity, FileText, Plus, Trash2 } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import Cookies from "js-cookie"

interface WorkerAgent {
  id: number
  name: string
  description: string | null
  status: string
  is_active: boolean
  voice_id: string
  instructions: string
  primary: boolean
  type: string
  twilio_phone_numbers: string[]
}

interface AgentData {
  id: number
  name: string
  status: string
  primary: boolean
  worker_agents: WorkerAgent[]
}

interface AvailableAgent {
  id: number
  name: string
  status: string
  primary: boolean
}

export default function WorkerAgentsDetailPage() {
  const [agentData, setAgentData] = useState<AgentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedInstructions, setExpandedInstructions] = useState<Set<number>>(new Set())
  const [addWorkerDialogOpen, setAddWorkerDialogOpen] = useState(false)
  const [availableAgents, setAvailableAgents] = useState<AvailableAgent[]>([])
  const [loadingAvailable, setLoadingAvailable] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [updatingWorkers, setUpdatingWorkers] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const params = useParams()
  const agentId = params?.id as string

  useEffect(() => {
    if (agentId) {
      fetchAgentData()
    }
  }, [agentId])

  const fetchAgentData = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/agents/agents/${agentId}/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${Cookies.get("Token") || ""}`,
        },
      })
      
      if (!res.ok) throw new Error("Failed to fetch agent data")
      
      const data = await res.json()
      setAgentData(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch agent data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchAvailableAgents = async () => {
    setLoadingAvailable(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/agents/agents/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${Cookies.get("Token") || ""}`,
        },
      })
      const data = await res.json()
      
      if (!agentData) return

      // Filter out: current agent, already assigned workers, and non-primary agents
      const currentWorkerIds = agentData.worker_agents.map(w => w.id)
      const filtered = Array.isArray(data)
        ? data.filter((agent: any) => 
            agent.id !== parseInt(agentId) && 
            !currentWorkerIds.includes(agent.id)
          ).map((agent: any) => ({
            id: agent.id,
            name: agent.name,
            status: agent.status,
            primary: agent.primary || false,
          }))
        : []
      
      setAvailableAgents(filtered)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch available agents",
        variant: "destructive",
      })
    } finally {
      setLoadingAvailable(false)
    }
  }

const handleAddWorker = async (workerId: number) => {
    if (!agentData) return

    setUpdatingWorkers(true)
    try {
      // Patch the worker agent to set its parent
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/agents/agents/${workerId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${Cookies.get("Token") || ""}`,
        },
        body: JSON.stringify({
          parent: agentId,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        const errorMessage = data?.detail || data?.error || "Failed to add worker agent"
        throw new Error(errorMessage)
      }

      toast({
        title: "Worker Added",
        description: data?.message || "Worker agent has been successfully added",
      })

      // Refresh agent data to get the updated worker list
      await fetchAgentData()
      setAddWorkerDialogOpen(false)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add worker agent",
        variant: "destructive",
      })
    } finally {
      setUpdatingWorkers(false)
    }
  }

  const handleRemoveWorker = async (workerId: number) => {
    if (!agentData) return
    if (!window.confirm("Are you sure you want to remove this worker agent?")) return

    setUpdatingWorkers(true)
    try {
      // Remove the parent by setting it to null
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/agents/agents/${workerId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${Cookies.get("Token") || ""}`,
        },
        body: JSON.stringify({
          parent: "",
        }),
      })

      if (!res.ok) throw new Error("Failed to remove worker agent")

      toast({
        title: "Worker Removed",
        description: "Worker agent has been successfully removed",
        variant: "destructive",
      })

      // Refresh agent data
      await fetchAgentData()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove worker agent",
        variant: "destructive",
      })
    } finally {
      setUpdatingWorkers(false)
    }
  }

  const handleToggleWorkerStatus = async (workerId: number) => {
    if (!agentData) return

    const worker = agentData.worker_agents.find((w) => w.id === workerId)
    if (!worker) return

    const newStatus = worker.status === "active" ? "inactive" : "active"

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/agents/agents/${workerId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${Cookies.get("Token") || ""}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!res.ok) throw new Error("Failed to update worker status")

      setAgentData((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          worker_agents: prev.worker_agents.map((w) =>
            w.id === workerId ? { ...w, status: newStatus } : w
          ),
        }
      })

      toast({
        title: "Status Updated",
        description: `Worker status changed to ${newStatus}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update worker status",
        variant: "destructive",
      })
    }
  }

  const toggleInstructions = (workerId: number) => {
    setExpandedInstructions((prev) => {
      const newSet = new Set(prev)
      newSet.has(workerId) ? newSet.delete(workerId) : newSet.add(workerId)
      return newSet
    })
  }

  const truncateText = (text: string, maxLength = 150) => {
    return text.length <= maxLength ? text : text.substring(0, maxLength) + "..."
  }

  const openAddWorkerDialog = () => {
    setSearchQuery("")
    fetchAvailableAgents()
    setAddWorkerDialogOpen(true)
  }

  const filteredAvailableAgents = availableAgents.filter(agent =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
      </div>
    )
  }

  if (!agentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <Card className="bg-white border-0 shadow-sm max-w-md">
          <CardContent className="text-center py-12">
            <p className="text-slate-500 font-light">Agent not found</p>
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mt-4"
            >
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const activeWorkers = agentData.worker_agents.filter((w) => w.status === "active").length
  const totalWorkers = agentData.worker_agents.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        {/* Header */}
        <div className="mb-12">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6 text-slate-600 hover:text-slate-900 -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Agents
          </Button>

          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 bg-slate-900">
                  <AvatarFallback className="bg-slate-900 text-white font-light text-2xl">
                    {agentData.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-4xl font-light tracking-tight text-slate-900">
                    {agentData.name}
                  </h1>
                  <p className="text-slate-500 font-light mt-1">Primary Agent</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {agentData.primary && (
                  <Badge variant="outline" className="text-sm font-light border-slate-300">
                    Primary
                  </Badge>
                )}
                <Button
                  onClick={openAddWorkerDialog}
                  className="bg-slate-900 hover:bg-slate-800 text-white"
                  disabled={updatingWorkers}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Worker Agent
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-1 h-12 bg-slate-900 rounded-full" />
                <div>
                  <p className="text-3xl font-light text-slate-900">{totalWorkers}</p>
                  <p className="text-sm text-slate-500">Total Workers</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1 h-12 bg-emerald-500 rounded-full" />
                <div>
                  <p className="text-3xl font-light text-slate-900">{activeWorkers}</p>
                  <p className="text-sm text-slate-500">Active Workers</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1 h-12 bg-slate-400 rounded-full" />
                <div>
                  <p className="text-3xl font-light text-slate-900">{totalWorkers - activeWorkers}</p>
                  <p className="text-sm text-slate-500">Inactive Workers</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Worker Agents Grid */}
        {agentData.worker_agents.length === 0 ? (
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="text-center py-20">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Activity className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-light text-slate-700 mb-2">No Worker Agents</h3>
              <p className="text-slate-500 font-light mb-6">
                This agent doesn't have any worker agents assigned yet
              </p>
              <Button
                onClick={openAddWorkerDialog}
                variant="outline"
                className="border-slate-300"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Worker
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {agentData.worker_agents.map((worker) => (
              <Card
                key={worker.id}
                className="group bg-white border-slate-200 hover:border-slate-300 transition-all duration-300 hover:shadow-lg overflow-hidden"
              >
                <CardHeader className="pb-4 border-b border-slate-100">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Avatar className="w-12 h-12 bg-slate-900 flex-shrink-0">
                        <AvatarFallback className="bg-slate-900 text-white font-light">
                          {worker.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg font-light text-slate-900 truncate">
                          {worker.name}
                        </CardTitle>
                        <p className="text-sm text-slate-500 font-light">{worker.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => router.push(`/dashboard/agent-settings/${worker.id}`)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-slate-900"
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleRemoveWorker(worker.id)}
                        disabled={updatingWorkers}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-4 space-y-4">
                  {/* Status Toggle */}
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          worker.status === "active" ? "bg-emerald-500" : "bg-slate-400"
                        }`}
                      />
                      <Label
                        htmlFor={`worker-toggle-${worker.id}`}
                        className="text-sm font-light text-slate-700 cursor-pointer"
                      >
                        {worker.status === "active" ? "Active" : "Inactive"}
                      </Label>
                    </div>
                    <Switch
                      id={`worker-toggle-${worker.id}`}
                      checked={worker.status === "active"}
                      onCheckedChange={() => handleToggleWorkerStatus(worker.id)}
                      className="data-[state=checked]:bg-emerald-500"
                    />
                  </div>

                  {/* Details */}
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-light">Worker ID</span>
                      <span className="text-slate-700 font-mono text-xs">#{worker.id}</span>
                    </div>

                    {worker.twilio_phone_numbers.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-slate-500">
                          <Phone className="w-4 h-4" />
                          <span className="font-light">Phone Numbers</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {worker.twilio_phone_numbers.map((phone, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="text-xs font-mono font-light border-slate-300"
                            >
                              {phone}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Instructions */}
                    {worker.instructions && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-slate-500">
                          <FileText className="w-4 h-4" />
                          <span className="font-light">Instructions</span>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-3 border-l-2 border-slate-900">
                          <p className="text-sm text-slate-700 leading-relaxed font-light whitespace-pre-wrap">
                            {expandedInstructions.has(worker.id)
                              ? worker.instructions
                              : truncateText(worker.instructions)}
                          </p>
                          {worker.instructions.length > 150 && (
                            <button
                              onClick={() => toggleInstructions(worker.id)}
                              className="mt-2 text-xs text-slate-600 hover:text-slate-900 font-light transition-colors"
                            >
                              {expandedInstructions.has(worker.id) ? "Show less" : "Read more"}
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add Worker Dialog */}
        <Dialog open={addWorkerDialogOpen} onOpenChange={setAddWorkerDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle className="text-2xl font-light text-slate-900">
                Add Worker Agent
              </DialogTitle>
              <DialogDescription className="text-slate-500 font-light">
                Select an agent to add as a worker to {agentData.name}
              </DialogDescription>
            </DialogHeader>

            {/* Search */}
            <div className="py-4">
              <Input
                placeholder="Search agents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border-slate-200 focus:border-slate-400"
              />
            </div>

            {/* Available Agents List */}
            <div className="flex-1 overflow-y-auto space-y-2">
              {loadingAvailable ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
                </div>
              ) : filteredAvailableAgents.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-slate-500 font-light">
                    {searchQuery ? "No agents found" : "No available agents to add"}
                  </p>
                </div>
              ) : (
                filteredAvailableAgents.map((agent) => (
                  <Card
                    key={agent.id}
                    className="group bg-white border-slate-200 hover:border-slate-300 transition-all duration-200 cursor-pointer"
                    onClick={() => handleAddWorker(agent.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <Avatar className="w-10 h-10 bg-slate-900">
                            <AvatarFallback className="bg-slate-900 text-white font-light text-sm">
                              {agent.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-light text-slate-900 truncate">
                              {agent.name}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className={`w-2 h-2 rounded-full ${
                                agent.status === "active" || agent.status === "Active"
                                  ? "bg-emerald-500"
                                  : "bg-slate-400"
                              }`} />
                              <span className="text-xs text-slate-500">{agent.status}</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={updatingWorkers}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setAddWorkerDialogOpen(false)}
                disabled={updatingWorkers}
              >
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Footer */}
        <div className="mt-20 pt-8 border-t border-slate-200">
          <div className="text-center">
            <p className="text-sm text-slate-400 font-light">© 2025 All rights reserved</p>
          </div>
        </div>
      </div>
    </div>
  )
}