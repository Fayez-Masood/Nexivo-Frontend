// "use client"

// import type * as React from "react"
// import { useState } from "react"
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Check, UploadCloud } from "lucide-react"
// import { cn } from "@/lib/utils"
// import { AudioPlayer } from "@/components/ui/audio-player"
// import { useToast } from "@/hooks/use-toast"

// interface AddAgentWizardProps {
//   isOpen: boolean
//   onClose: () => void
//   onAgentAdded: (agentData: any) => void
// }

// interface AgentFormData {
//   name: string
//   persona: string
//   goals: string
//   voiceType: "predefined" | "upload"
//   selectedVoiceId?: string
//   uploadedVoiceFile?: File | null
// }

// const predefinedVoices = [
//   {
//     id: "marissa",
//     name: "Marissa",
//     description: "your voice agent from Canada.",
//     avatar: "/placeholder.svg?height=64&width=64",
//     audioSrc: "/placeholder.svg?height=64&width=64", // Replace with actual audio URL
//   },
//   {
//     id: "scott",
//     name: "Scott",
//     description: "your voice agent from America.",
//     avatar: "/placeholder.svg?height=64&width=64",
//     audioSrc: "/placeholder.svg?height=64&width=64", // Replace with actual audio URL
//   },
//   {
//     id: "charlie",
//     name: "Charlie",
//     description: "your voice agent from UK.",
//     avatar: "/placeholder.svg?height=64&width=64",
//     audioSrc: "/placeholder.svg?height=64&width=64", // Replace with actual audio URL
//   },
// ]

// export function AddAgentWizard({ isOpen, onClose, onAgentAdded }: AddAgentWizardProps) {
//   const [step, setStep] = useState(1)
//   const [formData, setFormData] = useState<AgentFormData>({
//     name: "",
//     persona: "",
//     goals: "",
//     voiceType: "predefined",
//     selectedVoiceId: predefinedVoices[0].id,
//     uploadedVoiceFile: null,
//   })
//   const [isLoading, setIsLoading] = useState(false)
//   const { toast } = useToast()

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { id, value } = e.target
//     setFormData((prev) => ({ ...prev, [id]: value }))
//   }

//   const handleVoiceSelection = (voiceId: string) => {
//     setFormData((prev) => ({ ...prev, voiceType: "predefined", selectedVoiceId: voiceId, uploadedVoiceFile: null }))
//   }

//   const handleVoiceFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]
//     if (file) {
//       if (file.type !== "audio/mpeg") {
//         toast({
//           title: "Invalid file type",
//           description: "Please upload an MP3 file.",
//           variant: "destructive",
//         })
//         return
//       }
//       if (file.size > 5 * 1024 * 1024) {
//         // 5MB limit for demo
//         toast({
//           title: "File too large",
//           description: "Maximum file size is 5MB.",
//           variant: "destructive",
//         })
//         return
//       }
//       setFormData((prev) => ({ ...prev, voiceType: "upload", uploadedVoiceFile: file, selectedVoiceId: undefined }))
//     }
//   }

//   const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault()
//     e.stopPropagation()
//   }

//   const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault()
//     e.stopPropagation()
//     const file = e.dataTransfer.files?.[0]
//     if (file) {
//       if (file.type !== "audio/mpeg") {
//         toast({
//           title: "Invalid file type",
//           description: "Please upload an MP3 file.",
//           variant: "destructive",
//         })
//         return
//       }
//       if (file.size > 5 * 1024 * 1024) {
//         // 5MB limit for demo
//         toast({
//           title: "File too large",
//           description: "Maximum file size is 5MB.",
//           variant: "destructive",
//         })
//         return
//       }
//       setFormData((prev) => ({ ...prev, voiceType: "upload", uploadedVoiceFile: file, selectedVoiceId: undefined }))
//     }
//   }

//   const handleNext = () => {
//     if (step === 1 && !formData.name.trim()) {
//       toast({
//         title: "Agent Name Required",
//         description: "Please enter a name for your agent.",
//         variant: "destructive",
//       })
//       return
//     }
//     if (step === 2 && !formData.persona.trim()) {
//       toast({
//         title: "Agent Persona Required",
//         description: "Please describe the agent's persona.",
//         variant: "destructive",
//       })
//       return
//     }
//     if (step === 3 && !formData.goals.trim()) {
//       toast({
//         title: "Agent Goals Required",
//         description: "Please describe the agent's goals.",
//         variant: "destructive",
//       })
//       return
//     }
//     setStep((prev) => prev + 1)
//   }

//   const handleBack = () => {
//     setStep((prev) => prev - 1)
//   }

//   const handleSubmit = async () => {
//     setIsLoading(true)
//     // Simulate API call
//     await new Promise((resolve) => setTimeout(resolve, 2000))

//     // Here you would send formData to your backend
//     console.log("Submitting agent data:", formData)

//     onAgentAdded(formData) // Pass data to parent component
//     toast({
//       title: "Agent Created!",
//       description: "The agent will be charged according to your plan.",
//       duration: 5000,
//     })
//     setIsLoading(false)
//     onClose() // Close the wizard
//     setStep(1) // Reset step for next time
//     setFormData({
//       // Reset form data
//       name: "",
//       persona: "",
//       goals: "",
//       voiceType: "predefined",
//       selectedVoiceId: predefinedVoices[0].id,
//       uploadedVoiceFile: null,
//     })
//   }

//   const currentVoiceAudioSrc =
//     formData.voiceType === "predefined" && formData.selectedVoiceId
//       ? predefinedVoices.find((v) => v.id === formData.selectedVoiceId)?.audioSrc
//       : formData.uploadedVoiceFile
//         ? URL.createObjectURL(formData.uploadedVoiceFile)
//         : undefined

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-4xl h-[90vh] p-0 flex flex-col">
//         <DialogHeader className="p-6 border-b border-gray-200">
//           <DialogTitle className="text-2xl font-bold text-gray-900">Add New Agent</DialogTitle>
//         </DialogHeader>
//         <div className="flex flex-1 overflow-hidden">
//           {/* Left Sidebar */}
//           <div className="w-64 bg-gradient-to-b from-teal-700 to-teal-900 text-white p-6 flex flex-col justify-between">
//             <div>
//               <h2 className="text-lg font-semibold mb-6">Question {step} of 3</h2>
//               <div className="space-y-6">
//                 {["Persona", "Goals", "Voice"].map((label, index) => (
//                   <div key={label} className="flex items-center space-x-3">
//                     <div
//                       className={cn(
//                         "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300",
//                         step === index + 1
//                           ? "bg-yellow-400 text-teal-900 ring-2 ring-yellow-400 ring-offset-2 ring-offset-teal-700"
//                           : "bg-white/20 text-white/70",
//                       )}
//                     >
//                       {index + 1}
//                     </div>
//                     <span
//                       className={cn(
//                         "text-lg font-medium transition-colors duration-300",
//                         step === index + 1 ? "text-white" : "text-white/70",
//                       )}
//                     >
//                       {label}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//             <div className="text-sm text-white/60">
//             </div>
//           </div>

//           {/* Main Content */}
//           <div className="flex-1 p-8 flex flex-col justify-between overflow-auto">
//             {step === 1 && (
//               <div className="space-y-6">
//                 <h3 className="text-xl font-semibold text-gray-800">What is the desired persona of the agent?</h3>
//                 <p className="text-gray-600">
//                   Describe the personality of your agent. For example: You are a real estate assistant for Simple
//                   Realty. You work with both homeowners and homebuyers and are knowledgeable about trends in the housing
//                   market. You have helped many people accomplish their goals in regard to home buying or selling.
//                 </p>
//                 <Input
//                   id="name"
//                   placeholder="Enter agent name"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   className="h-12 text-lg"
//                 />
//                 <Textarea
//                   id="persona"
//                   placeholder="Describe the agent's personality..."
//                   value={formData.persona}
//                   onChange={handleInputChange}
//                   rows={8}
//                   className="min-h-[150px]"
//                 />
//               </div>
//             )}

//             {step === 2 && (
//               <div className="space-y-6">
//                 <h3 className="text-xl font-semibold text-gray-800">
//                   What do you want SmartConvo agents to accomplish for you?
//                 </h3>
//                 <p className="text-gray-600">
//                   Describe the goal of the agent in a declarative manner. For example: Your goal is to determine what
//                   requirements would need to be met for the homeowner to want to sell their home.
//                 </p>
//                 <Textarea
//                   id="goals"
//                   placeholder="Describe the agent's goals..."
//                   value={formData.goals}
//                   onChange={handleInputChange}
//                   rows={8}
//                   className="min-h-[150px]"
//                 />
//               </div>
//             )}

//             {step === 3 && (
//               <div className="space-y-6">
//                 <h3 className="text-xl font-semibold text-gray-800">Voice Agent</h3>
//                 <RadioGroup
//                   value={formData.selectedVoiceId}
//                   onValueChange={handleVoiceSelection}
//                   className="grid grid-cols-3 gap-4"
//                 >
//                   {predefinedVoices.map((voice) => (
//                     <Label
//                       key={voice.id}
//                       htmlFor={voice.id}
//                       className={cn(
//                         "flex flex-col items-center justify-center rounded-lg border-2 border-gray-200 p-4 cursor-pointer transition-all duration-200",
//                         formData.selectedVoiceId === voice.id
//                           ? "border-teal-600 ring-2 ring-teal-600"
//                           : "hover:border-gray-300",
//                       )}
//                     >
//                       <RadioGroupItem value={voice.id} id={voice.id} className="sr-only" />
//                       <Avatar className="h-16 w-16 mb-3">
//                         <AvatarImage src={voice.avatar || "/placeholder.svg"} alt={voice.name} />
//                         <AvatarFallback>{voice.name.charAt(0)}</AvatarFallback>
//                       </Avatar>
//                       <span className="font-medium text-gray-900">{voice.name}</span>
//                       <span className="text-sm text-gray-500 text-center">{voice.description}</span>
//                       {formData.selectedVoiceId === voice.id && (
//                         <Check className="absolute top-2 right-2 h-5 w-5 text-teal-600" />
//                       )}
//                     </Label>
//                   ))}
//                 </RadioGroup>

//                 <div className="space-y-2">
//                   <h4 className="text-lg font-medium text-gray-800">Preview Voice</h4>
//                   {currentVoiceAudioSrc ? (
//                     <AudioPlayer src={currentVoiceAudioSrc} />
//                   ) : (
//                     <p className="text-gray-500 text-sm">Select a voice or upload your recording to preview.</p>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <h4 className="text-lg font-medium text-gray-800">Upload your recording</h4>
//                   <div
//                     onDragOver={handleDragOver}
//                     onDrop={handleDrop}
//                     className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-gray-400 transition-colors"
//                   >
//                     <UploadCloud className="h-8 w-8 text-gray-400 mb-2" />
//                     <p className="text-gray-600">
//                       <Label
//                         htmlFor="voice-upload"
//                         className="text-teal-600 font-medium cursor-pointer hover:underline"
//                       >
//                         Drag & drop files or Browse
//                       </Label>
//                     </p>
//                     <Input
//                       id="voice-upload"
//                       type="file"
//                       accept="audio/mpeg"
//                       className="sr-only"
//                       onChange={handleVoiceFileUpload}
//                     />
//                     <p className="text-xs text-gray-500 mt-1">Suggested format: Mp3. Maximum duration: 5 minute</p>
//                     {formData.uploadedVoiceFile && (
//                       <p className="text-sm text-gray-700 mt-2">Selected: {formData.uploadedVoiceFile.name}</p>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Navigation Buttons */}
//             <div className="flex justify-end gap-4 mt-8">
//               {step > 1 && (
//                 <Button variant="outline" onClick={handleBack} disabled={isLoading}>
//                   Back
//                 </Button>
//               )}
//               {step < 3 && (
//                 <Button onClick={handleNext} disabled={isLoading}>
//                   Next
//                 </Button>
//               )}
//               {step === 3 && (
//                 <Button onClick={handleSubmit} disabled={isLoading}>
//                   {isLoading ? "Finishing..." : "Finish"}
//                 </Button>
//               )}
//             </div>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }



"use client"

import type * as React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Check, UploadCloud } from "lucide-react"
import { cn } from "@/lib/utils"
import { AudioPlayer } from "@/components/ui/audio-player"
import { useToast } from "@/hooks/use-toast"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"
import { useTutorial } from "@/components/tutorial/TutorialProvider"



interface AddAgentWizardProps {
  isOpen: boolean
  onClose: () => void
  onAgentAdded: (agentData: any) => void
}

interface AgentFormData {
  name: string
  persona: string
  goals: string
  prompt: string
  voiceType: "predefined" | "upload"
  selectedVoiceId?: string
  uploadedVoiceFile?: File | null
}

const predefinedVoices = [
  {
    id: "marissa",
    name: "Marissa",
    description: "your voice agent from Canada.",
    avatar: "/placeholder.svg?height=64&width=64",
    audioSrc: "/placeholder.svg?height=64&width=64",
  },
  {
    id: "scott",
    name: "Scott",
    description: "your voice agent from America.",
    avatar: "/placeholder.svg?height=64&width=64",
    audioSrc: "/placeholder.svg?height=64&width=64",
  },
  {
    id: "charlie",
    name: "Charlie",
    description: "your voice agent from UK.",
    avatar: "/placeholder.svg?height=64&width=64",
    audioSrc: "/placeholder.svg?height=64&width=64",
  },
]

export function AddAgentWizard({ isOpen, onClose, onAgentAdded }: AddAgentWizardProps) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<AgentFormData>({
    name: "",
    persona: "",
    goals: "",
    prompt: "",
    voiceType: "predefined",
    selectedVoiceId: predefinedVoices[0].id,
    uploadedVoiceFile: null,
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { driverRef } = useTutorial();

  const { tutorialSteps, startTutorial, updateTutorialProgress } = useTutorial();

useEffect(() => {
  if (!isOpen) return;

  // Delay to ensure modal DOM is rendered
  const timer = setTimeout(() => {
    startTutorial(true); // modal-specific tutorial
  }, 3000); // 200ms should be enough

  return () => clearTimeout(timer);
}, [isOpen, startTutorial]);

// useEffect(() => {
//   const checkAndStartTutorial = async () => {
//     if (!isOpen) return; // Only proceed if modal/feature is open

//     try {
//       const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
//       const token = Cookies.get("Token") || "";
//       const headers = {
//         "Content-Type": "application/json",
//         Authorization: `Token ${token}`,
//       };

//       const res = await fetch(`${BASE_URL}/companies/get_tutorial/`, { method: "GET", headers });
//       if (!res.ok) throw new Error("Failed to fetch tutorial progress");

//       const data = await res.json();
//       const tutorialArray: number[] = data.tutorial_setup || [];

//       // Start tutorial only if "9" is NOT in the array
//       if (!tutorialArray.includes(9)) {
//         startTutorial();
//       }
//     } catch (err) {
//       console.error("Error checking tutorial progress:", err);
//     }
//   };

//   checkAndStartTutorial();
// }, [isOpen, startTutorial]);




  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleVoiceSelection = (voiceId: string) => {
    setFormData((prev) => ({ ...prev, voiceType: "predefined", selectedVoiceId: voiceId, uploadedVoiceFile: null }))
  }

  const handleVoiceFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("audio/")) {
        toast({ title: "Invalid file type", description: "Please upload an audio file (MP3, WAV, OGG).", variant: "destructive" })
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "File too large", description: "Maximum file size is 5MB.", variant: "destructive" })
        return
      }
      setFormData((prev) => ({ ...prev, voiceType: "upload", uploadedVoiceFile: file, selectedVoiceId: undefined }))
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer.files?.[0]
    if (file) {
      if (!file.type.startsWith("audio/")) {
        toast({ title: "Invalid file type", description: "Please upload an audio file (MP3, WAV, OGG).", variant: "destructive" })
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "File too large", description: "Maximum file size is 5MB.", variant: "destructive" })
        return
      }
      setFormData((prev) => ({ ...prev, voiceType: "upload", uploadedVoiceFile: file, selectedVoiceId: undefined }))
    }
  }

  const handleNext = () => {
    if (step === 1 && !formData.name.trim()) {
      toast({ title: "Agent Name Required", description: "Please enter a name for your agent.", variant: "destructive" })
      return
    }
    if (step === 2 && !formData.persona.trim()) {
      toast({ title: "Agent Persona Required", description: "Please describe the agent's persona.", variant: "destructive" })
      return
    }
    if (step === 3 && (!formData.goals.trim() || !formData.prompt.trim())) {
      toast({ title: "Goals and Prompt Required", description: "Please complete both fields.", variant: "destructive" })
      return
    }
  //   if (step === 1) updateTutorialProgress(3) // Agent Name
  // if (step === 2) updateTutorialProgress(4) // Persona
  // if (step === 3) updateTutorialProgress(5) // Goals & Prompt
  setTimeout(() => {
    driverRef.current?.moveNext()
  }, 100) // adjust delay if needed
    setStep((prev) => prev + 1)
  }

  const handleBack = () => {
    setStep((prev) => prev - 1)
  }

  const handleSubmit = async () => {
    try {
      setIsLoading(true)

      const formPayload = new FormData()
      formPayload.append("name", formData.name)
      formPayload.append("persona", formData.persona)
      formPayload.append("goals", formData.goals)
      formPayload.append("instructions", formData.prompt)
      formPayload.append("status", "active")
      if (formData.uploadedVoiceFile) {
        formPayload.append("voice_clip", formData.uploadedVoiceFile)
      } else if (formData.selectedVoiceId) {
        formPayload.append("selected_voice", formData.selectedVoiceId)
      }

      const jsonPayload = JSON.stringify(Object.fromEntries(formPayload))
      console.log("Submitting agent data:", jsonPayload)
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/agents/agents/`, {
        method: "POST",
        headers: {
          "Authorization": `Token ${Cookies.get("Token") || ""}`,
        },
        body: formPayload,
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => null) // try to parse JSON
        console.error("Backend error:", errorData || await res.text())
        throw new Error(errorData?.error || "Failed to create agent")
      }


      const createdAgent = await res.json()
      onAgentAdded(createdAgent)

      toast({ title: "Agent Created!", description: "The agent will be charged according to your plan.", duration: 5000 })

      setStep(1)
      setFormData({
        name: "",
        persona: "",
        goals: "",
        prompt: "",
        voiceType: "predefined",
        selectedVoiceId: predefinedVoices[0].id,
        uploadedVoiceFile: null,
      })
      onClose()
    } catch (error) {
      console.error(error)
      toast({ title: "Error", description: "Unable to create agent.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const currentVoiceAudioSrc =
    formData.voiceType === "predefined" && formData.selectedVoiceId
      ? predefinedVoices.find((v) => v.id === formData.selectedVoiceId)?.audioSrc
      : formData.uploadedVoiceFile
        ? URL.createObjectURL(formData.uploadedVoiceFile)
        : undefined

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] p-0 flex flex-col">
        <DialogHeader className="p-6 border-b border-gray-200">
          <DialogTitle className="text-2xl font-bold text-gray-900">Add New Agent</DialogTitle>
        </DialogHeader>
        <div className="flex flex-1 overflow-hidden">
          <div className="w-64 bg-gradient-to-b from-teal-700 to-teal-900 text-white p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-semibold mb-6">Question {step} of 3</h2>
              <div className="space-y-6">
                {["Persona", "Goals", "Voice"].map((label, index) => (
                  <div key={label} className="flex items-center space-x-3">
                    <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300", step === index + 1 ? "bg-yellow-400 text-teal-900 ring-2 ring-yellow-400 ring-offset-2 ring-offset-teal-700" : "bg-white/20 text-white/70")}>{index + 1}</div>
                    <span className={cn("text-lg font-medium transition-colors duration-300", step === index + 1 ? "text-white" : "text-white/70")}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1 p-8 flex flex-col justify-between overflow-auto">
            {step === 1 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800">What is the desired persona of the agent?</h3>
                <p className="text-gray-600">Describe the personality of your agent...</p>
               <Input 
  id="name" 
  className="h-12 text-lg agent-modal-input-name" 
  placeholder="Enter agent name" 
  value={formData.name} 
  onChange={handleInputChange} 
/>

<Textarea 
  id="persona" 
  placeholder="Describe the agent's personality..." 
  value={formData.persona} 
  onChange={handleInputChange} 
  rows={8} 
  className="min-h-[150px]" 
/> </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800">What do you want SmartConvo agents to accomplish for you?</h3>
                <p className="text-gray-600">Describe the goal of the agent in a declarative manner...</p>
                <Textarea id="goals" placeholder="Describe the agent's goals..." value={formData.goals} onChange={handleInputChange} rows={6} className="min-h-[100px]" />
                <Textarea id="prompt" placeholder="Add the system prompt..." value={formData.prompt} onChange={handleInputChange} rows={6} className="min-h-[100px]" />
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800">Voice Agent</h3>
                <RadioGroup
  value={formData.selectedVoiceId}
  onValueChange={handleVoiceSelection}
  className="radio-group grid grid-cols-3 gap-4"
>

                  {predefinedVoices.map((voice) => (
                    <Label
                      key={voice.id}
                      htmlFor={voice.id}
                      className={cn(
                        "flex flex-col items-center justify-center rounded-lg border-2 border-gray-200 p-4 cursor-pointer transition-all duration-200",
                        formData.selectedVoiceId === voice.id
                          ? "border-teal-600 ring-2 ring-teal-600"
                          : "hover:border-gray-300",
                      )}
                    >
                      <RadioGroupItem value={voice.id} id={voice.id} className="sr-only" />
                      <Avatar className="h-16 w-16 mb-3">
                        <AvatarImage src={voice.avatar || "/placeholder.svg"} alt={voice.name} />
                        <AvatarFallback>{voice.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-gray-900">{voice.name}</span>
                      <span className="text-sm text-gray-500 text-center">{voice.description}</span>
                      {formData.selectedVoiceId === voice.id && (
                        <Check className="absolute top-2 right-2 h-5 w-5 text-teal-600" />
                      )}
                    </Label>
                  ))}
                </RadioGroup>

                <div className="space-y-2">
                  <h4 className="text-lg font-medium text-gray-800">Preview Voice</h4>
                  {currentVoiceAudioSrc ? (
                    <AudioPlayer src={currentVoiceAudioSrc} />
                  ) : (
                    <p className="text-gray-500 text-sm">Select a voice or upload your recording to preview.</p>
                  )}
                </div>

                <div className="space-y-2">
                  <h4 className="text-lg font-medium text-gray-800">Upload your recording</h4>
                  <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-gray-400 transition-colors"
                  >
                    <UploadCloud className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-gray-600">
                      <Label
                        htmlFor="voice-upload"
                        className="text-teal-600 font-medium cursor-pointer hover:underline"
                      >
                        Drag & drop files or Browse
                      </Label>
                    </p>
                    <Input
                      id="voice-upload"
                      type="file"
                      accept="audio/*"
                      className="sr-only"
                      onChange={handleVoiceFileUpload}
                    />
                    <p className="text-xs text-gray-500 mt-1">Supported formats: MP3, WAV, OGG. Max size: 5MB.</p>
                    {formData.uploadedVoiceFile && (
                      <p className="text-sm text-gray-700 mt-2">Selected: {formData.uploadedVoiceFile.name}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-4 mt-8">
              {step > 1 && (<Button variant="outline" onClick={handleBack} disabled={isLoading}>Back</Button>)}
              {step < 3 && (
  <Button 
    onClick={handleNext} 
    disabled={isLoading} 
    className="agent-modal-next-btn"
  >
    Next
  </Button>
)}

             {step === 3 && (
  <Button
    onClick={async () => {
      setIsLoading(true);

      try {
        // Append steps 2 through 9
        for (let s = 2; s <= 9; s++) {
          await updateTutorialProgress(s); // wait for each backend update
        }
        await updateTutorialProgress(-1);

        // Then submit the agent
        await handleSubmit(); // make sure handleSubmit is async
      } catch (err) {
        console.error("Error updating tutorial steps:", err);
      } finally {
        setIsLoading(false);
      }
    }}
    disabled={isLoading}
    className="agent-modal-finish-btn"
  >
    {isLoading ? "Finishing..." : "Finish"}
  </Button>
)}


            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}


// "use client"

// import type * as React from "react"
// import { useState } from "react"
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Check, UploadCloud } from "lucide-react"
// import { cn } from "@/lib/utils"
// import { AudioPlayer } from "@/components/ui/audio-player"
// import { useToast } from "@/hooks/use-toast"
// import Cookies from "js-cookie"
// import { useRouter } from "next/navigation"


// interface AddAgentWizardProps {
//   isOpen: boolean
//   onClose: () => void
//   onAgentAdded: (agentData: any) => void
// }

// interface AgentFormData {
//   name: string
//   persona: string
//   goals: string
//   prompt: string
//   voiceType: "predefined" | "upload"
//   selectedVoiceId?: string
//   uploadedVoiceFile?: File | null
// }

// const predefinedVoices = [
//   {
//     id: "marissa",
//     name: "Marissa",
//     description: "your voice agent from Canada.",
//     avatar: "/placeholder.svg?height=64&width=64",
//     audioSrc: "/placeholder.svg?height=64&width=64",
//   },
//   {
//     id: "scott",
//     name: "Scott",
//     description: "your voice agent from America.",
//     avatar: "/placeholder.svg?height=64&width=64",
//     audioSrc: "/placeholder.svg?height=64&width=64",
//   },
//   {
//     id: "charlie",
//     name: "Charlie",
//     description: "your voice agent from UK.",
//     avatar: "/placeholder.svg?height=64&width=64",
//     audioSrc: "/placeholder.svg?height=64&width=64",
//   },
// ]

// export function AddAgentWizard({ isOpen, onClose, onAgentAdded }: AddAgentWizardProps) {
//   const router = useRouter()
//   const [step, setStep] = useState(1)
//   const [formData, setFormData] = useState<AgentFormData>({
//     name: "",
//     persona: "",
//     goals: "",
//     prompt: "",
//     voiceType: "predefined",
//     selectedVoiceId: predefinedVoices[0].id,
//     uploadedVoiceFile: null,
//   })
//   const [isLoading, setIsLoading] = useState(false)
//   const { toast } = useToast()

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { id, value } = e.target
//     setFormData((prev) => ({ ...prev, [id]: value }))
//   }

//   const handleVoiceSelection = (voiceId: string) => {
//     setFormData((prev) => ({ ...prev, voiceType: "predefined", selectedVoiceId: voiceId, uploadedVoiceFile: null }))
//   }

//   const handleVoiceFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]
//     if (file) {
//       if (file.type !== "audio/mpeg") {
//         toast({ title: "Invalid file type", description: "Please upload an MP3 file.", variant: "destructive" })
//         return
//       }
//       if (file.size > 5 * 1024 * 1024) {
//         toast({ title: "File too large", description: "Maximum file size is 5MB.", variant: "destructive" })
//         return
//       }
//       setFormData((prev) => ({ ...prev, voiceType: "upload", uploadedVoiceFile: file, selectedVoiceId: undefined }))
//     }
//   }

//   const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault()
//     e.stopPropagation()
//   }

//   const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault()
//     e.stopPropagation()
//     const file = e.dataTransfer.files?.[0]
//     if (file) {
//       if (file.type !== "audio/mpeg") {
//         toast({ title: "Invalid file type", description: "Please upload an MP3 file.", variant: "destructive" })
//         return
//       }
//       if (file.size > 5 * 1024 * 1024) {
//         toast({ title: "File too large", description: "Maximum file size is 5MB.", variant: "destructive" })
//         return
//       }
//       setFormData((prev) => ({ ...prev, voiceType: "upload", uploadedVoiceFile: file, selectedVoiceId: undefined }))
//     }
//   }

//   const handleNext = () => {
//     if (step === 1 && !formData.name.trim()) {
//       toast({ title: "Agent Name Required", description: "Please enter a name for your agent.", variant: "destructive" })
//       return
//     }
//     if (step === 2 && !formData.persona.trim()) {
//       toast({ title: "Agent Persona Required", description: "Please describe the agent's persona.", variant: "destructive" })
//       return
//     }
//     if (step === 3 && (!formData.goals.trim() || !formData.prompt.trim())) {
//       toast({ title: "Goals and Prompt Required", description: "Please complete both fields.", variant: "destructive" })
//       return
//     }
//     setStep((prev) => prev + 1)
//   }

//   const handleBack = () => {
//     setStep((prev) => prev - 1)
//   }

//   const handleSubmit = async () => {
//     try {
//       setIsLoading(true)
//       console.log("Submitting agent data:", formData.name,
//           formData.persona,
//           formData.goals,
//           formData.prompt)

//       const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/agents/agents/`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Token ${Cookies.get("Token") || ""}`,
//         },
//         body: JSON.stringify({
//           name: formData.name,
//           persona: formData.persona,
//           goals: formData.goals,
//           instructions: formData.prompt,
//           //voice: formData.selectedVoiceId || "uploaded-voice",
//           status: "active",
//         }),
//       })

//       if (!res.ok) throw new Error("Failed to create agent")

//       const createdAgent = await res.json()
//       onAgentAdded(createdAgent)

//       toast({ title: "Agent Created!", description: "The agent will be charged according to your plan.", duration: 5000 })

//       setStep(1)
//       setFormData({
//         name: "",
//         persona: "",
//         goals: "",
//         prompt: "",
//         voiceType: "predefined",
//         selectedVoiceId: predefinedVoices[0].id,
//         uploadedVoiceFile: null,
//       })
//       //router.push("/dashboard/agents")
//       onClose()
//     } catch (error) {
//       console.error(error)
//       toast({ title: "Error", description: "Unable to create agent.", variant: "destructive" })
//     } finally {
//       setIsLoading(false)
//     }

    
//   }

//   const currentVoiceAudioSrc =
//     formData.voiceType === "predefined" && formData.selectedVoiceId
//       ? predefinedVoices.find((v) => v.id === formData.selectedVoiceId)?.audioSrc
//       : formData.uploadedVoiceFile
//         ? URL.createObjectURL(formData.uploadedVoiceFile)
//         : undefined

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-4xl h-[90vh] p-0 flex flex-col">
//         <DialogHeader className="p-6 border-b border-gray-200">
//           <DialogTitle className="text-2xl font-bold text-gray-900">Add New Agent</DialogTitle>
//         </DialogHeader>
//         <div className="flex flex-1 overflow-hidden">
//           <div className="w-64 bg-gradient-to-b from-teal-700 to-teal-900 text-white p-6 flex flex-col justify-between">
//             <div>
//               <h2 className="text-lg font-semibold mb-6">Question {step} of 3</h2>
//               <div className="space-y-6">
//                 {["Persona", "Goals", "Voice"].map((label, index) => (
//                   <div key={label} className="flex items-center space-x-3">
//                     <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300", step === index + 1 ? "bg-yellow-400 text-teal-900 ring-2 ring-yellow-400 ring-offset-2 ring-offset-teal-700" : "bg-white/20 text-white/70")}>{index + 1}</div>
//                     <span className={cn("text-lg font-medium transition-colors duration-300", step === index + 1 ? "text-white" : "text-white/70")}>{label}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           <div className="flex-1 p-8 flex flex-col justify-between overflow-auto">
//             {step === 1 && (
//               <div className="space-y-6">
//                 <h3 className="text-xl font-semibold text-gray-800">What is the desired persona of the agent?</h3>
//                 <p className="text-gray-600">Describe the personality of your agent...</p>
//                 <Input id="name" placeholder="Enter agent name" value={formData.name} onChange={handleInputChange} className="h-12 text-lg" />
//                 <Textarea id="persona" placeholder="Describe the agent's personality..." value={formData.persona} onChange={handleInputChange} rows={8} className="min-h-[150px]" />
//               </div>
//             )}

//             {step === 2 && (
//               <div className="space-y-6">
//                 <h3 className="text-xl font-semibold text-gray-800">What do you want SmartConvo agents to accomplish for you?</h3>
//                 <p className="text-gray-600">Describe the goal of the agent in a declarative manner...</p>
//                 <Textarea id="goals" placeholder="Describe the agent's goals..." value={formData.goals} onChange={handleInputChange} rows={6} className="min-h-[100px]" />
//                 <Textarea id="prompt" placeholder="Add the system prompt..." value={formData.prompt} onChange={handleInputChange} rows={6} className="min-h-[100px]" />
//               </div>
//             )}

//             {/* step 3 remains unchanged */}
//              {step === 3 && (
//               <div className="space-y-6">
//                 <h3 className="text-xl font-semibold text-gray-800">Voice Agent</h3>
//                 <RadioGroup
//                   value={formData.selectedVoiceId}
//                   onValueChange={handleVoiceSelection}
//                   className="grid grid-cols-3 gap-4"
//                 >
//                   {predefinedVoices.map((voice) => (
//                     <Label
//                       key={voice.id}
//                       htmlFor={voice.id}
//                       className={cn(
//                         "flex flex-col items-center justify-center rounded-lg border-2 border-gray-200 p-4 cursor-pointer transition-all duration-200",
//                         formData.selectedVoiceId === voice.id
//                           ? "border-teal-600 ring-2 ring-teal-600"
//                           : "hover:border-gray-300",
//                       )}
//                     >
//                       <RadioGroupItem value={voice.id} id={voice.id} className="sr-only" />
//                       <Avatar className="h-16 w-16 mb-3">
//                         <AvatarImage src={voice.avatar || "/placeholder.svg"} alt={voice.name} />
//                         <AvatarFallback>{voice.name.charAt(0)}</AvatarFallback>
//                       </Avatar>
//                       <span className="font-medium text-gray-900">{voice.name}</span>
//                       <span className="text-sm text-gray-500 text-center">{voice.description}</span>
//                       {formData.selectedVoiceId === voice.id && (
//                         <Check className="absolute top-2 right-2 h-5 w-5 text-teal-600" />
//                       )}
//                     </Label>
//                   ))}
//                 </RadioGroup>

//                 <div className="space-y-2">
//                   <h4 className="text-lg font-medium text-gray-800">Preview Voice</h4>
//                   {currentVoiceAudioSrc ? (
//                     <AudioPlayer src={currentVoiceAudioSrc} />
//                   ) : (
//                     <p className="text-gray-500 text-sm">Select a voice or upload your recording to preview.</p>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <h4 className="text-lg font-medium text-gray-800">Upload your recording</h4>
//                   <div
//                     onDragOver={handleDragOver}
//                     onDrop={handleDrop}
//                     className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-gray-400 transition-colors"
//                   >
//                     <UploadCloud className="h-8 w-8 text-gray-400 mb-2" />
//                     <p className="text-gray-600">
//                       <Label
//                         htmlFor="voice-upload"
//                         className="text-teal-600 font-medium cursor-pointer hover:underline"
//                       >
//                         Drag & drop files or Browse
//                       </Label>
//                     </p>
//                     <Input
//                       id="voice-upload"
//                       type="file"
//                       accept="audio/mpeg"
//                       className="sr-only"
//                       onChange={handleVoiceFileUpload}
//                     />
//                     <p className="text-xs text-gray-500 mt-1">Suggested format: Mp3. Maximum duration: 5 minute</p>
//                     {formData.uploadedVoiceFile && (
//                       <p className="text-sm text-gray-700 mt-2">Selected: {formData.uploadedVoiceFile.name}</p>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             )}

//             <div className="flex justify-end gap-4 mt-8">
//               {step > 1 && (<Button variant="outline" onClick={handleBack} disabled={isLoading}>Back</Button>)}
//               {step < 3 && (<Button onClick={handleNext} disabled={isLoading}>Next</Button>)}
//               {step === 3 && (<Button onClick={handleSubmit} disabled={isLoading}>{isLoading ? "Finishing..." : "Finish"}</Button>)}
//             </div>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }


