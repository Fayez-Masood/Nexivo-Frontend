"use client"

import type React from "react"

import { use, useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Square, ChevronUp, Copy, History, WrapText, Plus, Upload, FileText, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Cookies from "js-cookie"
import { useToast } from "@/hooks/use-toast"
import { UploadCloud, Loader2 } from "lucide-react"
import CustomToolsForm from "@/components/CustomToolsForm"
import { DialogTrigger } from "@/components/ui/dialog"
import { useRouter } from 'next/navigation';
import { Settings, User, MessageSquare, Target } from 'lucide-react'


import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"

type AgentConfigTabProps = { agentId: string }


const tabs = [
  { id: "voiceprint", label: "Voiceprint" },
  { id: "voice-prompts", label: "Voice Prompts" },
  { id: "agent-prompts", label: "Agent Prompts" },
  { id: "voice-settings", label: "Voice Settings" },
  { id: "tools", label: "Tools & Numbers" }, 
  { id: "faq", label: "FAQ" },
  { id: "additional-settings", label: "Additional Settings" },
]

import { Phone, Wrench, Check, X, Minus } from "lucide-react"


function ToolsTab({ agentId }: { agentId: string }) {
  const { toast } = useToast()
  const [companyNumbers, setCompanyNumbers] = useState<string[]>([])
  const [assignedNumbers, setAssignedNumbers] = useState<string[]>([])
  const [originalNumbers, setOriginalNumbers] = useState<string[]>([])
  const [dirty, setDirty] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [assignedTools, setAssignedTools] = useState<any[]>([])
  const [usedNumbers, setUsedNumbers] = useState<string[]>([])
  const [loadingNumbers, setLoadingNumbers] = useState(false)
  const [loadingAssignments, setLoadingAssignments] = useState<{ [key: string]: boolean }>({})

  // ===========================
  // Tools List Component
  // ===========================
  function ToolsList() {
    const [tools, setTools] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
      const fetchTools = async () => {
        try {
          setLoading(true)
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/custom_feature/custom-features/`,
            {
              headers: { Authorization: `Token ${Cookies.get("Token") || ""}` },
            }
          )
          const data = await res.json()
          setTools(Array.isArray(data) ? data : [])
        } catch (err) {
          console.error("Error fetching tools:", err)
        } finally {
          setLoading(false)
        }
      }

      fetchTools()
    }, [])

    const toggleTool = async (tool: any, isAssigned: boolean) => {
      try {
        const updatedObjects = isAssigned
          ? assignedTools.filter((t) => t.id !== tool.id)
          : [...assignedTools, tool]

        const updatedIds = updatedObjects.map((t) => String(t.id))

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/agents/agents/${agentId}/`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${Cookies.get("Token") || ""}`,
            },
            body: JSON.stringify({ custom_features_id: updatedIds }),
          }
        )

        const data = await res.json()
        if (!res.ok) throw new Error("Failed to update tools")

        setAssignedTools(data.custom_features || updatedObjects)

        toast({
          title: "Success",
          description: `Tool ${isAssigned ? "unassigned" : "assigned"} successfully.`,
        })
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to update tools.",
          variant: "destructive",
        })
      }
    }

    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
            <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
          </div>
          <p className="text-slate-500 font-light">Loading tools...</p>
        </div>
      )
    }

    if (tools.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
            <Wrench className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-500 font-light">No tools available</p>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => {
          const isAssigned = assignedTools.some((t) => t.id === tool.id)
          return (
            <Card
              key={tool.id}
              className={`group relative bg-white border transition-all duration-300 hover:shadow-lg rounded-xl overflow-hidden ${
                isAssigned ? "border-slate-900 shadow-md" : "border-slate-200"
              }`}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <span className="text-lg font-light text-slate-900 truncate pr-2">
                    {tool.name}
                  </span>
                  {isAssigned && (
                    <div className="flex-shrink-0 w-6 h-6 bg-slate-900 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-600 text-sm font-light leading-relaxed line-clamp-2">
                  {tool.description || "No description"}
                </p>
                <Button
                  variant={isAssigned ? "outline" : "default"}
                  className={`w-full rounded-xl transition-all duration-200 ${
                    isAssigned
                      ? "border-slate-300 text-slate-700 hover:bg-slate-50"
                      : "bg-slate-900 text-white hover:bg-slate-800"
                  }`}
                  onClick={() => toggleTool(tool, isAssigned)}
                >
                  {isAssigned ? (
                    <span className="flex items-center gap-2">
                      <Minus className="w-4 h-4" />
                      Unassign
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Assign
                    </span>
                  )}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    )
  }

  // ===========================
  // Fetch Agent + Company + All Agents
  // ===========================
  const fetchAgentAndCompany = async () => {
    try {
      setLoadingNumbers(true)

      const agentRes = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/agents/agents/${agentId}/`,
        {
          headers: { Authorization: `Token ${Cookies.get("Token") || ""}` },
        }
      )
      const agentData = await agentRes.json()

      const companyRes = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/public/company/get-twilio-phones`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${Cookies.get("Token") || ""}`,
          },
        }
      )
      const companyData = await companyRes.json()

      const allAgentsRes = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/agents/agents/`,
        {
          headers: { Authorization: `Token ${Cookies.get("Token") || ""}` },
        }
      )
      const allAgents = await allAgentsRes.json()

      let union: string[] = []
      if (Array.isArray(allAgents)) {
        union = allAgents.flatMap((a) => a.twilio_phone_numbers || [])
      }
      setUsedNumbers(union)

      if (Array.isArray(companyData.twilio_phone_numbers)) {
        setCompanyNumbers(companyData.twilio_phone_numbers)
      }

      if (Array.isArray(agentData.twilio_phone_numbers)) {
        setAssignedNumbers(agentData.twilio_phone_numbers || [])
        setOriginalNumbers(agentData.twilio_phone_numbers || [])
      }

      if (Array.isArray(agentData.custom_features)) {
        setAssignedTools(agentData.custom_features)
      }

      setDirty(false)
    } catch {
      toast({
        description: "Error fetching Twilio/Tools data.",
        variant: "destructive",
      })
    } finally {
      setLoadingNumbers(false)
    }
  }

  useEffect(() => {
    fetchAgentAndCompany()
  }, [agentId])

  const toggleNumber = async (num: string, isAssignedToThisAgent: boolean) => {
    setLoadingAssignments((prev) => ({ ...prev, [num]: true }))

    try {
      const updated = isAssignedToThisAgent
        ? assignedNumbers.filter((n) => n !== num)
        : [...assignedNumbers, num]

      setAssignedNumbers(updated)

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/agents/agents/${agentId}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${Cookies.get("Token") || ""}`,
          },
          body: JSON.stringify({ twilio_phone_numbers: updated }),
        }
      )

      if (!res.ok) throw new Error("Failed to update numbers")

      toast({
        title: "Success",
        description: `Number ${isAssignedToThisAgent ? "unassigned" : "assigned"} successfully.`,
      })

      await fetchAgentAndCompany()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update numbers.",
        variant: "destructive",
      })
    } finally {
      setLoadingAssignments((prev) => ({ ...prev, [num]: false }))
    }
  }

  const handleSave = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/agents/agents/${agentId}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${Cookies.get("Token") || ""}`,
          },
          body: JSON.stringify({ twilio_phone_numbers: assignedNumbers }),
        }
      )

      if (!res.ok) throw new Error("Failed to save assigned numbers")

      toast({
        title: "Success",
        description: "Twilio numbers updated successfully.",
      })
      await fetchAgentAndCompany()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update numbers.",
        variant: "destructive",
      })
    }
  }

  // ===========================
  // Render
  // ===========================
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-16 space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-1 h-20 bg-gradient-to-b from-slate-900 to-slate-400 rounded-full" />
            <div className="space-y-3">
              <h1 className="text-5xl font-extralight tracking-tight text-slate-900">
                Tools & Numbers
              </h1>
              <p className="text-lg text-slate-500 font-light tracking-wide">
                Manage Twilio numbers and custom tools for your agent
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8 pl-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                <Phone className="w-6 h-6 text-slate-600" />
              </div>
              <div>
                <p className="text-2xl font-light text-slate-900">
                  {loadingNumbers ? (
                    <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
                  ) : (
                    assignedNumbers.length
                  )}
                </p>
                <p className="text-xs text-slate-500 uppercase tracking-wider">
                  Assigned Numbers
                </p>
              </div>
            </div>
            <div className="w-px h-12 bg-slate-200" />
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                <Wrench className="w-6 h-6 text-slate-600" />
              </div>
              <div>
                <p className="text-2xl font-light text-slate-900">
                  {loadingNumbers ? (
                    <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
                  ) : (
                    assignedTools.length
                  )}
                </p>
                <p className="text-xs text-slate-500 uppercase tracking-wider">
                  Active Tools
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {loadingNumbers ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mb-6">
              <Loader2 className="w-10 h-10 text-slate-400 animate-spin" />
            </div>
            <p className="text-slate-500 font-light">Loading resources...</p>
          </div>
        ) : companyNumbers.length > 0 ? (
          <div className="space-y-12">
            {/* Numbers Grid */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Phone className="w-4 h-4 text-slate-600" />
                </div>
                <h2 className="text-2xl font-light text-slate-900">Phone Numbers</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {companyNumbers.map((num) => {
                  const isAssignedToThisAgent = assignedNumbers.includes(num)
                  const isUsedElsewhere = usedNumbers.includes(num) && !isAssignedToThisAgent

                  return (
                    <Card
                      key={num}
                      className={`group relative bg-white border transition-all duration-300 hover:shadow-lg rounded-xl overflow-hidden ${
                        isAssignedToThisAgent
                          ? "border-slate-900 shadow-md"
                          : isUsedElsewhere
                          ? "border-slate-300 opacity-60"
                          : "border-slate-200"
                      }`}
                    >
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center justify-between">
                          <span className="text-lg font-mono font-light text-slate-900">
                            {num}
                          </span>
                          {isAssignedToThisAgent && (
                            <div className="w-6 h-6 bg-slate-900 rounded-full flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          )}
                          {isUsedElsewhere && (
                            <div className="w-6 h-6 bg-slate-300 rounded-full flex items-center justify-center">
                              <X className="w-4 h-4 text-slate-600" />
                            </div>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-slate-600 text-sm font-light">
                          {isAssignedToThisAgent
                            ? "Currently linked to this agent"
                            : isUsedElsewhere
                            ? "Already assigned to another agent"
                            : "Available for assignment"}
                        </p>
                        <Button
                          disabled={isUsedElsewhere || loadingAssignments[num]}
                          variant={isAssignedToThisAgent ? "outline" : "default"}
                          className={`w-full rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${
                            isAssignedToThisAgent
                              ? "border-slate-300 text-slate-700 hover:bg-slate-50"
                              : isUsedElsewhere
                              ? "bg-slate-300 text-slate-600"
                              : "bg-slate-900 text-white hover:bg-slate-800"
                          }`}
                          onClick={() => toggleNumber(num, isAssignedToThisAgent)}
                        >
                          {loadingAssignments[num] ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : isAssignedToThisAgent ? (
                            <span className="flex items-center gap-2">
                              <Minus className="w-4 h-4" />
                              Unassign
                            </span>
                          ) : isUsedElsewhere ? (
                            "Unavailable"
                          ) : (
                            <span className="flex items-center gap-2">
                              <Plus className="w-4 h-4" />
                              Assign
                            </span>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* Tools Button */}
            <div className="flex justify-center pt-8">
              <Button
                onClick={() => setShowDialog(true)}
                className="group px-8 py-6 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <Wrench className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
                  <span className="font-light tracking-wide">Manage Custom Tools</span>
                </div>
              </Button>
            </div>

            {/* Save Button */}
            {dirty && (
              <div className="flex justify-end pt-8">
                <Button
                  onClick={handleSave}
                  className="px-10 py-6 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <span className="font-light tracking-wide">Save Changes</span>
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mb-6">
              <Phone className="w-10 h-10 text-slate-400" />
            </div>
            <p className="text-slate-500 font-light">No Twilio numbers available for this company</p>
          </div>
        )}

        {/* Bottom Divider */}
        <div className="mt-24 pt-12 border-t border-slate-100">
          <div className="flex items-center justify-center gap-2">
            <div className="w-1 h-1 bg-slate-300 rounded-full" />
            <div className="w-1 h-1 bg-slate-300 rounded-full" />
            <div className="w-1 h-1 bg-slate-300 rounded-full" />
          </div>
        </div>
      </div>

      {/* Tools Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-6xl max-h-[85vh] flex flex-col bg-white rounded-3xl shadow-2xl border-0 p-0">
          <div className="flex-shrink-0 bg-white/95 backdrop-blur-sm border-b border-slate-100">
            <DialogHeader className="px-8 py-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                  <Wrench className="w-6 h-6 text-slate-600" />
                </div>
                <div>
                  <DialogTitle className="text-3xl font-extralight text-slate-900 tracking-tight">
                    Custom Tools
                  </DialogTitle>
                  <p className="text-sm text-slate-500 font-light mt-1">
                    Assign tools to enhance agent capabilities
                  </p>
                </div>
              </div>
            </DialogHeader>
          </div>

          <div className="flex-1 overflow-y-auto px-8 py-6">
            {assignedNumbers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mb-6">
                  <Sparkles className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-light text-slate-700 mb-2">
                  No number assigned
                </h3>
                <p className="text-slate-500 font-light text-center max-w-md">
                  Assign a phone number to this agent before managing tools
                </p>
              </div>
            ) : (
              <ToolsList />
            )}
          </div>

          <div className="flex-shrink-0 bg-gradient-to-t from-white to-white/95 backdrop-blur-sm border-t border-slate-100 px-8 py-4">
            <div className="flex justify-end">
              <Button
                onClick={() => setShowDialog(false)}
                variant="outline"
                className="px-6 py-2 border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// function ToolsTab({ agentId }: { agentId: string }) {
//   const { toast } = useToast()
//   const [companyNumbers, setCompanyNumbers] = useState<string[]>([])
//   const [assignedNumbers, setAssignedNumbers] = useState<string[]>([])
//   const [originalNumbers, setOriginalNumbers] = useState<string[]>([])
//   const [dirty, setDirty] = useState(false)
//   const [showDialog, setShowDialog] = useState(false)
//   const [assignedTools, setAssignedTools] = useState<any[]>([])

//   // ===========================
//   // Tools List Component
//   // ===========================
//   function ToolsList() {
//     const [tools, setTools] = useState<any[]>([])
//     const [loading, setLoading] = useState(false)

//     useEffect(() => {
//       const fetchTools = async () => {
//         try {
//           setLoading(true)
//           const res = await fetch(
//             `${process.env.NEXT_PUBLIC_BASE_URL}/custom_feature/custom-features/`,
//             {
//               headers: {
//                 Authorization: `Token ${Cookies.get("Token") || ""}`,
//               },
//             }
//           )
//           const data = await res.json()
//           setTools(Array.isArray(data) ? data : [])
//         } catch (err) {
//           console.error("Error fetching tools:", err)
//         } finally {
//           setLoading(false)
//         }
//       }

//       fetchTools()
//     }, [])

//     const toggleTool = async (tool: any, isAssigned: boolean) => {
//       try {
//         const updatedObjects = isAssigned
//           ? assignedTools.filter((t) => t.id !== tool.id)
//           : [...assignedTools, tool]

//         const updatedIds = updatedObjects.map((t) => String(t.id))

//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_BASE_URL}/agents/agents/${agentId}/`,
//           {
//             method: "PATCH",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Token ${Cookies.get("Token") || ""}`,
//             },
//             body: JSON.stringify({ custom_features_id: updatedIds }),
//           }
//         )

//         const data = await res.json()
//         if (!res.ok) throw new Error("Failed to update tools")

//         setAssignedTools(data.custom_features || updatedObjects)

//         toast({
//           title: "Success",
//           description: `Tool ${isAssigned ? "unassigned" : "assigned"} successfully.`,
//         })
//       } catch (error: any) {
//         toast({
//           title: "Error",
//           description: error.message || "Failed to update tools.",
//           variant: "destructive",
//         })
//       }
//     }

//     if (loading) {
//       return <div className="text-center text-slate-500 italic animate-pulse">Loading tools...</div>
//     }

//     if (tools.length === 0) {
//       return <div className="text-center text-slate-500 italic">No tools available</div>
//     }

//     return (
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//         {tools.map((tool) => {
//           const isAssigned = assignedTools.some((t) => t.id === tool.id)
//           return (
//             <Card
//               key={tool.id}
//               className={`relative rounded-2xl backdrop-blur-md bg-white/60 dark:bg-slate-900/60 border 
//               transition-all duration-500 shadow-lg hover:shadow-2xl hover:scale-[1.03] ${
//                 isAssigned ? "border-indigo-500 ring-2 ring-indigo-300" : "border-slate-200"
//               }`}
//             >
//               <CardHeader>
//                 <CardTitle className="flex items-center justify-between text-lg font-semibold">
//                   <span className="bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
//                     {tool.name}
//                   </span>
//                   {isAssigned && (
//                     <span className="ml-2 text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
//                       Assigned
//                     </span>
//                   )}
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
//                   {tool.description || "No description"}
//                 </p>
//                 <Button
//                   variant={isAssigned ? "destructive" : "default"}
//                   className="w-full rounded-full py-2 shadow-md hover:shadow-xl transition"
//                   onClick={() => toggleTool(tool, isAssigned)}
//                 >
//                   {isAssigned ? "Unassign" : "Assign"}
//                 </Button>
//               </CardContent>
//             </Card>
//           )
//         })}
//       </div>
//     )
//   }

//   // ===========================
//   // Fetch Agent + Company
//   // ===========================
//   const fetchAgentAndCompany = async () => {
//     try {
//       const agentRes = await fetch(
//         `${process.env.NEXT_PUBLIC_BASE_URL}/agents/agents/${agentId}/`,
//         {
//           headers: { Authorization: `Token ${Cookies.get("Token") || ""}` },
//         }
//       )
//       const agentData = await agentRes.json()

//       const companyRes = await fetch(
//         `${process.env.NEXT_PUBLIC_BASE_URL}/public/company/get-twilio-phones`,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Token ${Cookies.get("Token") || ""}`,
//           },
//         }
//       )
//       const companyData = await companyRes.json()

//       if (Array.isArray(companyData.twilio_phone_numbers)) {
//         setCompanyNumbers(companyData.twilio_phone_numbers)
//       }

//       if (Array.isArray(agentData.twilio_phone_numbers)) {
//         setAssignedNumbers(agentData.twilio_phone_numbers || [])
//         setOriginalNumbers(agentData.twilio_phone_numbers || [])
//       }

//       if (Array.isArray(agentData.custom_features)) {
//         setAssignedTools(agentData.custom_features)
//       }

//       setDirty(false)
//     } catch {
//       toast({
//         description: "Error fetching Twilio/Tools data.",
//         variant: "destructive",
//       })
//     }
//   }

//   useEffect(() => {
//     fetchAgentAndCompany()
//   }, [agentId])

//   const toggleNumber = (num: string) => {
//     setAssignedNumbers((prev) => {
//       const updated = prev.includes(num) ? prev.filter((n) => n !== num) : [...prev, num]
//       setDirty(true)
//       return updated
//     })
//   }

//   const handleSave = async () => {
//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_BASE_URL}/agents/agents/${agentId}/`,
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Token ${Cookies.get("Token") || ""}`,
//           },
//           body: JSON.stringify({ twilio_phone_numbers: assignedNumbers }),
//         }
//       )

//       if (!res.ok) throw new Error("Failed to save assigned numbers")

//       toast({
//         title: "Success",
//         description: "Twilio numbers updated successfully.",
//       })
//       await fetchAgentAndCompany()
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error.message || "Failed to update numbers.",
//         variant: "destructive",
//       })
//     }
//   }

//   // ===========================
//   // Render
//   // ===========================
//   return (
//     <div className="space-y-12">
//       {/* Hero Header */}
//       <div className="text-center space-y-3">
//         <h2 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
//           Agent Tools & Numbers
//         </h2>
//         <p className="text-slate-500 text-lg">
//           Seamlessly manage Twilio numbers & custom tools for your agent
//         </p>
//       </div>

//       {companyNumbers.length > 0 ? (
//         <>
//           {/* Numbers Section */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {companyNumbers.map((num) => {
//               const isAssigned = assignedNumbers.includes(num)
//               return (
//                 <Card
//                   key={num}
//                   className={`rounded-2xl p-2 backdrop-blur-md bg-white/60 dark:bg-slate-900/60 transition-all duration-500 
//                   shadow-md hover:shadow-2xl hover:scale-[1.03] ${
//                     isAssigned ? "border-green-400 ring-2 ring-green-300" : "border border-slate-200"
//                   }`}
//                 >
//                   <CardHeader>
//                     <CardTitle className="flex items-center justify-between text-xl font-semibold">
//                       <span>{num}</span>
//                       {isAssigned && (
//                         <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
//                           Assigned
//                         </span>
//                       )}
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <p className="text-slate-600 dark:text-slate-300 mb-4 text-sm">
//                       {isAssigned
//                         ? "Currently linked to this agent."
//                         : "Assign this number to your agent."}
//                     </p>
//                     <Button
//                       variant={isAssigned ? "destructive" : "default"}
//                       className="w-full rounded-full shadow-md hover:shadow-xl transition"
//                       onClick={() => toggleNumber(num)}
//                     >
//                       {isAssigned ? "Unassign" : "Assign"}
//                     </Button>
//                   </CardContent>
//                 </Card>
//               )
//             })}
//           </div>

//           {/* Tools Modal */}
//           <div className="flex justify-center mt-10">
//             <Button
//               className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-8 py-3 rounded-full shadow-lg hover:scale-105 transition"
//               onClick={() => setShowDialog(true)}
//             >
//               Manage Custom Tools
//             </Button>
//           </div>

//           <Dialog open={showDialog} onOpenChange={setShowDialog}>
//             <DialogContent className="max-w-5xl rounded-3xl backdrop-blur-md bg-white/80 dark:bg-slate-900/80 shadow-2xl">
//               <DialogHeader className="text-center">
//                 <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
//                   Custom Tools
//                 </DialogTitle>
//               </DialogHeader>

//               {assignedNumbers.length === 0 ? (
//                 <div className="text-center text-slate-500 italic">
//                   No number assigned → tools hidden
//                 </div>
//               ) : (
//                 <ToolsList />
//               )}
//             </DialogContent>
//           </Dialog>

//           {/* Save Button */}
//           {dirty && (
//             <div className="flex justify-end pt-10">
//               <Button
//                 className="bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-700 text-white px-10 py-3 rounded-full shadow-lg transition-transform transform hover:scale-105"
//                 onClick={handleSave}
//               >
//                 Save Changes
//               </Button>
//             </div>
//           )}
//         </>
//       ) : (
//         <div className="text-center text-slate-500 italic">
//           No Twilio numbers available for this company.
//         </div>
//       )}
//     </div>
//   )
// }



function FAQTab({ agentId }: { agentId: string }) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [faqs, setFaqs] = useState<any[]>([])
  const [docs, setDocs] = useState<any[]>([])
  const [newQuestion, setNewQuestion] = useState("")
  const [newAnswer, setNewAnswer] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const token = Cookies.get("Token") || ""
  const [scrapLoading, setScrapLoading] = useState(false)

  const { toast } = useToast()
  



  const [scrapWebsites, setScrapWebsites] = useState<string[]>([])
  const [showScrapDialog, setShowScrapDialog] = useState(false)
  const [saving, setSaving] = useState(false)

  // 🧠 Fetch scrapping websites from backend
  const fetchScrappingWebsites = async () => {
    try {

      setScrapLoading(true) 

      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/agents/agents/${agentId}/`, {
        headers: {
          Authorization: `Token ${Cookies.get("Token") || ""}`,
        },
      })
      if (!res.ok) throw new Error("Failed to fetch agent details")
      const data = await res.json()
 
      setScrapWebsites(data.scraping_websites || [])
    } catch (error) {
    console.error("Error fetching scraping websites:", error)
    toast({
      title: "Error",
      description: "Failed to load scraping URLs.",
      variant: "destructive",
    })
  } finally {
    setScrapLoading(false)
  }
}

  // 💾 Save updated scrapping websites
  const handleSaveScrapping = async () => {
  try {
    setSaving(true)

    // ✅ Basic URL validation
    const invalidUrls = scrapWebsites.filter(
      (url) => url.trim() && !/^https?:\/\/[^\s/$.?#].[^\s]*$/.test(url)
    )

    if (invalidUrls.length > 0) {
      toast({
        title: "Invalid URLs",
        description: "Please enter valid URLs starting with http:// or https://",
        variant: "destructive",
      })
      setSaving(false)
      return
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/agents/agents/${agentId}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${Cookies.get("Token") || ""}`,
      },
      body: JSON.stringify({
        scraping_websites: scrapWebsites,
      }),
    })

    if (!res.ok) throw new Error("Failed to save scraping websites")

    toast({
      title: "Success",
      description: "Scraping URLs saved successfully.",
    })

    setShowScrapDialog(false)
  } catch (error) {
    console.error("Save failed:", error)
    toast({
      title: "Save failed",
      description: "Failed to save URLs. Please ensure they are valid URLs.",
      variant: "destructive",
    })
  } finally {
    setSaving(false)
  }
}



  // ➕ Add new URL field
  const handleAddUrl = () => setScrapWebsites((prev) => [...prev, ""])

  // ❌ Remove URL
  const handleRemoveUrl = (index: number) =>
    setScrapWebsites((prev) => prev.filter((_, i) => i !== index))

  // ✏️ Edit URL
  const handleEditUrl = (index: number, value: string) =>
    setScrapWebsites((prev) => prev.map((url, i) => (i === index ? value : url)))


  useEffect(() => {
    fetchFAQs()
    fetchDocuments()
  }, [agentId])

  const fetchFAQs = async () => {
    // FAQs are stored as uploaded documents associated with this agent.
    // The fetchDocuments() call already loads those — no separate FAQ endpoint needed.
    setFaqs([])
  }

  const fetchDocuments = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/documents/documents/?agent_id=${agentId}`, {
        headers: { Authorization: `Token ${token}` }
      })
      const data = await res.json()
      setDocs(data)
    } catch (error) {
      console.error("Failed to fetch documents:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0]
    if (!file) {
      setErrorMessage("Please select a file.")
      setTimeout(() => setErrorMessage(""), 4000)
      return
    }

    // Derive content-type from extension if browser leaves it blank (common on Windows for .txt)
    const extMimeMap: Record<string, string> = {
      ".pdf":  "application/pdf",
      ".txt":  "text/plain",
      ".md":   "text/markdown",
      ".csv":  "text/csv",
    }
    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase()
    const contentType = file.type || extMimeMap[ext] || ""

    if (!contentType) {
      setErrorMessage("Unsupported file type. Please upload a PDF, TXT, MD, or CSV file.")
      setTimeout(() => setErrorMessage(""), 5000)
      return
    }

    setUploading(true)
    try {
      // Step 1 — get a presigned S3 PUT URL from the backend
      const presignedRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/documents/s3/presigned-url/`, {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          file_name: file.name,
          content_type: contentType
        })
      })

      const presignedData = await presignedRes.json()

      // Surface the backend's own error message (e.g. "Unsupported file type")
      if (!presignedRes.ok) {
        const backendError = presignedData?.error || `Server error (${presignedRes.status})`
        throw new Error(backendError)
      }

      const uploadUrl = presignedData.url
      const s3Key = presignedData.file_key ?? presignedData.s3_key

      // Step 2 — PUT the file directly to S3 via the presigned URL
      const s3Res = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": contentType },
        body: file
      })

      if (!s3Res.ok) throw new Error(`S3 upload failed (HTTP ${s3Res.status})`)

      // Step 3 — register the document in the backend (triggers RAG ingestion)
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/documents/documents/`, {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: file.name,
          description: "FAQ Document",
          s3_url: uploadUrl.split("?")[0],
          file_key: s3Key,
          agent_id: agentId,
        })
      })

      if (response.ok) {
        setSuccessMessage("File uploaded successfully! It will be processed in a few seconds.")
        setTimeout(() => setSuccessMessage(""), 5000)
        fetchDocuments()
      } else {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData?.detail || errData?.error || `Metadata save failed (${response.status})`)
      }
    } catch (err: any) {
      console.error("Upload failed:", err)
      setErrorMessage(err?.message || "Upload failed. Please try again.")
      setTimeout(() => setErrorMessage(""), 6000)
    } finally {
      setUploading(false)
    }
  }

  const handleAddFAQ = async () => {
    if (!newQuestion.trim() || !newAnswer.trim()) return
    try {
      const res = await fetch(`/api/agents/${agentId}/faqs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: newQuestion, answer: newAnswer })
      })
      if (res.ok) {
        setNewQuestion("")
        setNewAnswer("")
        setShowAddForm(false)
        fetchFAQs()
      }
    } catch (err) {
      console.error("Error adding FAQ:", err)
    }
  }

  const handleDeleteFAQ = async (id: string) => {
    try {
      const res = await fetch(`/api/agents/${agentId}/faqs/${id}`, { method: "DELETE" })
      if (res.ok) fetchFAQs()
    } catch (err) {
      console.error("Error deleting FAQ:", err)
    }
  }

  const [deletingDocId, setDeletingDocId] = useState<number | null>(null)
  const [docToDelete, setDocToDelete] = useState<{ id: number; title: string } | null>(null)

  const handleDeleteDocument = async (docId: number) => {
    setDeletingDocId(docId)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/documents/documents/${docId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      if (res.ok || res.status === 204) {
        setDocs((prev) => prev.filter((d) => d.id !== docId))
      } else {
        console.error("Delete failed:", res.status)
      }
    } catch (err) {
      console.error("Error deleting document:", err)
    } finally {
      setDeletingDocId(null)
    }
  }

  if (loading) return <div className="text-center p-10 text-slate-600">Loading FAQ data...</div>

  return (
    <div className="space-y-6">

      {/* Delete confirmation dialog */}
      {docToDelete && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setDocToDelete(null)} />
          <div className="relative z-10 w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 pt-6 pb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Trash2 className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-900">Delete Document</h3>
                  <p className="text-xs text-slate-500 mt-0.5">This action cannot be undone</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 bg-slate-50 rounded-xl px-3 py-2.5 border border-slate-100 truncate">
                {docToDelete.title}
              </p>
            </div>
            <div className="flex items-center gap-2 px-6 pb-5">
              <button
                onClick={() => setDocToDelete(null)}
                className="flex-1 px-4 py-2 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const id = docToDelete.id
                  setDocToDelete(null)
                  await handleDeleteDocument(id)
                }}
                disabled={deletingDocId !== null}
                className="flex-1 px-4 py-2 text-sm text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors disabled:opacity-50"
              >
                {deletingDocId !== null ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={showScrapDialog} onOpenChange={setShowScrapDialog}>
  <DialogTrigger asChild>
    <Button
      className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white"
      onClick={fetchScrappingWebsites}
    >
      🌐 Scrap & Save
    </Button>
  </DialogTrigger>

  <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto rounded-2xl">
    <DialogHeader>
      <DialogTitle className="text-xl font-semibold">Manage Scrapping URLs</DialogTitle>
    </DialogHeader>

    <div className="space-y-4 mt-4">
  {scrapLoading ? (
    <div className="flex items-center justify-center py-8 text-slate-500">
      <Loader2 className="w-5 h-5 animate-spin mr-2" />
      Loading URLs...
    </div>
  ) : scrapWebsites.length === 0 ? (
    <p className="text-sm text-slate-500">No URLs added yet. Start by adding one below.</p>
  ) : (
    scrapWebsites.map((url, index) => (
      <div key={index} className="flex items-center gap-3">
        <Input
          value={url}
          onChange={(e) => handleEditUrl(index, e.target.value)}
          placeholder="Enter website URL"
          className="flex-1"
        />
        <Button
          variant="ghost"
          size="icon"
          className="text-red-500 hover:text-red-600"
          onClick={() => handleRemoveUrl(index)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    ))
  )}

  {!scrapLoading && (
    <Button
      variant="outline"
      onClick={handleAddUrl}
      className="flex items-center gap-2 text-sm text-cyan-700 border-cyan-600 hover:bg-cyan-50"
    >
      <Plus className="w-4 h-4" /> Add URL
    </Button>
  )}
</div>


    <div className="flex justify-end gap-3 mt-6">
      <Button variant="ghost" onClick={() => setShowScrapDialog(false)}>Cancel</Button>
      <Button
        onClick={handleSaveScrapping}
        disabled={saving}
        className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white"
      >
        {saving ? "Saving..." : "Done"}
      </Button>
    </div>
  </DialogContent>
</Dialog>



      {successMessage && <div className="p-4 bg-green-50 border border-green-200 text-green-700">{successMessage}</div>}
      {errorMessage && <div className="p-4 bg-red-50 border border-red-200 text-red-700">{errorMessage}</div>}

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">📁 Upload FAQ Documents</h2>
        <input type="file" ref={fileInputRef} className="mb-4" accept=".pdf,.txt,.md,.csv,application/pdf,text/plain,text/markdown,text/csv" />
        <Button onClick={handleUpload} disabled={uploading} className="mb-2">
          {uploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <UploadCloud className="w-4 h-4 mr-2" />} Upload
        </Button>

        <div className="mt-6">
          <h3 className="text-lg font-medium text-slate-800 mb-2">Uploaded Files</h3>
          {docs.length === 0 ? <p className="text-slate-500">No documents uploaded yet.</p> : (
            <ul className="space-y-2">
              {docs.map((doc) => (
                <li key={doc.id} className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <button
                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline truncate text-left"
                      onClick={async () => {
                        try {
                          const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/documents/presigned-view-url/?file_key=${encodeURIComponent(doc.title)}`, {
                            headers: { Authorization: `Token ${token}` }
                          })
                          const data = await res.json()
                          window.open(data.presigned_url, "_blank")
                        } catch {
                          alert("Could not open document.")
                        }
                      }}
                    >
                      {doc.title}
                    </button>
                  </div>
                  <button
                    onClick={() => setDocToDelete({ id: doc.id, title: doc.title })}
                    disabled={deletingDocId === doc.id}
                    className="flex-shrink-0 p-1.5 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                    title="Delete document"
                  >
                    {deletingDocId === doc.id
                      ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      : <Trash2 className="w-3.5 h-3.5" />}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

  
    </div>
  )
}

// // Tools Tab (Cinematic UI)
// function ToolsTab({ agentId }: { agentId: string }) {
//   const { toast } = useToast()
//   const [companyNumbers, setCompanyNumbers] = useState<string[]>([])
//   const [assignedNumbers, setAssignedNumbers] = useState<string[]>([])
//   const [originalNumbers, setOriginalNumbers] = useState<string[]>([]) // keep track of original for dirty check
//   const [showForm, setShowForm] = useState(false)
//   const [dirty, setDirty] = useState(false)

//   // Fetch agent + company data
//   const fetchAgentAndCompany = async () => {
//     try {
//       // 1) Fetch agent data first
//       const agentRes = await fetch(
//         `${process.env.NEXT_PUBLIC_BASE_URL}/agents/agents/${agentId}/`,
//         {
//           headers: {
//             Authorization: `Token ${Cookies.get("Token") || ""}`,
//           },
//         }
//       )
//       const agentData = await agentRes.json()

//       // 2) Fetch company numbers
//       const companyRes = await fetch(
//         `${process.env.NEXT_PUBLIC_BASE_URL}/public/company/get-twilio-phones`,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Token ${Cookies.get("Token") || ""}`,
//           },
//         }
//       )
//       const companyData = await companyRes.json()

//       console.log("Company Numbers API Response:", companyData)
//       console.log("Agent API Response:", agentData)

//       if (Array.isArray(companyData.twilio_phone_numbers)) {
//         setCompanyNumbers(companyData.twilio_phone_numbers)
//       }

//       if (
//         Array.isArray(agentData.twilio_phone_numbers) &&
//         agentData.twilio_phone_numbers.length > 0
//       ) {
//         setAssignedNumbers(agentData.twilio_phone_numbers)
//         setOriginalNumbers(agentData.twilio_phone_numbers)
//         setShowForm(true)
//       } else {
//         setAssignedNumbers([])
//         setOriginalNumbers([])
//         setShowForm(false)
//       }

//       setDirty(false) // reset dirty after fetching fresh data
//     } catch (error) {
//       console.error("Error fetching data:", error)
//       toast({
//         description: "Error fetching Twilio data.",
//         variant: "destructive",
//       })
//     }
//   }

//   useEffect(() => {
//     fetchAgentAndCompany()
//   }, [agentId])

//   // Toggle assignment (marks dirty)
//   const toggleNumber = (num: string) => {
//     setAssignedNumbers((prev) => {
//       const updated = prev.includes(num)
//         ? prev.filter((n) => n !== num) // remove on Unassign
//         : [...prev, num] // add on Assign

//       // mark dirty if different from original
//       setDirty(true)
//       return updated
//     })
//   }

//   // Save changes (PATCH request + re-fetch agent data)
//   const handleSave = async () => {
//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_BASE_URL}/agents/agents/${agentId}/`,
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Token ${Cookies.get("Token") || ""}`,
//           },
//           body: JSON.stringify({
//             twilio_phone_numbers: assignedNumbers,
//           }),
//         }
//       )

//       if (!res.ok) throw new Error("Failed to save assigned numbers")

//       toast({
//         title: "Success",
//         description: "Twilio numbers updated successfully.",
//       })

//       // Re-fetch to sync latest state & decide form visibility
//       await fetchAgentAndCompany()
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error.message || "Failed to update numbers.",
//         variant: "destructive",
//       })
//     }
//   }

//   return (
//     <div className="space-y-10">
//       <div className="text-center space-y-2">
//         <h2 className="text-3xl font-bold text-slate-900">Tools</h2>
//         <p className="text-slate-500">
//           Manage Twilio numbers and link them to your agent
//         </p>
//       </div>

//       {companyNumbers.length === 0 && (
//         <div className="text-center text-slate-600 italic">
//           No Twilio numbers available for this company.
//         </div>
//       )}

//       {companyNumbers.length > 0 && (
//         <>
//           {/* Numbers grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {companyNumbers.map((num) => {
//               const isAssigned = assignedNumbers.includes(num)
//               return (
//                 <Card
//                   key={num}
//                   className={`transition-all duration-300 shadow-md hover:shadow-xl rounded-2xl ${
//                     isAssigned ? "border-green-500" : "border-slate-200"
//                   }`}
//                 >
//                   <CardHeader>
//                     <CardTitle className="text-lg font-semibold flex items-center justify-between">
//                       {num}
//                       {isAssigned && (
//                         <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
//                           Assigned
//                         </span>
//                       )}
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <p className="text-slate-600 mb-4">
//                       {isAssigned
//                         ? "This number is currently linked to the agent."
//                         : "Click below to assign this number to the agent."}
//                     </p>
//                     <Button
//                       variant={isAssigned ? "destructive" : "default"}
//                       className="w-full"
//                       onClick={() => toggleNumber(num)}
//                     >
//                       {isAssigned ? "Unassign" : "Assign"}
//                     </Button>
//                   </CardContent>
//                 </Card>
//               )
//             })}
//           </div>

//           {/* Show form only if agent has assigned numbers (backend decides) */}
//           {showForm && (
//             <div className="space-y-6 border border-slate-200 p-6 rounded-2xl bg-gradient-to-r from-slate-50 to-slate-100 shadow-inner mt-10">
//               <h3 className="text-2xl font-semibold text-slate-800 text-center">
//                 Agent Configuration Form
//               </h3>
//               <p className="text-center text-slate-500">
//                 Fill out the details below for the assigned numbers
//               </p>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {Array.from({ length: 10 }).map((_, i) => (
//                   <div key={i} className="space-y-1">
//                     <label className="block text-sm text-slate-700 font-medium">
//                       Field {i + 1}
//                     </label>
//                     <Input
//                       placeholder={`Enter value for Field ${i + 1}`}
//                       className="rounded-xl border-slate-300"
//                     />
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Save button (always show if user made changes) */}
//           {dirty && (
//             <div className="flex justify-end pt-6">
//               <Button
//                 className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-2 rounded-xl shadow-lg transition-transform transform hover:scale-105"
//                 onClick={handleSave}
//               >
//                 Save Changes
//               </Button>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   )
// }








import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AudioPlayer } from "@/components/ui/audio-player"
import {Mic} from "lucide-react"
import { cn } from "@/lib/utils"

const predefinedVoices = [
  {
    id: "marissa",
    name: "Marissa",
    description: "Friendly and Sociable",
    tags: "american/casual/young/female/conversational",
    avatar: "/marissa.png",
    audioSrc: "/voices/marissa.mp3",
  },
  {
    id: "scott",
    name: "Scott",
    description: "Professional and Clear",
    tags: "american/formal/male/business",
    avatar: "/scott.png",
    audioSrc: "/voices/scott.mp3",
  },
  {
    id: "luna",
    name: "Luna",
    description: "Warm and Engaging",
    tags: "british/casual/male/conversational",
    avatar: "/luna.png",
    audioSrc: "/voices/luna.mp3",
  },
]

function VoiceprintTab({ agentId }: { agentId: string }) {
  const { toast } = useToast()
  const [selectedVoice, setSelectedVoice] = useState<string>(predefinedVoices[0].id)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [voiceType, setVoiceType] = useState<"predefined" | "upload">("predefined")
  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingAgent, setIsFetchingAgent] = useState(true)
  const [currentAgentVoice, setCurrentAgentVoice] = useState<{
    type: "predefined" | "upload"
    voiceId?: string
    customVoiceUrl?: string
  } | null>(null)
  const [previewText, setPreviewText] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  // Fetch current agent voice on mount
  useEffect(() => {
    const fetchAgentData = async () => {
      try {
        setIsFetchingAgent(true)
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/agents/agents/${agentId}/`, {
          method: "GET",
          headers: {
            Authorization: `Token ${Cookies.get("Token") || ""}`,
          },
        })

        if (res.ok) {
          const agentData = await res.json()
          if (agentData.selected_voice) {
            setCurrentAgentVoice({
              type: "predefined",
              voiceId: agentData.selected_voice,
            })
            setSelectedVoice(agentData.selected_voice)
            setVoiceType("predefined")
          } else if (agentData.voice_clip) {
            setCurrentAgentVoice({
              type: "upload",
              customVoiceUrl: agentData.voice_clip,
            })
            setVoiceType("upload")
          }
        }
      } catch (error) {
        console.error("Error fetching agent data:", error)
      } finally {
        setIsFetchingAgent(false)
      }
    }

    fetchAgentData()
  }, [agentId])

  const currentPredefinedVoice = predefinedVoices.find((v) => v.id === selectedVoice)

  const displayAudioSrc =
    voiceType === "upload" && uploadedFile
      ? URL.createObjectURL(uploadedFile)
      : voiceType === "upload" && currentAgentVoice?.customVoiceUrl
      ? currentAgentVoice.customVoiceUrl
      : currentPredefinedVoice?.audioSrc

  const handleVoiceSelection = (voiceId: string) => {
    setSelectedVoice(voiceId)
    setVoiceType("predefined")
    setUploadedFile(null)
  }

  const handleVoiceFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("audio/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload an audio file (MP3, WAV, OGG).",
          variant: "destructive",
        })
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Maximum file size is 5MB.",
          variant: "destructive",
        })
        return
      }

      setUploadedFile(file)
      setVoiceType("upload")
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer.files?.[0]
    if (file) {
      if (!file.type.startsWith("audio/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload an audio file (MP3, WAV, OGG).",
          variant: "destructive",
        })
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Maximum file size is 5MB.",
          variant: "destructive",
        })
        return
      }

      setUploadedFile(file)
      setVoiceType("upload")
    }
  }

  const handleUpdateVoice = async () => {
    try {
      setIsLoading(true)

      const formPayload = new FormData()

      if (voiceType === "upload" && uploadedFile) {
        formPayload.append("voice_clip", uploadedFile)
      } else if (voiceType === "predefined" && selectedVoice) {
        formPayload.append("selected_voice", selectedVoice)
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/agents/agents/${agentId}/`, {
        method: "PATCH",
        headers: {
          Authorization: `Token ${Cookies.get("Token") || ""}`,
        },
        body: formPayload,
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => null)
        throw new Error(errorData?.error || "Failed to update voice")
      }

      const updatedAgent = await res.json()

      // Update current agent voice state
      if (updatedAgent.selected_voice) {
        setCurrentAgentVoice({
          type: "predefined",
          voiceId: updatedAgent.selected_voice,
        })
      } else if (updatedAgent.voice_clip) {
        setCurrentAgentVoice({
          type: "upload",
          customVoiceUrl: updatedAgent.voice_clip,
        })
      }

      toast({
        title: "Voice Updated",
        description: "Your agent's voice has been successfully updated.",
      })

      // Clear uploaded file after successful update
      setUploadedFile(null)
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Unable to update voice.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGeneratePreview = async () => {
    if (!previewText.trim()) {
      toast({
        title: "Text Required",
        description: "Please enter some text to generate a preview.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    // Simulate generation - replace with actual API call
    setTimeout(() => {
      setIsGenerating(false)
      toast({
        title: "Preview Generated",
        description: "Your voice snippet has been created.",
      })
    }, 2000)
  }

  if (isFetchingAgent) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center py-32">
        <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mb-6">
          <Loader2 className="w-10 h-10 text-slate-400 animate-spin" />
        </div>
        <p className="text-slate-500 font-light">Loading voice configuration...</p>
      </div>
    )
  }

  const activeVoiceName =
    currentAgentVoice?.type === "upload"
      ? "Custom Voice"
      : currentAgentVoice?.voiceId
      ? predefinedVoices.find((v) => v.id === currentAgentVoice.voiceId)?.name
      : "No Voice Selected"

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-16 space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-1 h-20 bg-gradient-to-b from-slate-900 to-slate-400 rounded-full" />
            <div className="space-y-3">
              <h1 className="text-5xl font-extralight tracking-tight text-slate-900">Voice Configuration</h1>
              <p className="text-lg text-slate-500 font-light tracking-wide">
                Customize the voice personality of your agent
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8 pl-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                <Volume2 className="w-6 h-6 text-slate-600" />
              </div>
              <div>
                <p className="text-2xl font-light text-slate-900">{activeVoiceName}</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Active Voice</p>
              </div>
            </div>
            <div className="w-px h-12 bg-slate-200" />
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                <Mic className="w-6 h-6 text-slate-600" />
              </div>
              <div>
                <p className="text-2xl font-light text-slate-900">
                  {currentAgentVoice?.type === "predefined" ? "Predefined" : "Custom"}
                </p>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Voice Type</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-12">
          {/* Predefined Voices Section */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-slate-600" />
              </div>
              <h2 className="text-2xl font-light text-slate-900">Predefined Voices</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {predefinedVoices.map((voice) => {
                const isSelected = voiceType === "predefined" && selectedVoice === voice.id
                return (
                  <Card
                    key={voice.id}
                    className={cn(
                      "group relative bg-white border transition-all duration-300 hover:shadow-lg rounded-xl overflow-hidden cursor-pointer",
                      isSelected ? "border-slate-900 shadow-md" : "border-slate-200"
                    )}
                    onClick={() => handleVoiceSelection(voice.id)}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12 ring-2 ring-slate-100">
                            <AvatarImage src={voice.avatar} alt={voice.name} />
                            <AvatarFallback>{voice.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-lg font-light text-slate-900">{voice.name}</p>
                            <p className="text-xs text-slate-500 font-light">{voice.description}</p>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="w-6 h-6 bg-slate-900 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-slate-400 text-xs font-light font-mono">{voice.tags}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Custom Voice Upload Section */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                <Upload className="w-4 h-4 text-slate-600" />
              </div>
              <h2 className="text-2xl font-light text-slate-900">Custom Voice</h2>
            </div>

            <Card
              className={cn(
                "relative bg-white border transition-all duration-300 rounded-xl overflow-hidden",
                voiceType === "upload" ? "border-slate-900 shadow-md" : "border-slate-200 hover:border-slate-300"
              )}
            >
              <CardContent className="p-8">
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="relative rounded-xl border-2 border-dashed border-slate-300 p-12 transition-all duration-300 hover:border-slate-400"
                >
                  <input
                    id="voice-upload"
                    type="file"
                    accept="audio/*"
                    className="sr-only"
                    onChange={handleVoiceFileUpload}
                  />
                  <label htmlFor="voice-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center">
                        <Upload className="w-8 h-8 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-slate-700 font-light text-lg">
                          {uploadedFile ? (
                            <span className="text-slate-900 font-normal">✓ {uploadedFile.name}</span>
                          ) : currentAgentVoice?.type === "upload" && currentAgentVoice.customVoiceUrl ? (
                            <span className="text-slate-600">Current custom voice uploaded</span>
                          ) : (
                            <>
                              Drag & drop or <span className="text-slate-900 underline">browse</span> to upload
                            </>
                          )}
                        </p>
                        <p className="text-sm text-slate-400 font-light mt-2">
                          MP3, WAV, OGG • Max 5MB • Up to 5 minutes
                        </p>
                      </div>
                    </div>
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Audio Preview Section */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                <Play className="w-4 h-4 text-slate-600" />
              </div>
              <h2 className="text-2xl font-light text-slate-900">Preview</h2>
            </div>

            <Card className="bg-white border border-slate-200 rounded-xl">
              <CardContent className="p-6">
                {displayAudioSrc ? (
                  <AudioPlayer src={displayAudioSrc} />
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                      <Volume2 className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-slate-500 font-light">Select a voice to preview</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Generate Voice Snippet Section */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                <Mic className="w-4 h-4 text-slate-600" />
              </div>
              <h2 className="text-2xl font-light text-slate-900">Generate Voice Snippet</h2>
            </div>

            <Card className="bg-white border border-slate-200 rounded-xl">
              <CardContent className="p-6 space-y-4">
                <p className="text-slate-600 font-light">Test the selected voice with custom text</p>
                <Textarea
                  placeholder="Type something for the agent to say..."
                  value={previewText}
                  onChange={(e) => setPreviewText(e.target.value)}
                  rows={4}
                  className="resize-none font-light"
                />
                <Button
                  onClick={handleGeneratePreview}
                  disabled={isGenerating || !previewText.trim()}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-6 font-light tracking-wide disabled:opacity-40"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Preview"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Update Button */}
          <div className="flex justify-center pt-8">
            <Button
              onClick={handleUpdateVoice}
              disabled={isLoading}
              className="group px-12 py-6 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Updating Voice...
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                  <span className="font-light tracking-wide">Update Voice Configuration</span>
                </div>
              )}
            </Button>
          </div>
        </div>

        {/* Bottom Divider */}
        <div className="mt-24 pt-12 border-t border-slate-100">
          <div className="flex items-center justify-center gap-2">
            <div className="w-1 h-1 bg-slate-300 rounded-full" />
            <div className="w-1 h-1 bg-slate-300 rounded-full" />
            <div className="w-1 h-1 bg-slate-300 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

// Voice Prompts Tab (keeping existing)
function VoicePromptsTab({ agentId }: { agentId: string }) {
  const [expandedSections, setExpandedSections] = useState<string[]>(["welcome", "processing"])
  const { toast } = useToast()

  const [welcomePhrase, setWelcomePhrase] = useState("This is a virtual agent.")
  const [processingPhrases, setProcessingPhrases] = useState(`Okay, give me just a minute.
Great, just one second.
Hold on a moment.`)
  const [voicemailPhrase, setVoicemailPhrase] = useState("Okay, please start your voicemail, and hangup when you're done.")
  const [silencePhrase, setSilencePhrase] = useState("Are you still there? Maybe I missed what you said.")
  const DEFAULTS = {
  welcome: "This is a virtual agent.",
  processing: `Okay, give me just a minute.\nGreat, just one second.\nHold on a moment.`,
  voicemail: "Okay, please start your voicemail, and hangup when you're done.",
  silence: "Are you still there? Maybe I missed what you said.",
}
  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    )
  }

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/agents/agents/${agentId}/`, {
          headers: {
            Authorization: `Token ${Cookies.get("Token") || ""}`,
          },
        })

        if (!res.ok) throw new Error("Failed to fetch voice prompts")

        const data = await res.json()

        if (data.welcome_phrase) setWelcomePhrase(data.welcome_phrase)
        if (Array.isArray(data.processing_phrases)) setProcessingPhrases(data.processing_phrases.join("\n"))
        if (data.voicemail_phrase) setVoicemailPhrase(data.voicemail_phrase)
        if (data.silence_phrase) setSilencePhrase(data.silence_phrase)

      } catch (err: any) {
        toast({ title: "Error", description: err.message || "Failed to load voice prompts." })
      }
    }

    if (agentId) fetchPrompts()
  }, [agentId])


  const handleSave = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/agents/agents/${agentId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${Cookies.get("Token") || ""}`,
        },
        body: JSON.stringify({
          welcome_phrase: welcomePhrase,
          processing_phrases: processingPhrases.split("\n").filter(p => p.trim() !== ""), // assuming backend expects an array
          voicemail_phrase: voicemailPhrase,
          silence_phrase: silencePhrase,
        }),
      })

      if (!res.ok) {
        throw new Error("Failed to update voice prompts")
      }

      toast({ title: "Success", description: "Voice prompts updated successfully." })
    } catch (err: any) {
      toast({ title: "Error", description: err.message })
    }
  }

  const handleReset = async () => {
  setWelcomePhrase(DEFAULTS.welcome)
  setProcessingPhrases(DEFAULTS.processing)
  setVoicemailPhrase(DEFAULTS.voicemail)
  setSilencePhrase(DEFAULTS.silence)

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/agents/agents/${agentId}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${Cookies.get("Token") || ""}`,
      },
      body: JSON.stringify({
        welcome_phrase: DEFAULTS.welcome,
        processing_phrases: DEFAULTS.processing.split("\n"),
        voicemail_phrase: DEFAULTS.voicemail,
        silence_phrase: DEFAULTS.silence,
      }),
    })

    if (!res.ok) {
      throw new Error("Failed to reset to default")
    }

    toast({ title: "Success", description: "Voice prompts reset to default." })
  } catch (err: any) {
    toast({ title: "Error", description: err.message })
  }
}


  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800">
          When your agent interacts with a caller, we have some standard phrases that we utilize throughout the
          conversation. You can change these here.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-medium text-slate-800">Manage Voice Phrases</h2>

        {/* Welcome Phrase */}
        <div className="bg-white border border-slate-200 rounded-lg">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="font-medium text-slate-800">Welcome Phrase</h3>
              <p className="text-sm text-slate-600">The greeting your agent uses when it answers a call.</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button size="icon" variant="outline"><Play className="w-4 h-4" /></Button>
              <Button size="icon" variant="outline"><Square className="w-4 h-4" /></Button>
              <Button size="icon" variant="outline" onClick={() => toggleSection("welcome")}>
                <ChevronUp className={`w-4 h-4 transition-transform ${expandedSections.includes("welcome") ? "rotate-180" : ""}`} />
              </Button>
            </div>
          </div>
          <div className="p-4">
            <Textarea
              value={welcomePhrase}
              onChange={(e) => setWelcomePhrase(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>

        {/* Processing Phrases */}
        {/* <div className="bg-white border border-slate-200 rounded-lg">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="font-medium text-slate-800">Processing Phrases</h3>
              <p className="text-sm text-slate-600">
                What the agent says when it's processing something the caller has said. It will choose one at random
                from the list.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button size="icon" variant="outline"><Play className="w-4 h-4" /></Button>
              <Button size="icon" variant="outline"><Square className="w-4 h-4" /></Button>
              <Button size="icon" variant="outline" onClick={() => toggleSection("processing")}>
                <ChevronUp className={`w-4 h-4 transition-transform ${expandedSections.includes("processing") ? "rotate-180" : ""}`} />
              </Button>
            </div>
          </div>
          <div className="p-4 space-y-4">
            <Textarea
              value={processingPhrases}
              onChange={(e) => setProcessingPhrases(e.target.value)}
              className="min-h-[120px]"
            />
            <Button variant="outline" onClick={handleReset}>Reset to default</Button>
          </div>
        </div> */}

        {/* Voicemail Phrase */}
        {/* <div className="bg-white border border-slate-200 rounded-lg">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="font-medium text-slate-800">Voicemail Phrase</h3>
              <p className="text-sm text-slate-600">
                The agent will say this after the caller has asked to leave a voicemail.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button size="icon" variant="outline"><Play className="w-4 h-4" /></Button>
              <Button size="icon" variant="outline"><Square className="w-4 h-4" /></Button>
              <Button size="icon" variant="outline" onClick={() => toggleSection("voicemail")}>
                <ChevronUp className={`w-4 h-4 transition-transform ${expandedSections.includes("voicemail") ? "rotate-180" : ""}`} />
              </Button>
            </div>
          </div>
          <div className="p-4">
            <Textarea
              value={voicemailPhrase}
              onChange={(e) => setVoicemailPhrase(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div> */}

        {/* Extended Silence Phrase */}
        <div className="bg-white border border-slate-200 rounded-lg">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="font-medium text-slate-800">Extended Silence Phrase</h3>
              <p className="text-sm text-slate-600">The agent will say this after 15 seconds of silence.</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button size="icon" variant="outline"><Play className="w-4 h-4" /></Button>
              <Button size="icon" variant="outline"><Square className="w-4 h-4" /></Button>
              <Button size="icon" variant="outline" onClick={() => toggleSection("silence")}>
                <ChevronUp className={`w-4 h-4 transition-transform ${expandedSections.includes("silence") ? "rotate-180" : ""}`} />
              </Button>
            </div>
          </div>
          <div className="p-4">
            <Textarea
              value={silencePhrase}
              onChange={(e) => setSilencePhrase(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={handleReset}>Reset to default</Button>

          <Button className="bg-teal-600 hover:bg-teal-700 text-white" onClick={handleSave}>Save</Button>
        </div>
      </div>
    </div>
  )
}

function AgentConfigTab({ agentId }: AgentConfigTabProps) {
  const [agentConfig, setAgentConfig] = useState<any>(null)
  const { toast } = useToast()

  // Fetch agent_config
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/agents/agents/${agentId}/`, {
          headers: {
            Authorization: `Token ${Cookies.get("Token") || ""}`,
          },
        })

        if (!res.ok) throw new Error("Failed to fetch agent config")
        const data = await res.json()

        if (data.agent_config) setAgentConfig(data.agent_config)
      } catch (err: any) {
        toast({ title: "Error", description: err.message || "Failed to load agent config." })
      }
    }

    if (agentId) fetchConfig()
  }, [agentId])

  // Update field value
  const handleChange = (path: string[], value: any) => {
    setAgentConfig((prev: any) => {
      const updated = { ...prev }
      let obj = updated
      for (let i = 0; i < path.length - 1; i++) {
        obj = obj[path[i]]
      }
      obj[path[path.length - 1]] = value
      return updated
    })
  }

  // Save changes
  const handleSave = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/agents/agents/${agentId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${Cookies.get("Token") || ""}`,
        },
        body: JSON.stringify({ agent_config: agentConfig }),
      })

      if (!res.ok) throw new Error("Failed to save agent config")

      toast({ title: "Success", description: "Agent config saved successfully." })
    } catch (err: any) {
      toast({ title: "Error", description: err.message })
    }
  }

  // Render form fields with different UI based on type
  const renderField = (path: string[], key: string, value: any) => {
    const fullPath = [...path, key]

    if (typeof value === "boolean") {
      return (
        <div key={fullPath.join(".")} className="flex items-center justify-between bg-slate-50 px-4 py-3 rounded-xl shadow-sm">
          <Label className="text-slate-700 font-medium">{key}</Label>
          <Switch
            checked={value}
            onCheckedChange={(val) => handleChange(fullPath, val)}
          />
        </div>
      )
    }

    if (typeof value === "number") {
      return (
        <div key={fullPath.join(".")} className="p-4 bg-white rounded-xl shadow-sm border space-y-3">
          <Label className="block text-slate-700 font-semibold">{key}</Label>
          <Slider
            value={[value]}
            min={0}
            max={100}
            step={0.1}
            onValueChange={(val) => handleChange(fullPath, val[0])}
            className="w-full"
          />
          <div className="text-right text-xs text-slate-500">Current: {value}</div>
        </div>
      )
    }

    if (typeof value === "string" || value === null) {
      return (
        <div key={fullPath.join(".")} className="p-4 bg-white rounded-xl shadow-sm border space-y-2">
          <Label className="block text-slate-700 font-semibold">{key}</Label>
          <Input
            value={value || ""}
            placeholder="Enter value"
            className="border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
            onChange={(e) => handleChange(fullPath, e.target.value)}
          />
        </div>
      )
    }

    if (typeof value === "object" && value !== null) {
      return (
        <div key={fullPath.join(".")} className="p-6 bg-gradient-to-br from-slate-50 to-white border rounded-2xl shadow-md space-y-5">
          <h4 className="text-lg font-semibold text-slate-800 tracking-tight capitalize">{key}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(value).map(([subKey, subVal]) =>
              renderField(fullPath, subKey, subVal)
            )}
          </div>
        </div>
      )
    }

    return null
  }

  return (
  <div className="space-y-8">
    {/* Header */}
    <div className="text-center space-y-2">
      <h2 className="text-2xl font-bold text-slate-800">⚙️ Manage Agent Config</h2>
      <p className="text-slate-500 text-sm">
        Fine-tune your agent with corporate-grade precision and aesthetics.
      </p>
    </div>

    {!agentConfig ? (
      <div className="flex justify-center items-center py-20">
        <p className="text-slate-600 animate-pulse">Loading configuration...</p>
      </div>
    ) : (
      <Accordion
        type="single"
        collapsible
        className="w-full space-y-6"
      >
        {Object.entries(agentConfig).map(([key, val]) => (
          <AccordionItem
            key={key}
            value={key}
            className="border rounded-2xl shadow-lg overflow-hidden backdrop-blur-sm bg-white/80"
          >
            <AccordionTrigger className="px-6 py-4 font-semibold text-slate-800 bg-gradient-to-r from-slate-100 to-slate-50 hover:from-indigo-50 hover:to-blue-50 transition-colors duration-200">
              {key.toUpperCase()}
            </AccordionTrigger>
            <AccordionContent className="p-8 bg-gradient-to-br from-white via-slate-50 to-white space-y-8">
              {renderField([], key, val)}
            </AccordionContent>
          </AccordionItem>
        ))}

        <div className="flex justify-end pt-6">
          <Button
            className="shadow-lg text-white px-10 py-3 text-sm font-semibold rounded-xl transition-all duration-200"
            style={{ background: "var(--ink)" }}
            onClick={handleSave}
          >
            💾 Save All Changes
          </Button>
        </div>
      </Accordion>
    )}
  </div>
)

}



import {Sparkles, Save, Type, Hash } from "lucide-react"


function AgentPromptsTab({ agentId }: { agentId: string }) {
  const [agentPrompt, setAgentPrompt] = useState("")
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const lineNumbersRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/agents/agents/${agentId}/`, {
          headers: {
            Authorization: `Token ${Cookies.get("Token") || ""}`,
          },
        })

        if (!res.ok) throw new Error("Failed to fetch agent prompt")
        const data = await res.json()

        if (data.instructions) setAgentPrompt(data.instructions)
      } catch (err: any) {
        toast({ title: "Error", description: err.message || "Failed to load agent prompt." })
      } finally {
        setLoading(false)
      }
    }

    if (agentId) fetchPrompt()
  }, [agentId])

  const handleScroll = () => {
    if (lineNumbersRef.current && textareaRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/agents/agents/${agentId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${Cookies.get("Token") || ""}`,
        },
        body: JSON.stringify({
          instructions: agentPrompt,
        }),
      })

      if (!res.ok) throw new Error("Failed to save agent prompt")

      toast({ title: "Success", description: "Agent prompt saved successfully." })
    } catch (err: any) {
      toast({ title: "Error", description: err.message })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(agentPrompt)
      toast({ title: "Copied", description: "Prompt copied to clipboard." })
    } catch {
      toast({ title: "Error", description: "Failed to copy prompt." })
    }
  }

  const lineCount = agentPrompt ? agentPrompt.split("\n").length : 1
  const charCount = agentPrompt.length
  const wordCount = agentPrompt.trim() ? agentPrompt.trim().split(/\s+/).length : 0

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Header Section */}
        <div className="mb-16 space-y-6">
          <div className="flex items-start justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-1 h-16 bg-gradient-to-b from-slate-900 to-slate-400 rounded-full" />
                <div>
                  <h1 className="text-5xl font-extralight tracking-tight text-slate-900 mb-2">
                    Agent Prompt
                  </h1>
                  <p className="text-lg text-slate-500 font-light tracking-wide">
                    Define personality, context, and behavior
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Panel */}
            <div className="flex items-center gap-6 bg-slate-50/50 backdrop-blur-sm border border-slate-200/50 rounded-2xl px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Hash className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-2xl font-light text-slate-900">{lineCount}</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Lines</p>
                </div>
              </div>
              <div className="w-px h-12 bg-slate-200" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Type className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-2xl font-light text-slate-900">{wordCount}</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Words</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="max-w-3xl pl-8">
            <p className="text-slate-600 font-light leading-relaxed text-base">
              Shape your virtual agent's personality and response style. Define the context, tone, and behavioral 
              guidelines that will govern how your agent interacts and communicates.
            </p>
          </div>
        </div>

        {/* Editor Section */}
        <div className="space-y-6">
          <div className="group relative">
            {/* Floating toolbar */}
            <div className="absolute -top-16 right-0 z-10 flex items-center gap-3">
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all duration-200 shadow-sm hover:shadow group/btn"
              >
                <Copy className="w-4 h-4 text-slate-600 group-hover/btn:text-slate-900 transition-colors" />
                <span className="text-sm font-light text-slate-700 group-hover/btn:text-slate-900 transition-colors">
                  Copy
                </span>
              </button>
              
              <div className="text-sm text-slate-400 font-light px-4 py-2.5 bg-slate-50/50 border border-slate-200/50 rounded-xl">
                {charCount.toLocaleString()} characters
              </div>
            </div>

            {/* Editor Container */}
            <div className="relative bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-32">
                  <div className="relative">
                    <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mb-6">
                      <Loader2 className="w-10 h-10 text-slate-400 animate-spin" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/5 to-transparent rounded-2xl blur-xl" />
                  </div>
                  <p className="text-slate-500 font-light tracking-wide">Loading prompt...</p>
                </div>
              ) : (
                <div className="relative">
                  {/* Line numbers */}
                  <div
                    ref={lineNumbersRef}
                    className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-slate-50 to-slate-50/30 border-r border-slate-200/50 overflow-hidden select-none"
                    style={{ overflowY: 'hidden' }}
                  >
                    <div className="py-6">
                      {Array.from({ length: lineCount }, (_, i) => (
                        <div
                          key={i + 1}
                          className="flex items-center justify-center text-xs font-light text-slate-400 hover:text-slate-600 transition-colors"
                          style={{ height: '28px', lineHeight: '28px' }}
                        >
                          {i + 1}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Textarea */}
                  <Textarea
                    ref={textareaRef}
                    value={agentPrompt}
                    onChange={(e) => setAgentPrompt(e.target.value)}
                    onScroll={handleScroll}
                    placeholder="Define your agent's instructions, personality, and behavior guidelines..."
                    className="pl-20 pr-8 py-6 min-h-[500px] border-0 resize-none focus:ring-0 focus-visible:ring-0 font-mono text-[15px] text-slate-800 placeholder:text-slate-300 bg-transparent"
                    style={{ lineHeight: '28px' }}
                  />

                  {/* Gradient overlay at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                </div>
              )}
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-6">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-slate-400" />
              <p className="text-sm text-slate-500 font-light">
                Auto-saved locally as you type
              </p>
            </div>

            <Button
              onClick={handleSave}
              disabled={loading || isSaving}
              className="group relative px-8 py-6 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-slate-800 to-slate-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center gap-3">
                {isSaving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="font-light tracking-wide">Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-light tracking-wide">Save Changes</span>
                  </>
                )}
              </div>
            </Button>
          </div>
        </div>

        {/* Bottom Divider */}
        <div className="mt-24 pt-12 border-t border-slate-100">
          <div className="flex items-center justify-center gap-2">
            <div className="w-1 h-1 bg-slate-300 rounded-full" />
            <div className="w-1 h-1 bg-slate-300 rounded-full" />
            <div className="w-1 h-1 bg-slate-300 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}


import { Volume2, Sliders, RotateCcw } from 'lucide-react'

// Voice Settings Tab (keeping existing)
function VoiceSettingsTab({ agentId }: { agentId: string }) {
  const { toast } = useToast()
  const [stability, setStability] = useState(50)
  const [clarity, setClarity] = useState(50)
  const [styleExaggeration, setStyleExaggeration] = useState(50)
  const [voiceSpeed, setVoiceSpeed] = useState(50)
  const [speakerBoost, setSpeakerBoost] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/agents/agents/${agentId}/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${Cookies.get("Token") || ""}`,
          },
        })
        const data = await res.json()
        setStability(data.voice_stability ?? 50)
        setClarity(data.voice_clarity ?? 50)
        setStyleExaggeration(data.voice_style ?? 50)
        // setVoiceSpeed(Math.round(((2 - data.voice_speed) / 1.5) * 100) ?? 50)
        setVoiceSpeed(data.voice_speed ?? 50)
        setSpeakerBoost(data.speaker_boost ?? true)
      } catch (error) {
        console.error("Failed to load voice settings:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [agentId])

  const handleSave = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/agents/agents/${agentId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${Cookies.get("Token") || ""}`,
        },
        body: JSON.stringify({
          voice_stability: stability,
          voice_clarity: clarity,
          voice_style: styleExaggeration,
          // voice_speed: -1 * ((voiceSpeed * (1.5 / 100)) - 2),
          voice_speed: voiceSpeed,
          speaker_boost: speakerBoost,
        }),
      })

      if (res.ok) {
        toast({ title: "Voice settings updated", description: "Preferences saved." })
      } else throw new Error("Failed to update")
    } catch {
      toast({ title: "Update failed", description: "Could not save settings.", variant: "destructive" })
    }
  }

  const handleReset = () => {
    setStability(50)
    setClarity(50)
    setStyleExaggeration(50)
    setVoiceSpeed(50)
    setSpeakerBoost(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mb-6">
              <Loader2 className="w-10 h-10 text-slate-400 animate-spin" />
            </div>
            <p className="text-slate-500 font-light">Loading voice settings...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-16 space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-1 h-20 bg-gradient-to-b from-slate-900 to-slate-400 rounded-full" />
            <div className="space-y-3">
              <h1 className="text-5xl font-extralight tracking-tight text-slate-900">
                Voice Settings
              </h1>
              <p className="text-lg text-slate-500 font-light tracking-wide">
                Fine-tune your agent's voice characteristics and audio output
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8 pl-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                <Volume2 className="w-6 h-6 text-slate-600" />
              </div>
              <div>
                <p className="text-2xl font-light text-slate-900">4</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider">
                  Voice Parameters
                </p>
              </div>
            </div>
            <div className="w-px h-12 bg-slate-200" />
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                <Sliders className="w-6 h-6 text-slate-600" />
              </div>
              <div>
                <p className="text-2xl font-light text-slate-900">
                  {speakerBoost ? "On" : "Off"}
                </p>
                <p className="text-xs text-slate-500 uppercase tracking-wider">
                  Speaker Boost
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-12 max-w-4xl">
          {/* Sliders */}
          <div className="space-y-8">
            {[
              { label: "Stability", value: stability, set: setStability },
              { label: "Clarity", value: clarity, set: setClarity },
              { label: "Style", value: styleExaggeration, set: setStyleExaggeration },
              { label: "Speed", value: voiceSpeed, set: setVoiceSpeed },
            ].map(({ label, value, set }) => (
              <div key={label}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                    <Sliders className="w-4 h-4 text-slate-600" />
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <h2 className="text-2xl font-light text-slate-900">{label}</h2>
                    <span className="text-lg font-light text-slate-600 min-w-[4rem] text-right">
                      {value}%
                    </span>
                  </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={value}
                    onChange={(e) => set(Number(e.target.value))}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-slate-900 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:scale-110 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-slate-900 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Speaker Boost Toggle */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                <Volume2 className="w-4 h-4 text-slate-600" />
              </div>
              <h2 className="text-2xl font-light text-slate-900">Speaker Boost</h2>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
              <label className="flex items-center gap-4 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    id="speaker-boost"
                    checked={speakerBoost}
                    onChange={(e) => setSpeakerBoost(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-8 bg-slate-200 rounded-full peer-checked:bg-slate-900 transition-colors duration-300"></div>
                  <div className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-6 shadow-sm"></div>
                </div>
                <span className="text-base font-light text-slate-700 group-hover:text-slate-900 transition-colors">
                  Enable enhanced speaker output
                </span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-8">
            <Button
              variant="outline"
              onClick={handleReset}
              className="px-8 py-6 border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl transition-all duration-300"
            >
              <span className="flex items-center gap-2 font-light tracking-wide">
                <RotateCcw className="w-4 h-4" />
                Reset to Defaults
              </span>
            </Button>
            <Button
              onClick={handleSave}
              className="px-10 py-6 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <span className="font-light tracking-wide">Save Changes</span>
            </Button>
          </div>
        </div>

        {/* Bottom Divider */}
        <div className="mt-24 pt-12 border-t border-slate-100">
          <div className="flex items-center justify-center gap-2">
            <div className="w-1 h-1 bg-slate-300 rounded-full" />
            <div className="w-1 h-1 bg-slate-300 rounded-full" />
            <div className="w-1 h-1 bg-slate-300 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

// Additional Settings Tab
function AdditionalSettings() {
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "location",
    "business-hours",
    "agent-settings",
    "outbound-call",
    "post-call",
  ])
  const [businessClosed, setBusinessClosed] = useState(false)
  const [removeBusiness, setRemoveBusiness] = useState(false)
  const [alwaysSendText, setAlwaysSendText] = useState(true)
  const [enableTemplate, setEnableTemplate] = useState(false)
  const [autogenerate, setAutogenerate] = useState(true)
  const [enableInterruptions, setEnableInterruptions] = useState(false)
  const [enableSMS, setEnableSMS] = useState(false)
  const [enableHearDTMF, setEnableHearDTMF] = useState(false)
  const [enableSendDTMF, setEnableSendDTMF] = useState(false)
  const [allowContentSearch, setAllowContentSearch] = useState(false)
  const [disableVoicemail, setDisableVoicemail] = useState(true)
  const [disableSMSAgent, setDisableSMSAgent] = useState(true)
  const [enableAnsweringMachine, setEnableAnsweringMachine] = useState(false)

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-medium text-slate-800 text-center">Additional Settings</h2>

      {/* Location Settings */}
      <div className="bg-white border border-slate-200 rounded-lg">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-blue-600 font-medium">Location settings</h3>
          <Button size="icon" variant="outline" onClick={() => toggleSection("location")}>
            <ChevronUp
              className={`w-4 h-4 transition-transform ${expandedSections.includes("location") ? "rotate-180" : ""}`}
            />
          </Button>
        </div>
        {expandedSections.includes("location") && (
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <label className="text-slate-700 font-medium">Agent Locale*</label>
              <Select defaultValue="english-us">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english-us">English (United States)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-slate-700 font-medium">Agent Location (street address or city & state)</label>
              <Input placeholder="" />
            </div>

            <div className="space-y-2">
              <label className="text-slate-700 font-medium">Agent Timezone (automatically set by Agent Location)</label>
              <Select defaultValue="utc">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="utc">Etc/UTC: Coordinated Universal Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      {/* Business Hours */}
      <div className="bg-white border border-slate-200 rounded-lg">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-blue-600 font-medium">Business Hours</h3>
          <Button size="icon" variant="outline" onClick={() => toggleSection("business-hours")}>
            <ChevronUp
              className={`w-4 h-4 transition-transform ${expandedSections.includes("business-hours") ? "rotate-180" : ""}`}
            />
          </Button>
        </div>
        {expandedSections.includes("business-hours") && (
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <label className="text-slate-700 font-medium">Current Generated business hours.</label>
              <Textarea className="min-h-[120px]" />
            </div>

            <p className="text-slate-600 text-sm">This represents the agent's understanding of your business hours</p>

            <div className="space-y-2">
              <label className="text-slate-700 font-medium">Business Hours Source</label>
              <Select defaultValue="plain-text">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="plain-text">Plain Text</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-slate-700 font-medium">Business Hours Description</label>
              <Textarea className="min-h-[120px]" />
            </div>

            <p className="text-slate-600 text-sm">Holidays/Special Dates should be specified with the full date.</p>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="business-closed"
                checked={businessClosed}
                onChange={(e) => setBusinessClosed(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="business-closed" className="text-slate-700">
                Toggle to enforce business as closed.
              </label>
            </div>

            <div className="space-y-2">
              <label className="text-slate-700 font-medium">Days business is closed.</label>
              <Input defaultValue="0" />
              <p className="text-slate-600 text-sm">If set to zero, a manual update is required to re-open.</p>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="remove-business"
                checked={removeBusiness}
                onChange={(e) => setRemoveBusiness(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="remove-business" className="text-slate-700">
                Remove Business Hours
              </label>
            </div>
            <p className="text-slate-600 text-sm">Removes all business hour data from agent and sets to default.</p>
          </div>
        )}
      </div>

      {/* Agent Settings */}
      <div className="bg-white border border-slate-200 rounded-lg">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-blue-600 font-medium">Agent Settings</h3>
          <Button size="icon" variant="outline" onClick={() => toggleSection("agent-settings")}>
            <ChevronUp
              className={`w-4 h-4 transition-transform ${expandedSections.includes("agent-settings") ? "rotate-180" : ""}`}
            />
          </Button>
        </div>
        {expandedSections.includes("agent-settings") && (
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <label className="text-slate-700 font-medium">Pronunciation Dictionaries</label>
              <Input />
            </div>

            <div className="space-y-2">
              <label className="text-slate-700 font-medium">Initial Trigger</label>
              <Input defaultValue="Start the goal" />
              <p className="text-slate-600 text-sm">
                Instead of waiting for first response, this can trigger a specific task for each conversation.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="always-send-text"
                checked={alwaysSendText}
                onChange={(e) => setAlwaysSendText(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="always-send-text" className="text-slate-700">
                Always send opening text
              </label>
            </div>
            <p className="text-slate-600 text-sm">
              If unchecked, opening texts still be triggered by 'openingsms:true' in API metadata. If no message
              provided below, no text will be sent.
            </p>

            <div className="space-y-2">
              <label className="text-slate-700 font-medium">Text message to send when call is answered.</label>
              <Textarea className="min-h-[80px]" />
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="enable-template"
                checked={enableTemplate}
                onChange={(e) => setEnableTemplate(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="enable-template" className="text-slate-700">
                Enable Template Library
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="autogenerate"
                checked={autogenerate}
                onChange={(e) => setAutogenerate(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="autogenerate" className="text-slate-700">
                Autogenerate next action phrases
              </label>
            </div>
            <p className="text-slate-600 text-sm">
              The Agent will naturally generate phrases to continue the conversation.
            </p>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="enable-interruptions"
                checked={enableInterruptions}
                onChange={(e) => setEnableInterruptions(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="enable-interruptions" className="text-slate-700">
                Enable Interruptions.
              </label>
            </div>
            <p className="text-slate-600 text-sm">Allow the agent to be interrupted mid-sentence.</p>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="enable-sms"
                checked={enableSMS}
                onChange={(e) => setEnableSMS(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="enable-sms" className="text-slate-700">
                Enable SMS Channel During Calls
              </label>
            </div>
            <p className="text-slate-600 text-sm">Allow agent to receive and read text messages during the call.</p>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="enable-hear-dtmf"
                checked={enableHearDTMF}
                onChange={(e) => setEnableHearDTMF(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="enable-hear-dtmf" className="text-slate-700">
                Enable Agent to hear DTMF (dial tones)
              </label>
            </div>
            <p className="text-slate-600 text-sm">
              DTMF tones will be sent to the Agent. This is not necessary for tasks that are triggered by DTMF
            </p>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="enable-send-dtmf"
                checked={enableSendDTMF}
                onChange={(e) => setEnableSendDTMF(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="enable-send-dtmf" className="text-slate-700">
                Enable Agent to send DTMF (dial tones)
              </label>
            </div>
            <p className="text-slate-600 text-sm">
              Agent can send DTMF tones when contextually relevant, i.e. responding to an answering machine.
            </p>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="allow-content-search"
                checked={allowContentSearch}
                onChange={(e) => setAllowContentSearch(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="allow-content-search" className="text-slate-700">
                Allow Agent to independently search Content Library
              </label>
            </div>
            <p className="text-slate-600 text-sm">
              If checked, the Agent can search content library when deemed necessary. If unchecked, content library will
              be searched for every response.
            </p>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="disable-voicemail"
                checked={disableVoicemail}
                onChange={(e) => setDisableVoicemail(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="disable-voicemail" className="text-slate-700">
                Disable voicemail request detection.
              </label>
            </div>
            <p className="text-slate-600 text-sm">Prevent the agent from automatically offering to take a voicemail</p>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="disable-sms-agent"
                checked={disableSMSAgent}
                onChange={(e) => setDisableSMSAgent(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="disable-sms-agent" className="text-slate-700">
                Disable SMS.
              </label>
            </div>
            <p className="text-slate-600 text-sm">Prevent the agent from being able to send SMS messages.</p>
          </div>
        )}
      </div>

      {/* Outbound Call Settings */}
      <div className="bg-white border border-slate-200 rounded-lg">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-blue-600 font-medium">Outbound Call Settings</h3>
          <Button size="icon" variant="outline" onClick={() => toggleSection("outbound-call")}>
            <ChevronUp
              className={`w-4 h-4 transition-transform ${expandedSections.includes("outbound-call") ? "rotate-180" : ""}`}
            />
          </Button>
        </div>
        {expandedSections.includes("outbound-call") && (
          <div className="p-4 space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="enable-answering-machine"
                checked={enableAnsweringMachine}
                onChange={(e) => setEnableAnsweringMachine(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="enable-answering-machine" className="text-slate-700">
                Enable answering machine detection
              </label>
            </div>

            <div className="space-y-2">
              <label className="text-slate-700 font-medium">Greeting Delay</label>
              <Input defaultValue="0" />
              <p className="text-slate-600 text-sm">
                The delay, in seconds, the agent will wait before saying its Hello Prompt. Set to 0 to allow agent to
                determine if human or machine answered.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Post Call Settings */}
      <div className="bg-white border border-slate-200 rounded-lg">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-blue-600 font-medium">Post Call Settings</h3>
          <Button size="icon" variant="outline" onClick={() => toggleSection("post-call")}>
            <ChevronUp
              className={`w-4 h-4 transition-transform ${expandedSections.includes("post-call") ? "rotate-180" : ""}`}
            />
          </Button>
        </div>
        {expandedSections.includes("post-call") && (
          <div className="p-4">
            <p className="text-slate-600">Post call settings will be configured here.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function AdditionalSettingsTab({ agentId }: { agentId: string }) {
  const [agentName, setAgentName] = useState("")
  const [agentPersona, setAgentPersona] = useState("")
  const [agentGoals, setAgentGoals] = useState("")
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // Fetch Agent details
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/agents/agents/${agentId}/`, {
          headers: {
            Authorization: `Token ${Cookies.get("Token") || ""}`,
          },
        })

        if (!res.ok) throw new Error("Failed to fetch agent details")
        const data = await res.json()

        setAgentName(data.name || "")
        setAgentPersona(data.persona || "")
        setAgentGoals(data.goals || "")
      } catch (err: any) {
        toast({ title: "❌ Error", description: err.message || "Could not load agent settings." })
      } finally {
        setLoading(false)
      }
    }

    if (agentId) fetchDetails()
  }, [agentId])

  // Save changes
  const handleSave = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/agents/agents/${agentId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${Cookies.get("Token") || ""}`,
        },
        body: JSON.stringify({
          name: agentName,
          persona: agentPersona,
          goals: agentGoals,
        }),
      })

      if (!res.ok) throw new Error("Failed to save changes")

      toast({ title: "Success", description: "Agent settings updated successfully." })
    } catch (err: any) {
      toast({ title: "❌ Error", description: err.message })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mb-6">
              <Loader2 className="w-10 h-10 text-slate-400 animate-spin" />
            </div>
            <p className="text-slate-500 font-light">Loading agent settings...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-16 space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-1 h-20 bg-gradient-to-b from-slate-900 to-slate-400 rounded-full" />
            <div className="space-y-3">
              <h1 className="text-5xl font-extralight tracking-tight text-slate-900">
                Additional Settings
              </h1>
              <p className="text-lg text-slate-500 font-light tracking-wide">
                Configure your agent's identity, persona, and strategic goals
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8 pl-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                <Settings className="w-6 h-6 text-slate-600" />
              </div>
              <div>
                <p className="text-2xl font-light text-slate-900">
                  {agentName ? "1" : "0"}
                </p>
                <p className="text-xs text-slate-500 uppercase tracking-wider">
                  Agent Name Set
                </p>
              </div>
            </div>
            <div className="w-px h-12 bg-slate-200" />
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-slate-600" />
              </div>
              <div>
                <p className="text-2xl font-light text-slate-900">
                  {agentPersona ? "1" : "0"}
                </p>
                <p className="text-xs text-slate-500 uppercase tracking-wider">
                  Persona Defined
                </p>
              </div>
            </div>
            <div className="w-px h-12 bg-slate-200" />
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-slate-600" />
              </div>
              <div>
                <p className="text-2xl font-light text-slate-900">
                  {agentGoals ? "1" : "0"}
                </p>
                <p className="text-xs text-slate-500 uppercase tracking-wider">
                  Goals Set
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-12 max-w-4xl">
          {/* Agent Name */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-slate-600" />
              </div>
              <h2 className="text-2xl font-light text-slate-900">Agent Name</h2>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
              <Input
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                placeholder="Enter agent name"
                className="text-lg font-light border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
              />
            </div>
          </div>

          {/* Agent Persona */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-slate-600" />
              </div>
              <h2 className="text-2xl font-light text-slate-900">Agent Persona</h2>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
              <Textarea
                value={agentPersona}
                onChange={(e) => setAgentPersona(e.target.value)}
                placeholder="Describe your agent's persona, tone, and communication style..."
                rows={6}
                className="text-base font-light border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 resize-none"
              />
            </div>
          </div>

          {/* Agent Goals */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-slate-600" />
              </div>
              <h2 className="text-2xl font-light text-slate-900">Agent Goals</h2>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
              <Textarea
                value={agentGoals}
                onChange={(e) => setAgentGoals(e.target.value)}
                placeholder="Define the strategic objectives and goals your agent should achieve..."
                rows={6}
                className="text-base font-light border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 resize-none"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-8">
            <Button
              onClick={handleSave}
              className="px-10 py-6 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <span className="font-light tracking-wide">Save Changes</span>
            </Button>
          </div>
        </div>

        {/* Bottom Divider */}
        <div className="mt-24 pt-12 border-t border-slate-100">
          <div className="flex items-center justify-center gap-2">
            <div className="w-1 h-1 bg-slate-300 rounded-full" />
            <div className="w-1 h-1 bg-slate-300 rounded-full" />
            <div className="w-1 h-1 bg-slate-300 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}


import { ArrowLeft } from "lucide-react"

export default function AgentConfigPage({ params }: { params: Promise<{ agentId: string }> }) {
  
  const [activeTab, setActiveTab] = useState("voiceprint")
  const router = useRouter()
  const { agentId } = use(params) 
  const [agentName, setAgentName] = useState("")
  
  // Fetch agent name for header
  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/agents/agents/${agentId}/`, {
          headers: { Authorization: `Token ${Cookies.get("Token") || ""}` },
        })
        const data = await res.json()
        setAgentName(data.name || "")
      } catch (err) {
        console.error("Failed to fetch agent:", err)
      }
    }
    fetchAgent()
  }, [agentId])

  const renderTabContent = () => {
    switch (activeTab) {
      case "voiceprint":
        return <VoiceprintTab agentId={agentId} />
      case "voice-prompts":
        return <VoicePromptsTab agentId={agentId} />
      case "agent-prompts":
        return <AgentPromptsTab agentId={agentId} />
      case "voice-settings":
        return <VoiceSettingsTab agentId={agentId} />
      case "tools":
        return <ToolsTab agentId={agentId} />
      case "faq":
        return <FAQTab agentId={agentId} />
      case "additional-settings":
        return <AdditionalSettingsTab agentId={agentId} />
      default:
        return <VoiceprintTab agentId={agentId} />
    }
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--canvas)" }}>
      {/* Hero Header Section */}
      <div className="relative overflow-hidden border-b border-slate-100/50">
        {/* Ambient Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/5 via-transparent to-blue-500/5 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/10 to-slate-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-slate-900/10 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-8 py-16 relative">
          {/* Back Button */}
          <div className="mb-8">
            <Button 
              variant="outline" 
              onClick={() => router.push('/dashboard/agent-settings')}
              className="group rounded-xl border-slate-200/80 bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-white hover:border-slate-300 hover:shadow-md transition-all duration-300 font-light"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
              Back to Agents
            </Button>
          </div>

          {/* Main Header */}
          <div className="flex items-start gap-6">
            {/* Decorative Element */}
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center shadow-xl">
                <Settings className="w-10 h-10 text-white animate-[spin_20s_linear_infinite]" />
              </div>
            </div>

            {/* Title Section */}
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-6xl font-extralight tracking-tight text-slate-900 leading-none">
                    Agent Configuration
                  </h1>
                </div>
                <div className="h-1 w-32 bg-gradient-to-r from-slate-900 via-slate-600 to-transparent rounded-full" />
              </div>
              
              {/* Agent Name Badge */}
              <div className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200/80 shadow-sm">
                <div className="relative flex items-center justify-center">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <div className="absolute w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Configuring</span>
                  <div className="w-1 h-1 bg-slate-300 rounded-full" />
                  <span className="text-sm font-medium text-slate-900">
                    {agentName || (
                      <span className="text-slate-400 animate-pulse">Loading agent...</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Subtitle */}
              <p className="text-slate-500 font-light text-lg tracking-wide max-w-2xl">
                Fine-tune your agent's behavior, voice, and capabilities with precision controls
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Tabs */}
        <div className="px-8 py-6 bg-white/60 backdrop-blur-md border-b border-slate-100/50 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{ animationDelay: `${index * 50}ms` }}
                className={cn(
                  "relative px-6 py-3.5 text-sm font-light tracking-wide rounded-xl transition-all duration-300 whitespace-nowrap animate-fadeIn",
                  tab.id === activeTab
                    ? "text-white shadow-lg scale-105"
                    : "hover:bg-white/80 hover:shadow-md"
                )}
                style={
                  tab.id === activeTab
                    ? { background: "var(--signal)" }
                    : { color: "var(--fg-3)" }
                }
              >
                {tab.id === activeTab && (
                  <>
                    <div className="absolute inset-0 rounded-xl" style={{ background: "var(--signal)" }} />
                  </>
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {tab.label}
                  {tab.id === activeTab && (
                    <div className="w-1 h-1 rounded-full animate-pulse" style={{ background: "var(--signal-ink)" }} />
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="relative min-h-[600px]">
          {/* Ambient Content Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-50/30 via-transparent to-slate-50/30 pointer-events-none" />
          <div className="relative">
            {renderTabContent()}
          </div>
        </div>

        {/* Bottom Signature */}
        <div className="px-8 py-16 border-t border-slate-100/50">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
            </div>
            <p className="text-xs text-slate-400 font-light tracking-wider">
              Powered by Nexivo
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}