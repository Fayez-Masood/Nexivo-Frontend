// "use client"

// import { useEffect, useState, useCallback } from "react"
// import { useToast } from "@/hooks/use-toast"
// import Cookies from "js-cookie"
// import { Card, CardContent } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
// import { Label } from "@/components/ui/label"
// import { Search } from "lucide-react"
// import PhoneInput from "react-phone-input-2"
// import "react-phone-input-2/lib/style.css"
// import { parsePhoneNumberFromString } from "libphonenumber-js"

// export default function CompaniesAssignPage() {
//   const [companies, setCompanies] = useState<any[]>([])
//   const [searchTerm, setSearchTerm] = useState("")
//   const [sortBy, setSortBy] = useState("name")
//   const [hoveredCompany, setHoveredCompany] = useState<number | null>(null)
//   const [assignDialogOpen, setAssignDialogOpen] = useState(false)
//   const [selectedCompany, setSelectedCompany] = useState<any>(null)
//   const [phoneNumber, setPhoneNumber] = useState("")
//   const { toast } = useToast()

//   const [numbersDialogOpen, setNumbersDialogOpen] = useState(false)
//   const [numbersToShow, setNumbersToShow] = useState<string[]>([])

//   // ⬇️ make fetchCompanies reusable
//   const fetchCompanies = useCallback(async () => {
//     const token = Cookies.get("adminToken")
//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/companies/`, {
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Token ${token || ""}`,
//         },
//       })
//       const data = await res.json()
//       console.log("Fetched companies:", data)
//       if (Array.isArray(data)) setCompanies(data)
//       else if (Array.isArray(data.results)) setCompanies(data.results)
//     } catch (err) {
//       console.error("Failed to fetch companies", err)
//     }
//   }, [])

//   useEffect(() => {
//     fetchCompanies()
//   }, [fetchCompanies])

//   const filteredCompanies = companies
//     .filter((c) => {
//       const term = searchTerm.toLowerCase()
//       return (
//         c.name.toLowerCase().includes(term) ||
//         (c.twilio_phone_numbers &&
//           c.twilio_phone_numbers.some((num: string) =>
//             num.toString().includes(term)
//           ))
//       )
//     })
//     .sort((a, b) => {
//       switch (sortBy) {
//         case "name":
//           return a.name.localeCompare(b.name)
//         case "date":
//           return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
//         default:
//           return 0
//       }
//     })

//   const handleAssign = async () => {
//     if (!phoneNumber || phoneNumber.length < 6) {
//       toast({
//         variant: "destructive",
//         title: "Invalid number",
//         description: "Please enter a valid phone number.",
//       })
//       return
//     }
//     try {
//       const token = Cookies.get("adminToken")
//       const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/public/company/twilio-phones/`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Token ${token || ""}`,
//         },
//         body: JSON.stringify({
//           company_email: selectedCompany?.email,
//           phone_numbers: [`+${phoneNumber}`],
//         }),
//       })

//       if (!res.ok) throw new Error("Request failed")

//       const data = await res.json()
//       console.log("Assign response:", data)

//       toast({
//         title: "Success",
//         description: "Phone numbers added successfully!",
//       })
//       setAssignDialogOpen(false)
//       setPhoneNumber("")

//       // 🔄 refresh the companies list
//       await fetchCompanies()
//     } catch (err) {
//       console.error("Assign failed", err)
//       toast({
//         variant: "destructive",
//         title: "Failed",
//         description: "Could not assign number. Please try again.",
//       })
//     }
//   }



//   // Helper: infer country from phone number
//   const getCountryFromPhone = (number: string) => {
//     try {
//       const parsed = parsePhoneNumberFromString("+" + number.replace(/^\+/, ""))
//       return parsed ? parsed.country : null
//     } catch {
//       return null
//     }
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-3xl font-bold text-slate-800">Companies</h1>
//         <div className="relative w-72">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
//           <Input
//             placeholder="Search companies..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="pl-10"
//           />
//         </div>
//         <Select value={sortBy} onValueChange={setSortBy}>
//           <SelectTrigger className="w-40">
//             <SelectValue placeholder="Sort By" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="name">Sort by Name</SelectItem>
//             <SelectItem value="date">Sort by Date</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//         {filteredCompanies.map((company) => {
//           const numbers: string[] = company.twilio_phone_numbers || []
//           return (
//             <Card
//               key={company.id}
//               onMouseEnter={() => setHoveredCompany(company.id)}
//               onMouseLeave={() => setHoveredCompany(null)}
//               className="relative hover:shadow-lg transition-shadow group"
//             >
//               <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
//                 <div className="w-20 h-20 bg-slate-200 rounded-xl flex items-center justify-center">
//                   <img
//                     src={company.logo || "/placeholder.svg"}
//                     alt={`${company.name} logo`}
//                     className="w-16 h-16 object-contain"
//                   />
//                 </div>
//                 <h3 className="font-semibold text-lg">{company.name}</h3>
//                 <p className="text-sm text-slate-500">{company.industry}</p>
//                 <p className="text-xs text-slate-400">
//                   Added: {new Date(company.created_at).toLocaleDateString()}
//                 </p>

//                 {numbers.length === 0 ? (
//                   <p className="text-sm text-red-500">No numbers assigned</p>
//                 ) : (
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => {
//                       setNumbersToShow(numbers)
//                       setNumbersDialogOpen(true)
//                     }}
//                   >
//                     View {numbers.length} Number{numbers.length > 1 ? "s" : ""}
//                   </Button>
//                 )}

//                 {/* Assign Number Button (space reserved, fades in on hover) */}
//                 <div className="h-10 flex items-center">
//                   <Button
//                     variant="default"
//                     size="sm"
//                     className="opacity-0 group-hover:opacity-100 transition"
//                     onClick={() => {
//                       setSelectedCompany(company)
//                       setAssignDialogOpen(true)
//                     }}
//                   >
//                     Assign Number
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           )
//         })}
//       </div>

//       {/* Assign Number Dialog */}
//       <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>Assign Number to {selectedCompany?.name}</DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4 py-2">
//             <div>
//               <Label>Phone Number</Label>
//               <PhoneInput
//                 country={"us"}
//                 value={phoneNumber}
//                 onChange={(value) => setPhoneNumber(value)}
//                 inputClass="!w-full !h-10 !text-base !pl-12"
//                 dropdownClass="text-sm"
//                 enableSearch
//               />
//             </div>
//           </div>

//           <DialogFooter>
//             <Button onClick={handleAssign} className="w-full">
//               Assign
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Numbers Dialog */}
//       <Dialog open={numbersDialogOpen} onOpenChange={setNumbersDialogOpen}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>Assigned Numbers</DialogTitle>
//           </DialogHeader>
//           <div className="space-y-3">
//             {numbersToShow.map((num, idx) => {
//               const country = getCountryFromPhone(num)

//               const handleDelete = async () => {
//                 try {
//                   const token = Cookies.get("adminToken")
//                   console.log("Deleting number:", num, "for company:", selectedCompany?.email)
//                   const res = await fetch(
//                     `${process.env.NEXT_PUBLIC_BASE_URL}/public/company/twilio-phones/`,
//                     {
//                       method: "DELETE",
//                       headers: {
//                         "Content-Type": "application/json",
//                         "Authorization": `Token ${token || ""}`,
//                       },
//                       body: JSON.stringify({
//                         email: selectedCompany?.email,
//                         phone_number: num,
//                       }),
//                     }
//                   )

//                   if (!res.ok) throw new Error("Delete failed")

//                   toast({
//                     title: "Deleted",
//                     description: `Number ${num} removed successfully.`,
//                   })

//                   // update UI locally
//                   setNumbersToShow((prev) =>
//                     prev.filter((n) => n !== num)
//                   )
//                   await fetchCompanies()
//                 } catch (err) {
//                   console.error("Delete failed", err)
//                   toast({
//                     variant: "destructive",
//                     title: "Failed",
//                     description: "Could not delete number. Please try again.",
//                   })
//                 }
//               }

//               return (
//                 <div
//                   key={idx}
//                   className="flex items-center justify-between text-sm font-medium text-slate-700"
//                 >
//                   <span>
//                     📞 +{num} {country && `(${country})`}
//                   </span>
//                   <Button
//                     variant="destructive"
//                     size="sm"
//                     onClick={handleDelete}
//                   >
//                     Delete
//                   </Button>
//                 </div>
//               )
//             })}
//           </div>
//           <DialogFooter>
//             <Button onClick={() => setNumbersDialogOpen(false)}>Close</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//     </div>
//   )
// }


"use client"

import { useEffect, useState, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"
import Cookies from "js-cookie"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search } from "lucide-react"
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"
import { parsePhoneNumberFromString } from "libphonenumber-js"

export default function CompaniesAssignPage() {
  const [companies, setCompanies] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [hoveredCompany, setHoveredCompany] = useState<number | null>(null)
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<any>(null)
  const [phoneNumber, setPhoneNumber] = useState("")
  const { toast } = useToast()

  const [numbersDialogOpen, setNumbersDialogOpen] = useState(false)
  const [numbersToShow, setNumbersToShow] = useState<string[]>([])

  // ⬇️ make fetchCompanies reusable
  const fetchCompanies = useCallback(async () => {
    const token = Cookies.get("adminToken")
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/companies/`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token || ""}`,
        },
      })
      const data = await res.json()
      console.log("Fetched companies:", data)
      if (Array.isArray(data)) setCompanies(data)
      else if (Array.isArray(data.results)) setCompanies(data.results)
    } catch (err) {
      console.error("Failed to fetch companies", err)
    }
  }, [])

  useEffect(() => {
    fetchCompanies()
  }, [fetchCompanies])

  const filteredCompanies = companies
    .filter((c) => {
      const term = searchTerm.toLowerCase()
      return (
        c.name.toLowerCase().includes(term) ||
        (c.twilio_phone_numbers &&
          c.twilio_phone_numbers.some((num: string) =>
            num.toString().includes(term)
          ))
      )
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "date":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        default:
          return 0
      }
    })

  const handleAssign = async () => {
    if (!phoneNumber || phoneNumber.length < 6) {
      toast({
        variant: "destructive",
        title: "Invalid number",
        description: "Please enter a valid phone number.",
      })
      return
    }
    try {
      const token = Cookies.get("adminToken")
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/public/company/twilio-phones/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token || ""}`,
        },
        body: JSON.stringify({
          company_email: selectedCompany?.email,
          phone_numbers: [`+${phoneNumber}`],
        }),
      })

      if (!res.ok) throw new Error("Request failed")

      const data = await res.json()
      console.log("Assign response:", data)

      toast({
        title: "Success",
        description: "Phone numbers added successfully!",
      })
      setAssignDialogOpen(false)
      setPhoneNumber("")

      // 🔄 refresh the companies list
      await fetchCompanies()
    } catch (err) {
      console.error("Assign failed", err)
      toast({
        variant: "destructive",
        title: "Failed",
        description: "Could not assign number. Please try again.",
      })
    }
  }

  // ⬇️ DELETE handler moved here
  const handleDeleteNumber = async (num: string) => {
    try {
      const token = Cookies.get("adminToken")
      console.log("Deleting number:", num, "for company:", selectedCompany?.email)
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/public/company/twilio-phones/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${token || ""}`,
          },
          body: JSON.stringify({
            email: selectedCompany?.email,
            phone_number: num,
          }),
        }
      )

      if (!res.ok) throw new Error("Delete failed")

      toast({
        title: "Deleted",
        description: `Number ${num} removed successfully.`,
      })

      // update UI locally
      setNumbersToShow((prev) => prev.filter((n) => n !== num))
      await fetchCompanies()
    } catch (err) {
      console.error("Delete failed", err)
      toast({
        variant: "destructive",
        title: "Failed",
        description: "Could not delete number. Please try again.",
      })
    }
  }

  // Helper: infer country from phone number
  const getCountryFromPhone = (number: string) => {
    try {
      const parsed = parsePhoneNumberFromString("+" + number.replace(/^\+/, ""))
      return parsed ? parsed.country : null
    } catch {
      return null
    }
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="sticky top-2 md:top-4 z-40">
        <div className="relative overflow-hidden rounded-xl md:rounded-2xl">
          <div className="absolute -inset-[1px] bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 rounded-xl md:rounded-2xl opacity-60 blur-[2px] animate-[gradient_3s_ease_infinite] bg-[length:200%_100%]" />
          <div className="relative bg-white/70 backdrop-blur-xl border border-white/20 rounded-xl md:rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-violet-500/5 to-purple-500/10" />
            <div className="relative px-4 md:px-6 py-3 md:py-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h1 className="text-xl md:text-2xl font-light text-slate-800 tracking-tight">Manage Numbers</h1>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                      placeholder="Search companies..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64 rounded-xl border-slate-200 bg-white/80 h-10 focus:border-indigo-400"
                    />
                  </div>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40 rounded-xl border-slate-200 bg-white/80 h-10">
                      <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="name">Sort by Name</SelectItem>
                      <SelectItem value="date">Sort by Date</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {filteredCompanies.map((company) => {
          const numbers: string[] = company.twilio_phone_numbers || []
          return (
            <div
              key={company.id}
              onMouseEnter={() => setHoveredCompany(company.id)}
              onMouseLeave={() => setHoveredCompany(null)}
              className="group bg-white rounded-2xl border border-slate-200/60 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="p-5 flex flex-col items-center text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center">
                  <span className="text-lg font-semibold text-indigo-600">{company.name?.charAt(0) || "C"}</span>
                </div>
                <h3 className="font-semibold text-base text-slate-800">{company.name}</h3>
                <p className="text-sm text-slate-500">{company.industry}</p>
                <p className="text-xs text-slate-400">
                  Added: {new Date(company.created_at).toLocaleDateString()}
                </p>

                {numbers.length === 0 ? (
                  <p className="text-sm text-slate-400 italic">No numbers assigned</p>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl border-slate-200 hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
                    onClick={() => {
                      setSelectedCompany(company)
                      setNumbersToShow(numbers)
                      setNumbersDialogOpen(true)
                    }}
                  >
                    View {numbers.length} Number{numbers.length > 1 ? "s" : ""}
                  </Button>
                )}

                {/* Assign Number Button */}
                <div className="h-10 flex items-center">
                  <Button
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-all rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 shadow-sm"
                    onClick={() => {
                      setSelectedCompany(company)
                      setAssignDialogOpen(true)
                    }}
                  >
                    Add Number
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Assign Number Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-light text-slate-800 tracking-tight">Assign Number to {selectedCompany?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Phone Number</Label>
              <PhoneInput
                country={"us"}
                value={phoneNumber}
                onChange={(value) => setPhoneNumber(value)}
                inputClass="!w-full !h-10 !text-base !pl-12"
                dropdownClass="text-sm"
                enableSearch
              />
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleAssign} className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700">
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Numbers Dialog */}
      <Dialog open={numbersDialogOpen} onOpenChange={setNumbersDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-light text-slate-800 tracking-tight">Assigned Numbers</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {numbersToShow.map((num, idx) => {
              const country = getCountryFromPhone(num)
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between text-sm font-medium text-slate-700"
                >
                  <span>
                    📞 +{num} {country && `(${country})`}
                  </span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteNumber(num)}
                  >
                    Delete
                  </Button>
                </div>
              )
            })}
          </div>
          <DialogFooter>
            <Button onClick={() => setNumbersDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}



// "use client"

// import { useEffect, useState, useCallback } from "react"
// import { useToast } from "@/hooks/use-toast"
// import Cookies from "js-cookie"
// import { Card, CardContent } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
// import { Label } from "@/components/ui/label"
// import { Search, Plus, Phone, Building2, Trash2 } from "lucide-react"
// import PhoneInput from "react-phone-input-2"
// import "react-phone-input-2/lib/style.css"
// import { parsePhoneNumberFromString } from "libphonenumber-js"

// export default function CompaniesAssignPage() {
//   const [companies, setCompanies] = useState<any[]>([])
//   const [searchTerm, setSearchTerm] = useState("")
//   const [sortBy, setSortBy] = useState("name")
//   const [assignDialogOpen, setAssignDialogOpen] = useState(false)
//   const [selectedCompany, setSelectedCompany] = useState<any>(null)
//   const [phoneNumber, setPhoneNumber] = useState("")
//   const { toast } = useToast()

//   const [numbersDialogOpen, setNumbersDialogOpen] = useState(false)
//   const [numbersToShow, setNumbersToShow] = useState<string[]>([])

//   const fetchCompanies = useCallback(async () => {
//     const token = Cookies.get("adminToken")
//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/companies/`, {
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Token ${token || ""}`,
//         },
//       })
//       const data = await res.json()
//       if (Array.isArray(data)) setCompanies(data)
//       else if (Array.isArray(data.results)) setCompanies(data.results)
//     } catch (err) {
//       console.error("Failed to fetch companies", err)
//     }
//   }, [])

//   useEffect(() => {
//     fetchCompanies()
//   }, [fetchCompanies])

//   const filteredCompanies = companies
//     .filter((c) => {
//       const term = searchTerm.toLowerCase()
//       return (
//         c.name.toLowerCase().includes(term) ||
//         (c.twilio_phone_numbers &&
//           c.twilio_phone_numbers.some((num: string) =>
//             num.toString().includes(term)
//           ))
//       )
//     })
//     .sort((a, b) => {
//       switch (sortBy) {
//         case "name":
//           return a.name.localeCompare(b.name)
//         case "date":
//           return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
//         default:
//           return 0
//       }
//     })

//   const handleAssign = async () => {
//     if (!phoneNumber || phoneNumber.length < 6) {
//       toast({
//         variant: "destructive",
//         title: "Invalid number",
//         description: "Please enter a valid phone number.",
//       })
//       return
//     }
//     try {
//       const token = Cookies.get("adminToken")
//       const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/public/company/twilio-phones/`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Token ${token || ""}`,
//         },
//         body: JSON.stringify({
//           company_email: selectedCompany?.email,
//           phone_numbers: [`+${phoneNumber}`],
//         }),
//       })

//       if (!res.ok) throw new Error("Request failed")

//       toast({
//         title: "Success",
//         description: "Phone number assigned successfully.",
//       })
//       setAssignDialogOpen(false)
//       setPhoneNumber("")
//       await fetchCompanies()
//     } catch (err) {
//       console.error("Assign failed", err)
//       toast({
//         variant: "destructive",
//         title: "Failed",
//         description: "Could not assign number.",
//       })
//     }
//   }

//   const handleDeleteNumber = async (num: string) => {
//     try {
//       const token = Cookies.get("adminToken")
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_BASE_URL}/public/company/twilio-phones/`,
//         {
//           method: "DELETE",
//           headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Token ${token || ""}`,
//           },
//           body: JSON.stringify({
//             email: selectedCompany?.email,
//             phone_number: num,
//           }),
//         }
//       )

//       if (!res.ok) throw new Error("Delete failed")

//       toast({
//         title: "Deleted",
//         description: "Number removed successfully.",
//       })

//       setNumbersToShow((prev) => prev.filter((n) => n !== num))
//       await fetchCompanies()
//     } catch (err) {
//       console.error("Delete failed", err)
//       toast({
//         variant: "destructive",
//         title: "Failed",
//         description: "Could not delete number.",
//       })
//     }
//   }

//   const getCountryFromPhone = (number: string) => {
//     try {
//       const parsed = parsePhoneNumberFromString("+" + number.replace(/^\+/, ""))
//       return parsed ? parsed.country : null
//     } catch {
//       return null
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
//       {/* Header Section */}
//       <div className="border-b border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
//         <div className="max-w-7xl mx-auto px-6 py-8">
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <h1 className="text-4xl font-light tracking-tight text-slate-900 dark:text-white mb-2">
//                 Companies
//               </h1>
//               <p className="text-sm text-slate-500 dark:text-slate-400 font-light tracking-wide uppercase">
//                 Manage Organization Contacts
//               </p>
//             </div>
//           </div>

//           {/* Search and Filter Bar */}
//           <div className="flex items-center gap-4">
//             <div className="relative flex-1 max-w-md">
//               <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
//               <Input
//                 placeholder="Search companies..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-11 h-11 bg-white/80 dark:bg-slate-800/80 border-slate-200/60 dark:border-slate-700/60 focus:border-slate-400 dark:focus:border-slate-600 rounded-xl"
//               />
//             </div>
//             <Select value={sortBy} onValueChange={setSortBy}>
//               <SelectTrigger className="w-48 h-11 bg-white/80 dark:bg-slate-800/80 border-slate-200/60 dark:border-slate-700/60 rounded-xl">
//                 <SelectValue placeholder="Sort By" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="name">Sort by Name</SelectItem>
//                 <SelectItem value="date">Sort by Date</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </div>
//       </div>

//       {/* Companies Grid */}
//       <div className="max-w-7xl mx-auto px-6 py-8">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {filteredCompanies.map((company, index) => {
//             const numbers: string[] = company.twilio_phone_numbers || []
//             return (
//               <div
//                 key={company.id}
//                 className="group relative"
//                 style={{ animationDelay: `${index * 30}ms` }}
//               >
//                 {/* Hover glow effect */}
//                 <div className="absolute inset-0 bg-gradient-to-br from-slate-200/30 to-slate-300/30 dark:from-slate-700/30 dark:to-slate-800/30 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
//                 <Card className="relative rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-800/60 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 overflow-hidden">
//                   <CardContent className="p-6 flex flex-col items-center space-y-4">
//                     {/* Logo */}
//                     <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden ring-1 ring-slate-200/50 dark:ring-slate-700/50">
//                       {company.logo ? (
//                         <img
//                           src={company.logo}
//                           alt={company.name}
//                           className="w-12 h-12 object-contain"
//                         />
//                       ) : (
//                         <Building2 className="w-8 h-8 text-slate-400" />
//                       )}
//                     </div>

//                     {/* Company Info */}
//                     <div className="text-center space-y-1 w-full">
//                       <h3 className="font-medium text-lg text-slate-900 dark:text-white truncate">
//                         {company.name}
//                       </h3>
//                       <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
//                         {company.industry || "N/A"}
//                       </p>
//                       <p className="text-xs text-slate-400 dark:text-slate-500 font-light">
//                         {new Date(company.created_at).toLocaleDateString()}
//                       </p>
//                     </div>

//                     {/* Numbers Status */}
//                     <div className="w-full pt-2">
//                       {numbers.length === 0 ? (
//                         <div className="text-center py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
//                           <p className="text-xs text-slate-500 dark:text-slate-400 font-light">
//                             No numbers assigned
//                           </p>
//                         </div>
//                       ) : (
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           className="w-full justify-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800"
//                           onClick={() => {
//                             setSelectedCompany(company)
//                             setNumbersToShow(numbers)
//                             setNumbersDialogOpen(true)
//                           }}
//                         >
//                           <Phone className="h-3.5 w-3.5" />
//                           <span className="text-sm">{numbers.length} Number{numbers.length > 1 ? "s" : ""}</span>
//                         </Button>
//                       )}
//                     </div>

//                     {/* Add Number Button - appears on hover */}
//                     <div className="w-full opacity-0 group-hover:opacity-100 transition-all duration-300">
//                       <Button
//                         size="sm"
//                         className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 text-white gap-2 rounded-xl"
//                         onClick={() => {
//                           setSelectedCompany(company)
//                           setAssignDialogOpen(true)
//                         }}
//                       >
//                         <Plus className="h-4 w-4" />
//                         Add Number
//                       </Button>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//             )
//           })}
//         </div>
//       </div>

//       {/* Assign Number Dialog - Cinematic */}
//       <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
//         <DialogContent className="sm:max-w-md rounded-3xl bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border border-slate-200/50 dark:border-slate-800/50 shadow-[0_20px_80px_-15px_rgba(0,0,0,0.3)] p-0 overflow-hidden">
//           {/* Header */}
//           <div className="relative px-6 pt-6 pb-4 bg-gradient-to-b from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900">
//             <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
//             <div className="relative">
//               <DialogTitle className="text-2xl font-light tracking-tight text-white">
//                 Assign Number
//               </DialogTitle>
//               <p className="text-sm text-slate-400 mt-1 font-light">
//                 {selectedCompany?.name}
//               </p>
//             </div>
//           </div>

//           {/* Content */}
//           <div className="px-6 py-6 space-y-4">
//             <div>
//               <Label className="text-sm font-light text-slate-700 dark:text-slate-300 mb-2 block">
//                 Phone Number
//               </Label>
//               <PhoneInput
//                 country={"us"}
//                 value={phoneNumber}
//                 onChange={(value) => setPhoneNumber(value)}
//                 inputClass="!w-full !h-11 !text-base !pl-12 !rounded-xl !border-slate-200 dark:!border-slate-700 !bg-white/80 dark:!bg-slate-800/80"
//                 dropdownClass="!rounded-xl"
//                 buttonClass="!rounded-l-xl !border-slate-200 dark:!border-slate-700"
//                 enableSearch
//               />
//             </div>
//           </div>

//           {/* Footer */}
//           <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
//             <Button 
//               onClick={handleAssign} 
//               className="w-full h-11 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 rounded-xl"
//             >
//               Assign Number
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* Numbers Dialog - Cinematic */}
//       <Dialog open={numbersDialogOpen} onOpenChange={setNumbersDialogOpen}>
//         <DialogContent className="sm:max-w-md rounded-3xl bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border border-slate-200/50 dark:border-slate-800/50 shadow-[0_20px_80px_-15px_rgba(0,0,0,0.3)] p-0 overflow-hidden">
//           {/* Header */}
//           <div className="relative px-6 pt-6 pb-4 bg-gradient-to-b from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900">
//             <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
//             <div className="relative">
//               <DialogTitle className="text-2xl font-light tracking-tight text-white">
//                 Assigned Numbers
//               </DialogTitle>
//               <p className="text-sm text-slate-400 mt-1 font-light">
//                 {selectedCompany?.name}
//               </p>
//             </div>
//           </div>

//           {/* Content */}
//           <div className="px-6 py-6 space-y-3 max-h-96 overflow-y-auto">
//             {numbersToShow.map((num, idx) => {
//               const country = getCountryFromPhone(num)
//               return (
//                 <div
//                   key={idx}
//                   className="group flex items-center justify-between p-4 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 hover:shadow-lg transition-all duration-300"
//                 >
//                   <div className="flex items-center gap-3">
//                     <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
//                       <Phone className="h-4 w-4 text-slate-600 dark:text-slate-300" />
//                     </div>
//                     <div>
//                       <p className="text-sm font-mono font-medium text-slate-900 dark:text-white">
//                         +{num}
//                       </p>
//                       {country && (
//                         <p className="text-xs text-slate-500 dark:text-slate-400">
//                           {country}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 dark:hover:text-red-400"
//                     onClick={() => handleDeleteNumber(num)}
//                   >
//                     <Trash2 className="h-4 w-4" />
//                   </Button>
//                 </div>
//               )
//             })}
//           </div>

//           {/* Footer */}
//           <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
//             <Button 
//               variant="ghost"
//               onClick={() => setNumbersDialogOpen(false)}
//               className="w-full hover:bg-slate-200 dark:hover:bg-slate-800"
//             >
//               Close
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }