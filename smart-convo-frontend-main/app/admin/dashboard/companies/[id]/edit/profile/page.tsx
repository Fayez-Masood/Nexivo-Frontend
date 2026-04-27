"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Cookies from "js-cookie"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, CreditCard, Globe, Mail, Phone, MapPin, Building } from "lucide-react"

export default function EditCompanyProfile() {
  const { id: companyId } = useParams()
  const router = useRouter()

  const [companyData, setCompanyData] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCompany = async () => {
      const token = Cookies.get("adminToken")
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/companies/${companyId}/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token || ""}`
          }
        })
        const data = await res.json()
        setCompanyData(data)
        console.log(data)
        setLoading(false)
      } catch (err) {
        console.error("Failed to fetch company", err)
        setLoading(false)
      }
    }

    fetchCompany()
  }, [companyId])

  const handleStatusChange = (status: string) => {
    setCompanyData((prev: any) => ({ ...prev, status }))
  }

  const handleSave = async () => {
    const token = Cookies.get("adminToken")
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/companies/${companyId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token || ""}`
        },
        body: JSON.stringify({ status: companyData.status })
      })
      alert("Status updated successfully!")
    } catch (err) {
      console.error("Failed to update status", err)
    }
  }

  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete this company?")
    if (!confirmed) return

    const token = Cookies.get("adminToken")
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/companies/${companyId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Token ${token || ""}`
        }
      })
      alert("Company deleted successfully!")
      router.push("/admin/dashboard/companies")
    } catch (err) {
      console.error("Failed to delete company", err)
    }
  }

  if (loading || !companyData) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-slate-500">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin mb-3" />
        <p className="text-sm font-medium">Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Company Overview */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/60 overflow-hidden hover:shadow-lg transition-all duration-300">
          <div className="p-5 border-b border-slate-100">
            <h3 className="text-base font-semibold text-slate-800">Company Information</h3>
            <p className="text-xs text-slate-500 mt-0.5">Basic company details and contact information</p>
          </div>
          <div className="p-5 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Building className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-600">Company Name</span>
                </div>
                <p className="text-lg font-semibold">{companyData.name}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-600">Email</span>
                </div>
                <p className="text-lg">{companyData.email}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-600">Phone</span>
                </div>
                <p className="text-lg">{companyData.phone}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-600">Website</span>
                </div>
                <a href={companyData.website} className="text-lg text-indigo-600 hover:underline" target="_blank" rel="noopener noreferrer">
                  {companyData.website}
                </a>
              </div>
              <div className="space-y-2">
                <span className="text-sm font-medium text-slate-600">Industry</span>
                <p className="text-lg">{companyData.industry}</p>
              </div>
              <div className="space-y-2">
                <span className="text-sm font-medium text-slate-600">Company Size</span>
                <p className="text-lg">{companyData.company_size} employees</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-600">Address</span>
              </div>
              <p className="text-lg">{companyData.address}</p>
            </div>
            <div className="space-y-2">
              <span className="text-sm font-medium text-slate-600">Description</span>
              <p className="text-slate-700 leading-relaxed">{companyData.description}</p>
            </div>
          </div>
        </div>

        {/* Company Stats */}
        <div className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden hover:shadow-lg transition-all duration-300">
          <div className="p-5 border-b border-slate-100">
            <h3 className="text-base font-semibold text-slate-800">Company Stats</h3>
            <p className="text-xs text-slate-500 mt-0.5">Key metrics and information</p>
          </div>
          <div className="p-5 space-y-3">
            <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors">
              <span className="text-sm text-slate-600">Status</span>
              <Select value={companyData.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-[120px] rounded-xl border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="active">active</SelectItem>
                  <SelectItem value="inactive">inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors">
              <span className="text-sm text-slate-600">Plan</span>
              <Badge className="text-xs font-medium bg-indigo-100 text-indigo-700 border-0 rounded-full">{companyData.plan}</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-slate-400" />
              <div className="flex-1">
                <p className="text-sm text-slate-600">Date Joined</p>
                <p className="text-sm font-medium">{new Date(companyData.created_at || companyData.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-slate-400" />
              <div className="flex-1">
                <p className="text-sm text-slate-600">Total Users</p>
                <p className="text-sm font-medium">{companyData.users.length}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-slate-400" />
              <div className="flex-1">
                <p className="text-sm text-slate-600">Last Login</p>
                <p className="text-sm font-medium">{companyData.last_login ? new Date(companyData.last_login).toLocaleDateString() : "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4 text-slate-400" />
              <div className="flex-1">
                <p className="text-sm text-slate-600">Monthly Usage</p>
                <p className="text-sm font-medium">1250 API calls</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="destructive" onClick={handleDelete} className="rounded-xl">
          Delete Company
        </Button>
        <Button onClick={handleSave} className="px-8 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 shadow-lg shadow-indigo-500/25">
          Save Changes
        </Button>
      </div>
    </div>
  )
}
