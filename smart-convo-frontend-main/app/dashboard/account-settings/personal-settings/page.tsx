
// "use client"

// import { useEffect, useState } from "react"
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardContent,
// } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Switch } from "@/components/ui/switch"
// import { Label } from "@/components/ui/label"
// import { Input } from "@/components/ui/input"
// import Cookies from "js-cookie"
// import { useToast } from "@/hooks/use-toast"

// export default function PersonalSettings() {
//   const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
//   const [loading, setLoading] = useState(false)
//   const [qrCode, setQrCode] = useState<string | null>(null)
//   const [code, setCode] = useState("")
//   const [verifying, setVerifying] = useState(false)
//   const [initializing, setInitializing] = useState(true)

//   const { toast } = useToast()
//   const token = Cookies.get("Token") || ""
//   // Fetch initial 2FA status
//   useEffect(() => {
//     const fetch2FAStatus = async () => {
//       try {
//         const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/authentication/2fa/status/`, {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Token ${token}`,
//           },
//         })
//         const data = await response.json()
//         console.log(data)
//         setTwoFactorEnabled(data.is_2fa_enabled || false)
//       } catch (err) {
//         toast({ title: "Error", description: "Could not fetch 2FA status", variant: "destructive" })
//       } finally {
//         setInitializing(false)
//       }
//     }

//     fetch2FAStatus()
//   }, [token, toast])

//   // Handle toggle switch
//   const handle2FAToggle = async () => {
//     const newValue = !twoFactorEnabled
//     setTwoFactorEnabled(newValue)

//     if (newValue) {
//       // Enabling 2FA
//       setLoading(true)
//       try {
//         const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/authentication/2fa/setup/`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Token ${token}`,
//           },
//         })

//         const data = await response.json()

//         if (!response.ok) {
//           throw new Error(data?.message || "Failed to set up 2FA")
//         }

//         setQrCode(data.qr_code_base64)
//         toast({ title: "QR Code Ready", description: "Scan the code with your Authenticator App." })
//       } catch (err: any) {
//         toast({ title: "Error", description: err.message, variant: "destructive" })
//         setTwoFactorEnabled(false)
//       } finally {
//         setLoading(false)
//       }
//     } else {
//       // Disabling 2FA
//       try {
//         const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/authentication/2fa/disable/`, {
//           method: "DELETE",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Token ${token}`,
//           },
//         })

//         const data = await response.json()

//         if (!response.ok) {
//           throw new Error(data?.message || "Failed to disable 2FA")
//         }

//         toast({ title: "2FA Disabled", description: "Two-Factor Authentication is now off." })
//       } catch (err: any) {
//         toast({ title: "Error", description: err.message, variant: "destructive" })
//         setTwoFactorEnabled(true)
//       }

//       setQrCode(null)
//       setCode("")
//     }
//   }

//   // Handle 6-digit code verification
//   const handleVerifyCode = async () => {
//     if (!code || code.length !== 6) {
//       toast({ title: "Invalid Code", description: "Please enter a valid 6-digit code.", variant: "destructive" })
//       return
//     }

//     setVerifying(true)

//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/authentication/2fa/verify/`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Token ${token}`,
//         },
//         body: JSON.stringify({ token: code }),
//       })

//       const data = await response.json()

//       if (!response.ok) {
//         throw new Error(data?.message || "Invalid code")
//       }

//       toast({ title: "2FA Verified", description: "Two-Factor Authentication is now enabled." })
//       setQrCode(null)
//       setCode("")
//       setTwoFactorEnabled(true)
//     } catch (err: any) {
//       toast({ title: "Verification Failed", description: err.message, variant: "destructive" })
//     } finally {
//       setVerifying(false)
//     }
//   }

//   if (initializing) {
//     return <p className="text-center py-10">Loading Settings...</p>
//   }

//   return (
//     <div className="max-w-2xl mx-auto py-10">
//       <Card>
//         <CardHeader>
//           <CardTitle>Two-Factor Authentication (2FA)</CardTitle>
//           <CardDescription>
//             Secure your account with an extra layer of protection.
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           <div className="flex items-center justify-between">
//             <Label htmlFor="2fa">Enable 2FA</Label>
//             <Switch
//               id="2fa"
//               checked={twoFactorEnabled}
//               onCheckedChange={handle2FAToggle}
//               disabled={loading || verifying}
//             />
//           </div>

//           {loading && <p>Loading QR Code...</p>}

//           {qrCode && (
//             <div className="text-center">
//               <p className="mb-2">Scan this QR code with your Authenticator App:</p>
//               <img
//                 src={`data:image/png;base64,${qrCode}`}
//                 alt="2FA QR Code"
//                 className="mx-auto border p-2 rounded shadow-md"
//               />

//               <div className="mt-6 space-y-4">
//                 <Label htmlFor="code">Enter 6-digit code</Label>
//                 <Input
//                   id="code"
//                   type="text"
//                   maxLength={6}
//                   value={code}
//                   onChange={(e) => setCode(e.target.value)}
//                   placeholder="123456"
//                   className="text-center tracking-widest"
//                 />
//                 <Button onClick={handleVerifyCode} disabled={verifying}>
//                   {verifying ? "Verifying..." : "Verify Code"}
//                 </Button>
//               </div>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   )
// }







"use client"


import { useEffect, useState } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import Cookies from "js-cookie"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Shield, Building2, Mail, Edit3, Save, Play, Sparkles } from "lucide-react"


// Full list of country codes
const COUNTRY_CODES = [
  { code: "+1", name: "United States / Canada" },
  { code: "+44", name: "United Kingdom" },
  { code: "+92", name: "Pakistan" },
  { code: "+91", name: "India" },
  { code: "+81", name: "Japan" },
  { code: "+61", name: "Australia" },
  { code: "+49", name: "Germany" },
  { code: "+33", name: "France" },
  { code: "+39", name: "Italy" },
  { code: "+86", name: "China" },
  { code: "+34", name: "Spain" },
  { code: "+7", name: "Russia" },
  { code: "+55", name: "Brazil" },
  { code: "+27", name: "South Africa" },
  { code: "+82", name: "South Korea" },
  { code: "+31", name: "Netherlands" },
  { code: "+90", name: "Turkey" },
  { code: "+966", name: "Saudi Arabia" },
  { code: "+971", name: "UAE" },
  { code: "+20", name: "Egypt" },
  // ... full world list would continue here
]


interface Company {
  [key: string]: any
}


export default function PersonalSettings() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [loading, setLoading] = useState(false)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [code, setCode] = useState("")
  const [verifying, setVerifying] = useState(false)
  const [initializing, setInitializing] = useState(true)


  const [company, setCompany] = useState<Company | null>(null)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [tempValue, setTempValue] = useState("")
  const [countryCode, setCountryCode] = useState("+1")


  const { toast } = useToast()
  const token = Cookies.get("Token") || ""


  const NON_EDITABLE_FIELDS = [
    "id",
    "plan",
    "status",
    "created_at",
    "updated_at",
    "users",
    "last_login",
    "twilio_phone_numbers",
  ]


  const INDUSTRY_OPTIONS = ["Technology", "Finance", "Healthcare", "Education", "Retail", "municipal services", "Restaurant","Other"]
  const SIZE_OPTIONS = ["1-10", "11-50", "51-200", "201-500", "500+"]


  const router = useRouter()
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL


  const SMTP_FIELDS = [
    "MAIL_DRIVER",
    "MAIL_HOST",
    "MAIL_PORT",
    "MAIL_USERNAME",
    "MAIL_PASSWORD",
    "MAIL_ENCRYPTION",
    "MAIL_FROM_ADDRESS",
    "MAIL_FROM_NAME",
    "mail_config", 
  ]




const handleFinishTutorial = async () => {
  try {
    // 1️⃣ Clear local storage
    localStorage.setItem("tutorial_setup", JSON.stringify([]))


    // 2️⃣ Fire PATCH request to backend
    const response = await fetch(`${BASE_URL}/companies/update_tutorial/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ tutorial_setup: [] }),
    })


    if (!response.ok) throw new Error("Failed to update tutorial progress")


    toast({
      title: "Tutorial Reset",
      description: "Your tutorial progress has been cleared.",
    })


    // 3️⃣ Redirect to dashboard
    setTimeout(() => {
      router.push("/dashboard")
    }, 3000)
  } catch (err: any) {
    console.error("Error resetting tutorial:", err)
    toast({
      title: "Error",
      description: err.message || "Something went wrong resetting the tutorial.",
      variant: "destructive",
    })
  }
}



  // Fetch 2FA + Company data
  useEffect(() => {
    const fetch2FAStatus = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/authentication/2fa/status/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
          }
        )
        const data = await response.json()
        setTwoFactorEnabled(data.is_2fa_enabled || false)
      } catch {
        toast({
          title: "Error",
          description: "Could not fetch 2FA status",
          variant: "destructive",
        })
      } finally {
        setInitializing(false)
      }
    }


    const fetchCompanyData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/company-users/me/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
          }
        )
        const data = await res.json()
        if (data.mail_config && typeof data.mail_config === 'string') {
      data.mail_config = JSON.parse(data.mail_config);
    }
        console.log("Fetched company data:", data)
        setCompany(data)
      } catch {
        toast({
          title: "Error",
          description: "Failed to fetch company data",
          variant: "destructive",
        })
      }
    }


    fetch2FAStatus()
    fetchCompanyData()
  }, [token, toast])


  // Save edited field with validation
  const handleSaveField = async (field: string) => {
    if (!company) return


    // Validation rules
    if (field === "company_since" && !/^\d+$/.test(tempValue)) {
      toast({ title: "Invalid Input", description: "Company Since must be a number.", variant: "destructive" })
      return
    }
    if (field === "website" && !/^www\.[a-zA-Z0-9-]+\.[a-z]{2,}$/.test(tempValue)) {
      toast({ title: "Invalid Website", description: "Website must be in format www.xyz.com", variant: "destructive" })
      return
    }
    if (field === "phone_number") {
      if (!/^\d{6,15}$/.test(tempValue)) {
        toast({ title: "Invalid Phone", description: "Phone number must be 6–15 digits.", variant: "destructive" })
        return
      }
    }


    try {
      const updated = { ...company, [field]: field === "phone_number" ? `${countryCode}${tempValue}` : tempValue }
      setCompany(updated)


      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/company-users/me/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({ [field]: updated[field] }),
        }
      )


      if (!res.ok) throw new Error("Failed to update company")


      toast({
        title: "Updated",
        description: `${field.replace("_", " ")} updated successfully.`,
      })
      setEditingField(null)
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      })
    }
  }


  // Toggle 2FA
  const handle2FAToggle = async () => {
    const newValue = !twoFactorEnabled
    setTwoFactorEnabled(newValue)


    if (newValue) {
      setLoading(true)
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/authentication/2fa/setup/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
          }
        )
        const data = await response.json()
        if (!response.ok) throw new Error(data?.message || "Failed to set up 2FA")
        setQrCode(data.qr_code_base64)
        toast({
          title: "QR Code Ready",
          description: "Scan the code with your Authenticator App.",
        })
      } catch (err: any) {
        toast({ title: "Error", description: err.message, variant: "destructive" })
        setTwoFactorEnabled(false)
      } finally {
        setLoading(false)
      }
    } else {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/authentication/2fa/disable/`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
          }
        )
        const data = await response.json()
        if (!response.ok) throw new Error(data?.message || "Failed to disable 2FA")
        toast({ title: "2FA Disabled", description: "Two-Factor Authentication is now off." })
      } catch (err: any) {
        toast({ title: "Error", description: err.message, variant: "destructive" })
        setTwoFactorEnabled(true)
      }
      setQrCode(null)
      setCode("")
    }
  }


  // Verify 2FA
  const handleVerifyCode = async () => {
    if (!code || code.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter a valid 6-digit code.",
        variant: "destructive",
      })
      return
    }
    setVerifying(true)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/authentication/2fa/verify/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({ token: code }),
        }
      )
      const data = await response.json()
      if (!response.ok) throw new Error(data?.message || "Invalid code")
      toast({ title: "2FA Verified", description: "Two-Factor Authentication is now enabled." })
      setQrCode(null)
      setCode("")
      setTwoFactorEnabled(true)
    } catch (err: any) {
      toast({ title: "Verification Failed", description: err.message, variant: "destructive" })
    } finally {
      setVerifying(false)
    }
  }


  if (initializing) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-slate-900 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-slate-600 font-light tracking-wide">Loading Settings...</p>
        </div>
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Colorless */}
      <div className="relative overflow-hidden bg-white border-b border-slate-200">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-50/50 via-transparent to-slate-50/50"></div>
        
        <div className="relative max-w-5xl mx-auto px-8 py-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4"
          >
            <div className="w-1 h-20 bg-gradient-to-b from-slate-900 via-slate-400 to-slate-200 rounded-full"></div>
            <div>
              <h1 className="text-5xl font-extralight tracking-tight text-slate-900 mb-2">
                Settings
              </h1>
              <p className="text-lg text-slate-500 font-light tracking-wide">
                Manage your account security and company information
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-12 space-y-8">
        {/* 2FA Section - Indigo accent */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-50 to-white px-8 py-6 border-b border-indigo-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-xl font-light text-indigo-900">Two-Factor Authentication</h2>
                  <p className="text-sm text-indigo-600 font-light mt-0.5">
                    Secure your account with an extra layer of protection
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                <Label htmlFor="2fa" className="text-slate-900 font-light">Enable 2FA</Label>
                <Switch
                  id="2fa"
                  checked={twoFactorEnabled}
                  onCheckedChange={handle2FAToggle}
                  disabled={loading || verifying}
                />
              </div>

              {loading && (
                <div className="text-center py-4">
                  <p className="text-indigo-600 font-light animate-pulse">Loading QR Code...</p>
                </div>
              )}

              {qrCode && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-6 bg-indigo-50/50 rounded-2xl p-8 border border-indigo-100"
                >
                  <p className="text-slate-900 font-light">Scan this QR code with your Authenticator App</p>
                  <div className="flex justify-center">
                    <img
                      src={`data:image/png;base64,${qrCode}`}
                      alt="2FA QR Code"
                      className="border-4 border-white shadow-2xl rounded-2xl"
                    />
                  </div>
                  <div className="mt-8 space-y-4 max-w-sm mx-auto">
                    <Label htmlFor="code" className="text-slate-700 font-light">Enter 6-digit code</Label>
                    <Input
                      id="code"
                      type="text"
                      maxLength={6}
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="123456"
                      className="text-center tracking-widest text-2xl font-light bg-white border-indigo-200 rounded-xl h-14 focus:ring-2 focus:ring-indigo-400"
                    />
                    <Button
                      onClick={handleVerifyCode}
                      disabled={verifying}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-12 font-light transition-all duration-200"
                    >
                      {verifying ? "Verifying..." : "Verify Code"}
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Company Data Section - Blue accent */}
        {company && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-white px-8 py-6 border-b border-blue-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-light text-blue-900">Company Information</h2>
                    <p className="text-sm text-blue-600 font-light mt-0.5">
                      Manage and update your company details
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(company)
                    .filter(([field]) =>
                      !NON_EDITABLE_FIELDS.includes(field) &&
                      field !== "tutorial_setup" &&
                      !SMTP_FIELDS.includes(field) // 🚫 remove SMTP fields
                    )
                    .map(([field, value]) => (
                      <div
                        key={field}
                        className="p-5 bg-blue-50/30 rounded-2xl border border-blue-100 hover:border-blue-200 transition-all duration-200"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <p className="text-sm font-medium text-blue-900 capitalize">
                            {field.replace("_", " ")}
                          </p>
                          {editingField === field ? (
                            <Button
                              size="sm"
                              onClick={() => handleSaveField(field)}
                              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-3 h-8 font-light flex items-center gap-1"
                            >
                              <Save className="w-3 h-3" />
                              Save
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setEditingField(field)
                                setTempValue(String(value))
                              }}
                              className="text-blue-700 hover:bg-blue-100 rounded-lg px-3 h-8 font-light flex items-center gap-1"
                            >
                              <Edit3 className="w-3 h-3" />
                              Edit
                            </Button>
                          )}
                        </div>

                        {editingField === field ? (
                          field === "industry" ? (
                            <select
                              value={tempValue}
                              onChange={(e) => setTempValue(e.target.value)}
                              className="w-full border border-blue-200 rounded-xl bg-white p-2.5 font-light text-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                            >
                              {INDUSTRY_OPTIONS.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          ) : field === "company_size" ? (
                            <select
                              value={tempValue}
                              onChange={(e) => setTempValue(e.target.value)}
                              className="w-full border border-blue-200 rounded-xl bg-white p-2.5 font-light text-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                            >
                              {SIZE_OPTIONS.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          ) : field === "phone_number" ? (
                            <div className="space-y-2">
                              <select
                                value={countryCode}
                                onChange={(e) => setCountryCode(e.target.value)}
                                className="w-full border border-blue-200 rounded-xl bg-white p-2.5 font-light text-sm"
                              >
                                {COUNTRY_CODES.map((c) => (
                                  <option key={c.code} value={c.code}>{c.name} ({c.code})</option>
                                ))}
                              </select>
                              <Input
                                value={tempValue}
                                onChange={(e) => setTempValue(e.target.value)}
                                placeholder="Phone number"
                                className="bg-white border-blue-200 rounded-xl font-light text-sm"
                              />
                            </div>
                          ) : (
                            <Input
                              value={tempValue}
                              onChange={(e) => setTempValue(e.target.value)}
                              className="bg-white border-blue-200 rounded-xl font-light text-sm"
                            />
                          )
                        ) : (
                          <p className="text-slate-900 font-light text-sm">{String(value) || "—"}</p>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* SMTP Section - Emerald accent */}
        {company && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-50 to-white px-8 py-6 border-b border-emerald-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <Mail className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-light text-emerald-900">SMTP Configuration</h2>
                    <p className="text-sm text-emerald-600 font-light mt-0.5">
                      Email delivery settings for your workspace
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(company)
                    .filter(([field]) => SMTP_FIELDS.includes(field))
                    .map(([field, value]) => (
                      <div
                        key={field}
                        className="p-5 bg-emerald-50/30 rounded-2xl border border-emerald-100 hover:border-emerald-200 transition-all duration-200"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <p className="text-sm font-medium text-emerald-900 capitalize">
                            {field.replaceAll("_", " ")}
                          </p>
                          {editingField === field ? (
                            <Button
                              size="sm"
                              onClick={() => handleSaveField(field)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-3 h-8 font-light flex items-center gap-1"
                            >
                              <Save className="w-3 h-3" />
                              Save
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setEditingField(field)
                                setTempValue(String(value))
                              }}
                              className="text-emerald-700 hover:bg-emerald-100 rounded-lg px-3 h-8 font-light flex items-center gap-1"
                            >
                              <Edit3 className="w-3 h-3" />
                              Edit
                            </Button>
                          )}
                        </div>

                        {editingField === field ? (
                          <Input
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            className="bg-white border-emerald-200 rounded-xl font-light text-sm"
                          />
                        ) : (
                          <p className="text-slate-900 font-light text-sm break-all">{String(value) || "—"}</p>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tutorial Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-center pt-8"
        >
          <Button
            onClick={handleFinishTutorial}
            className="group bg-slate-900 hover:bg-slate-800 text-white px-8 py-6 rounded-2xl shadow-lg font-light text-lg transition-all duration-300 hover:scale-105 flex items-center gap-3"
          >
            <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Watch Tutorial
            <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          </Button>
        </motion.div>

        <div className="mt-16 flex items-center justify-center gap-2">
          <div className="w-1 h-1 bg-slate-300 rounded-full animate-pulse"></div>
          <div className="w-1 h-1 bg-slate-300 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-1 h-1 bg-slate-300 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  )
}
