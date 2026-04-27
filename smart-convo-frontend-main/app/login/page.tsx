// "use client"

// import type React from "react"
// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import Cookies from "js-cookie"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Eye, EyeOff, MessageSquare, Building, User } from "lucide-react"
// import { useAuth } from "@/components/auth-provider"
// import { cn } from "@/lib/utils"

// export default function LoginPage() {
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [showPassword, setShowPassword] = useState(false)
//   const [isLoading, setIsLoading] = useState(false)
//   const [loginType, setLoginType] = useState<"company" | "user">("company") // Default to company login
//   const router = useRouter()
//   const { login } = useAuth()

//   useEffect(() => {
//     // Set initial login type from localStorage if available
//     const storedLoginType = localStorage.getItem("loginType")
//     if (storedLoginType === "user" || storedLoginType === "company") {
//       setLoginType(storedLoginType)
//     }
//   }, [])

//   const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault()
//   setIsLoading(true)

//   try {

//     const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/login/`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         email,
//         password,
//       }),
//     })
    
//     const data = await response.json()
//     console.log("Login response:", data)
//     if (!response.ok) {
//       throw new Error(data?.message || "Login failed")
//     }

//     // Check if user is verified
//     console.log(data.token, "User type:", data.last_login, "Login type:", data.user_type)
    
//     if (data.token && data.user_type === "company_user" && !data.previous_last_login) {
//       localStorage.setItem("user", JSON.stringify(data))
//       Cookies.set("Token", data.token, { expires: 7 })
//       router.push("/first-time-setup")
     
//     }

//     else if (data.token && data.user_type === loginType || (data.user_type === "company_user" && loginType === "user")) {
//       // Store login type in localStorage
//       localStorage.setItem("loginType", loginType)
//       Cookies.set("Token", data.token, { expires: 7 })
//       const token = Cookies.get("Token")

//       // Simulate login 
//       login({ email, name: data.name || "John Doe", type: loginType })
      

//       router.push("/dashboard")
//     } else {
//       alert("User not verified or login type mismatch")
//     }
//   } catch (err: any) {
//     console.error("Login error:", err)
//     alert(err.message)
//   } finally {
//     setIsLoading(false)
//   }
// }


//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
//       <Card className="w-full max-w-md shadow-xl border-0">
//         <CardHeader className="space-y-4 text-center">
//           <div className="flex items-center justify-center space-x-2">
//             <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-lg flex items-center justify-center">
//               <MessageSquare className="w-6 h-6 text-white" />
//             </div>
//             <span className="text-2xl font-bold text-slate-800">Smart Convo</span>
//           </div>
//           <div>
//             <CardTitle className="text-2xl text-slate-800">Welcome back</CardTitle>
//             <CardDescription className="text-slate-600">Sign in to your account to continue</CardDescription>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <div className="flex justify-center gap-4 mb-6">
//             <Button
//               variant={loginType === "company" ? "default" : "outline"}
//               onClick={() => setLoginType("company")}
//               className={cn(
//                 "flex-1 h-11",
//                 loginType === "company"
//                   ? "bg-teal-600 hover:bg-teal-700 text-white"
//                   : "border-teal-600 text-teal-600 hover:bg-teal-50",
//               )}
//             >
//               <Building className="mr-2 h-4 w-4" /> Login as Company
//             </Button>
//             <Button
//               variant={loginType === "user" ? "default" : "outline"}
//               onClick={() => setLoginType("user")}
//               className={cn(
//                 "flex-1 h-11",
//                 loginType === "user"
//                   ? "bg-teal-600 hover:bg-teal-700 text-white"
//                   : "border-teal-600 text-teal-600 hover:bg-teal-50",
//               )}
//             >
//               <User className="mr-2 h-4 w-4" /> Login as User
//             </Button>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="email" className="text-slate-700">
//                 {loginType === "company" ? "Company Email" : "User Email"}
//               </Label>
//               <Input
//                 id="email"
//                 type="email"
//                 placeholder={loginType === "company" ? "Enter your company email" : "Enter your user email"}
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 className="h-11"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="password" className="text-slate-700">
//                 Password
//               </Label>
//               <div className="relative">
//                 <Input
//                   id="password"
//                   type={showPassword ? "text" : "password"}
//                   placeholder="Enter your password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                   className="h-11 pr-10"
//                 />
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   size="sm"
//                   className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
//                   onClick={() => setShowPassword(!showPassword)}
//                 >
//                   {showPassword ? (
//                     <EyeOff className="h-4 w-4 text-slate-500" />
//                   ) : (
//                     <Eye className="h-4 w-4 text-slate-500" />
//                   )}
//                 </Button>
//               </div>
//             </div>
//             <div className="flex items-center justify-between">
//               <Link href="/forgot-password" className="text-sm text-teal-600 hover:text-teal-700">
//                 Forgot password?
//               </Link>
//               <Link href="/admin" className="text-sm text-gray-600 hover:text-gray-700">
//                 Admin Login
//               </Link>
//             </div>
//             <Button type="submit" className="w-full h-11 bg-teal-600 hover:bg-teal-700 text-white" disabled={isLoading}>
//               {isLoading ? "Signing in..." : "Sign in"}
//             </Button>
//           </form>
//           <div className="mt-6 text-center">
//             <p className="text-sm text-slate-600">
//               {"Don't have an account? "}
//               <Link href="/signup" className="text-teal-600 hover:text-teal-700 font-medium">
//                 Sign up
//               </Link>
//             </p>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }


"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Cookies from "js-cookie"
import { Eye, EyeOff, Building, User } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"


export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loginType, setLoginType] = useState<"company" | "user">("company")
  const [require2FA, setRequire2FA] = useState(false)
  const [twoFACode, setTwoFACode] = useState("")
  const [verifying2FA, setVerifying2FA] = useState(false)


  const router = useRouter()
  const { login } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const storedLoginType = localStorage.getItem("loginType")
    if (storedLoginType === "user" || storedLoginType === "company") {
      setLoginType(storedLoginType)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsLoading(true)
    try {
     
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await response.json()

      if (data.two_fa_required) {
        Cookies.set("TempToken", data.token, { expires: 0.04 })
        setRequire2FA(true)
        return
      }

      if (!response.ok) {
        throw new Error(data?.message || "Login failed")
      }
      console.log("Login response:", data)
      // Only block when status is explicitly set to something other than "active" (e.g. inactive/suspended). null/undefined means allowed.
      if (data.user_type === "company" && data.status != null && data.status !== "active") {
        toast({
          title: "Login blocked",
          description: "Your company is not active. Please contact support.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      if (data.token && data.user_type === "company_user" && !data.previous_last_login) {
        localStorage.setItem("user", JSON.stringify(data))
        Cookies.set("Token", data.token, { expires: 7 })
        router.push("/first-time-setup")
      } else if (
        data.token &&
        (data.user_type === loginType || (data.user_type === "company_user" && loginType === "user"))
      ) {
        localStorage.setItem("category", data.industry)
        localStorage.setItem("loginType", loginType)
        Cookies.set("Token", data.token, { expires: 7 })
        login({ email, name: data.name || "John Doe", type: loginType })
        if (data.tutorial_setup) {
          localStorage.setItem("tutorial_setup", JSON.stringify(data.tutorial_setup))
          const tutorialSetup = data.tutorial_setup
          
          
          if (!tutorialSetup.includes(1)) {
        
            router.push("/dashboard")
          } else if (
            !tutorialSetup.includes(9) &&
            !tutorialSetup.includes(-1) &&
            !tutorialSetup.includes(2) && tutorialSetup.includes(1)
          ) {
          
           
            router.push("/dashboard/agents")
          } else {
  
            router.push("/dashboard")
          }
        }
        else{
  
          router.push("/dashboard")}
        
      } else {
        toast({
          title: "Login error",
          description: "User not verified or login type mismatch",
          variant: "destructive",
        })
      }
    } catch (err: any) {
      console.error("Login error:", err)
      alert(err.message)
    } finally {
      if (!require2FA) {
    // only stop loading if login failed
        if (!Cookies.get("Token")) {
          setIsLoading(false)
        }
      }
    }
  }

  const handle2FAVerification = async () => {
    setVerifying2FA(true)
    const tempToken = Cookies.get("TempToken")

    if (!twoFACode || twoFACode.length !== 6 || !tempToken) {
      toast({ title: "Invalid code", description: "Please enter a valid 6-digit code", variant: "destructive" })
      setVerifying2FA(false)
      return
    }
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          token: twoFACode,
        }),
      })

      const result = await response.json()
      console.log(result)

      if (!response.ok) {
        throw new Error(result?.message || "Invalid 2FA code")
      }

      toast({ title: "2FA Success", description: "You're now logged in." })

      Cookies.set("Token", tempToken, { expires: 7 })
      Cookies.remove("TempToken")

      if (result.token && result.user_type === "company_user" && !result.previous_last_login) {
        localStorage.setItem("user", JSON.stringify(result))
        Cookies.set("Token", result.token, { expires: 7 })
        router.push("/first-time-setup")
      } else if (
        result.token &&
        (result.user_type === loginType || (result.user_type === "company_user" && loginType === "user"))
      ) {
        localStorage.setItem("loginType", loginType)
        Cookies.set("Token", result.token, { expires: 7 })
        login({ email, name: result.name || "John Doe", type: loginType })
        router.push("/dashboard")
      } else {
        toast({
          title: "Login error",
          description: "User not verified or login type mismatch",
          variant: "destructive",
        })
      }

      // login({ email, name: result.name || "John Doe", type: loginType })
      // router.push("/dashboard")
    } catch (err: any) {
      toast({ title: "2FA Error", description: err.message, variant: "destructive" })
    } finally {
      setVerifying2FA(false)
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
      {/* Background Image */}
      <div
  className="absolute inset-0 bg-cover bg-center opacity-70"
  style={{ backgroundImage: 'url("/agent-bg.jpg")' }}
/>

                            

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-screen px-8">
        <div className="w-full max-w-4xl flex gap-12 items-center">
          {/* Left Panel */}
          <div className="flex-1 text-gray-900">
            <h1 className="text-5xl font-bold mb-6 leading-tight">
  AI VOICE & COMMUNICATION <span className="underline decoration-lime-400">AGENTS</span><br />
  THAT ANSWER EVERY CALL.<br />
</h1>
<p className="text-gray-600 mb-6">
  SmartConvo by Pentagon AI — The Future of<br />
  <span className="text-primary">Customer Communication</span>
</p>

            
            <Link href="/signup" className="text-gray-900 font-medium border-b-2 border-gray-900 hover:border-lime-400 transition">
              Create account →
            </Link>
          </div>

          {/* Right Panel */}
          <div className="w-[420px]">
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
              <h2 className="text-2xl font-semibold text-center text-gray-900 mb-6">
                Login to your account
              </h2>

              {/* Toggle Login Type */}
              <div className="flex justify-center gap-4 mb-6">
                <Button
                  type="button"
                  onClick={() => setLoginType("company")}
                  className={cn(
                    "flex-1 h-10 rounded-full transition",
                    loginType === "company" ? "bg-black text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  <Building className="mr-2 h-4 w-4" /> Company
                </Button>
                <Button
                  type="button"
                  onClick={() => setLoginType("user")}
                  className={cn(
                    "flex-1 h-10 rounded-full transition",
                    loginType === "user" ? "bg-black text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  <User className="mr-2 h-4 w-4" /> User
                </Button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-gray-700 text-sm">
                    {loginType === "company" ? "Company Email" : "User Email"}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="text-gray-700 text-sm">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 pr-10 focus:ring-2 focus:ring-black"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2">
                    {/* <input type="checkbox" className="w-4 h-4 border-gray-300 rounded" />
                    Remember me */}
                  </label>
                  <Link href="/forgot-password" className="text-gray-500 hover:text-gray-700">
                    Forgot password?
                  </Link>
                </div>

                {!require2FA ? (
                  <Button type="submit" disabled={isLoading} className="w-full h-11 bg-black hover:bg-gray-800 text-white rounded-xl">
                    {isLoading ? "Signing in..." : "Sign in"}
                  </Button>
                ) : (
                  <>
                    <div>
                      <Label htmlFor="2fa" className="text-gray-700 text-sm">Two-Factor Code</Label>
                      <Input
                        id="2fa"
                        type="text"
                        maxLength={6}
                        value={twoFACode}
                        onChange={(e) => setTwoFACode(e.target.value)}
                        placeholder="Enter 6-digit code"
                        className="w-full px-4 py-3 text-center tracking-widest rounded-xl border border-gray-200 focus:ring-2 focus:ring-black"
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={handle2FAVerification}
                      disabled={verifying2FA || twoFACode.length !== 6}
                      className="w-full h-11 bg-black hover:bg-gray-800 text-white rounded-xl"
                    >
                      {verifying2FA ? "Verifying..." : "Verify Code"}
                    </Button>
                  </>
                )}
              </form>

              <div className="mt-6 text-center text-sm text-gray-600">
                Don’t have an account?{" "}
                <Link href="/signup" className="text-black font-medium hover:underline">
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}




// "use client"

// import type React from "react"
// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import Cookies from "js-cookie"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Eye, EyeOff, MessageSquare, Building, User } from "lucide-react"
// import { useAuth } from "@/components/auth-provider"
// import { cn } from "@/lib/utils"
// import { toast } from "@/components/ui/use-toast"

// export default function LoginPage() {
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [showPassword, setShowPassword] = useState(false)
//   const [isLoading, setIsLoading] = useState(false)
//   const [loginType, setLoginType] = useState<"company" | "user">("company")
//   const [show2FAModal, setShow2FAModal] = useState(false)
//   const [twoFACode, setTwoFACode] = useState("")
//   const [verifying2FA, setVerifying2FA] = useState(false)
//   const [token_placeholder, setTokenPlaceholder] = useState("")

//   const router = useRouter()
//   const { login } = useAuth()

//   useEffect(() => {
//     const storedLoginType = localStorage.getItem("loginType")
//     if (storedLoginType === "user" || storedLoginType === "company") {
//       setLoginType(storedLoginType)
//     }

//     const script = document.createElement("script")
//     script.src = ""
//     script.async = true
//     script.defer = true
//     document.body.appendChild(script)
//   }, [])

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     const token = ""

//     if (!token) {
//       alert("Please complete the check.")
//       return
//     }

//     setTokenPlaceholder(token)
//     Cookies.set("TokenPlaceholder", token, { expires: 0.04 })

//     setIsLoading(true)
//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/login/`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email,
//           password,
//           token: token,
//         }),
//       })

//       const data = await response.json()
     
//       // if (data.two_fa_required) {
//       //     Cookies.set("TempToken", data.token, { expires: 0.04 }) // temp 2FA token
//       //     setShow2FAModal(true)
//       //     return
//       //   }
//       console.log("Login response:", data)

//       if (!response.ok) {
//         throw new Error(data?.message || "Login failed")
//       }

      
//       if (data.token && data.user_type === "company_user" && !data.previous_last_login) {
//         localStorage.setItem("user", JSON.stringify(data))
//         Cookies.set("Token", data.token, { expires: 7 })
//         router.push("/first-time-setup")
//       } else if (
//         data.token &&
//         (data.user_type === loginType || (data.user_type === "company_user" && loginType === "user"))
//       ) {
//         localStorage.setItem("loginType", loginType)
//         Cookies.set("Token", data.token, { expires: 7 })
//         login({ email, name: data.name || "John Doe", type: loginType })
//         router.push("/dashboard")
//       } else {
//               toast({
//           title: "Login error",
//           description: "User not verified or login type mismatch",
//           variant: "destructive",
//         })
//       }
//     } catch (err: any) {
//       console.error("Login error:", err)
//       alert(err.message)
//     } finally {
//       setIsLoading(false)
//       // reset removed
//     }
//   }

  

// const handle2FAVerification = async () => {
//   setVerifying2FA(true)
//   const tempToken = Cookies.get("TempToken")

//   if (!twoFACode || twoFACode.length !== 6 || !tempToken) {
//     toast({ title: "Invalid code", description: "Please enter a valid 6-digit code", variant: "destructive" })
//     setVerifying2FA(false)
//     return
//   }

//   const token_placeholder = Cookies.get("TokenPlaceholder")
//   console.log("Token:", token_placeholder)
//   console.log("2FA Code:", twoFACode)
//   console.log(email)
//   console.log(password)
//   try {
//     const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/login/`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email,
//           password,
//           token: token_placeholder,
//           token: twoFACode,
//         }),
//       })
   

//     const result = await response.json()
//     console.log("2FA response:", result)

//     if (!response.ok) {
//       throw new Error(result?.message || "Invalid 2FA code")
//     }

//     toast({ title: "2FA Success", description: "You're now logged in." })

//     Cookies.set("Token", tempToken, { expires: 7 })
//     Cookies.remove("TempToken")

//     login({ email, name: result.name || "John Doe", type: loginType })
//     router.push("/dashboard")
//   } catch (err: any) {
//     toast({ title: "2FA Error", description: err.message, variant: "destructive" })
//   } finally {
//     setVerifying2FA(false)
//   }
// }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
//       <Card className="w-full max-w-md shadow-xl border-0">
//         <CardHeader className="space-y-4 text-center">
//           <div className="flex items-center justify-center space-x-2">
//             <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-lg flex items-center justify-center">
//               <MessageSquare className="w-6 h-6 text-white" />
//             </div>
//             <span className="text-2xl font-bold text-slate-800">Smart Convo</span>
//           </div>
//           <div>
//             <CardTitle className="text-2xl text-slate-800">Welcome back</CardTitle>
//             <CardDescription className="text-slate-600">Sign in to your account to continue</CardDescription>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <div className="flex justify-center gap-4 mb-6">
//             <Button
//               variant={loginType === "company" ? "default" : "outline"}
//               onClick={() => setLoginType("company")}
//               className={cn(
//                 "flex-1 h-11",
//                 loginType === "company"
//                   ? "bg-teal-600 hover:bg-teal-700 text-white"
//                   : "border-teal-600 text-teal-600 hover:bg-teal-50"
//               )}
//             >
//               <Building className="mr-2 h-4 w-4" /> Login as Company
//             </Button>
//             <Button
//               variant={loginType === "user" ? "default" : "outline"}
//               onClick={() => setLoginType("user")}
//               className={cn(
//                 "flex-1 h-11",
//                 loginType === "user"
//                   ? "bg-teal-600 hover:bg-teal-700 text-white"
//                   : "border-teal-600 text-teal-600 hover:bg-teal-50"
//               )}
//             >
//               <User className="mr-2 h-4 w-4" /> Login as User
//             </Button>
//           </div>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="email" className="text-slate-700">
//                 {loginType === "company" ? "Company Email" : "User Email"}
//               </Label>
//               <Input
//                 id="email"
//                 type="email"
//                 placeholder={loginType === "company" ? "Enter your company email" : "Enter your user email"}
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 className="h-11"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="password" className="text-slate-700">
//                 Password
//               </Label>
//               <div className="relative">
//                 <Input
//                   id="password"
//                   type={showPassword ? "text" : "password"}
//                   placeholder="Enter your password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                   className="h-11 pr-10"
//                 />
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   size="sm"
//                   className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
//                   onClick={() => setShowPassword(!showPassword)}
//                 >
//                   {showPassword ? (
//                     <EyeOff className="h-4 w-4 text-slate-500" />
//                   ) : (
//                     <Eye className="h-4 w-4 text-slate-500" />
//                   )}
//                 </Button>
//               </div>
//             </div>

//             <div></div>

//             <div className="flex items-center justify-between">
//               <Link href="/forgot-password" className="text-sm text-teal-600 hover:text-teal-700">
//                 Forgot password?
//               </Link>
//               <Link href="/admin" className="text-sm text-gray-600 hover:text-gray-700">
//                 Admin Login
//               </Link>
//             </div>

//             <Button
//               type="submit"
//               className="w-full h-11 bg-teal-600 hover:bg-teal-700 text-white"
//               disabled={isLoading}
//             >
//               {isLoading ? "Signing in..." : "Sign in"}
//             </Button>
//           </form>
//           <div className="mt-6 text-center">
//             <p className="text-sm text-slate-600">
//               {"Don't have an account? "}
//               <Link href="/signup" className="text-teal-600 hover:text-teal-700 font-medium">
//                 Sign up
//               </Link>
//             </p>
//           </div>
//         </CardContent>
//       </Card>
//       {show2FAModal && (
//   <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
//     <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-sm space-y-4">
//       <h2 className="text-lg font-semibold text-center">Two-Factor Authentication</h2>
//       <p className="text-sm text-gray-600 text-center">Enter the 6-digit code from your authenticator app</p>
//       <Input
//         type="text"
//         maxLength={6}
//         value={twoFACode}
//         onChange={(e) => setTwoFACode(e.target.value)}
//         className="text-center tracking-widest"
//         placeholder="123456"
//       />
//       <Button
//         onClick={handle2FAVerification}
//         disabled={verifying2FA || twoFACode.length !== 6}
//         className="w-full bg-teal-600 hover:bg-teal-700 text-white"
//       >
//         {verifying2FA ? "Verifying..." : "Verify"}
//       </Button>
//     </div>
//   </div>
// )}

//     </div>
//   )
// }
