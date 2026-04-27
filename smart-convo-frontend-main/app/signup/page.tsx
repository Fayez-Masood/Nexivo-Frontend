// "use client"

// import React, { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { MessageSquare, Upload, Building, CheckCircle } from "lucide-react"
// import { useAuth } from "@/components/auth-provider"
// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";


// const countries = [
//   "Afghanistan",
//   "Albania",
//   "Algeria",
//   "Andorra",
//   "Angola",
//   "Antigua and Barbuda",
//   "Argentina",
//   "Armenia",
//   "Australia",
//   "Austria",
//   "Azerbaijan",
//   "Bahamas",
//   "Bahrain",
//   "Bangladesh",
//   "Barbados",
//   "Belarus",
//   "Belgium",
//   "Belize",
//   "Benin",
//   "Bhutan",
//   "Bolivia",
//   "Bosnia and Herzegovina",
//   "Botswana",
//   "Brazil",
//   "Brunei",
//   "Bulgaria",
//   "Burkina Faso",
//   "Burundi",
//   "Cabo Verde",
//   "Cambodia",
//   "Cameroon",
//   "Canada",
//   "Central African Republic",
//   "Chad",
//   "Chile",
//   "China",
//   "Colombia",
//   "Comoros",
//   "Congo",
//   "Costa Rica",
//   "Croatia",
//   "Cuba",
//   "Cyprus",
//   "Czech Republic",
//   "Denmark",
//   "Djibouti",
//   "Dominica",
//   "Dominican Republic",
//   "Ecuador",
//   "Egypt",
//   "El Salvador",
//   "Equatorial Guinea",
//   "Eritrea",
//   "Estonia",
//   "Eswatini",
//   "Ethiopia",
//   "Fiji",
//   "Finland",
//   "France",
//   "Gabon",
//   "Gambia",
//   "Georgia",
//   "Germany",
//   "Ghana",
//   "Greece",
//   "Grenada",
//   "Guatemala",
//   "Guinea",
//   "Guinea-Bissau",
//   "Guyana",
//   "Haiti",
//   "Honduras",
//   "Hungary",
//   "Iceland",
//   "India",
//   "Indonesia",
//   "Iran",
//   "Iraq",
//   "Ireland",
//   "Israel",
//   "Italy",
//   "Jamaica",
//   "Japan",
//   "Jordan",
//   "Kazakhstan",
//   "Kenya",
//   "Kiribati",
//   "Kuwait",
//   "Kyrgyzstan",
//   "Laos",
//   "Latvia",
//   "Lebanon",
//   "Lesotho",
//   "Liberia",
//   "Libya",
//   "Liechtenstein",
//   "Lithuania",
//   "Luxembourg",
//   "Madagascar",
//   "Malawi",
//   "Malaysia",
//   "Maldives",
//   "Mali",
//   "Malta",
//   "Marshall Islands",
//   "Mauritania",
//   "Mauritius",
//   "Mexico",
//   "Micronesia",
//   "Moldova",
//   "Monaco",
//   "Mongolia",
//   "Montenegro",
//   "Morocco",
//   "Mozambique",
//   "Myanmar",
//   "Namibia",
//   "Nauru",
//   "Nepal",
//   "Netherlands",
//   "New Zealand",
//   "Nicaragua",
//   "Niger",
//   "Nigeria",
//   "North Korea",
//   "North Macedonia",
//   "Norway",
//   "Oman",
//   "Pakistan",
//   "Palau",
//   "Palestine",
//   "Panama",
//   "Papua New Guinea",
//   "Paraguay",
//   "Peru",
//   "Philippines",
//   "Poland",
//   "Portugal",
//   "Qatar",
//   "Romania",
//   "Russia",
//   "Rwanda",
//   "Saint Kitts and Nevis",
//   "Saint Lucia",
//   "Saint Vincent and the Grenadines",
//   "Samoa",
//   "San Marino",
//   "Sao Tome and Principe",
//   "Saudi Arabia",
//   "Senegal",
//   "Serbia",
//   "Seychelles",
//   "Sierra Leone",
//   "Singapore",
//   "Slovakia",
//   "Slovenia",
//   "Solomon Islands",
//   "Somalia",
//   "South Africa",
//   "South Korea",
//   "South Sudan",
//   "Spain",
//   "Sri Lanka",
//   "Sudan",
//   "Suriname",
//   "Sweden",
//   "Switzerland",
//   "Syria",
//   "Taiwan",
//   "Tajikistan",
//   "Tanzania",
//   "Thailand",
//   "Timor-Leste",
//   "Togo",
//   "Tonga",
//   "Trinidad and Tobago",
//   "Tunisia",
//   "Turkey",
//   "Turkmenistan",
//   "Tuvalu",
//   "Uganda",
//   "Ukraine",
//   "United Arab Emirates",
//   "United Kingdom",
//   "United States",
//   "Uruguay",
//   "Uzbekistan",
//   "Vanuatu",
//   "Vatican City",
//   "Venezuela",
//   "Vietnam",
//   "Yemen",
//   "Zambia",
//   "Zimbabwe",
// ]

// const industries = [
//   "Technology",
//   "Healthcare",
//   "Finance",
//   "Education",
//   "Retail",
//   "Manufacturing",
//   "Real Estate",
//   "Automotive",
//   "Food & Beverage",
//   "Travel & Tourism",
//   "Media & Entertainment",
//   "Telecommunications",
//   "Energy",
//   "Construction",
//   "Agriculture",
//   "Transportation",
//   "Legal Services",
//   "Consulting",
//   "Marketing & Advertising",
//   "Non-profit",
//   "Government",
//   "Insurance",
//   "Banking",
//   "E-commerce",
//   "Software Development",
//   "Biotechnology",
//   "Pharmaceuticals",
//   "Fashion",
//   "Sports & Recreation",
//   "Beauty & Cosmetics",
//   "Gaming",
//   "Aerospace",
//   "Mining",
//   "Logistics",
//   "Security",
//   "Environmental Services",
//   "Architecture",
//   "Interior Design",
//   "Photography",
//   "Music",
//   "Art & Design",
//   "Publishing",
//   "Research & Development",
//   "Human Resources",
//   "Customer Service",
//   "Sales",
//   "Operations",
//   "Supply Chain",
//   "Quality Assurance",
//   "Data Analytics",
// ]

// const companySizes = [
//   { value: "1-10", label: "1-10 employees" },
//   { value: "11-50", label: "11-50 employees" },
//   { value: "51-100", label: "51-100 employees" },
//   { value: "101-500", label: "101-500 employees" },
//   { value: "500+", label: "500+ employees" },
// ]

// const plans = [
//   { value: "basic", label: "Basic Plan - $29/month", description: "Perfect for small teams" },
//   { value: "premium", label: "Premium Plan - $79/month", description: "Great for growing businesses" },
//   { value: "enterprise", label: "Enterprise Plan - $199/month", description: "For large organizations" },
//   { value: "custom", label: "Custom Plan - Contact us", description: "Tailored to your needs" },
// ]



// export default function SignupPage() {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     website: "",
//     description: "",
//     country: "",
//     city: "",
//     postalCode: "",
//     address: "",
//     industry: "",
//     companySize: "",
//     companySince: "",
//     plan: "",
//     logo: null as File | null,
//     password: "",
//     confirmPassword: "",
//   })
//   const [isLoading, setIsLoading] = useState(false)
//   const [showSuccess, setShowSuccess] = useState(false)
//   const [errors, setErrors] = useState<Record<string, string>>({})
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);
//   const router = useRouter()
//   const { login } = useAuth()

//   useEffect(() => {
//   if (errorMessage) {
//     const timer = setTimeout(() => setErrorMessage(null), 5000); // 5 seconds
//     return () => clearTimeout(timer);
//   }
// }, [errorMessage]);


//   const validateEmail = (email: string) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
//     return emailRegex.test(email)
//   }

//   const validatePhone = (phone: string) => {
//     const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
//     return phoneRegex.test(phone.replace(/[\s\-$$$$]/g, ""))
//   }

//   const validateWebsite = (website: string) => {
//    const regex = /^www\.[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
//     return regex.test(website);
//   }

//   const validatePassword = (password: string) => {
//     const minLength = password.length >= 8
//     const hasUppercase = /[A-Z]/.test(password)
//     const hasDigit = /[0-9]/.test(password)
//     return minLength && hasUppercase && hasDigit
//   }


//   const handleInputChange = (field: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }))

//     // Clear error when user starts typing
//     if (errors[field]) {
//       setErrors((prev) => ({ ...prev, [field]: "" }))
//     }

//     // Real-time validation
//     if (field === "email" && value && !validateEmail(value)) {
//       setErrors((prev) => ({ ...prev, email: "Please enter a valid email address" }))
//     }
//     if (field === "phone" && value && !validatePhone(value)) {
//       setErrors((prev) => ({ ...prev, phone: "Please enter a valid phone number" }))
//     }
//     if (field === "website" && value && !validateWebsite(value)) {
//       setErrors((prev) => ({ ...prev, website: "Please enter a valid website URL" }))
//     }
//   }

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]
//     if (file) {
//       if (file.size > 5 * 1024 * 1024) {
//         // 5MB limit
//         setErrors((prev) => ({ ...prev, logo: "File size must be less than 5MB" }))
//         return
//       }
//       if (!file.type.startsWith("image/")) {
//         setErrors((prev) => ({ ...prev, logo: "Please upload an image file" }))
//         return
//       }
//       setFormData((prev) => ({ ...prev, logo: file }))
//       setErrors((prev) => ({ ...prev, logo: "" }))
//     }
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     // Validation
//     const newErrors: Record<string, string> = {}

//     if (!formData.name.trim()) newErrors.name = "Company name is required"
//     if (!formData.email.trim()) newErrors.email = "Email is required"
//     else if (!validateEmail(formData.email)) newErrors.email = "Please enter a valid email"
//     if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
//     else if (!validatePhone(formData.phone)) newErrors.phone = "Please enter a valid phone number"
//     if (formData.website && !validateWebsite(formData.website)) newErrors.website = "Please enter a valid website URL"
//     if (!formData.description.trim()) newErrors.description = "Company description is required"
//     if (!formData.country.trim()) newErrors.country = "Country is required"
//     if (!formData.city.trim()) newErrors.city = "City is required"
//     if (!formData.postalCode.trim()) newErrors.postalCode = "Postal code is required"
//     if (!formData.address.trim()) newErrors.address = "Address is required"
//     if (!formData.industry) newErrors.industry = "Industry is required"
//     if (!formData.companySize) newErrors.companySize = "Company size is required"
//     if (!formData.companySince) newErrors.companySince = "Company founding year is required"
//     else if (Number.parseInt(formData.companySince) > new Date().getFullYear()) {
//       newErrors.companySince = "Founding year cannot be in the future"
//     }
//     // if (!formData.plan) newErrors.plan = "Please select a plan"

//     if (!formData.password) {
//       newErrors.password = "Password is required"
//     } else if (!validatePassword(formData.password)) {
//       newErrors.password = "Password must be at least 8 characters, include an uppercase letter and a digit"
//     }

//     if (formData.confirmPassword !== formData.password) {
//       newErrors.confirmPassword = "Passwords do not match"
//     }


//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors)
//       return
//     }

//     setIsLoading(true)

//     // Prepare data for backend
//     const signupData = {
//       name: formData.name,
//       email: formData.email,
//       phone: formData.phone,
//       website: formData.website || null,
//       description: formData.description,
//       address: `${formData.address}, ${formData.city}, ${formData.postalCode}, ${formData.country}`,
//       industry: formData.industry,
//       company_size: formData.companySize,
//       company_since: Number.parseInt(formData.companySince),
//       plan: null,
//       // formData.plan || 
//       logo: formData.logo,
//       // Default values (not shown in form)
//       status: "Pending",
//       last_login: null,
//       users: [],
//       monthly_usage: 0,
//       created_at: null,
//       updated_at: null,
//     }

//     try {
//       const body = new FormData()

//       // Append all values from signupData
//       body.append("name", formData.name)
//       body.append("email", formData.email)
//       body.append("phone", formData.phone)
//       body.append("website", formData.website || "")
//       body.append("description", formData.description)
//       body.append("address", `${formData.address}, ${formData.city}, ${formData.postalCode}, ${formData.country}`)
//       body.append("industry", formData.industry)
//       body.append("company_size", formData.companySize)
//       body.append("company_since", String(Number.parseInt(formData.companySince)))
//       body.append("plan", "Basic")
//       body.append("password", formData.password)
//       body.append("confirm_password", formData.confirmPassword)

//       // Add fields not shown in form but required in signupData
//       // body.append("status", "Pending")
//       // body.append("last_login", "") // send empty string or backend can default null
//       // body.append("users", JSON.stringify([])) // empty user array
//       // body.append("monthly_usage", "0")
//       // body.append("created_at", "") // let backend assign if needed
//       // body.append("updated_at", "")

//       // Append file
//       if (formData.logo) {
//         body.append("logo", formData.logo)
//       }
//       console.log(body.get("name"))
//       console.log(body.get("email"))
//       console.log(body.get("phone"))
//       console.log(body.get("website"))
//       console.log(body.get("description"))
//       console.log(body.get("address"))
//       console.log(body.get("industry"))
//       console.log(body.get("company_size"))
//       console.log(body.get("company_since"))
//       console.log(body.get("password"))

//       const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/companies/`, {
//         method: "POST",
//         body,
//       })

//       if (!response.ok) {
//         const errorData = await response.json();

//         // Convert errorData to string (handle objects like { email: ["This field is required."] })
//         const formattedError = Object.entries(errorData)
//           .map(([key, val]) => `${key}: ${(val as string[]).join(', ')}`)
//           .join('\n');

//         setErrorMessage(formattedError);
//         setIsLoading(false);
//         return;

//       }

//       setIsLoading(false)
//       setShowSuccess(true)

//       setTimeout(() => {
//         router.push("/login")
//       }, 5000)
//     } catch (err) {
//       console.error("Error submitting form:", err)
//       alert("Error submitting the form. Please try again.")
//       setIsLoading(false)
//     }

//   }

//   if (showSuccess) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
//         <Card className="w-full max-w-md shadow-xl border-0">
//           <CardContent className="p-8 text-center">
//             <div className="flex justify-center mb-6">
//               <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
//                 <CheckCircle className="w-8 h-8 text-green-600" />
//               </div>
//             </div>
//             <h2 className="text-2xl font-bold text-slate-800 mb-4">Request Submitted!</h2>
//             <p className="text-slate-600 mb-6">
//               Your company registration request is being processed. You will receive an email confirmation shortly.
//             </p>
//             <div className="flex items-center justify-center space-x-2 text-sm text-slate-500">
//               <div className="w-4 h-4 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
//               <span>Redirecting to login page...</span>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
//       <Card className="w-full max-w-2xl shadow-xl border-0">
//         <CardHeader className="space-y-4 text-center">
//           <div className="flex items-center justify-center space-x-2">
//             <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-lg flex items-center justify-center">
//               <MessageSquare className="w-6 h-6 text-white" />
//             </div>
//             <span className="text-2xl font-bold text-slate-800">Smart Convo</span>
//           </div>
//           <div>
//             <CardTitle className="text-2xl text-slate-800 flex items-center justify-center gap-2">
//               <Building className="w-6 h-6" />
//               Create Company Account
//             </CardTitle>
//             <CardDescription className="text-slate-600">
//               Register your company to get started with Smart Convo
//             </CardDescription>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Basic Information */}
//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Basic Information</h3>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="name" className="text-slate-700">
//                     Company Name *
//                   </Label>
//                   <Input
//                     id="name"
//                     placeholder="Enter company name"
//                     value={formData.name}
//                     onChange={(e) => handleInputChange("name", e.target.value)}
//                     className={`h-11 transition-all duration-200 ${errors.name ? "border-red-500 focus:border-red-500" : "focus:border-teal-500"}`}
//                   />
//                   {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="email" className="text-slate-700">
//                     Company Email *
//                   </Label>
//                   <Input
//                     id="email"
//                     type="email"
//                     placeholder="company@example.com"
//                     value={formData.email}
//                     onChange={(e) => handleInputChange("email", e.target.value)}
//                     className={`h-11 transition-all duration-200 ${errors.email ? "border-red-500 focus:border-red-500" : "focus:border-teal-500"}`}
//                   />
//                   {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="phone" className="text-slate-700">
//                     Phone Number *
//                   </Label>
//                   <PhoneInput
//                     country={'us'}
//                     value={formData.phone}
//                     onChange={(phone) => handleInputChange("phone", phone)}
//                     inputProps={{
//                       name: 'phone',
//                       required: true,
//                       className: `h-11 w-full border px-3 py-2 rounded-md focus:outline-none transition-all duration-200 ${
//                         errors.phone ? 'border-red-500 focus:border-red-500' : 'focus:border-teal-500'
//                       }`,
//                     }}
//                     containerClass="w-full"
//                   />
//                   {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                  
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="website" className="text-slate-700">
//                     Website
//                   </Label>
//                   <Input
//                     id="website"
//                     placeholder="www.company.com"
//                     value={formData.website}
//                     onChange={(e) => handleInputChange("website", e.target.value)}
//                     className={`h-11 transition-all duration-200 ${errors.website ? "border-red-500 focus:border-red-500" : "focus:border-teal-500"}`}
//                   />
//                   {errors.website && <p className="text-sm text-red-500">{errors.website}</p>}
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="description" className="text-slate-700">
//                   Company Description *
//                 </Label>
//                 <Textarea
//                   id="description"
//                   placeholder="Tell us about your company..."
//                   value={formData.description}
//                   onChange={(e) => handleInputChange("description", e.target.value)}
//                   className={`min-h-[100px] transition-all duration-200 ${errors.description ? "border-red-500 focus:border-red-500" : "focus:border-teal-500"}`}
//                 />
//                 {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="password" className="text-slate-700">
//                   Password *
//                 </Label>
//                 <Input
//                   id="password"
//                   type="password"
//                   placeholder="Enter a strong password"
//                   value={formData.password}
//                   onChange={(e) => handleInputChange("password", e.target.value)}
//                   className={`h-11 transition-all duration-200 ${errors.password ? "border-red-500 focus:border-red-500" : "focus:border-teal-500"}`}
//                 />
//                 {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="confirmPassword" className="text-slate-700">
//                   Confirm Password *
//                 </Label>
//                 <Input
//                   id="confirmPassword"
//                   type="password"
//                   placeholder="Re-enter password"
//                   value={formData.confirmPassword}
//                   onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
//                   className={`h-11 transition-all duration-200 ${errors.confirmPassword ? "border-red-500 focus:border-red-500" : "focus:border-teal-500"}`}
//                 />
//                 {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
//               </div>
//             </div>

//             {/* Address Information */}
//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Address Information</h3>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="country" className="text-slate-700">
//                     Country *
//                   </Label>
//                   <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
//                     <SelectTrigger
//                       className={`h-11 transition-all duration-200 ${errors.country ? "border-red-500 focus:border-red-500" : "focus:border-teal-500"}`}
//                     >
//                       <SelectValue placeholder="Select country" />
//                     </SelectTrigger>
//                     <SelectContent className="max-h-60">
//                       {countries.map((country) => (
//                         <SelectItem key={country} value={country}>
//                           {country}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   {errors.country && <p className="text-sm text-red-500">{errors.country}</p>}
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="city" className="text-slate-700">
//                     City *
//                   </Label>
//                   <Input
//                     id="city"
//                     placeholder="New York"
//                     value={formData.city}
//                     onChange={(e) => handleInputChange("city", e.target.value)}
//                     className={`h-11 transition-all duration-200 ${errors.city ? "border-red-500 focus:border-red-500" : "focus:border-teal-500"}`}
//                   />
//                   {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="postalCode" className="text-slate-700">
//                     Postal Code *
//                   </Label>
//                   <Input
//                     id="postalCode"
//                     placeholder="10001"
//                     value={formData.postalCode}
//                     onChange={(e) => handleInputChange("postalCode", e.target.value)}
//                     className={`h-11 transition-all duration-200 ${errors.postalCode ? "border-red-500 focus:border-red-500" : "focus:border-teal-500"}`}
//                   />
//                   {errors.postalCode && <p className="text-sm text-red-500">{errors.postalCode}</p>}
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="address" className="text-slate-700">
//                     Street Address *
//                   </Label>
//                   <Input
//                     id="address"
//                     placeholder="123 Main Street"
//                     value={formData.address}
//                     onChange={(e) => handleInputChange("address", e.target.value)}
//                     className={`h-11 transition-all duration-200 ${errors.address ? "border-red-500 focus:border-red-500" : "focus:border-teal-500"}`}
//                   />
//                   {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
//                 </div>
//               </div>
//             </div>

//             {/* Company Details */}
//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Company Details</h3>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="industry" className="text-slate-700">
//                     Industry *
//                   </Label>
//                   <Select value={formData.industry} onValueChange={(value) => handleInputChange("industry", value)}>
//                     <SelectTrigger
//                       className={`h-11 transition-all duration-200 ${errors.industry ? "border-red-500 focus:border-red-500" : "focus:border-teal-500"}`}
//                     >
//                       <SelectValue placeholder="Select industry" />
//                     </SelectTrigger>
//                     <SelectContent className="max-h-60">
//                       {industries.map((industry) => (
//                         <SelectItem key={industry} value={industry}>
//                           {industry}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   {errors.industry && <p className="text-sm text-red-500">{errors.industry}</p>}
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="companySize" className="text-slate-700">
//                     Company Size *
//                   </Label>
//                   <Select
//                     value={formData.companySize}
//                     onValueChange={(value) => handleInputChange("companySize", value)}
//                   >
//                     <SelectTrigger
//                       className={`h-11 transition-all duration-200 ${errors.companySize ? "border-red-500 focus:border-red-500" : "focus:border-teal-500"}`}
//                     >
//                       <SelectValue placeholder="Select company size" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {companySizes.map((size) => (
//                         <SelectItem key={size.value} value={size.value}>
//                           {size.label}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   {errors.companySize && <p className="text-sm text-red-500">{errors.companySize}</p>}
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="companySince" className="text-slate-700">
//                     Company Since *
//                   </Label>
//                   <Input
//                     id="companySince"
//                     type="number"
//                     min="1800"
//                     max={new Date().getFullYear()}
//                     placeholder="2020"
//                     value={formData.companySince}
//                     onChange={(e) => handleInputChange("companySince", e.target.value)}
//                     className={`h-11 transition-all duration-200 ${errors.companySince ? "border-red-500 focus:border-red-500" : "focus:border-teal-500"}`}
//                   />
//                   {errors.companySince && <p className="text-sm text-red-500">{errors.companySince}</p>}
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="logo" className="text-slate-700">
//                     Company Logo
//                   </Label>
//                   <div className="relative">
//                     <Input id="logo" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
//                     <Button
//                       type="button"
//                       variant="outline"
//                       className="w-full h-11 justify-start bg-transparent"
//                       onClick={() => document.getElementById("logo")?.click()}
//                     >
//                       <Upload className="w-4 h-4 mr-2" />
//                       {formData.logo ? formData.logo.name : "Upload logo"}
//                     </Button>
//                   </div>
//                   {errors.logo && <p className="text-sm text-red-500">{errors.logo}</p>}
//                 </div>
//               </div>
//             </div>

//             {/* Plan Selection */}
//             {/* <div className="space-y-4">
//               <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Select Plan</h3>

//               <div className="space-y-2">
//                 <Label htmlFor="plan" className="text-slate-700">
//                   Choose Your Plan *
//                 </Label>
//                 <Select value={formData.plan} onValueChange={(value) => handleInputChange("plan", value)}>
//                   <SelectTrigger
//                     className={`h-11 transition-all duration-200 ${errors.plan ? "border-red-500 focus:border-red-500" : "focus:border-teal-500"}`}
//                   >
//                     <SelectValue placeholder="Select a plan" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {plans.map((plan) => (
//                       <SelectItem key={plan.value} value={plan.value}>
//                         <div className="flex flex-col">
//                           <span className="font-medium">{plan.label}</span>
//                           <span className="text-sm text-slate-500">{plan.description}</span>
//                         </div>
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 {errors.plan && <p className="text-sm text-red-500">{errors.plan}</p>}
//               </div>
//             </div> */}

//             <Button
//               type="submit"
//               className="w-full h-12 bg-teal-600 hover:bg-teal-700 text-white text-lg font-medium transition-all duration-200 transform hover:scale-[1.02]"
//               disabled={isLoading}
//             >
//               {isLoading ? (
//                 <div className="flex items-center space-x-2">
//                   <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                   <span>Creating Account...</span>
//                 </div>
//               ) : (
//                 "Create Company Account"
//               )}
//             </Button>
//           </form>

//           {errorMessage && (
//             <div className="mt-4 p-2 text-sm text-red-600 bg-red-100 rounded">
//               {errorMessage}
//             </div>
//           )}


//           <div className="mt-6 text-center">
//             <p className="text-sm text-slate-600">
//               Already have an account?{" "}
//               <Link
//                 href="/login"
//                 className="text-teal-600 hover:text-teal-700 font-medium transition-colors duration-200"
//               >
//                 Sign in
//               </Link>
//             </p>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }




"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Upload, Building, CheckCircle } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"
import { useToast } from "@/hooks/use-toast"


const countries = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
]

const industries = [
  "Aerospace",
  "Agriculture",
  "Architecture",
  "Art & Design",
  "Automotive",
  "Banking",
  "Beauty & Cosmetics",
  "Biotechnology",
  "Chemicals",
  "Childcare Services",
  "Construction",
  "Consulting",
  "Customer Service",
  "Data Analytics",
  "E-commerce",
  "Education",
  "Electronics",
  "Energy",
  "Environmental Services",
  "Event Management",
  "Fashion",
  "Film & Television",
  "Finance",
  "Fitness & Sports",
  "Food & Beverage",
  "Food Production",
  "Furniture",
  "Gaming",
  "Government",
  "Health & Wellness",
  "Healthcare",
  "Hospitality",
  "Human Resources",
  "Insurance",
  "Interior Design",
  "Legal Services",
  "Logistics",
  "Manufacturing",
  "Marketing & Advertising",
  "Media & Entertainment",
  "Mining",
  "Music",
  "Music & Audio",
  "Municipal Services",
  "Non-profit",
  "Operations",
  "Pharmaceuticals",
  "Photography",
  "Printing & Packaging",
  "Public Relations",
  "Publishing",
  "Quality Assurance",
  "Real Estate",
  "Recruitment",
  "Research & Development",
  "Restaurant",
  "Retail",
  "Sales",
  "Security",
  "Software Development",
  "Sports & Recreation",
  "Supply Chain",
  "Technology",
  "Telecommunications",
  "Textile",
  "Tourism",
  "Training & Development",
  "Transportation",
  "Travel & Tourism",
  "Waste Management",
  "Wellness & Spa",
  "Other"
];


const companySizes = [
  { value: "1-10", label: "1-10 employees" },
  { value: "11-50", label: "11-50 employees" },
  { value: "51-100", label: "51-100 employees" },
  { value: "101-500", label: "101-500 employees" },
  { value: "500+", label: "500+ employees" },
]

const plans = [
  { value: "basic", label: "Basic Plan - $29/month", description: "Perfect for small teams" },
  { value: "premium", label: "Premium Plan - $79/month", description: "Great for growing businesses" },
  { value: "enterprise", label: "Enterprise Plan - $199/month", description: "For large organizations" },
  { value: "custom", label: "Custom Plan - Contact us", description: "Tailored to your needs" },
]

/** API field errors may be string[], a single string, or nested objects (e.g. DRF). */
function formatApiFieldError(val: unknown): string {
  if (Array.isArray(val)) return val.map((v) => String(v)).join(", ")
  if (val != null && typeof val === "object") return JSON.stringify(val)
  return String(val ?? "")
}

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    description: "",
    country: "",
    city: "",
    postalCode: "",
    address: "",
    industry: "",
    companySize: "",
    companySince: "",
    plan: "",
    logo: null as File | null,
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter()
  const { login } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 5000); // 5 seconds
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
    return phoneRegex.test(phone.replace(/[\s\-$$$$]/g, ""))
  }

  const validateWebsite = (website: string) => {
    const regex = /^www\.[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/
    return regex.test(website)
  }

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8
    const hasUppercase = /[A-Z]/.test(password)
    const hasDigit = /[0-9]/.test(password)
    return minLength && hasUppercase && hasDigit
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }

    // Real-time validation
    if (field === "email" && value && !validateEmail(value)) {
      setErrors((prev) => ({ ...prev, email: "Please enter a valid email address" }))
    }
    if (field === "phone" && value && !validatePhone(value)) {
      setErrors((prev) => ({ ...prev, phone: "Please enter a valid phone number" }))
    }
    if (field === "website" && value && !validateWebsite(value)) {
      setErrors((prev) => ({ ...prev, website: "Please enter a valid website URL" }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setErrors((prev) => ({ ...prev, logo: "File size must be less than 5MB" }))
        return
      }
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({ ...prev, logo: "Please upload an image file" }))
        return
      }
      setFormData((prev) => ({ ...prev, logo: file }))
      setErrors((prev) => ({ ...prev, logo: "" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = "Company name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!validateEmail(formData.email)) newErrors.email = "Please enter a valid email"
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
    else if (!validatePhone(formData.phone)) newErrors.phone = "Please enter a valid phone number"
    if (!formData.website.trim()) newErrors.website = "Website is required"
    else if (!validateWebsite(formData.website)) newErrors.website = "Please enter a valid website URL"
    if (formData.website && !validateWebsite(formData.website)) newErrors.website = "Please enter a valid website URL"
    if (!formData.description.trim()) newErrors.description = "Company description is required"
    if (!formData.country.trim()) newErrors.country = "Country is required"
    if (!formData.city.trim()) newErrors.city = "City is required"
    if (!formData.postalCode.trim()) newErrors.postalCode = "Postal code is required"
    else if (!/^\d+$/.test(formData.postalCode)) newErrors.postalCode = "Postal code must be a number"
    if (!formData.address.trim()) newErrors.address = "Address is required"
    if (!formData.industry) newErrors.industry = "Industry is required"
    if (!formData.companySize) newErrors.companySize = "Company size is required"
    if (!formData.companySince) newErrors.companySince = "Company founding year is required"
    else if (Number.parseInt(formData.companySince) > new Date().getFullYear()) {
      newErrors.companySince = "Founding year cannot be in the future"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (!validatePassword(formData.password)) {
      newErrors.password = "Password must be at least 8 characters, include an uppercase letter and a digit"
    }

    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      toast({
        title: "Validation Error",
        description: "Please fix the highlighted fields before submitting.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Prepare data for backend
    const signupData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      website: formData.website || null,
      description: formData.description,
      address: `${formData.address}, ${formData.city}, ${formData.postalCode}, ${formData.country}`,
      industry: formData.industry,
      company_size: formData.companySize,
      company_since: Number.parseInt(formData.companySince),
      plan: null,
      logo: formData.logo,
      status: "Pending",
      last_login: null,
      users: [],
      monthly_usage: 0,
      created_at: null,
      updated_at: null,
    }

    try {
      const body = new FormData()

      // Append all values from signupData
      body.append("name", formData.name)
      body.append("email", formData.email)
      body.append("phone", formData.phone)
      body.append("website", formData.website || "")
      body.append("description", formData.description)
      body.append("address", `${formData.address}, ${formData.city}, ${formData.postalCode}, ${formData.country}`)
      body.append("industry", formData.industry)
      body.append("company_size", formData.companySize)
      body.append("company_since", String(Number.parseInt(formData.companySince)))
      body.append("plan", "Basic")
      body.append("password", formData.password)
      body.append("confirm_password", formData.confirmPassword)

      // Append file
      if (formData.logo) {
        body.append("logo", formData.logo)
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/companies/`, {
        method: "POST",
        body,
      })

      if (!response.ok) {
        const errorData = (await response.json()) as Record<string, unknown>

        const formattedError = Object.entries(errorData)
          .map(([key, val]) => `${key}: ${formatApiFieldError(val)}`)
          .join("\n")

        setErrorMessage(formattedError)
        setIsLoading(false)
        return
      }

      setIsLoading(false)
      setShowSuccess(true)

      setTimeout(() => {
        router.push("/login")
      }, 5000)
    } catch (err) {
      console.error("Error submitting form:", err)
      alert("Error submitting the form. Please try again.")
      setIsLoading(false)
    }
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-2xl text-center max-w-md">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Request Submitted!</h2>
          <p className="text-slate-600 mb-6">
            Your company registration request is being processed. You will receive an email confirmation shortly.
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-slate-500">
            <div className="w-4 h-4 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
            <span>Redirecting to login page...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
      {/* Cinematic Background (public/agent-bg.jpg) */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-70"
        style={{ backgroundImage: 'url("/agent-bg.jpg")' }}
      />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-screen px-8">
        <div className="w-full max-w-6xl flex gap-12 items-start">
          {/* Left Panel */}
          <div className="flex-1 text-gray-900">
            <h1 className="text-4xl font-bold mb-6 leading-tight uppercase">
              AI voice & communication <span className="underline decoration-lime-400">agents</span><br />
              that <span className="underline decoration-lime-400">book every appointment</span>
            </h1>
            <p className="text-gray-600 mb-6">
              Answer every call. Never miss an opportunity.<br />
              SmartConvo by Pentagon AI — The Future of{" "}
              <span className="text-primary">Customer Communication</span>
            </p>

            <Link href="/login" className="text-gray-900 font-medium border-b-2 border-gray-900 hover:border-lime-400 transition">
              Already have an account? Login →
            </Link>
          </div>

          {/* Right Panel - Signup Form */}
          <div className="w-[620px]">
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-slate-800 ml-3">Smart Convo</span>
              </div>

              <h2 className="text-2xl font-semibold text-center text-gray-900 mb-4">
                Register Your Company
              </h2>
              <CardDescription className="text-center text-slate-600 mb-6">
                Create your company account to get started with SmartConvo
              </CardDescription>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Basic Information</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-slate-700">Company Name *</Label>
                      <Input
                        id="name"
                        placeholder="Enter company name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className={`h-11 transition-all duration-200 ${errors.name ? "border-red-500 focus:border-red-500" : "focus:border-teal-500"}`}
                      />
                      {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-700">Company Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="company@example.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className={`h-11 transition-all duration-200 ${errors.email ? "border-red-500 focus:border-red-500" : "focus:border-teal-500"}`}
                      />
                      {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-slate-700">Phone Number *</Label>
                      <PhoneInput
                        country={"us"}
                        value={formData.phone}
                        onChange={(phone) => handleInputChange("phone", phone)}
                        inputProps={{
                          name: "phone",
                          required: true,
                          className: `h-11 w-full border px-3 py-2 rounded-md focus:outline-none transition-all duration-200 ${errors.phone ? 'border-red-500 focus:border-red-500' : 'focus:border-teal-500'}`,
                        }}
                        containerClass="w-full"
                      />
                      {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website" className="text-slate-700">Website</Label>
                      <Input
                        id="website"
                        placeholder="www.company.com"
                        value={formData.website}
                        onChange={(e) => handleInputChange("website", e.target.value)}
                        className={`h-11 transition-all duration-200 ${errors.website ? "border-red-500 focus:border-red-500" : "focus:border-teal-500"}`}
                      />
                      {errors.website && <p className="text-sm text-red-500">{errors.website}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-slate-700">Company Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Tell us about your company..."
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      className={`min-h-[100px] transition-all duration-200 ${errors.description ? "border-red-500 focus:border-red-500" : "focus:border-teal-500"}`}
                    />
                    {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                  </div>
                </div>

                {/* Passwords */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-slate-700">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter a strong password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className={`h-11 transition-all duration-200 ${errors.password ? "border-red-500 focus:border-red-500" : "focus:border-teal-500"}`}
                    />
                    {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-slate-700">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Re-enter password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className={`h-11 transition-all duration-200 ${errors.confirmPassword ? "border-red-500 focus:border-red-500" : "focus:border-teal-500"}`}
                    />
                    {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
                  </div>
                </div>

                {/* Address Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Address Information</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="country" className="text-slate-700">Country *</Label>
                      <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
                        <SelectTrigger className={`h-11 transition-all duration-200 ${errors.country ? "border-red-500 focus:border-red-500" : "focus:border-teal-500"}`}>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {countries.map((country) => (
                            <SelectItem key={country} value={country}>{country}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.country && <p className="text-sm text-red-500">{errors.country}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-slate-700">City *</Label>
                      <Input
                        id="city"
                        placeholder="New York"
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        className={`h-11 transition-all duration-200 ${errors.city ? "border-red-500 focus:border-red-500" : "focus:border-teal-500"}`}
                      />
                      {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="postalCode" className="text-slate-700">Postal Code *</Label>
                      <Input
                        id="postalCode"
                        placeholder="10001"
                        value={formData.postalCode}
                        onChange={(e) => handleInputChange("postalCode", e.target.value)}
                        className={`h-11 transition-all duration-200 ${errors.postalCode ? "border-red-500 focus:border-red-500" : "focus:border-teal-500"}`}
                      />
                      {errors.postalCode && <p className="text-sm text-red-500">{errors.postalCode}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-slate-700">Street Address *</Label>
                      <Input
                        id="address"
                        placeholder="123 Main Street"
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        className={`h-11 transition-all duration-200 ${errors.address ? "border-red-500 focus:border-red-500" : "focus:border-teal-500"}`}
                      />
                      {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
                    </div>
                  </div>
                </div>

                {/* Company Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Company Details</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="industry" className="text-slate-700">Industry *</Label>
                      <Select value={formData.industry} onValueChange={(value) => handleInputChange("industry", value)}>
                        <SelectTrigger className={`h-11 transition-all duration-200 ${errors.industry ? "border-red-500 focus:border-red-500" : "focus:border-teal-500"}`}>
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {industries.map((industry) => (
                            <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.industry && <p className="text-sm text-red-500">{errors.industry}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="companySize" className="text-slate-700">Company Size *</Label>
                      <Select value={formData.companySize} onValueChange={(value) => handleInputChange("companySize", value)}>
                        <SelectTrigger className={`h-11 transition-all duration-200 ${errors.companySize ? "border-red-500 focus:border-red-500" : "focus:border-teal-500"}`}>
                          <SelectValue placeholder="Select company size" />
                        </SelectTrigger>
                        <SelectContent>
                          {companySizes.map((size) => (
                            <SelectItem key={size.value} value={size.value}>{size.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.companySize && <p className="text-sm text-red-500">{errors.companySize}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companySince" className="text-slate-700">Company Since *</Label>
                      <Input
                        id="companySince"
                        type="number"
                        min="1800"
                        max={new Date().getFullYear()}
                        placeholder="2020"
                        value={formData.companySince}
                        onChange={(e) => handleInputChange("companySince", e.target.value)}
                        className={`h-11 transition-all duration-200 ${errors.companySince ? "border-red-500 focus:border-red-500" : "focus:border-teal-500"}`}
                      />
                      {errors.companySince && <p className="text-sm text-red-500">{errors.companySince}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="logo" className="text-slate-700">Company Logo</Label>
                      <div className="relative">
                        <Input id="logo" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full h-11 justify-start bg-transparent"
                          onClick={() => document.getElementById("logo")?.click()}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          {formData.logo ? formData.logo.name : "Upload logo"}
                        </Button>
                      </div>
                      {errors.logo && <p className="text-sm text-red-500">{errors.logo}</p>}
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full h-12 bg-teal-600 hover:bg-teal-700 text-white text-lg font-medium transition-all duration-200 transform hover:scale-[1.02]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    "Create Company Account"
                  )}
                </Button>
              </form>

              {errorMessage && (
                <div className="mt-4 p-2 text-sm text-red-600 bg-red-100 rounded whitespace-pre-line">
                  {errorMessage}
                </div>
              )}

              <div className="mt-6 text-center">
                <p className="text-sm text-slate-600">
                  Already have an account?{" "}
                  <Link href="/login" className="text-teal-600 hover:text-teal-700 font-medium transition-colors duration-200">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

