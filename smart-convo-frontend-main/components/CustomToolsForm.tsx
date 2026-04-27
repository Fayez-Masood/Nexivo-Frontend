// "use client"

// import { useState, useMemo } from "react"
// import Cookies from "js-cookie"
// import { motion, AnimatePresence } from "framer-motion"
// import { useToast } from "@/hooks/use-toast"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Textarea } from "@/components/ui/textarea"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
// import { Progress } from "@/components/ui/progress"

// // Step types
// type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7

// // Helper type for key/value pairs
// type KVEntry = { id: string; key: string; value: string }

// export default function CustomToolsForm({ onSuccess }: { onSuccess?: () => void }) {
//   const { toast } = useToast()
//   const token = Cookies.get("Token") || ""
//   const [step, setStep] = useState<Step>(1)

//   // Main form state
//   const [formData, setFormData] = useState<any>({
//     name: "",
//     description: "",
//     method: "POST",
//     url: "",
//     headers: [] as KVEntry[],
//     query_template: [] as KVEntry[],
//     body_template: [] as KVEntry[],
//     parameters: {},
//     omit_nulls: false,
//     timeout_ms: 30000,
//     speak_during_execution: {
//       enabled: false,
//       delay_seconds: 0,
//       message: "",
//     },
//   })

//   // Add new KV row
//   const addKV = (section: "headers" | "query_template" | "body_template") => {
//     setFormData((prev: any) => ({
//       ...prev,
//       [section]: [
//         ...prev[section],
//         { id: crypto.randomUUID(), key: "", value: "" },
//       ],
//     }))
//   }

//   // Helper to recursively get the deepest placeholder
// function getDeepestPlaceholder(value: string): string | null {
//   let current = value.trim()

//   // If contains quotes, skip immediately
//   if (current.includes('"') || current.includes("'")) return null

//   // Keep peeling nested braces like {{{param}}} → {{param}} → {param}
//   while (current.startsWith("{") && current.endsWith("}")) {
//     current = current.slice(1, -1).trim()
//   }

//   // At this point current is the innermost string
//   if (!current.includes("{") && !current.includes("}") && current.length > 0) {
//     return current
//   }

//   return null
// }
// const extractPlaceholdersFromString = (str: string): string[] => {
//   const found: string[] = []
//   const regex = /\{([^{}]+)\}/g // match {word}

//   let match
//   while ((match = regex.exec(str)) !== null) {
//     let candidate = match[1].trim()

//     // ❌ reject if contains quotes, nested braces, or empty
//     if (
//       candidate === "" ||
//       candidate.includes('"') ||
//       candidate.includes("'") ||
//       candidate.includes("{") ||
//       candidate.includes("}")
//     ) {
//       continue
//     }

//     found.push(candidate)
//   }
//   return found
// }


//   // Update KV row without losing focus
//   const updateKV = (
//     section: "headers" | "query_template" | "body_template",
//     id: string,
//     field: "key" | "value",
//     newValue: string
//   ) => {
//     setFormData((prev: any) => ({
//       ...prev,
//       [section]: prev[section].map((entry: KVEntry) =>
//         entry.id === id ? { ...entry, [field]: newValue } : entry
//       ),
//     }))
//   }

//   const handleParameterConfig = (paramKey: string, field: string, value: any) => {
//     setFormData((prev: any) => ({
//       ...prev,
//       parameters: {
//         ...prev.parameters,
//         [paramKey]: {
//           ...prev.parameters[paramKey],
//           [field]: value,
//         },
//       },
//     }))
//   }

//   // Extract placeholders like {summary}, {phone_number}
//   const extractedParams = useMemo(() => {
//     const regex = /^\{[a-zA-Z0-9_]+\}$/;
//     const found: string[] = []

//     const scan = (entries: KVEntry[]) => {
//     entries.forEach((e) => {
//       const val = e.value.trim();
//       if (regex.test(val)) {
//         found.push(val.slice(1, -1)); // remove { }
//       }
//     });
//   };

//     scan(formData.query_template)
//     scan(formData.body_template)

//     return Array.from(new Set(found)) // unique only
//   }, [formData.query_template, formData.body_template])

// const initialFormData = {
//   name: "",
//   description: "",
//   method: "POST",
//   url: "",
//   headers: [] as KVEntry[],
//   query_template: [] as KVEntry[],
//   body_template: [] as KVEntry[],
//   parameters: {},
//   omit_nulls: false,
//   timeout_ms: 30000,
//   speak_during_execution: {
//     enabled: false,
//     delay_seconds: 0,
//     message: "",
//   },
// }

// const handleSubmit = async () => {
//   try {
//     const formatKV = (arr: KVEntry[]) =>
//       Object.fromEntries(
//         arr
//           .filter(e => e.key)
//           .map(e => {
//             let raw = e.value.trim()
//             if (/^\{[a-zA-Z0-9_]+\}$/.test(raw)) {
//               return [e.key, raw]
//             }
//             try {
//               return [e.key, JSON.parse(raw)]
//             } catch {
//               return [e.key, raw]
//             }
//           })
//       )

//     const payload = {
//       name: formData.name,
//       description: formData.description,
//       method: formData.method,
//       url: formData.url,
//       headers: formatKV(formData.headers),
//       query_template: formatKV(formData.query_template),
//       body_template: formatKV(formData.body_template),
//       parameters: extractedParams.reduce((acc, key) => {
//         if (formData.parameters[key]) {
//           acc[key] = formData.parameters[key]
//         }
//         return acc
//       }, {} as Record<string, any>),
//       omit_nulls: formData.omit_nulls,
//       timeout_ms: formData.timeout_ms,
//       speak_during_execution: {
//         enabled:
//           formData.speak_during_execution.enabled === true ||
//           formData.speak_during_execution.enabled === "true",
//         delay_seconds:
//           Number(formData.speak_during_execution.delay_seconds) || 0,
//         message: formData.speak_during_execution.message || "",
//       },
//     }

//     console.log("Submitting payload:", JSON.stringify(payload, null, 2))

//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_BASE_URL}/custom_feature/custom-features/`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Token ${Cookies.get("Token") || ""}`,
//         },
//         body: JSON.stringify(payload),
//       }
//     )

//     if (!res.ok) throw new Error("Request failed")
//     const data = await res.json()
//     console.log("Response:", data)

//     // ✅ Reset form + close
//     setFormData(initialFormData)
//     setStep(1) // or setOpen(false) if it's in a modal/drawer
//     onSuccess?.()

//     toast({ title: "Success", description: "Custom feature created!" })
//   } catch (err) {
//     console.error("Submit failed", err)
//     toast({
//       variant: "destructive",
//       title: "Error",
//       description: "Could not create feature.",
//     })
//   }
// }

//   return (
    
//     <Card className="p-6 rounded-2xl shadow-2xl bg-gradient-to-br from-white via-slate-50 to-slate-100 border border-slate-200 max-h-[90vh] overflow-y-auto">
//       <CardHeader>
//         <CardTitle className="text-2xl font-bold text-center">
//           Create Custom Tool
//         </CardTitle>
//         <p className="text-center text-slate-500 mt-1">
//           Step {step} of 7
//         </p>
//         <Progress
//           value={(step / 7) * 100}
//           className="h-2 mt-3 rounded-full bg-slate-200"
//         />
//       </CardHeader>

//       <CardContent>
//         <AnimatePresence mode="wait">
//           <motion.div
//             key={step}
//             initial={{ opacity: 0, y: 15 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -15 }}
//             transition={{ duration: 0.25 }}
//             className="space-y-6"
//           >
//                             {/* Step 1 */}
//                     {step === 1 && (
//                     <div className="space-y-6">
//                         <div className="space-y-2">
//                         <label htmlFor="tool-name" className="block text-sm font-semibold text-slate-700">
//                             Name
//                         </label>
//                         <Input
//                             id="tool-name"
//                             placeholder="Tool Name"
//                             value={formData.name}
//                             onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                             className="w-full"
//                         />
//                         </div>

//                         <div className="space-y-2">
//                         <label htmlFor="tool-description" className="block text-sm font-semibold text-slate-700">
//                             Description
//                         </label>
//                         <Textarea
//                             id="tool-description"
//                             placeholder="Tool Description"
//                             value={formData.description}
//                             onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                             className="w-full min-h-[96px] resize-y"
//                         />
//                         </div>
//                     </div>
//                     )}

//                     {/* Step 2 */}
//                     {step === 2 && (
//                     <div className="space-y-6">
//                         <div className="space-y-2">
//                         <label htmlFor="request-method" className="block text-sm font-semibold text-slate-700">
//                             Method
//                         </label>
//                         <div>
//                             <select
//                             id="request-method"
//                             className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
//                             value={formData.method}
//                             onChange={(e) => setFormData({ ...formData, method: e.target.value })}
//                             >
//                             {["GET", "POST", "PUT", "PATCH", "DELETE"].map((m) => (
//                                 <option key={m} value={m}>
//                                 {m}
//                                 </option>
//                             ))}
//                             </select>
//                         </div>
//                         </div>

//                         <div className="space-y-2">
//                         <label htmlFor="request-url" className="block text-sm font-semibold text-slate-700">
//                             URL
//                         </label>
//                         <Input
//                             id="request-url"
//                             placeholder="Request URL"
//                             value={formData.url}
//                             onChange={(e) => setFormData({ ...formData, url: e.target.value })}
//                             className="w-full"
//                         />
//                         </div>
//                     </div>
//                     )}


//                                 {/* Step 3: Headers */}
//                                 {step === 3 && (
//                                 <div className="space-y-3">
//                                     <h3 className="font-semibold text-lg">Headers</h3>
//                                     {formData.headers.map((entry: KVEntry) => (
//                                     <div key={entry.id} className="flex gap-2">
//                                         <Input
//                                         placeholder="Key"
//                                         value={entry.key}
//                                         onChange={(e) =>
//                                             updateKV("headers", entry.id, "key", e.target.value)
//                                         }
//                                         />
//                                         <Input
//                                         placeholder="Value"
//                                         value={entry.value}
//                                         onChange={(e) =>
//                                             updateKV("headers", entry.id, "value", e.target.value)
//                                         }
//                                         />
//                                     </div>
//                                     ))}
//                                     <Button variant="outline" onClick={() => addKV("headers")}>
//                                     + Add Header
//                                     </Button>
//                                 </div>
//                                 )}

//                     {/* Step 4 */}
//                     {step === 4 && (
//                     <div className="space-y-3">
//                         <h3 className="font-semibold text-lg">Query Parameters</h3>
//                         {formData.query_template.map((entry: KVEntry) => (
//                         <div key={entry.id} className="flex gap-2">
//                             <Input
//                             placeholder="Key"
//                             value={entry.key}
//                             onChange={(e) => {
//                                 updateKV("query_template", entry.id, "key", e.target.value)

//                                 // detect {placeholders} in key
//                                 const placeholders = extractPlaceholdersFromString(e.target.value)
//                                 if (placeholders.length > 0) {
//                                 setFormData((prev: any) => ({
//                                     ...prev,
//                                     parameters: {
//                                     ...prev.parameters,
//                                     ...Object.fromEntries(
//                                         placeholders.map((p) => [
//                                         p,
//                                         prev.parameters[p] || {
//                                             type: "",
//                                             description: "",
//                                             required: false,
//                                         },
//                                         ])
//                                     ),
//                                     },
//                                 }))
//                                 }
//                             }}
//                             />
//                             <Input
//                             placeholder="Value"
//                             value={entry.value}
//                             onChange={(e) => {
//                                 updateKV("query_template", entry.id, "value", e.target.value)

//                                 // detect {placeholders} in value
//                                 const placeholders = extractPlaceholdersFromString(e.target.value)
//                                 if (placeholders.length > 0) {
//                                 setFormData((prev: any) => ({
//                                     ...prev,
//                                     parameters: {
//                                     ...prev.parameters,
//                                     ...Object.fromEntries(
//                                         placeholders.map((p) => [
//                                         p,
//                                         prev.parameters[p] || {
//                                             type: "",
//                                             description: "",
//                                             required: false,
//                                         },
//                                         ])
//                                     ),
//                                     },
//                                 }))
//                                 }
//                             }}
//                             />
//                         </div>
//                         ))}
//                         <Button variant="outline" onClick={() => addKV("query_template")}>
//                         + Add Query Param
//                         </Button>
//                     </div>
//                     )}

//                     {/* Step 5 */}
//                     {step === 5 && (
//                     <div className="space-y-4">
//                         <h3 className="font-semibold text-lg">Body Template</h3>

//                         {/* Manual key-value input */}
//                         <div className="space-y-3">
//                         {formData.body_template.map((entry: KVEntry) => (
//                             <div key={entry.id} className="flex gap-2">
//                             <Input
//                                 placeholder="Key"
//                                 value={entry.key}
//                                 onChange={(e) => {
//                                 updateKV("body_template", entry.id, "key", e.target.value)

//                                 // detect {placeholders} in key
//                                 const placeholders = extractPlaceholdersFromString(e.target.value)
//                                 if (placeholders.length > 0) {
//                                     setFormData((prev: any) => ({
//                                     ...prev,
//                                     parameters: {
//                                         ...prev.parameters,
//                                         ...Object.fromEntries(
//                                         placeholders.map((p) => [
//                                             p,
//                                             prev.parameters[p] || {
//                                             type: "",
//                                             description: "",
//                                             required: false,
//                                             },
//                                         ])
//                                         ),
//                                     },
//                                     }))
//                                 }
//                                 }}
//                                 className="w-1/2"
//                             />
//                             <Input
//                                 placeholder="Value"
//                                 value={entry.value}
//                                 onChange={(e) => {
//                                 updateKV("body_template", entry.id, "value", e.target.value)

//                                 // detect {placeholders} in value
//                                 const placeholders = extractPlaceholdersFromString(e.target.value)
//                                 if (placeholders.length > 0) {
//                                     setFormData((prev: any) => ({
//                                     ...prev,
//                                     parameters: {
//                                         ...prev.parameters,
//                                         ...Object.fromEntries(
//                                         placeholders.map((p) => [
//                                             p,
//                                             prev.parameters[p] || {
//                                             type: "",
//                                             description: "",
//                                             required: false,
//                                             },
//                                         ])
//                                         ),
//                                     },
//                                     }))
//                                 }
//                                 }}
//                                 className="w-1/2"
//                             />
//                             </div>
//                         ))}
//                         <Button variant="outline" onClick={() => addKV("body_template")}>
//                             + Add Body Field
//                         </Button>
//                         </div>

//                         {/* JSON Paste Section */}
//                         <div className="space-y-2 pt-4">
//                         <label className="font-semibold block">Paste JSON</label>
//                         <Textarea
//                             placeholder={`e.g.\n{\n  "summary": "{summary}",\n  "due_date": "{due_date}",\n  "notes": [{"note": "{note}"}]\n}`}
//                             onBlur={(e) => {
//                             try {
//                                 const parsed = JSON.parse(e.target.value)

//                                 // --- Shallow flatten (stringify all values, strip outer quotes for strings) ---
//                                 const shallowFlatten = (obj: any): KVEntry[] => {
//                                 return Object.entries(obj).map(([k, v]) => {
//                                     let stringified = JSON.stringify(v)
//                                     if (typeof v === "string" && stringified.startsWith('"') && stringified.endsWith('"')) {
//                                     stringified = stringified.slice(1, -1) // strip outer quotes
//                                     }
//                                     return { id: crypto.randomUUID(), key: k, value: stringified }
//                                 })
//                                 }

//                                 const newEntries = shallowFlatten(parsed)

//                                 // --- Collect placeholders from keys + values ---
//                                 const placeholders: string[] = []
//                                 newEntries.forEach((entry) => {
//                                 placeholders.push(...extractPlaceholdersFromString(entry.key))
//                                 placeholders.push(...extractPlaceholdersFromString(entry.value))
//                                 })

//                                 setFormData((prev: any) => ({
//                                 ...prev,
//                                 body_template: [...prev.body_template, ...newEntries],
//                                 parameters: {
//                                     ...prev.parameters,
//                                     ...Object.fromEntries(
//                                     placeholders.map((p) => [
//                                         p,
//                                         prev.parameters[p] || { type: "", description: "", required: false },
//                                     ])
//                                     ),
//                                 },
//                                 }))
//                             } catch (err) {
//                                 console.error("Invalid JSON", err)
//                                 toast({
//                                 title: "🚨 Invalid JSON",
//                                 description: "Please check the JSON format before pasting.",
//                                 variant: "destructive",
//                                 })
//                             }
//                             }}
//                             className="w-full min-h-[120px] resize-y"
//                         />
//                         <p className="text-sm text-slate-500">
//                             Shallow keys are shown for editing.  
//                             Deepest <code>{`{placeholders}`}</code> (without quotes) — even inside arrays — are carried to Step 6.
//                         </p>
//                         </div>
//                     </div>
//                     )}

//                     {/* Step 6: Parameters (auto-detected) */}
//                     {step === 6 && (
//                     <div className="space-y-4">
//                         <h3 className="font-semibold text-lg">Parameters</h3>
//                         {Object.keys(formData.parameters).length === 0 && (
//                         <p className="italic text-slate-500">No parameters detected in templates.</p>
//                         )}
//                         {Object.keys(formData.parameters).map((paramKey) => (
//                         <div key={paramKey} className="border p-3 rounded-xl bg-white shadow-sm">
//                             <h4 className="font-semibold">{paramKey}</h4>
//                             <Input
//                             placeholder="Type (e.g. string, number)"
//                             value={formData.parameters[paramKey]?.type || ""}
//                             onChange={(e) => handleParameterConfig(paramKey, "type", e.target.value)}
//                             className="mt-2"
//                             />
//                             <Input
//                             placeholder="Description"
//                             value={formData.parameters[paramKey]?.description || ""}
//                             onChange={(e) => handleParameterConfig(paramKey, "description", e.target.value)}
//                             className="mt-2"
//                             />
//                             <div className="flex items-center gap-2 mt-2">
//                             <Checkbox
//                                 checked={formData.parameters[paramKey]?.required || false}
//                                 onCheckedChange={(checked) => handleParameterConfig(paramKey, "required", !!checked)}
//                             />
//                             <span>Required</span>
//                             </div>
//                         </div>
//                         ))}
//                     </div>
//                     )}

//                                 {/* Step 7: Misc */}
//                                 {/* Step 7: Misc */}
//                     {step === 7 && (
//                     <div className="space-y-4">
//                         <div className="flex items-center gap-2">
//                         <Checkbox
//                             checked={formData.omit_nulls}
//                             onCheckedChange={(checked) =>
//                             setFormData({ ...formData, omit_nulls: !!checked })
//                             }
//                         />
//                         <span>Omit nulls</span>
//                         </div>

//                         <div className="space-y-2">
//                         <label className="font-semibold">Timeout (ms)</label>
//                         <Input
//                             type="number"
//                             placeholder="Timeout (ms)"
//                             value={formData.timeout_ms}
//                             onChange={(e) =>
//                             setFormData({ ...formData, timeout_ms: Number(e.target.value) })
//                             }
//                         />
//                         </div>

//                         <div className="flex items-center gap-2 mt-4">
//                         <Checkbox
//                             checked={formData.speak_during_execution.enabled}
//                             onCheckedChange={(checked) =>
//                             setFormData({
//                                 ...formData,
//                                 speak_during_execution: {
//                                 ...formData.speak_during_execution,
//                                 enabled: !!checked,
//                                 },
//                             })
//                             }
//                         />
//                         <span>Speak During Execution</span>
//                         </div>

//                         {formData.speak_during_execution.enabled && (
//                         <div className="space-y-4 mt-3">
//                             <div className="space-y-2">
//                             <label className="font-semibold">Delay Seconds</label>
//                             <Input
//                                 type="number"
//                                 placeholder="Delay (seconds)"
//                                 value={formData.speak_during_execution.delay_seconds}
//                                 onChange={(e) =>
//                                 setFormData({
//                                     ...formData,
//                                     speak_during_execution: {
//                                     ...formData.speak_during_execution,
//                                     delay_seconds: Number(e.target.value),
//                                     },
//                                 })
//                                 }
//                             />
//                             </div>

//                             <div className="space-y-2">
//                             <label className="font-semibold">Message</label>
//                             <Textarea
//                                 placeholder="Message"
//                                 value={formData.speak_during_execution.message}
//                                 onChange={(e) =>
//                                 setFormData({
//                                     ...formData,
//                                     speak_during_execution: {
//                                     ...formData.speak_during_execution,
//                                     message: e.target.value,
//                                     },
//                                 })
//                                 }
//                             />
//                             </div>
//                         </div>
//                         )}
//                     </div>
//                     )}

//                             </motion.div>
//                             </AnimatePresence>

//                             {/* Navigation */}
//                             <div className="flex justify-between pt-8">
//                             {step > 1 && (
//                                 <Button variant="outline" onClick={() => setStep((s) => (s - 1) as Step)}>
//                                 ← Back
//                                 </Button>
//                             )}
//                             {step < 7 && (
//                                 <Button
//                                 className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
//                                 onClick={() => setStep((s) => (s + 1) as Step)}
//                                 >
//                                 Next →
//                                 </Button>
//                             )}
//                             {step === 7 && (
//                                 <Button
//                                 className="bg-green-600 hover:bg-green-700 text-white shadow-lg"
//                                 onClick={handleSubmit}
//                                 >
//                                 ✅ Submit
//                                 </Button>
//           )}
//         </div>
//       </CardContent>
//     </Card>
//   )
// }



"use client"

import { useState, useMemo } from "react"
import { useEffect } from "react"
import Cookies from "js-cookie"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

// Step types
type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7

// Helper type for key/value pairs
type KVEntry = { id: string; key: string; value: string }

export default function CustomToolsForm({
  tool,
  onSuccess,
}: {
  tool?: any
  onSuccess?: () => void
}) {
  const { toast } = useToast()
  const token = Cookies.get("Token") || ""
  const [step, setStep] = useState<Step>(1)

  // Define step labels once
const stepLabels: Record<Step, string> = {
  1: "Basic Info",
  2: "Request Setup",
  3: "Headers",
  4: "Query Params",
  5: "Body",
  6: "Parameters",
  7: "Misc",
}

const totalSteps = Object.keys(stepLabels).length



  // Main form state
  const [formData, setFormData] = useState<any>({
    name: "",
    description: "",
    method: "POST",
    url: "",
    headers: [] as KVEntry[],
    query_template: [] as KVEntry[],
    body_template: [] as KVEntry[],
    parameters: {},
    omit_nulls: false,
    timeout_ms: 30000,
    speak_during_execution: {
      enabled: false,
      delay_seconds: 0,
      message: "",
      message_field_type: "message",
    },
  })
 useEffect(() => {
  if (tool) {
    // Detect which field type is being used
    let detectedFieldType = "message"; // default
    let messageValue = "";

    if (tool.speak_during_execution) {
      if (tool.speak_during_execution.instructions) {
        detectedFieldType = "instructions";
        messageValue = tool.speak_during_execution.instructions;
      } else if (tool.speak_during_execution.message) {
        detectedFieldType = "message";
        messageValue = tool.speak_during_execution.message;
      }
    }

    setFormData({
      ...formData,
      ...tool,
      headers: tool.headers
        ? Object.entries(tool.headers).map(([k, v]: [string, any]) => ({
            id: crypto.randomUUID(),
            key: k,
            value: typeof v === "string" ? v : JSON.stringify(v),
          }))
        : [],
      query_template: tool.query_template
        ? Object.entries(tool.query_template).map(([k, v]: [string, any]) => ({
            id: crypto.randomUUID(),
            key: k,
            value: typeof v === "string" ? v : JSON.stringify(v),
          }))
        : [],
      body_template: tool.body_template
        ? Object.entries(tool.body_template).map(([k, v]: [string, any]) => ({
            id: crypto.randomUUID(),
            key: k,
            value: typeof v === "string" ? v : JSON.stringify(v),
          }))
        : [],
      speak_during_execution: {
        enabled: tool.speak_during_execution?.enabled || false,
        delay_seconds: tool.speak_during_execution?.delay_seconds || 0,
        message: messageValue,
        message_field_type: detectedFieldType,
      },
    })
  }
}, [tool])

  // Add new KV row
  const addKV = (section: "headers" | "query_template" | "body_template") => {
    setFormData((prev: any) => ({
      ...prev,
      [section]: [
        ...prev[section],
        { id: crypto.randomUUID(), key: "", value: "" },
      ],
    }))
  }

  // Helper to recursively get the deepest placeholder
function getDeepestPlaceholder(value: string): string | null {
  let current = value.trim()

  // If contains quotes, skip immediately
  if (current.includes('"') || current.includes("'")) return null

  // Keep peeling nested braces like {{{param}}} → {{param}} → {param}
  while (current.startsWith("{") && current.endsWith("}")) {
    current = current.slice(1, -1).trim()
  }

  // At this point current is the innermost string
  if (!current.includes("{") && !current.includes("}") && current.length > 0) {
    return current
  }

  return null
}

function extractDeepestCurlyStrings(inputStr: string): string[] {
  // Step 1: Remove double quotes
  let s: string = inputStr.replace(/"/g, "");

  // Step 2: Balance curly braces using stack
  let stack: number[] = [];
  let toRemove: Set<number> = new Set();

  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === "{") {
      stack.push(i);
    } else if (ch === "}") {
      if (stack.length > 0) {
        stack.pop(); // valid pair
      } else {
        toRemove.add(i); // extra closing
      }
    }
  }

  while (stack.length > 0) {
    toRemove.add(stack.pop()!); // extra opening
  }

  // Build balanced string
  s = s
    .split("")
    .map((ch, idx) => (toRemove.has(idx) ? "" : ch))
    .join("");

  // Step 3: Traverse and extract deepest substrings
  let result: string[] = [];
  stack = [];

  for (let i = 0; i < s.length; i++) {
    if (s[i] === "{") {
      stack.push(i);
    }

    if (s[i] === "}" && stack.length > 0) {
      const candidate = s.slice(stack[stack.length - 1] + 1, i).trim();

      // ✅ Filter: skip if contains :, [ or ], or empty
      if (
        candidate &&
        !candidate.includes(":") &&
        !candidate.includes("[") &&
        !candidate.includes("]")
      ) {
        result.push(candidate);
      }

      stack = []; // reset for next deepest block
    }
  }

  // ✅ Remove duplicates
  return Array.from(new Set(result));
}

const extractPlaceholdersFromString = (str: string): string[] => {
  const found: string[] = []
  const regex = /\{([^{}]+)\}/g // match {word}

  let match
  while ((match = regex.exec(str)) !== null) {
    let candidate = match[1].trim()

    // ❌ reject if contains quotes, nested braces, or empty
    if (
      candidate === "" ||
      candidate.includes('"') ||
      candidate.includes("'") ||
      candidate.includes("{") ||
      candidate.includes("}")
    ) {
      continue
    }

    found.push(candidate)
  }
  return found
}


  // Update KV row without losing focus
  const updateKV = (
    section: "headers" | "query_template" | "body_template",
    id: string,
    field: "key" | "value",
    newValue: string
  ) => {
    setFormData((prev: any) => ({
      ...prev,
      [section]: prev[section].map((entry: KVEntry) =>
        entry.id === id ? { ...entry, [field]: newValue } : entry
      ),
    }))
  }

  const handleParameterConfig = (paramKey: string, field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      parameters: {
        ...prev.parameters,
        [paramKey]: {
          ...prev.parameters[paramKey],
          [field]: value,
        },
      },
    }))
  }

  // Extract placeholders like {summary}, {phone_number}
  const extractedParams = useMemo(() => {
    const regex = /^\{[a-zA-Z0-9_]+\}$/;
    const found: string[] = []

    const scan = (entries: KVEntry[]) => {
    entries.forEach((e) => {
      const val = e.value.trim();
      if (regex.test(val)) {
        found.push(val.slice(1, -1)); // remove { }
      }
    });
  };

  

    scan(formData.query_template)
    scan(formData.body_template)

    // 🔥 Scan URL for {placeholders}
    
    const urlMatches = formData.url.match(/\{[a-zA-Z0-9_]+\}/g);
    
    if (urlMatches) {
      urlMatches.forEach((m) => found.push(m.slice(1, -1))); // strip braces
    }
    // alert(urlMatches)
    // alert(JSON.stringify(found))
    return Array.from(new Set(found)) // unique only
  }, [formData.url, formData.query_template, formData.body_template])

  // Sync extracted params into formData.parameters
useEffect(() => {
  if (extractedParams.length > 0) {
    setFormData((prev: any) => ({
      ...prev,
      parameters: {
        ...prev.parameters,
        ...Object.fromEntries(
          extractedParams.map((p) => [
            p,
            prev.parameters[p] || { type: "", description: "", required: false },
          ])
        ),
      },
    }));
  }
}, [extractedParams]);

const initialFormData = {
  name: "",
  description: "",
  method: "POST",
  url: "",
  headers: [] as KVEntry[],
  query_template: [] as KVEntry[],
  body_template: [] as KVEntry[],
  parameters: {},
  omit_nulls: false,
  timeout_ms: 30000,
  speak_during_execution: {
    enabled: false,
    delay_seconds: 0,
    message: "",
    message_field_type: "message",
  },
}

const handleSubmit = async () => {
  try {
    const formatKV = (arr: KVEntry[]) =>
      Object.fromEntries(
        arr
          .filter(e => e.key)
          .map(e => {
            let raw = e.value.trim()
            if (/^\{[a-zA-Z0-9_]+\}$/.test(raw)) {
              return [e.key, raw]
            }
            try {
              return [e.key, JSON.parse(raw)]
            } catch {
              return [e.key, raw]
            }
          })
      )

    const payload = {
      name: formData.name,
      description: formData.description,
      method: formData.method,
      url: formData.url,
      headers: formatKV(formData.headers),
      query_template: formatKV(formData.query_template),
      body_template: formatKV(formData.body_template),
      // parameters: extractedParams.reduce((acc, key) => {
      //   if (formData.parameters[key]) {
      //     acc[key] = formData.parameters[key]
      //   }
      //   return acc
      // }, {} as Record<string, any>),
      parameters: formData.parameters,
      omit_nulls: formData.omit_nulls,
      timeout_ms: formData.timeout_ms,
      speak_during_execution: {
        enabled:
          formData.speak_during_execution.enabled === true ||
          formData.speak_during_execution.enabled === "true",
        delay_seconds:
            Number(formData.speak_during_execution.delay_seconds) || 0,
          [formData.speak_during_execution.message_field_type || "message"]: 
            formData.speak_during_execution.message || "",
      },
    }

    console.log("Submitting payload:", JSON.stringify(payload, null, 2))

    const url = tool
  ? `${process.env.NEXT_PUBLIC_BASE_URL}/custom_feature/custom-features/${tool.id}/`
  : `${process.env.NEXT_PUBLIC_BASE_URL}/custom_feature/custom-features/`

const method = tool ? "PATCH" : "POST"

const res = await fetch(url, {
  method,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Token ${Cookies.get("Token") || ""}`,
  },
  body: JSON.stringify(payload),
})


    if (!res.ok) throw new Error("Request failed")
    const data = await res.json()
    console.log("Response:", data)

    // ✅ Reset form + close
    setFormData(initialFormData)
    setStep(1) // or setOpen(false) if it's in a modal/drawer
    onSuccess?.()

    if (tool){
toast({ title: "Success", description: "Custom feature updated!" })
    }
    else{
    toast({ title: "Success", description: "Custom feature created!" })
    }
  } catch (err) {
    console.error("Submit failed", err)
    toast({
      variant: "destructive",
      title: "Error",
      description: "Could not create feature.",
    })
  }
}

  return (
    
    <Card className="p-6 rounded-2xl shadow-2xl bg-gradient-to-br from-white via-slate-50 to-slate-100 border border-slate-200 max-h-[90vh] overflow-y-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Create Custom Tool
        </CardTitle>
        <p className="text-center text-slate-500 mt-1">
          Step {step} of 7
        </p>
        {/* Progress Stepper */}
{/* Progress Stepper (replace old <Progress /> with this) */}
<div className="relative w-full mt-3">
  {/* base line (behind, full length) */}
  <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 bg-slate-200 rounded-full z-0" />

  {/* filled line (stops at current step center) */}
  <div
    className="absolute left-0 top-1/2 h-1 -translate-y-1/2 bg-black rounded-full z-0 transition-all duration-300"
    style={{
      width: `${((step - 1) / (totalSteps - 1)) * 100}%`,
    }}
  />

  {/* circles row */}
  <div className="relative flex justify-between items-center h-12 z-10">
    {Object.entries(stepLabels).map(([num, label]) => {
      const stepNum = Number(num) as Step
      const isCurrent = stepNum === step
      const isCompleted = stepNum < step

      return (
        <div key={num} className="group relative flex flex-col items-center">
          {/* circle */}
          <button
            type="button"
            onClick={() => setStep(stepNum)}
            disabled={isCurrent}
            className={`w-9 h-9 rounded-full border flex items-center justify-center text-sm font-medium transform transition-transform
              ${
                isCurrent
                  ? "bg-blue-600 text-white border-blue-600"
                  : isCompleted
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-600 border-gray-300"
              }
              group-hover:scale-110
            `}
            aria-current={isCurrent ? "true" : "false"}
          >
            {num}
          </button>

          {/* tooltip above circle (shows on hover) */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150">
            <div className="bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap shadow">
              Step {num}: {label}
            </div>
          </div>
        </div>
      )
    })}
  </div>
</div>


      </CardHeader>

      <CardContent>
        {/* Step Navigation */}
{/* <div className="flex flex-wrap justify-center gap-2 mb-6">
  {Object.entries(stepLabels).map(([num, label]) => {
    const stepNum = Number(num) as Step
    const isCurrent = stepNum === step
    return (
      <button
        key={num}
        onClick={() => !isCurrent && setStep(stepNum)}
        disabled={isCurrent}
        className={`px-3 py-1 rounded-md border text-sm transition
          ${isCurrent 
            ? "bg-black text-white border-black cursor-not-allowed"
            : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 hover:text-black"
          }`}
      >
        {label}
      </button>
    )
  })}
</div> */}

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
                            {/* Step 1 */}
                    {step === 1 && (
                    <div className="space-y-6">
                        <div className="space-y-2">
                        <label htmlFor="tool-name" className="block text-sm font-semibold text-slate-700">
                            Name
                        </label>
                        <Input
                            id="tool-name"
                            placeholder="Tool Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full"
                        />
                        </div>

                        <div className="space-y-2">
                        <label htmlFor="tool-description" className="block text-sm font-semibold text-slate-700">
                            Description
                        </label>
                        <Textarea
                            id="tool-description"
                            placeholder="Tool Description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full min-h-[96px] resize-y"
                        />
                        </div>
                    </div>
                    )}

                    {/* Step 2 */}
                    {step === 2 && (
                    <div className="space-y-6">
                        <div className="space-y-2">
                        <label htmlFor="request-method" className="block text-sm font-semibold text-slate-700">
                            Method
                        </label>
                        <div>
                            <select
                            id="request-method"
                            className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                            value={formData.method}
                            onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                            >
                            {["GET", "POST", "PUT", "PATCH", "DELETE"].map((m) => (
                                <option key={m} value={m}>
                                {m}
                                </option>
                            ))}
                            </select>
                        </div>
                        </div>

                        <div className="space-y-2">
                        <label htmlFor="request-url" className="block text-sm font-semibold text-slate-700">
                            URL
                        </label>
                        <Input
                            id="request-url"
                            placeholder="Request URL"
                            value={formData.url}
                            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                            className="w-full"
                        />
                        </div>
                    </div>
                    )}


                                {/* Step 3: Headers */}
                                {step === 3 && (
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-lg">Headers</h3>
                                    {formData.headers.map((entry: KVEntry) => (
                                    <div key={entry.id} className="flex gap-2">
                                        <Input
                                        placeholder="Key"
                                        value={entry.key}
                                        onChange={(e) =>
                                            updateKV("headers", entry.id, "key", e.target.value)
                                        }
                                        />
                                        <Input
                                        placeholder="Value"
                                        value={entry.value}
                                        onChange={(e) =>
                                            updateKV("headers", entry.id, "value", e.target.value)
                                        }
                                        />
                                    </div>
                                    ))}
                                    <Button variant="outline" onClick={() => addKV("headers")}>
                                    + Add Header
                                    </Button>
                                </div>
                                )}

                    {/* Step 4 */}
                    {step === 4 && (
                    <div className="space-y-3">
                        <h3 className="font-semibold text-lg">Query Parameters</h3>
                        {formData.query_template.map((entry: KVEntry) => (
                        <div key={entry.id} className="flex gap-2">
                            <Input
                            placeholder="Key"
                            value={entry.key}
                            onChange={(e) => {
                                updateKV("query_template", entry.id, "key", e.target.value)

                                // detect {placeholders} in key
                                const placeholders = extractPlaceholdersFromString(e.target.value)
                                if (placeholders.length > 0) {
                                setFormData((prev: any) => ({
                                    ...prev,
                                    parameters: {
                                    ...prev.parameters,
                                    ...Object.fromEntries(
                                        placeholders.map((p) => [
                                        p,
                                        prev.parameters[p] || {
                                            type: "",
                                            description: "",
                                            required: false,
                                        },
                                        ])
                                    ),
                                    },
                                }))
                                }
                            }}
                            />
                            <Input
                            placeholder="Value"
                            value={entry.value}
                            onChange={(e) => {
                                updateKV("query_template", entry.id, "value", e.target.value)

                                // detect {placeholders} in value
                                const placeholders = extractPlaceholdersFromString(e.target.value)
                                if (placeholders.length > 0) {
                                setFormData((prev: any) => ({
                                    ...prev,
                                    parameters: {
                                    ...prev.parameters,
                                    ...Object.fromEntries(
                                        placeholders.map((p) => [
                                        p,
                                        prev.parameters[p] || {
                                            type: "",
                                            description: "",
                                            required: false,
                                        },
                                        ])
                                    ),
                                    },
                                }))
                                }
                            }}
                            />
                        </div>
                        ))}
                        <Button variant="outline" onClick={() => addKV("query_template")}>
                        + Add Query Param
                        </Button>
                    </div>
                    )}

                    {/* Step 5 */}
                    {step === 5 && (
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Body Template</h3>

                        {/* Manual key-value input */}
                        <div className="space-y-3">
                        {formData.body_template.map((entry: KVEntry) => (
                            <div key={entry.id} className="flex gap-2">
                            <Input
                                placeholder="Key"
                                value={entry.key}
                                onChange={(e) => {
                                updateKV("body_template", entry.id, "key", e.target.value)

                                // detect {placeholders} in key
                                const placeholders = extractPlaceholdersFromString(e.target.value)
                                if (placeholders.length > 0) {
                                    setFormData((prev: any) => ({
                                    ...prev,
                                    parameters: {
                                        ...prev.parameters,
                                        ...Object.fromEntries(
                                        placeholders.map((p) => [
                                            p,
                                            prev.parameters[p] || {
                                            type: "",
                                            description: "",
                                            required: false,
                                            },
                                        ])
                                        ),
                                    },
                                    }))
                                }
                                }}
                                className="w-1/2"
                            />
                            <Input
                                placeholder="Value"
                                value={entry.value}
                                onChange={(e) => {
                                updateKV("body_template", entry.id, "value", e.target.value)

                                // detect {placeholders} in value
                                const placeholders = extractPlaceholdersFromString(e.target.value)
                                if (placeholders.length > 0) {
                                    setFormData((prev: any) => ({
                                    ...prev,
                                    parameters: {
                                        ...prev.parameters,
                                        ...Object.fromEntries(
                                        placeholders.map((p) => [
                                            p,
                                            prev.parameters[p] || {
                                            type: "",
                                            description: "",
                                            required: false,
                                            },
                                        ])
                                        ),
                                    },
                                    }))
                                }
                                }}
                                className="w-1/2"
                            />
                            </div>
                        ))}
                        <Button variant="outline" onClick={() => addKV("body_template")}>
                            + Add Body Field
                        </Button>
                        </div>

                        {/* JSON Paste Section */}
                        <div className="space-y-2 pt-4">
                        <label className="font-semibold block">Paste JSON</label>
                        <Textarea
                            placeholder={`e.g.\n{\n  "summary": "{summary}",\n  "due_date": "{due_date}",\n  "notes": [{"note": "{note}"}]\n}`}
                            onBlur={(e) => {
                            try {
                                const parsed = JSON.parse(e.target.value)

                                // --- Shallow flatten (stringify all values, strip outer quotes for strings) ---
                                const shallowFlatten = (obj: any): KVEntry[] => {
                                return Object.entries(obj).map(([k, v]) => {
                                    let stringified = JSON.stringify(v)
                                    if (typeof v === "string" && stringified.startsWith('"') && stringified.endsWith('"')) {
                                    stringified = stringified.slice(1, -1) // strip outer quotes
                                    }
                                    return { id: crypto.randomUUID(), key: k, value: stringified }
                                })
                                }

                                const newEntries = shallowFlatten(parsed)

// --- Collect placeholders from keys + values ---
const placeholders: string[] = []
newEntries.forEach((entry) => {
  // from keys
  placeholders.push(...extractPlaceholdersFromString(entry.key))

  // from values (deepest curly brace strings)
  placeholders.push(...extractDeepestCurlyStrings(entry.value))
})


                                setFormData((prev: any) => ({
                                ...prev,
                                body_template: [...prev.body_template, ...newEntries],
                                parameters: {
                                    ...prev.parameters,
                                    ...Object.fromEntries(
                                    placeholders.map((p) => [
                                        p,
                                        prev.parameters[p] || { type: "", description: "", required: false },
                                    ])
                                    ),
                                },
                                }))
                            } catch (err) {
                                console.error("Invalid JSON", err)
                                toast({
                                title: "🚨 Invalid JSON",
                                description: "Please check the JSON format before pasting.",
                                variant: "destructive",
                                })
                            }
                            }}
                            className="w-full min-h-[120px] resize-y"
                        />
                        <p className="text-sm text-slate-500">
                            Shallow keys are shown for editing.  
                            Deepest <code>{`{placeholders}`}</code> (without quotes) — even inside arrays — are carried to Step 6.
                        </p>
                        </div>
                    </div>
                    )}

                    {/* Step 6: Parameters (auto-detected) */}
                    {/* Step 6 */}
{step === 6 && (
  <div className="space-y-4">
    <h3 className="font-semibold text-lg">Parameters</h3>

    {/* Existing Parameters */}
    {Object.keys(formData.parameters || {}).map((paramKey) => (
      <div
        key={paramKey}
        className="border rounded-lg p-4 bg-slate-50 flex flex-col space-y-3"
      >
        {/* Header row: Parameter name + Remove button */}
        <div className="flex items-center justify-between">
          <input
            type="text"
            value={paramKey}
            onChange={(e) => {
              const newKey = e.target.value
              const updated = { ...formData.parameters }
              updated[newKey] = updated[paramKey]
              delete updated[paramKey]
              setFormData((prev) => ({ ...prev, parameters: updated }))
            }}
            className="flex-1 rounded border px-3 py-2"
            placeholder="Parameter name"
          />

          <button
            onClick={() => {
              const updated = { ...formData.parameters }
              delete updated[paramKey]
              setFormData((prev) => ({ ...prev, parameters: updated }))
            }}
            className="ml-3 text-red-500 hover:text-red-700 text-sm"
          >
            ✕
          </button>
        </div>

        {/* Type Dropdown (with array handling) */}
        <select
          className="w-full rounded-lg border px-3 py-2"
          value={formData.parameters[paramKey]?.type || ""}
          onChange={(e) => {
            const newType = e.target.value
            handleParameterConfig(paramKey, "type", newType)
            if (newType === "array") {
              handleParameterConfig(paramKey, "items", { type: "" })
            } else {
              handleParameterConfig(paramKey, "items", undefined)
            }
          }}
        >
          <option value="">-- Select Type --</option>
          <option value="string">string</option>
          <option value="integer">integer</option>
          <option value="float">float</option>
          <option value="double">double</option>
          <option value="boolean">boolean</option>
          <option value="char">char</option>
          <option value="array">array</option>
          <option value="object">object</option>
        </select>

        {/* If array → show items dropdown */}
        {formData.parameters[paramKey]?.type === "array" && (
          <select
            className="w-full rounded-lg border px-3 py-2"
            value={formData.parameters[paramKey]?.items?.type || ""}
            onChange={(e) =>
              handleParameterConfig(paramKey, "items", { type: e.target.value })
            }
          >
            <option value="">-- Select Item Type --</option>
            <option value="string">string</option>
            <option value="integer">integer</option>
            <option value="float">float</option>
            <option value="double">double</option>
            <option value="boolean">boolean</option>
            <option value="char">char</option>
          </select>
        )}

        {/* Required checkbox */}
        <label className="flex items-center space-x-2 text-sm">
          <input
            type="checkbox"
            checked={formData.parameters[paramKey]?.required || false}
            onChange={(e) =>
              handleParameterConfig(paramKey, "required", e.target.checked)
            }
          />
          <span>Required</span>
        </label>

        {/* Description */}
        <textarea
          placeholder="Description"
          value={formData.parameters[paramKey]?.description || ""}
          onChange={(e) =>
            handleParameterConfig(paramKey, "description", e.target.value)
          }
          className="w-full rounded border px-3 py-2"
        />
      </div>
    ))}

    {/* Add Parameter Button */}
    <button
      onClick={() => {
        const newKey = `param_${Object.keys(formData.parameters || {}).length + 1}`
        setFormData((prev) => ({
          ...prev,
          parameters: {
            ...prev.parameters,
            [newKey]: {
              type: "",
              required: false,
              description: "",
            },
          },
        }))
      }}
      className="px-4 py-2 rounded-lg bg-white text-black border border-gray-300 hover:bg-gray-100"
    >
      + Add Parameter
    </button>
  </div>
)}


                                {/* Step 7: Misc */}
                                {/* Step 7: Misc */}
                    {step === 7 && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                        <Checkbox
                            checked={formData.omit_nulls}
                            onCheckedChange={(checked) =>
                            setFormData({ ...formData, omit_nulls: !!checked })
                            }
                        />
                        <span>Omit nulls</span>
                        </div>

                        <div className="space-y-2">
                        <label className="font-semibold">Timeout (ms)</label>
                        <Input
                            type="number"
                            placeholder="Timeout (ms)"
                            value={formData.timeout_ms}
                            onChange={(e) =>
                            setFormData({ ...formData, timeout_ms: Number(e.target.value) })
                            }
                        />
                        </div>

                        <div className="flex items-center gap-2 mt-4">
                        <Checkbox
                            checked={formData.speak_during_execution.enabled}
                            onCheckedChange={(checked) =>
                            setFormData({
                                ...formData,
                                speak_during_execution: {
                                ...formData.speak_during_execution,
                                enabled: !!checked,
                                },
                            })
                            }
                        />
                        <span>Speak During Execution</span>
                        </div>

                        {formData.speak_during_execution.enabled && (
                        <div className="space-y-4 mt-3">
                            <div className="space-y-2">
                            <label className="font-semibold">Delay Seconds</label>
                            <Input
                                type="number"
                                placeholder="Delay (seconds)"
                                value={formData.speak_during_execution.delay_seconds}
                                onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    speak_during_execution: {
                                    ...formData.speak_during_execution,
                                    delay_seconds: Number(e.target.value),
                                    },
                                })
                                }
                            />
                            </div>

                            <div className="space-y-2">
  <label className="font-semibold">Field Type</label>
  <select
    className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
    value={formData.speak_during_execution.message_field_type || "message"}
    onChange={(e) =>
      setFormData({
        ...formData,
        speak_during_execution: {
          ...formData.speak_during_execution,
          message_field_type: e.target.value,
        },
      })
    }
  >
    <option value="message">Message</option>
    <option value="instructions">Instructions</option>
  </select>
</div>

<div className="space-y-2">
  <label className="font-semibold">
    {formData.speak_during_execution.message_field_type === "instructions" 
      ? "Instructions" 
      : "Message"}
  </label>
  <Textarea
    placeholder={
      formData.speak_during_execution.message_field_type === "instructions"
        ? "Instructions"
        : "Message"
    }
    value={formData.speak_during_execution.message}
    onChange={(e) =>
      setFormData({
        ...formData,
        speak_during_execution: {
          ...formData.speak_during_execution,
          message: e.target.value,
        },
      })
    }
  />
</div>
                        </div>
                        )}
                    </div>
                    )}

                            </motion.div>
                            </AnimatePresence>

                            {/* Navigation */}
                            <div className="flex justify-between pt-8">
                            {step > 1 && (
                                <Button variant="outline" onClick={() => setStep((s) => (s - 1) as Step)}>
                                ← Back
                                </Button>
                            )}
                            {step < 7 && (
                                <Button
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                                onClick={() => setStep((s) => (s + 1) as Step)}
                                >
                                Next →
                                </Button>
                            )}
                            {step === 7 && (
                                <Button
                                className="bg-green-600 hover:bg-green-700 text-white shadow-lg"
                                onClick={handleSubmit}
                                >
                                {tool ? "💾 Update Tool" : "✅ Submit"}
                                </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}




// {/* Step 5 */} {step === 5 && ( <div className="space-y-4"> <h3 className="font-semibold text-lg">Body Template</h3> {/* Manual key-value input */} <div className="space-y-3"> {formData.body_template.map((entry: KVEntry) => ( <div key={entry.id} className="flex gap-2"> <Input placeholder="Key" value={entry.key} onChange={(e) => updateKV("body_template", entry.id, "key", e.target.value) } className="w-1/2" /> <Input placeholder="Value" value={entry.value} onChange={(e) => updateKV("body_template", entry.id, "value", e.target.value) } className="w-1/2" /> </div> ))} <Button variant="outline" onClick={() => addKV("body_template")}> + Add Body Field </Button> </div> {/* JSON Paste Section */} <div className="space-y-2 pt-4"> <label className="font-semibold block">Paste JSON</label> <Textarea placeholder={e.g.\n{\n "summary": "{summary}",\n "notes": [{"note": "{note}"}]\n}} onBlur={(e) => { try { const parsed = JSON.parse(e.target.value) // --- Helper: extract deepest placeholder --- const getDeepestPlaceholder = (val: string): string | null => { let current = val.trim() // ❌ reject if contains any single or double quote if (current.includes('"') || current.includes("'")) return null let last: string | null = null while (current.startsWith("{") && current.endsWith("}")) { last = current.slice(1, -1).trim() current = last } return last && !last.includes("{") && !last.includes("}") ? last : null } // --- Scan for placeholders inside any structure --- const placeholders: string[] = [] const scan = (val: any) => { if (typeof val === "string") { const deepest = getDeepestPlaceholder(val) if (deepest) placeholders.push(deepest) } else if (Array.isArray(val)) { val.forEach(scan) } else if (typeof val === "object" && val !== null) { Object.values(val).forEach(scan) } } scan(parsed) // --- Shallow flatten only (for editing UI) --- const shallowFlatten = (obj: any): KVEntry[] => { return Object.entries(obj).map(([k, v]) => ({ id: crypto.randomUUID(), key: k, value: typeof v === "string" || typeof v === "number" || typeof v === "boolean" ? String(v) : JSON.stringify(v), })) } const newEntries = shallowFlatten(parsed) setFormData((prev: any) => ({ ...prev, body_template: [...prev.body_template, ...newEntries], parameters: { ...prev.parameters, ...Object.fromEntries( placeholders.map((p) => [ p, prev.parameters[p] || { type: "", description: "", required: false, }, ]) ), }, })) } catch (err) { console.error("Invalid JSON", err) toast({ title: "🚨 Invalid JSON", description: "Please check the JSON format before pasting.", variant: "destructive", }) } }} className="w-full min-h-[120px] resize-y" /> <p className="text-sm text-slate-500"> Shallow keys are shown for editing. Deepest <code>{{placeholders}}</code> (without quotes) — even inside arrays — are carried to Step 6. </p> </div> </div> )} {/* Step 6: Parameters (auto-detected) */} {step === 6 && ( <div className="space-y-4"> <h3 className="font-semibold text-lg">Parameters</h3> {extractedParams.length === 0 && ( <p className="italic text-slate-500"> No parameters detected in templates. </p> )} {extractedParams.map((paramKey) => ( <div key={paramKey} className="border p-3 rounded-xl bg-white shadow-sm"> <h4 className="font-semibold">{paramKey}</h4> <Input placeholder="Type (e.g. string, number)" value={formData.parameters[paramKey]?.type || ""} onChange={(e) => handleParameterConfig(paramKey, "type", e.target.value) } className="mt-2" /> <Input placeholder="Description" value={formData.parameters[paramKey]?.description || ""} onChange={(e) => handleParameterConfig(paramKey, "description", e.target.value) } className="mt-2" /> <div className="flex items-center gap-2 mt-2"> <Checkbox checked={formData.parameters[paramKey]?.required || false} onCheckedChange={(checked) => handleParameterConfig(paramKey, "required", !!checked) } /> <span>Required</span> </div> </div> ))} </div> )}