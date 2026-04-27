"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Users, ChevronRight, Search, ChevronLeft, AlertCircle, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import Cookies from "js-cookie"

interface Agent {
  id: number
  name: string
  status: string
  primary: boolean
  worker_agents: any[]
  parent?: number | null
}

const ITEMS_PER_PAGE = 8

export default function WorkerAgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    fetchAgents()
  }, [])

  const fetchAgents = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/agents/agents/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${Cookies.get("Token") || ""}`,
        },
      })
      const data = await res.json()
      console.log(data)
      const enriched = Array.isArray(data)
        ? data.map((agent) => ({
            id: agent.id,
            name: agent.name,
            status: agent.status,
            primary: agent.primary || false,
            worker_agents: agent.worker_agents || [],
            parent: agent.parent || null,
          }))
        : []
      setAgents(enriched)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch agents",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getParentAgentName = (parentId: number) => {
    const parentAgent = agents.find(agent => agent.id === parentId)
    return parentAgent ? parentAgent.name : "Unknown Agent"
  }

  const handleAgentClick = (agent: Agent) => {
    if (agent.parent !== null && agent.parent !== undefined) {
      setSelectedAgent(agent)
      setDialogOpen(true)
    } else {
      router.push(`/dashboard/agents/workers/${agent.id}`)
    }
  }

  const filteredAgents = agents.filter((agent) =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Pagination calculations
  const totalPages = Math.ceil(filteredAgents.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedAgents = filteredAgents.slice(startIndex, endIndex)

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  const totalWorkers = agents.reduce((sum, agent) => sum + agent.worker_agents.length, 0)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        {/* Header */}
        <div className="mb-12 space-y-6">
          <div className="space-y-3">
            <h1 className="text-5xl font-light tracking-tight text-slate-900">
              Worker Agents
            </h1>
            <p className="text-lg text-slate-500 font-light max-w-2xl">
              Manage and organize worker agents across your primary agents
            </p>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center gap-8 pt-4">
            <div className="flex items-center gap-3">
              <div className="w-1 h-12 bg-slate-900 rounded-full" />
              <div>
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
                    <p className="text-sm text-slate-500">Loading...</p>
                  </div>
                ) : (
                  <>
                    <p className="text-3xl font-light text-slate-900">{agents.length}</p>
                    <p className="text-sm text-slate-500">Primary Agents</p>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-1 h-12 bg-slate-400 rounded-full" />
              <div>
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
                    <p className="text-sm text-slate-500">Loading...</p>
                  </div>
                ) : (
                  <>
                    <p className="text-3xl font-light text-slate-900">{totalWorkers}</p>
                    <p className="text-sm text-slate-500">Total Workers</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search agents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-white border-slate-200 focus:border-slate-400 transition-colors rounded-xl"
            />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
          </div>
        ) : filteredAgents.length === 0 ? (
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-light text-slate-700 mb-2">
                {searchQuery ? "No agents found" : "No agents available"}
              </h3>
              <p className="text-slate-500 font-light">
                {searchQuery
                  ? "Try adjusting your search query"
                  : "Create an agent to get started"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-4">
              {paginatedAgents.map((agent) => (
                <Card
                  key={agent.id}
                  className={`group bg-white border-slate-200 transition-all duration-300 overflow-hidden ${
                    agent.parent !== null && agent.parent !== undefined
                      ? "opacity-60 cursor-not-allowed"
                      : "hover:border-slate-300 hover:shadow-lg cursor-pointer"
                  }`}
                  onClick={() => handleAgentClick(agent)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <Avatar className="w-14 h-14 bg-slate-900 flex-shrink-0">
                          <AvatarFallback className="bg-slate-900 text-white font-light text-lg">
                            {agent.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center gap-3">
                            <h3 className="text-xl font-light text-slate-900 truncate">
                              {agent.name}
                            </h3>
                            {agent.primary && (
                              <Badge variant="outline" className="text-xs font-light border-slate-300">
                                Primary
                              </Badge>
                            )}
                            {agent.parent !== null && agent.parent !== undefined && (
                              <Badge variant="outline" className="text-xs font-light border-amber-300 text-amber-700 bg-amber-50">
                                Worker
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-slate-500">
                            {agent.parent !== null && agent.parent !== undefined ? (
                              <span className="flex items-center gap-2 text-amber-600">
                                Already a worker of {getParentAgentName(agent.parent)}
                              </span>
                            ) : (
                              <>
                                <span className="flex items-center gap-2">
                                  <Users className="w-4 h-4" />
                                  {agent.worker_agents.length} {agent.worker_agents.length === 1 ? "Worker" : "Workers"}
                                </span>
                                <span className="flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full ${
                                    agent.status === "active" || agent.status === "Active" 
                                      ? "bg-emerald-500" 
                                      : "bg-slate-300"
                                  }`} />
                                  {agent.status}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {agent.parent === null || agent.parent === undefined ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="group-hover:bg-slate-100 transition-colors rounded-full"
                        >
                          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                        </Button>
                      ) : (
                        <AlertCircle className="w-5 h-5 text-amber-500" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="border-slate-200 text-slate-600 disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className={
                        currentPage === page
                          ? "bg-slate-900 text-white hover:bg-slate-800"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }
                    >
                      {page}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="border-slate-200 text-slate-600 disabled:opacity-30"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}

            {/* Results info */}
            {totalPages > 1 && (
              <div className="text-center mt-4">
                <p className="text-sm text-slate-500 font-light">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredAgents.length)} of {filteredAgents.length} agents
                </p>
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <div className="mt-20 pt-8 border-t border-slate-200">
          <div className="text-center">
            <p className="text-sm text-slate-400 font-light">
              © 2025 All rights reserved
            </p>
          </div>
        </div>
      </div>

      {/* Dialog */}
      {dialogOpen && selectedAgent && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setDialogOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-amber-600" />
              </div>
              <button
                onClick={() => setDialogOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h2 className="text-2xl font-light text-slate-900 mb-3">
              Already Assigned
            </h2>
            
            <p className="text-slate-600 font-light leading-relaxed mb-2">
              <span className="font-medium text-slate-900">{selectedAgent.name}</span> is already a worker of{" "}
              <span className="font-medium text-slate-900">
                {getParentAgentName(selectedAgent.parent!)}
              </span>.
            </p>
            
            <p className="text-slate-500 text-sm font-light leading-relaxed">
              Worker agents cannot have their own workers. Only primary agents can manage worker agents.
            </p>

            <div className="mt-8 flex justify-end">
              <Button
                onClick={() => setDialogOpen(false)}
                className="bg-slate-900 text-white hover:bg-slate-800 px-6 rounded-xl"
              >
                Got it
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}