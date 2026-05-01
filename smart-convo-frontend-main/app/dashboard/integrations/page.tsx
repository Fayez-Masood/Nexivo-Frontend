

// "use client"

// import { Button } from "@/components/ui/button"
// import React, { useState, useEffect } from "react"
// import Cookies from "js-cookie"
// //import { useLocation } from "react-router-dom"
// import { usePathname } from "next/navigation"

// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"

// // 🔹 Mapping between backend integration_name and frontend keys
// const integrationKeyMap: Record<string, string> = {
//   "leadconnector (ghl) v2 - standard": "ghl-standard",
//   "leadconnector (ghl) v2 - whitelabel": "ghl-whitelabel",
//   hubspot: "hubspot",
//   google: "google",
//   "microsoft - delegated": "ms-delegated",
//   "microsoft - admin": "ms-admin",
//   salesforce: "salesforce",
//   accesse11: "accesse11",   // ✅ no space
//   clover: "clover",         // ✅ direct match
// }


// export default function IntegrationsPage() {
//   const [integrations, setIntegrations] = useState<any[]>([
//     { key: "ghl-standard", name: "Leadconnector (GHL) v2 - Standard", status: "Not Connected", statusColor: "text-orange-600" },
//     { key: "ghl-whitelabel", name: "Leadconnector (GHL) v2 - Whitelabel", status: "Not Connected", statusColor: "text-orange-600" },
//     { key: "hubspot", name: "Hubspot", status: "Not Connected", statusColor: "text-orange-600" },
//     { key: "google", name: "Google", status: "Not Connected", statusColor: "text-orange-600" },
//     { key: "ms-delegated", name: "Microsoft - Delegated", status: "Not Connected", statusColor: "text-orange-600" },
//     { key: "ms-admin", name: "Microsoft - Admin", status: "Not Connected", statusColor: "text-orange-600" },
//     { key: "salesforce", name: "Salesforce", status: "Not Connected", statusColor: "text-orange-600", hasDocumentation: true }, 
//     { key: "accesse11", name: "Accesse 11", status: "Not Connected", statusColor: "text-orange-600", apiUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/integrations/accesse11/connect/`, requiresCredentials: true },
//     { key: "clover", name: "Clover", status: "Not Connected", statusColor: "text-orange-600", apiUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/integrations/clover/connect/` },
//   ])

//   const [isAccesseModalOpen, setIsAccesseModalOpen] = useState(false)
//   const [username, setUsername] = useState("")
//   const [password, setPassword] = useState("")
//   const [currentIntegration, setCurrentIntegration] = useState<any>(null)

// const pathname = usePathname()

//   // 🔹 Fetch connected integrations whenever user navigates to this page
//   useEffect(() => {
//   const fetchIntegrations = async () => {
    
//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/integrations/crm-integrations/`, {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Token ${Cookies.get("Token") || ""}`,
//         },
//       })

//       if (!res.ok) throw new Error("Failed to fetch integrations")
//       const data = await res.json()

//       // Backend gives crm_type like "clover", "accesse11", etc.
//       const connectedKeys = data
//         .filter((item: any) => item.status === "active")
//         .map((item: any) => integrationKeyMap[item.crm_type.toLowerCase()] || item.crm_type.toLowerCase())

//       setIntegrations((prev) =>
//         prev.map((integration) => ({
//           ...integration,
//           status: connectedKeys.includes(integration.key) ? "Connected" : "Not Connected",
//           statusColor: connectedKeys.includes(integration.key) ? "text-green-600" : "text-orange-600",
//         }))
//       )
//     } catch (error) {
//       console.error("Error fetching integrations:", error)
//     }
//   }

//   fetchIntegrations()
// }, [pathname])


//   // 🔹 Handle connect button click
//   const handleConnect = async (integration: any) => {
//     if (integration.requiresCredentials) {
//       setCurrentIntegration(integration)
//       setIsAccesseModalOpen(true)
//       return
//     }

//     if (!integration.apiUrl) {
//       console.log(`No API for ${integration.name}`)
//       return
//     }

//     try {
//       const token = Cookies.get("Token") || ""
//       const res = await fetch(integration.apiUrl, {
//         method: "GET",
//         headers: {
//           Authorization: `Token ${token}`,
//           "Content-Type": "application/json",
//         },
//       })

//       const data = await res.json()
//       if (!res.ok) {
//         console.error("Failed to get connect URL", data)
//         return
//       }

//       if (data.url) {
//         window.location.href = data.url
//       } else {
//         console.error("No URL returned from backend")
//       }
//     } catch (error) {
//       console.error("Error connecting integration:", error)
//     }
//   }

//   // 🔹 Submit Accesse11 credentials
//   const handleAccesseSubmit = async () => {
//     if (!currentIntegration?.apiUrl) return

//     try {
//       const token = Cookies.get("Token") || ""
//       const res = await fetch(currentIntegration.apiUrl, {
//         method: "POST",
//         headers: {
//           Authorization: `Token ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ username, password }),
//       })

//       const data = await res.json()
//       if (!res.ok) {
//         console.error("Failed to connect Accesse11", data)
//         return
//       }

//       console.log("Connected successfully", data)

//       // ✅ Update status in UI
//       setIntegrations((prev) =>
//         prev.map((integration) =>
//           integration.key === "accesse11"
//             ? { ...integration, status: "Connected", statusColor: "text-green-600" }
//             : integration
//         )
//       )
//     } catch (error) {
//       console.error("Error connecting Accesse11:", error)
//     } finally {
//       setIsAccesseModalOpen(false)
//       setUsername("")
//       setPassword("")
//     }
//   }

//   return (
//     <div className="p-6 space-y-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-2xl font-semibold text-slate-800">Integrations</h1>
//       </div>

//       <div className="space-y-4">
//         <h2 className="text-xl font-medium text-slate-700">External Integrations</h2>

//         <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
//           <table className="w-full">
//             <thead className="bg-slate-800 text-white">
//               <tr>
//                 <th className="text-left p-4 font-medium">Integration</th>
//                 <th className="text-left p-4 font-medium">Status</th>
//                 <th className="text-left p-4 font-medium">Action</th>
//               </tr>
//             </thead>
//                       <tbody className="divide-y divide-slate-200">
//   {integrations.map((integration, index) => (
//     <tr key={index} className="hover:bg-slate-50">
//       <td className="p-4">
//         <div className="flex items-center">
//           <span className="text-slate-800">{integration.name}</span>
//           {integration.hasDocumentation && (
//             <span className="ml-2 text-blue-600 text-sm">(Documentation)</span>
//           )}
//         </div>
//       </td>

//       <td className="p-4">
//         <span className={integration.statusColor}>{integration.status}</span>
//       </td>

//       <td className="p-4">
//         {integration.status === "Connected" ? (
//           <Button
//             className="bg-red-600 hover:bg-red-700 text-white px-6 py-2"
//             onClick={async () => {
//               try {
//                 const token = Cookies.get("Token") || ""
//                 let deleteUrl = ""

//                 if (integration.key === "clover") {
//                   deleteUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/integrations/crm-integrations/clover/`
//                 } else if (integration.key === "accesse11") {
//                   deleteUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/integrations/crm-integrations/accesse11/`
//                 }

//                 if (!deleteUrl) return

//                 const res = await fetch(deleteUrl, {
//                   method: "DELETE",
//                   headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Token ${token}`,
//                   },
//                 })

//                 if (!res.ok) throw new Error("Failed to disconnect")

//                 // ✅ Update status in UI
//                 setIntegrations((prev) =>
//                   prev.map((item) =>
//                     item.key === integration.key
//                       ? { ...item, status: "Not Connected", statusColor: "text-orange-600" }
//                       : item
//                   )
//                 )
//               } catch (error) {
//                 console.error("Error disconnecting integration:", error)
//               }
//             }}
//           >
//             Disconnect
//           </Button>
//         ) : (
//           <Button
//             className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
//             onClick={() => handleConnect(integration)}
//           >
//             {integration.status === "Not Connected" ? "Connect" : "Reconnect"}
//           </Button>
//         )}
//       </td>
//     </tr>
//   ))}
// </tbody>

//           </table>
//         </div>
//       </div>

//       {/* Accesse11 Modal */}
//       <Dialog open={isAccesseModalOpen} onOpenChange={setIsAccesseModalOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Connect Accesse11</DialogTitle>
//           </DialogHeader>

//           <div className="space-y-4">
//             <div>
//               <Label htmlFor="username">Username</Label>
//               <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username" />
//             </div>
//             <div>
//               <Label htmlFor="password">Password</Label>
//               <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" />
//             </div>
//           </div>

//           <DialogFooter>
//             <Button className="bg-slate-500 hover:bg-slate-600 text-white" onClick={() => setIsAccesseModalOpen(false)}>
//               Cancel
//             </Button>
//             <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleAccesseSubmit}>
//               Connect
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }



"use client"


import { Button } from "@/components/ui/button"
import React, { useState, useEffect } from "react"
import Cookies from "js-cookie"
import { usePathname } from "next/navigation"
import { useToast } from "@/hooks/use-toast"


import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link2, CheckCircle2, XCircle, Loader2, MapPin } from "lucide-react"


// 🔹 Mapping between backend integration_name and frontend keys
const integrationKeyMap: Record<string, string> = {
  "leadconnector (ghl) v2 - standard": "ghl-standard",
  "leadconnector (ghl) v2 - whitelabel": "ghl-whitelabel",
  hubspot: "hubspot",
  google: "google",
  "microsoft - delegated": "ms-delegated",
  "microsoft - admin": "ms-admin",
  salesforce: "salesforce",
  accesse11: "accesse11",
  clover: "clover",
}


export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<any[]>([
    // { key: "ghl-standard", name: "Leadconnector (GHL) v2 - Standard", status: "Not Connected", statusColor: "text-orange-600" },
    // { key: "ghl-whitelabel", name: "Leadconnector (GHL) v2 - Whitelabel", status: "Not Connected", statusColor: "text-orange-600" },
    // { key: "hubspot", name: "Hubspot", status: "Not Connected", statusColor: "text-orange-600" },
    // { key: "google", name: "Google", status: "Not Connected", statusColor: "text-orange-600" },
    // { key: "ms-delegated", name: "Microsoft - Delegated", status: "Not Connected", statusColor: "text-orange-600" },
    { key: "facebook", name: "Facebook", status: "Not Connected", statusColor: "text-orange-600" },
    { 
    key: "salesforce", 
    name: "Salesforce", 
    status: "Not Connected", 
    statusColor: "text-orange-600",
    hasDocumentation: true,
    apiUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/integrations/salesforce/connect/`,
  },
    { key: "accesse11", name: "Accesse 11", status: "Not Connected", statusColor: "text-orange-600", apiUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/integrations/accesse11/connect/`, requiresCredentials: true },
    { key: "clover", name: "Clover", status: "Not Connected", statusColor: "text-orange-600", apiUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/integrations/clover/connect/` },
    {
      key: "kitchenhub",
      name: "KitchenHub",
      status: "-------", 
      statusColor: "text-grey-600",
      isKitchenHub: true
    }


  ])


  const [isAccesseModalOpen, setIsAccesseModalOpen] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [currentIntegration, setCurrentIntegration] = useState<any>(null)
  const [isFacebookModalOpen, setIsFacebookModalOpen] = useState(false)
  const [agents, setAgents] = useState<any[]>([])
  const [loadingAgents, setLoadingAgents] = useState(false)


  const [isKitchenHubModalOpen, setIsKitchenHubModalOpen] = useState(false)
  const [kitchenHubItems, setKitchenHubItems] = useState<any[]>([])
  const [loadingKitchenHub, setLoadingKitchenHub] = useState(false)



  const { toast } = useToast()


  const pathname = usePathname()
  const [hasTwilioPhones, setHasTwilioPhones] = useState<boolean | null>(null)


  // 🔹 Check if Twilio phone numbers exist
  useEffect(() => {
    const checkTwilioPhones = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/public/company/get-twilio-phones`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${Cookies.get("Token") || ""}`,
          },
        })
        
        const data = await res.json()
        if (Array.isArray(data.twilio_phone_numbers) && data.twilio_phone_numbers.length > 0) {
          setHasTwilioPhones(true)
        } else {
          setHasTwilioPhones(false)
          toast({ description: "No Twilio phones found. Please assign one first.", variant: "destructive" })
        }
      } catch (error) {
        console.error("Error checking Twilio phones:", error)
        toast({ description: "Error checking Twilio phones.", variant: "destructive" })
        setHasTwilioPhones(false)
      }
    }


    checkTwilioPhones()
  }, [])


  // 🔹 Fetch connected integrations whenever user navigates to this page
  useEffect(() => {
    const fetchIntegrations = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/integrations/crm-integrations/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${Cookies.get("Token") || ""}`,
          },
        })


        if (!res.ok) throw new Error("Failed to fetch integrations")
        const data = await res.json()
      console.log("Fetched integrations:", data)


        const connectedKeys = data
          .filter((item: any) => item.status === "active")
          .map((item: any) => integrationKeyMap[item.crm_type.toLowerCase()] || item.crm_type.toLowerCase())


        setIntegrations((prev) =>
  prev.map((integration) => {
    if (integration.key === "kitchenhub") {
      return { 
        ...integration, 
        status: "----------------", 
        statusColor: "text-grey-600" 
      }
    }


    return {
      ...integration,
      status: connectedKeys.includes(integration.key) ? "Connected" : "Not Connected",
      statusColor: connectedKeys.includes(integration.key) ? "text-green-600" : "text-orange-600",
    }
  })
)


      } catch (error) {
        console.error("Error fetching integrations:", error)
        toast({ description: "Failed to fetch integrations.", variant: "destructive" })
      }
    }


    fetchIntegrations()
  }, [pathname])


  // 🔹 Handle connect button click
  const handleConnect = async (integration: any) => {
  
    if (integration.key === "salesforce") {
    try {
      const token = Cookies.get("Token") || ""


      const resp = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/integrations/salesforce/connect/`,
        {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      )


      if (!resp.ok) {
        throw new Error("Failed to get Salesforce auth URL")
      }


      const data = await resp.json()
      
      if (data.auth_url) {
        window.location.href = data.auth_url
      } else {
        toast({
          description: "Failed to get Salesforce auth URL.",
          variant: "destructive",
        })
      }
      return
    } catch (error) {
      console.error("Salesforce connection error:", error)
      toast({
        description: "Failed to connect Salesforce.",
        variant: "destructive",
      })
      return
    }
  }



    if (integration.key === "facebook") {
      setIsFacebookModalOpen(true)
      fetchAgentsForFacebook()
      return
    }




    if (integration.requiresCredentials) {
      setCurrentIntegration(integration)
      setIsAccesseModalOpen(true)
      return
    }


    if (!integration.apiUrl) {
      toast({ description: `No API configured for ${integration.name}.`, variant: "destructive" })
      return
    }


    try {
      const token = Cookies.get("Token") || ""
      const res = await fetch(integration.apiUrl, {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      })


      const data = await res.json()
      if (!res.ok) {
        toast({ description: `Failed to connect ${integration.name}.`, variant: "destructive" })
        return
      }


      if (data.url) {
        window.location.href = data.url
      } else {
        toast({ description: "No URL returned from backend.", variant: "destructive" })
      }
    } catch (error) {
      console.error("Error connecting integration:", error)
      toast({ description: `Error connecting ${integration.name}.`, variant: "destructive" })
    }
  }


  const openKitchenHubModal = async () => {
  try {
    setLoadingKitchenHub(true)
    const token = Cookies.get("Token") || ""


    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/integrations/kitchenhub/kitchenhub_integrations/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`
      }
    })


    const data = await res.json()


    if (!Array.isArray(data)) {
      toast({ description: "Invalid response.", variant: "destructive" })
      return
    }


    setKitchenHubItems(data)
    setIsKitchenHubModalOpen(true)
  } catch (error) {
    toast({ description: "Failed to fetch KitchenHub details.", variant: "destructive" })
  } finally {
    setLoadingKitchenHub(false)
  }
}



const updateKitchenHubField = (id: number, field: string, value: any) => {
  setKitchenHubItems(prev =>
    prev.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    )
  )
}


const saveKitchenHubItem = async (item: any) => {
  try {
    const token = Cookies.get("Token") || ""
    const res = await fetch(`https://apii.pentagonai.co/api/integrations/kitchenhub/kitchenhub_integrations/${item.id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`
      },
      body: JSON.stringify({
        location: item.location,
        provider_store_id: item.provider_store_id,
        provider: item.provider,
        status: item.status
      })
    })


    if (!res.ok) throw new Error()


    toast({ description: "KitchenHub updated successfully!" })
  } catch (err) {
    toast({ description: "Failed to update KitchenHub.", variant: "destructive" })
  }
}



  // 🔹 Submit Accesse11 credentials
const handleAccesseSubmit = async () => {
  if (!currentIntegration?.apiUrl) return


  try {
    const token = Cookies.get("Token") || ""
    const res = await fetch(currentIntegration.apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })


    const data = await res.json()
    console.log("Accesse11 connection response:", data)


    // 🔹 Prevent marking as connected if backend returns login failure
    if (data?.error?.includes("AccessE11 login failed")) {
      toast({ description: "Invalid Accesse11 credentials. Please try again.", variant: "destructive" })
      return
    }


    if (!res.ok) {
      console.log("Error status code")
      toast({ description: "Failed to connect Accesse11.", variant: "destructive" })
      return
    }


    // ✅ Only update if no error
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.key === "accesse11"
          ? { ...integration, status: "Connected", statusColor: "text-green-600" }
          : integration
      )
    )
    toast({ description: "Accesse11 connected successfully!" })
  } catch (error) {
    console.error("Error connecting Accesse11:", error)
    toast({ description: "Error connecting Accesse11.", variant: "destructive" })
  } finally {
    setIsAccesseModalOpen(false)
    setUsername("")
    setPassword("")
  }
}



const fetchAgentsForFacebook = async () => {
  try {
    setLoadingAgents(true)
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/agents/agents/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${Cookies.get("Token") || ""}`,
      },
    })
    const data = await res.json()
    setAgents(Array.isArray(data) ? data : [])
  } catch (error) {
    console.error("Error fetching agents:", error)
    toast({ description: "Failed to fetch agents", variant: "destructive" })
  } finally {
    setLoadingAgents(false)
  }
}



const handleFacebookConnect = async (agentId: number) => {
  try {
    const token = Cookies.get("Token") || ""
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/integrations/facebook/connect/?agent_id=${agentId}`,
      {
        headers: { Authorization: `Token ${token}` },
      }
    )


    const data = await res.json()


    if (!res.ok) throw new Error(data.detail || "Failed to connect Facebook")


    // ✅ If an auth URL exists, redirect the user
    if (data.auth_url) {
      console.log(data.auth_url)
      window.location.href = data.auth_url
      return
    }


    // (Fallback toast if the API didn't return an auth URL)
    toast({ description: `Facebook connected for Agent ${agentId}!` })
    setIsFacebookModalOpen(false)
  } catch (error: any) {
    console.error(error)
    toast({
      description: error.message || "Error connecting Facebook",
      variant: "destructive",
    })
  }
}

  const connectedCount = integrations.filter(i => i.status === "Connected").length
  const totalIntegrations = integrations.filter(i => !i.isKitchenHub).length

  if (hasTwilioPhones === null) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--canvas)" }} className="flex items-center justify-center">
        <div className="text-center space-y-4">
          <div style={{ width: 48, height: 48, borderRadius: "50%", border: "3px solid var(--border-1)", borderTopColor: "var(--signal)", animation: "spin 0.8s linear infinite" }} className="mx-auto" />
          <p className="text-slate-600 font-light tracking-wide">Loading integrations...</p>
        </div>
      </div>
    )
  }


  return (
    <div style={{ minHeight: "100vh", background: "var(--canvas)" }}>
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b" style={{ background: "var(--paper)", borderColor: "var(--border-1)" }}>

        <div className="relative max-w-7xl mx-auto px-8 py-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-1 h-20 rounded-full" style={{ background: "var(--ink)" }}></div>
            <div>
              <h1 className="text-5xl font-extralight tracking-tight text-slate-900 mb-2">
                Integrations
              </h1>
              <p className="text-lg text-slate-500 font-light tracking-wide">
                Connect your external services and manage API integrations
              </p>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
            <div className="group bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-slate-300 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-[var(--ink)] group-hover:scale-110 transition-all duration-300">
                  <Link2 className="w-6 h-6 text-slate-600 group-hover:text-white transition-colors duration-300" />
                </div>
              </div>
              <p className="text-3xl font-light text-slate-900 mb-1">{totalIntegrations}</p>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-light">Total Integrations</p>
            </div>

            <div className="group bg-white border border-[var(--border-1)] rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300" style={{ background: "var(--sage-bg)" }}>
                  <CheckCircle2 className="w-6 h-6" style={{ color: "var(--sage-ink)" }} />
                </div>
                <div className="px-2 py-1 rounded-full text-xs font-medium" style={{ background: "var(--success-soft)", color: "var(--success)" }}>
                  {totalIntegrations > 0 ? Math.round((connectedCount / totalIntegrations) * 100) : 0}%
                </div>
              </div>
              <p className="text-3xl font-light text-slate-900 mb-1">{connectedCount}</p>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-light">Connected</p>
            </div>

            <div className="group bg-white border border-[var(--border-1)] rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300" style={{ background: "var(--butter-bg)" }}>
                  <XCircle className="w-6 h-6" style={{ color: "var(--butter-ink)" }} />
                </div>
                <div className="px-2 py-1 rounded-full text-xs font-medium" style={{ background: "var(--butter-bg)", color: "var(--butter-ink)" }}>
                  {totalIntegrations > 0 ? Math.round(((totalIntegrations - connectedCount) / totalIntegrations) * 100) : 0}%
                </div>
              </div>
              <p className="text-3xl font-light text-slate-900 mb-1">{totalIntegrations - connectedCount}</p>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-light">Not Connected</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {hasTwilioPhones && (
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="px-8 py-5 border-b border-slate-200" style={{ background: "var(--graphite-50)" }}>
              <div className="grid grid-cols-12 gap-4 text-xs font-medium text-slate-600 uppercase tracking-wider">
                <div className="col-span-4">Integration</div>
                <div className="col-span-3">Status</div>
                <div className="col-span-5 text-right">Action</div>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {integrations.map((integration, index) => (
                <div
                  key={index}
                  className="relative px-8 py-6 hover:bg-slate-50/50 transition-all duration-200 group border-l-4 border-transparent hover:border-[var(--border-2)]"
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-slate-200 transition-all duration-200">
                          <Link2 className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                          <p className="text-sm font-light text-slate-900">{integration.name}</p>
                          {integration.hasDocumentation && (
                            <span className="text-xs font-light" style={{ color: "var(--signal-ink)" }}>Documentation</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="col-span-3">
                      <span style={
                        integration.status === "Connected"
                          ? { background: "var(--success-soft)", color: "var(--success)", border: "1px solid var(--success)", borderRadius: "var(--radius-pill)", padding: "2px 10px", fontSize: 12, fontWeight: 400 }
                          : integration.isKitchenHub
                          ? { background: "var(--graphite-50)", color: "var(--fg-3)", border: "1px solid var(--border-1)", borderRadius: "var(--radius-pill)", padding: "2px 10px", fontSize: 12 }
                          : { background: "var(--butter-bg)", color: "var(--butter-ink)", border: "1px solid var(--butter-ink)", borderRadius: "var(--radius-pill)", padding: "2px 10px", fontSize: 12, fontWeight: 400 }
                      }>
                        {integration.status}
                      </span>
                    </div>

                    <div className="col-span-5 flex justify-end">
                      {integration.isKitchenHub ? (
                        <button
                          className="rounded-xl text-sm font-light flex items-center gap-2"
                          style={{ background: "var(--signal)", color: "white", padding: "8px 16px", border: "none", cursor: "pointer" }}
                          onClick={() => openKitchenHubModal(integration)}
                        >
                          <MapPin className="w-4 h-4" />
                          Location
                        </button>
                      ) : integration.status === "Connected" ? (
                        <button
                          style={{ background: "var(--danger)", color: "white", padding: "8px 16px", borderRadius: "var(--radius-md)", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 400 }}
                          onClick={async () => {
                            try {
                              const token = Cookies.get("Token") || ""
                              let deleteUrl = ""


                              if (integration.key === "clover") {
                                deleteUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/integrations/crm-integrations/clover/`
                              } else if (integration.key === "accesse11") {
                                deleteUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/integrations/crm-integrations/accesse11/`
                              }
                              else if (integration.key === "salesforce") {
                            deleteUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/integrations/salesforce/disconnect/`
                          }


                              if (!deleteUrl) {
                                toast({ description: "No disconnect endpoint found.", variant: "destructive" })
                                return
                              }


                              const res = await fetch(deleteUrl, {
                                method: "DELETE",
                                headers: {
                                  "Content-Type": "application/json",
                                  Authorization: `Token ${token}`,
                                },
                              })


                              if (!res.ok) throw new Error("Failed to disconnect")


                              setIntegrations((prev) =>
                                prev.map((item) =>
                                  item.key === integration.key
                                    ? { ...item, status: "Not Connected", statusColor: "text-orange-600" }
                                    : item
                                )
                              )
                              toast({ description: `${integration.name} disconnected successfully.` })
                            } catch (error) {
                              console.error("Error disconnecting integration:", error)
                              toast({ description: `Error disconnecting ${integration.name}.`, variant: "destructive" })
                            }
                          }}
                        >
                          Disconnect
                        </button>
                      ) : (
                        <button
                          style={{ background: "var(--signal)", color: "white", padding: "8px 16px", borderRadius: "var(--radius-md)", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 400 }}
                          onClick={() => handleConnect(integration)}
                        >
                          {integration.status === "Not Connected" ? "Connect" : "Reconnect"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* KitchenHub Modal */}
      <Dialog open={isKitchenHubModalOpen} onOpenChange={setIsKitchenHubModalOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-light text-slate-900">KitchenHub Integrations</DialogTitle>
          </DialogHeader>


          {loadingKitchenHub ? (
            <div className="py-10 text-center text-slate-500 font-light">Loading...</div>
          ) : (
            <div className="space-y-6 overflow-y-auto pr-2 max-h-[calc(85vh-200px)]">
              {kitchenHubItems.map((item) => (
                <div
                  key={item.id}
                  className="border border-slate-200 p-6 rounded-2xl bg-slate-50 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <h3 className="font-light text-lg mb-4 text-slate-700">
                    Location #{item.id}
                  </h3>


                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


                    {/* Editable Location */}
                    <div className="space-y-2">
                      <Label className="text-sm font-light text-slate-700">Location</Label>
                      <Input
                        value={item.location}
                        onChange={(e) =>
                          updateKitchenHubField(item.id, "location", e.target.value)
                        }
                        placeholder="Enter location"
                        className="rounded-xl border-slate-200"
                      />
                    </div>


                    {/* Read-only Provider */}
                    <div className="space-y-2">
                      <Label className="text-sm font-light text-slate-700">Provider</Label>
                      <Input value={item.provider} disabled className="rounded-xl border-slate-200 bg-slate-100" />
                    </div>


                    {/* Read-only Provider Store ID */}
                    <div className="space-y-2">
                      <Label className="text-sm font-light text-slate-700">Provider Store ID</Label>
                      <Input value={item.provider_store_id} disabled className="rounded-xl border-slate-200 bg-slate-100" />
                    </div>


                    {/* Read-only Status */}
                    <div className="space-y-2">
                      <Label className="text-sm font-light text-slate-700">Status</Label>
                      <Input value={item.status} disabled className="rounded-xl border-slate-200 bg-slate-100" />
                    </div>


                  </div>


                  <button
                    className="mt-4 rounded-xl text-sm font-light"
                    style={{ background: "var(--signal)", color: "white", padding: "8px 16px", border: "none", cursor: "pointer" }}
                    onClick={() => saveKitchenHubItem(item)}
                  >
                    Save Changes
                  </button>
                </div>
              ))}
            </div>
          )}


          <DialogFooter>
            <button
              className="rounded-xl text-sm font-light"
              style={{ background: "var(--graphite-50)", color: "var(--fg-2)", border: "1px solid var(--border-1)", padding: "8px 16px", cursor: "pointer" }}
              onClick={() => setIsKitchenHubModalOpen(false)}
            >
              Close
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {/* Facebook Agent Selection Modal */}
      <Dialog open={isFacebookModalOpen} onOpenChange={setIsFacebookModalOpen}>
        <DialogContent className="max-w-4xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-light text-slate-900">Select Agent to Connect Facebook</DialogTitle>
          </DialogHeader>


          {loadingAgents ? (
            <div className="flex items-center justify-center py-10 text-slate-500 font-light">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              Loading agents...
            </div>
          ) : agents.length === 0 ? (
            <div className="text-center text-slate-500 italic py-10 font-light">No agents found</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className="border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-200 bg-white"
                >
                  <h3 className="font-light text-lg text-slate-800 mb-2">{agent.name}</h3>
                  <p className="text-sm text-slate-500 font-light mb-4">
                    {agent.persona || "No persona"}
                  </p>
                  <button
                    style={{ background: "var(--signal)", color: "white", width: "100%", padding: "8px 16px", borderRadius: "var(--radius-md)", border: "none", cursor: "pointer", fontSize: 14 }}
                    onClick={() => handleFacebookConnect(agent.id)}
                  >
                    Connect
                  </button>
                </div>
              ))}
            </div>
          )}


          <DialogFooter>
            <button
              className="mt-4 rounded-xl text-sm font-light"
              style={{ background: "var(--graphite-50)", color: "var(--fg-2)", border: "1px solid var(--border-1)", padding: "8px 16px", cursor: "pointer" }}
              onClick={() => setIsFacebookModalOpen(false)}
            >
              Close
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {/* Accesse11 Modal */}
      <Dialog open={isAccesseModalOpen} onOpenChange={setIsAccesseModalOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-light text-slate-900">Connect Accesse11</DialogTitle>
          </DialogHeader>


          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-light text-slate-700">Username</Label>
              <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username" className="rounded-xl border-slate-200" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-light text-slate-700">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" className="rounded-xl border-slate-200" />
            </div>
          </div>


          <DialogFooter className="flex gap-2">
            <button className="rounded-xl text-sm font-light" style={{ background: "var(--graphite-50)", color: "var(--fg-2)", border: "1px solid var(--border-1)", padding: "8px 16px", cursor: "pointer" }} onClick={() => setIsAccesseModalOpen(false)}>
              Cancel
            </button>
            <button className="rounded-xl text-sm font-light" style={{ background: "var(--signal)", color: "white", padding: "8px 16px", border: "none", cursor: "pointer" }} onClick={handleAccesseSubmit}>
              Connect
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}






// "use client"

// import { Button } from "@/components/ui/button"
// import React from "react"
// import Cookies from "js-cookie"

// const integrations = [
//   {
//     name: "Leadconnector (GHL) v2 - Standard",
//     status: "Not Connected",
//     statusColor: "text-orange-600",
//   },
//   {
//     name: "Leadconnector (GHL) v2 - Whitelabel",
//     status: "Not Connected",
//     statusColor: "text-orange-600",
//   },
//   {
//     name: "Hubspot",
//     status: "Not Connected",
//     statusColor: "text-orange-600",
//   },
//   {
//     name: "Google",
//     status: "Not Connected",
//     statusColor: "text-orange-600",
//   },
//   {
//     name: "Microsoft - Delegated",
//     status: "Not Connected",
//     statusColor: "text-orange-600",
//   },
//   {
//     name: "Microsoft - Admin",
//     status: "Not Connected",
//     statusColor: "text-orange-600",
//   },
//   {
//     name: "Salesforce",
//     status: "Not Connected",
//     statusColor: "text-orange-600",
//     hasDocumentation: true,
//   },
//   {
//     name: "Accesse 11",
//     status: "Not Connected",
//     statusColor: "text-orange-600",
//     apiUrl: "https://apii.pentagonai.co/api/integrations/accesse11/connect/",
//   },
//   {
//     name: "Clover",
//     status: "Not Connected",
//     statusColor: "text-orange-600",
//     apiUrl: "https://apii.pentagonai.co/api/integrations/clover/connect/",
//   },
// ]

// export default function IntegrationsPage() {
//   const handleConnect = async (integration: any) => {
//     if (!integration.apiUrl) {
//       console.log(`No API for ${integration.name}`)
//       return
//     }

//     try {
//       const token = Cookies.get("Token") || ""

//       const res = await fetch(integration.apiUrl, {
//         method: "GET",
//         headers: {
//           "Authorization": `Token ${token}`,
//           "Content-Type": "application/json",
//         },
//       })

//       if (!res.ok) {
//         const errorData = await res.json()
//         console.error("Failed to get connect URL", errorData)
//         return
//       }

//       const data = await res.json()
//       if (data.url) {
//         window.location.href = data.url
//       } else {
//         console.error("No URL returned from backend")
//       }
//     } catch (error) {
//       console.error("Error connecting integration:", error)
//     }
//   }
//   return (
//     <div className="p-6 space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <h1 className="text-2xl font-semibold text-slate-800">Integrations</h1>
//       </div>

//       {/* External Integrations Section */}
//       <div className="space-y-4">
//         <h2 className="text-xl font-medium text-slate-700">External Integrations</h2>

//         {/* Integrations Table */}
//         <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
//           <table className="w-full">
//             <thead className="bg-slate-800 text-white">
//               <tr>
//                 <th className="text-left p-4 font-medium">Integration</th>
//                 <th className="text-left p-4 font-medium">Status</th>
//                 <th className="text-left p-4 font-medium">Action</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-200">
//               {integrations.map((integration, index) => (
//                 <tr key={index} className="hover:bg-slate-50">
//                   <td className="p-4">
//                     <div className="flex items-center">
//                       <span className="text-slate-800">{integration.name}</span>
//                       {integration.hasDocumentation && (
//                         <span className="ml-2 text-blue-600 text-sm">(Documentation)</span>
//                       )}
//                     </div>
//                   </td>
//                   <td className="p-4">
//                     <span className={integration.statusColor}>{integration.status}</span>
//                   </td>
//                   <td className="p-4">
//                     <Button
//                       className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
//                       onClick={() => handleConnect(integration)}
//                     >
//                       CONNECT
//                     </Button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   )
// }
