// "use client"

// import { useParams } from "next/navigation"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Settings, MessageSquare, BarChart3 } from "lucide-react"

// export default function ViewCompanyAgents() {
//   const params = useParams()
//   const companyId = params.id

//   const agents = [
//     {
//       id: 1,
//       name: "Customer Support Agent",
//       type: "Support",
//       status: "Active",
//       description: "Handles customer inquiries and support tickets",
//       language: "English",
//       voiceEnabled: true,
//       lastUpdated: "2024-07-10",
//       totalConversations: 1250,
//       avgRating: 4.5,
//       responseTime: "2.3s",
//     },
//     {
//       id: 2,
//       name: "Sales Assistant",
//       type: "Sales",
//       status: "Active",
//       description: "Assists with product inquiries and sales processes",
//       language: "English",
//       voiceEnabled: false,
//       lastUpdated: "2024-07-08",
//       totalConversations: 890,
//       avgRating: 4.2,
//       responseTime: "1.8s",
//     },
//     {
//       id: 3,
//       name: "Technical Support",
//       type: "Technical",
//       status: "Inactive",
//       description: "Provides technical assistance and troubleshooting",
//       language: "English",
//       voiceEnabled: true,
//       lastUpdated: "2024-07-05",
//       totalConversations: 456,
//       avgRating: 4.7,
//       responseTime: "3.1s",
//     },
//   ]

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-2xl font-bold text-slate-800">Agent Information</h2>
//           <p className="text-slate-600 mt-1">View AI agents for this company</p>
//         </div>
//         <div className="text-sm text-slate-600">
//           Total Agents: <span className="font-medium">{agents.length}</span>
//         </div>
//       </div>

//       {/* Agent Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <Card>
//           <CardContent className="p-4 text-center">
//             <div className="text-2xl font-bold text-green-600">
//               {agents.filter((a) => a.status === "Active").length}
//             </div>
//             <div className="text-sm text-slate-600">Active Agents</div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-4 text-center">
//             <div className="text-2xl font-bold text-indigo-600">
//               {agents.reduce((sum, agent) => sum + agent.totalConversations, 0).toLocaleString()}
//             </div>
//             <div className="text-sm text-slate-600">Total Conversations</div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-4 text-center">
//             <div className="text-2xl font-bold text-yellow-600">
//               {(agents.reduce((sum, agent) => sum + agent.avgRating, 0) / agents.length).toFixed(1)}
//             </div>
//             <div className="text-sm text-slate-600">Average Rating</div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-4 text-center">
//             <div className="text-2xl font-bold text-purple-600">
//               {(agents.reduce((sum, agent) => sum + Number.parseFloat(agent.responseTime), 0) / agents.length).toFixed(
//                 1,
//               )}
//               s
//             </div>
//             <div className="text-sm text-slate-600">Avg Response Time</div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Agents List */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {agents.map((agent) => (
//           <Card key={agent.id}>
//             <CardHeader>
//               <div className="flex items-center justify-between">
//                 <div>
//                   <CardTitle className="text-lg">{agent.name}</CardTitle>
//                   <CardDescription>{agent.type} Agent</CardDescription>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <Badge variant={agent.status === "Active" ? "default" : "secondary"}>{agent.status}</Badge>
//                   <Button variant="ghost" size="sm">
//                     <Settings className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <p className="text-sm text-slate-600">{agent.description}</p>

//               <div className="grid grid-cols-2 gap-4 text-sm">
//                 <div>
//                   <span className="font-medium text-slate-700">Language:</span>
//                   <p className="text-slate-600">{agent.language}</p>
//                 </div>
//                 <div>
//                   <span className="font-medium text-slate-700">Voice:</span>
//                   <p className="text-slate-600">{agent.voiceEnabled ? "Enabled" : "Disabled"}</p>
//                 </div>
//                 <div>
//                   <span className="font-medium text-slate-700">Last Updated:</span>
//                   <p className="text-slate-600">{new Date(agent.lastUpdated).toLocaleDateString()}</p>
//                 </div>
//                 <div>
//                   <span className="font-medium text-slate-700">Response Time:</span>
//                   <p className="text-slate-600">{agent.responseTime}</p>
//                 </div>
//               </div>

//               <div className="grid grid-cols-3 gap-4 pt-4 border-t">
//                 <div className="text-center">
//                   <div className="flex items-center justify-center mb-1">
//                     <MessageSquare className="h-4 w-4 text-indigo-600" />
//                   </div>
//                   <div className="text-lg font-semibold">{agent.totalConversations.toLocaleString()}</div>
//                   <div className="text-xs text-slate-600">Conversations</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="flex items-center justify-center mb-1">
//                     <span className="text-yellow-500">★</span>
//                   </div>
//                   <div className="text-lg font-semibold">{agent.avgRating}</div>
//                   <div className="text-xs text-slate-600">Rating</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="flex items-center justify-center mb-1">
//                     <BarChart3 className="h-4 w-4 text-green-600" />
//                   </div>
//                   <div className="text-lg font-semibold">{agent.responseTime}</div>
//                   <div className="text-xs text-slate-600">Response</div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {agents.length === 0 && (
//         <Card>
//           <CardContent className="text-center py-12">
//             <p className="text-slate-500">No agents found for this company.</p>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   )
// }




"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Cookies from "js-cookie"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

export default function ViewCompanyAgents() {
  const { toast } = useToast()
  const params = useParams()
  const router = useRouter()
  const companyId = params.id

  const [agents, setAgents] = useState<any[]>([])
  const [loadingAgents, setLoadingAgents] = useState(true)

  // NEW: view either "tools" or "numbers"
  const [selectedAgent, setSelectedAgent] = useState<any | null>(null)

  useEffect(() => {
    const fetchAgents = async () => {
      setLoadingAgents(true)
      try {
        const token = Cookies.get("adminToken")
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/agents/agents/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token || ""}`,
          },
        })

        const data = await res.json()
        let fetchedAgents: any[] = []
        if (Array.isArray(data)) fetchedAgents = data
        else if (Array.isArray(data.results)) fetchedAgents = data.results

        if (companyId)
          fetchedAgents = fetchedAgents.filter(
            (a) => String(a.company) === String(companyId)
          )

        setAgents(fetchedAgents)
      } catch (err) {
        console.error("Failed to fetch agents", err)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load agents. Please try again.",
        })
      } finally {
        setLoadingAgents(false)
      }
    }

    if (companyId) fetchAgents()
  }, [companyId, toast])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-light text-slate-800 tracking-tight">
            Agents for Company #{companyId}
          </h2>
          <p className="text-sm text-slate-500 font-light mt-1">
            View all AI agents assigned to this company.
          </p>
        </div>
      </div>

      {/* Agents Loader */}
      {loadingAgents ? (
        <div className="flex flex-col items-center justify-center h-48">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin mb-3" />
          <p className="text-sm text-slate-500">Loading agents...</p>
        </div>
      ) : agents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="group bg-white rounded-2xl border border-slate-200/60 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col"
            >
              <div className="p-5 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-slate-800">
                      {agent.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Created:{" "}
                      {new Date(agent.created_at).toLocaleDateString() || "N/A"}
                    </p>
                  </div>
                  <Badge
                    className={`text-xs font-medium border-0 rounded-full ${
                      agent.primary ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {agent.primary ? "Primary" : "Secondary"}
                  </Badge>
                </div>
              </div>

              <div className="p-5 flex flex-col flex-grow">
                <p className="text-sm text-slate-600 line-clamp-2 mb-4">
                  {agent.instructions || "No instructions provided."}
                </p>

                <div className="flex flex-col sm:flex-row gap-2 mt-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 rounded-xl border-slate-200 hover:bg-indigo-50 hover:border-indigo-300 text-indigo-700 font-medium transition-all min-w-0"
                    onClick={() => setSelectedAgent({ ...agent, view: "tools" })}
                  >
                    <Eye className="h-4 w-4 mr-2 flex-shrink-0" /> 
                    <span className="truncate">View Tools</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 rounded-xl border-slate-200 hover:bg-violet-50 hover:border-violet-300 text-violet-700 font-medium transition-all min-w-0"
                    onClick={() => setSelectedAgent({ ...agent, view: "numbers" })}
                  >
                    <Eye className="h-4 w-4 mr-2 flex-shrink-0" /> 
                    <span className="truncate">View Numbers</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <Eye className="w-7 h-7 text-slate-400" />
          </div>
          <p className="text-slate-500 font-medium">No agents found for this company.</p>
        </div>
      )}}

      {/* Dialog: Tools + Numbers - Cinematic Modal */}
      <Dialog open={!!selectedAgent} onOpenChange={() => setSelectedAgent(null)}>
        <DialogContent className="max-w-5xl rounded-3xl bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border border-slate-200/50 dark:border-slate-800/50 shadow-[0_20px_80px_-15px_rgba(0,0,0,0.3)] max-h-[85vh] overflow-hidden p-0">
          
          {/* TOOLS VIEW */}
          {selectedAgent?.view === "tools" && (
            <div className="flex flex-col h-full">
              {/* Header with dramatic gradient overlay */}
              <div className="relative px-8 pt-8 pb-6 bg-gradient-to-b from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
                <div className="relative">
                  <DialogTitle className="text-3xl font-light tracking-tight text-white mb-2">
                    {selectedAgent?.name}
                  </DialogTitle>
                  <DialogDescription className="text-slate-400 text-sm font-light tracking-wide uppercase">
                    Assigned Tools & Capabilities
                  </DialogDescription>
                </div>
              </div>

              {/* Scrollable content area */}
              <div className="flex-1 overflow-y-auto px-8 py-6">
                {!selectedAgent?.custom_features?.length ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                      <Eye className="h-8 w-8 text-slate-400" />
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 font-light">No tools assigned to this agent</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedAgent.custom_features.map((tool: any, index: number) => (
                      <div
                        key={tool.id}
                        className="group relative"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-200/50 to-slate-300/50 dark:from-slate-800/50 dark:to-slate-900/50 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <Card className="relative rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-800/60 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 flex flex-col h-full">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-2">
                              <CardTitle className="text-base font-medium text-slate-900 dark:text-slate-100 line-clamp-2 flex-1">
                                {tool.name || "Unnamed Tool"}
                              </CardTitle>
                              <span className="px-2 py-0.5 text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full whitespace-nowrap">
                                ACTIVE
                              </span>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0 flex-1">
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                              {tool.description || "No description available."}
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-8 py-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <Button 
                  variant="ghost" 
                  onClick={() => setSelectedAgent(null)}
                  className="w-full sm:w-auto hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                >
                  Close
                </Button>
              </div>
            </div>
          )}

          {/* NUMBERS VIEW */}
          {selectedAgent?.view === "numbers" && (
            <div className="flex flex-col h-full">
              {/* Header with dramatic gradient overlay */}
              <div className="relative px-8 pt-8 pb-6 bg-gradient-to-b from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
                <div className="relative">
                  <DialogTitle className="text-3xl font-light tracking-tight text-white mb-2">
                    {selectedAgent?.name}
                  </DialogTitle>
                  <DialogDescription className="text-slate-400 text-sm font-light tracking-wide uppercase">
                    Connected Phone Numbers
                  </DialogDescription>
                </div>
              </div>

              {/* Scrollable content area */}
              <div className="flex-1 overflow-y-auto px-8 py-6">
                {!selectedAgent?.twilio_phone_numbers?.length ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                      <Eye className="h-8 w-8 text-slate-400" />
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 font-light">No numbers assigned</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedAgent.twilio_phone_numbers.map((num: string, index: number) => (
                      <div
                        key={num}
                        className="group relative"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-200/50 to-slate-300/50 dark:from-slate-800/50 dark:to-slate-900/50 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <Card className="relative rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-800/60 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 p-5">
                          <p className="text-lg font-mono font-medium text-slate-900 dark:text-slate-100 tracking-wide">
                            {num}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
                            Twilio Number
                          </p>
                        </Card>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-8 py-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <Button 
                  variant="ghost" 
                  onClick={() => setSelectedAgent(null)}
                  className="w-full sm:w-auto hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                >
                  Close
                </Button>
              </div>
            </div>
          )}

        </DialogContent>
      </Dialog>
    </div>
  )
}