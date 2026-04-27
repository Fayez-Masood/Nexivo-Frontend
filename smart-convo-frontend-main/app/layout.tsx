import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import "react-phone-input-2/lib/style.css"
import { AuthProvider } from "@/components/auth-provider"
import { Toaster } from "@/components/ui/toaster"
import { TutorialProvider } from "@/components/tutorial/TutorialProvider";
import 'leaflet/dist/leaflet.css'

export const metadata: Metadata = {
  title: "Smart Convo - Dashboard",
  description: "Modern corporate dashboard for Smart Convo",
    // generator: 'v0.dev'
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <AuthProvider><TutorialProvider>{children}<Toaster /></TutorialProvider></AuthProvider>
      </body>
    </html>
  )
}
