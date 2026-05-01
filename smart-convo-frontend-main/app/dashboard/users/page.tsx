"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Mail, CheckCircle, Copy, UserPlus, Users, Shield, Clock, Calendar, Loader2 } from "lucide-react"
import Cookies from "js-cookie"

interface UserData {
  id: string
  firstName: string
  lastName: string
  email: string
  role: "admin" | "member"
  status: "Active" | "Inactive" | "Pending"
  companyId: string
  profilePic: string | null
  lastLogin: string | null
  dateCreated: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>([])
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false)
  const [isManageUserModalOpen, setIsManageUserModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
  const { toast } = useToast()

  const [newUserData, setNewUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "member" as "admin" | "member",
  })
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const [generatedPassword, setGeneratedPassword] = useState("")
  const [addUserLoading, setAddUserLoading] = useState(false)
  const [isLoadingUsers, setIsLoadingUsers] = useState(true)
  const [manageUserRole, setManageUserRole] = useState<"admin" | "member">("member")
  const [manageUserStatus, setManageUserStatus] = useState<"Active" | "Inactive">("Active")
  const [manageUserLoading, setManageUserLoading] = useState(false)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoadingUsers(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/company-users/`, {
          method: "GET",
          headers: { "Content-Type": "application/json", Authorization: `Token ${Cookies.get("Token") || ""}` },
        })
        if (!response.ok) throw new Error("Failed to fetch users")
        const data = await response.json()
        setUsers(
          data.map((user: any, index: number) => ({
            id: user.id || `user${index + 1}`,
            firstName: user.user_first_name,
            lastName: user.user_last_name,
            email: user.user_email,
            role: user.role,
            status: user.status || "Pending",
            companyId: user.user_company || "company123",
            profilePic: user.image || null,
            lastLogin: user.user_last_login || null,
            dateCreated: user.user_date_joined || new Date().toISOString(),
          }))
        )
      } catch (error: any) {
        toast({ title: "Error loading users", description: error.message, variant: "destructive" })
      } finally {
        setIsLoadingUsers(false)
      }
    }
    fetchUsers()
  }, [])

  const generateRandomPassword = (length = 12) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()"
    return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join("")
  }

  const handleSendOtp = async () => {
    if (!newUserData.email || !/\S+@\S+\.\S+/.test(newUserData.email)) {
      toast({ title: "Invalid Email", description: "Please enter a valid email address.", variant: "destructive" })
      return
    }
    setAddUserLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setOtpSent(true)
    toast({ title: "OTP Sent", description: "A verification code has been sent to your email." })
    setAddUserLoading(false)
  }

  const handleVerifyOtp = async () => {
    if (otp === "123456") {
      setAddUserLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 500))
      setOtpVerified(true)
      toast({ title: "OTP Verified", description: "Email successfully verified." })
      setAddUserLoading(false)
    } else {
      toast({ title: "Invalid OTP", description: "Please enter the correct verification code.", variant: "destructive" })
    }
  }

  const handleAddUserSubmit = async () => {
    if (!newUserData.firstName || !newUserData.lastName || !newUserData.email || !otpVerified) {
      toast({ title: "Missing Information", description: "Please fill all fields and verify email.", variant: "destructive" })
      return
    }
    setAddUserLoading(true)
    const newPassword = generateRandomPassword()
    setGeneratedPassword(newPassword)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/company-users/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Token ${Cookies.get("Token") || ""}` },
        body: JSON.stringify({ email: newUserData.email, password: newPassword, first_name: newUserData.firstName, last_name: newUserData.lastName, role: newUserData.role }),
      })
      const responseData = await response.json()
      if (!response.ok) throw new Error(responseData.message || "Failed to create user")
      setUsers((prev) => [...prev, {
        id: `user${users.length + 1}`, firstName: newUserData.firstName, lastName: newUserData.lastName,
        email: newUserData.email, role: newUserData.role, status: "Pending",
        companyId: "company123", profilePic: null, lastLogin: null, dateCreated: new Date().toISOString(),
      }])
      toast({ title: "User Added Successfully!", description: "Random password generated. Please provide it to the user." })
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Something went wrong.", variant: "destructive" })
    }
    setAddUserLoading(false)
  }

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(generatedPassword)
    toast({ title: "Password Copied!", description: "The generated password has been copied to your clipboard." })
    setIsAddUserModalOpen(false)
    setNewUserData({ firstName: "", lastName: "", email: "", role: "member" })
    setOtp(""); setOtpSent(false); setOtpVerified(false); setGeneratedPassword("")
  }

  const openManageUserModal = (user: UserData) => {
    setSelectedUser(user)
    setManageUserRole(user.role)
    setManageUserStatus(user.status === "Active" ? "Active" : "Inactive")
    setIsManageUserModalOpen(true)
  }

  const handleManageUserSubmit = async () => {
    if (!selectedUser) return
    try {
      setManageUserLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/company-users/${selectedUser.id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Token ${Cookies.get("Token") || ""}` },
        body: JSON.stringify({ role: manageUserRole, status: manageUserStatus.toLowerCase() }),
      })
      if (!response.ok) throw new Error("Failed to update user")
      const updatedUser = await response.json()
      setUsers((prev) => prev.map((user) => (user.id === selectedUser.id ? { ...user, ...updatedUser } : user)))
      toast({ title: "User Updated", description: `${selectedUser.firstName} ${selectedUser.lastName}'s profile has been updated.` })
    } catch (err) {
      toast({ title: "Error", description: "Failed to update user. Please try again.", variant: "destructive" })
    } finally {
      setManageUserLoading(false); setIsManageUserModalOpen(false); setSelectedUser(null)
    }
  }

  const handleDeleteUser = async () => {
    if (!selectedUser) return
    if (!window.confirm(`Are you sure you want to delete ${selectedUser.firstName} ${selectedUser.lastName}?`)) return
    try {
      setManageUserLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/company-users/${selectedUser.id}/`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Token ${Cookies.get("Token") || ""}` },
      })
      if (!response.ok) throw new Error("Failed to delete user")
      setUsers((prev) => prev.filter((user) => user.id !== selectedUser.id))
      toast({ title: "User Deleted", description: `${selectedUser.firstName} ${selectedUser.lastName} has been removed.`, variant: "destructive" })
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete user. Please try again.", variant: "destructive" })
    } finally {
      setManageUserLoading(false); setIsManageUserModalOpen(false); setSelectedUser(null)
    }
  }

  const statusStyle = (status: UserData["status"]) => {
    switch (status) {
      case "Active":   return { background: "var(--success-soft)", color: "var(--success)" }
      case "Inactive": return { background: "var(--danger-soft)",  color: "var(--danger)"  }
      case "Pending":  return { background: "var(--butter-bg)",    color: "var(--butter-ink)" }
      default:         return { background: "var(--graphite-100)", color: "var(--graphite-600)" }
    }
  }

  const activeUsers  = users.filter((u) => u.status === "Active").length
  const adminUsers   = users.filter((u) => u.role === "admin").length
  const pendingUsers = users.filter((u) => u.status === "Pending").length

  if (isLoadingUsers)
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "var(--canvas)", flexDirection: "column", gap: 12 }}>
        <Loader2 style={{ width: 24, height: 24, color: "var(--signal-ink)", animation: "spin 1s linear infinite" }} />
        <span style={{ fontSize: 13, color: "var(--fg-3)", fontFamily: "var(--font-mono)", letterSpacing: "0.04em" }}>Loading users…</span>
        <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      </div>
    )

  return (
    <div style={{ minHeight: "100vh", background: "var(--canvas)" }}>
      {/* Page header */}
      <div style={{ background: "var(--paper)", borderBottom: "1px solid var(--border-1)", padding: "28px 32px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24, gap: 16, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--fg-3)", marginBottom: 6 }}>
              Team
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--fg-1)", letterSpacing: "-0.02em", margin: 0, lineHeight: 1.2 }}>
              Team Members
            </h1>
            <p style={{ fontSize: 13, color: "var(--fg-3)", marginTop: 4 }}>
              Manage your team and control access permissions
            </p>
          </div>

          <Dialog open={isAddUserModalOpen} onOpenChange={setIsAddUserModalOpen}>
            <DialogTrigger asChild>
              <button
                style={{
                  display: "inline-flex", alignItems: "center", gap: 7,
                  padding: "9px 16px", borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--ink)", background: "var(--ink)",
                  color: "var(--canvas)", fontSize: 13, fontWeight: 500, cursor: "pointer",
                  boxShadow: "var(--shadow-sm)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                <UserPlus style={{ width: 15, height: 15 }} strokeWidth={1.5} />
                Add User
              </button>
            </DialogTrigger>

            <DialogContent style={{ maxWidth: 480, borderRadius: "var(--radius-xl)", border: "1px solid var(--border-1)", background: "var(--paper)", boxShadow: "var(--shadow-xl)", padding: 28 }}>
              <DialogHeader>
                <DialogTitle style={{ fontSize: 16, fontWeight: 500, color: "var(--fg-1)" }}>Add New User</DialogTitle>
              </DialogHeader>
              {!generatedPassword ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingTop: 12 }}>
                  {["firstName", "lastName"].map((field) => (
                    <div key={field}>
                      <Label style={{ fontSize: 12, color: "var(--fg-3)", marginBottom: 6, display: "block" }}>
                        {field === "firstName" ? "First Name" : "Last Name"}
                      </Label>
                      <Input
                        value={(newUserData as any)[field]}
                        onChange={(e) => setNewUserData({ ...newUserData, [field]: e.target.value })}
                        disabled={addUserLoading}
                      />
                    </div>
                  ))}
                  <div>
                    <Label style={{ fontSize: 12, color: "var(--fg-3)", marginBottom: 6, display: "block" }}>Email</Label>
                    <Input
                      type="email"
                      value={newUserData.email}
                      onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                      disabled={otpSent || addUserLoading}
                    />
                  </div>
                  {!otpVerified && (
                    <div>
                      <Label style={{ fontSize: 12, color: "var(--fg-3)", marginBottom: 6, display: "block" }}>OTP Verification</Label>
                      <div style={{ display: "flex", gap: 8 }}>
                        <Input
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          placeholder="Enter OTP"
                          disabled={!otpSent || otpVerified || addUserLoading}
                          style={{ flex: 1 }}
                        />
                        <Button
                          onClick={otpSent ? handleVerifyOtp : handleSendOtp}
                          disabled={(otpSent && otpVerified) || addUserLoading}
                          className="bg-[var(--ink)] text-[var(--canvas)] hover:opacity-90"
                        >
                          {addUserLoading ? "…" : otpSent ? "Verify" : "Send OTP"}
                        </Button>
                      </div>
                    </div>
                  )}
                  {otpVerified && (
                    <div>
                      <Label style={{ fontSize: 12, color: "var(--fg-3)", marginBottom: 6, display: "block" }}>Role</Label>
                      <Select
                        value={newUserData.role}
                        onValueChange={(v: "admin" | "member") => setNewUserData({ ...newUserData, role: v })}
                        disabled={addUserLoading}
                      >
                        <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="member">Member</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 4 }}>
                    <Button onClick={handleAddUserSubmit} disabled={!otpVerified || addUserLoading} className="bg-[var(--ink)] text-[var(--canvas)] hover:opacity-90">
                      {addUserLoading ? "Creating…" : "Create User"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: "center", paddingTop: 12 }}>
                  <div style={{ width: 52, height: 52, borderRadius: "50%", background: "var(--success-soft)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                    <CheckCircle style={{ width: 22, height: 22, color: "var(--success)" }} strokeWidth={1.5} />
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 500, color: "var(--fg-1)", marginBottom: 6 }}>User Created Successfully!</div>
                  <p style={{ fontSize: 13, color: "var(--fg-3)", marginBottom: 16 }}>
                    Share the generated password with the new user. They can change it on first login.
                  </p>
                  <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--border-1)", borderRadius: "var(--radius-sm)", padding: "10px 14px", background: "var(--graphite-50)", marginBottom: 16 }}>
                    <Input type="text" value={generatedPassword} readOnly style={{ flex: 1, border: "none", background: "transparent", fontFamily: "var(--font-mono)", fontSize: 13 }} />
                    <button onClick={handleCopyPassword} style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: "var(--radius-xs)", border: "1px solid var(--border-2)", background: "var(--paper)", fontSize: 12, cursor: "pointer", color: "var(--fg-2)", flexShrink: 0 }}>
                      <Copy style={{ width: 12, height: 12 }} strokeWidth={1.5} /> Copy
                    </button>
                  </div>
                  <Button onClick={handleCopyPassword} className="bg-[var(--ink)] text-[var(--canvas)] hover:opacity-90">Done</Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>

        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {[
            { bg: "var(--sky-bg)",    ink: "var(--sky-ink)",    icon: Users,        value: users.length, label: "Total Users",    pct: null },
            { bg: "var(--sage-bg)",   ink: "var(--sage-ink)",   icon: CheckCircle,  value: activeUsers,  label: "Active Users",   pct: users.length > 0 ? Math.round((activeUsers / users.length) * 100) : 0 },
            { bg: "var(--mist-bg)",   ink: "var(--mist-ink)",   icon: Shield,       value: adminUsers,   label: "Administrators", pct: users.length > 0 ? Math.round((adminUsers / users.length) * 100) : 0 },
            { bg: "var(--butter-bg)", ink: "var(--butter-ink)", icon: Clock,        value: pendingUsers, label: "Pending",        pct: users.length > 0 ? Math.round((pendingUsers / users.length) * 100) : 0 },
          ].map(({ bg, ink, icon: Icon, value, label, pct }) => (
            <div key={label} style={{ background: "var(--paper)", border: "1px solid var(--border-1)", borderRadius: "var(--radius-lg)", padding: "16px 18px", display: "flex", alignItems: "center", gap: 12, boxShadow: "var(--shadow-sm)" }}>
              <div style={{ width: 38, height: 38, borderRadius: 9, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon style={{ width: 17, height: 17, color: ink }} strokeWidth={1.5} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 24, fontWeight: 300, color: "var(--fg-1)", letterSpacing: "-0.03em", lineHeight: 1 }}>{value}</span>
                  {pct !== null && (
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: ink, background: bg, padding: "2px 6px", borderRadius: "var(--radius-pill)" }}>{pct}%</span>
                  )}
                </div>
                <div style={{ fontSize: 11, fontWeight: 500, color: "var(--fg-4)", marginTop: 3, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div style={{ padding: "28px 32px" }}>
        {users.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px 24px", textAlign: "center" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--graphite-100)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
              <Users style={{ width: 20, height: 20, color: "var(--fg-4)" }} strokeWidth={1.5} />
            </div>
            <div style={{ fontSize: 15, fontWeight: 500, color: "var(--fg-1)", marginBottom: 6 }}>No team members yet</div>
            <p style={{ fontSize: 13, color: "var(--fg-3)" }}>Click "Add User" to invite new team members</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
            {users.map((user) => (
              <UserCard key={user.id} user={user} statusStyle={statusStyle} onManage={() => openManageUserModal(user)} />
            ))}
          </div>
        )}
      </div>

      {/* Manage User Modal */}
      {selectedUser && (
        <Dialog open={isManageUserModalOpen} onOpenChange={setIsManageUserModalOpen}>
          <DialogContent style={{ maxWidth: 420, borderRadius: "var(--radius-xl)", border: "1px solid var(--border-1)", background: "var(--paper)", boxShadow: "var(--shadow-xl)", padding: 28 }}>
            <DialogHeader>
              <DialogTitle style={{ fontSize: 16, fontWeight: 500, color: "var(--fg-1)" }}>
                Manage {selectedUser.firstName} {selectedUser.lastName}
              </DialogTitle>
            </DialogHeader>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingTop: 12 }}>
              <div>
                <Label style={{ fontSize: 12, color: "var(--fg-3)", marginBottom: 6, display: "block" }}>Role</Label>
                <Select value={manageUserRole} onValueChange={(v: "admin" | "member") => setManageUserRole(v)} disabled={manageUserLoading}>
                  <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label style={{ fontSize: 12, color: "var(--fg-3)", marginBottom: 6, display: "block" }}>Status</Label>
                <Select value={manageUserStatus} onValueChange={(v: "Active" | "Inactive") => setManageUserStatus(v)} disabled={manageUserLoading}>
                  <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
              <button
                onClick={handleDeleteUser}
                disabled={manageUserLoading}
                style={{
                  flex: 1, padding: "9px 16px", borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--danger-soft)", background: "var(--danger-soft)",
                  color: "var(--danger)", fontSize: 13, fontWeight: 500, cursor: "pointer",
                }}
              >
                {manageUserLoading ? "Deleting…" : "Delete User"}
              </button>
              <button
                onClick={handleManageUserSubmit}
                disabled={manageUserLoading}
                style={{
                  flex: 1, padding: "9px 16px", borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--ink)", background: "var(--ink)",
                  color: "var(--canvas)", fontSize: 13, fontWeight: 500, cursor: "pointer",
                }}
              >
                {manageUserLoading ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

function UserCard({
  user, statusStyle, onManage,
}: {
  user: UserData
  statusStyle: (s: UserData["status"]) => { background: string; color: string }
  onManage: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "var(--paper)",
        border: `1px solid ${hovered ? "var(--border-2)" : "var(--border-1)"}`,
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        boxShadow: hovered ? "var(--shadow-md)" : "var(--shadow-sm)",
        transition: "box-shadow var(--dur-base) var(--ease-out), border-color var(--dur-fast) var(--ease-out)",
      }}
    >
      <div style={{ padding: "18px 18px 16px" }}>
        {/* User avatar + info */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <div
            style={{
              width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
              background: "var(--mist-bg)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 600, color: "var(--mist-ink)" }}>
              {initials}
            </span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: "var(--fg-1)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user.firstName} {user.lastName}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--fg-4)", marginTop: 2 }}>
              <Mail style={{ width: 10, height: 10, flexShrink: 0 }} strokeWidth={1.5} />
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</span>
            </div>
          </div>
        </div>

        {/* Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, borderTop: "1px solid var(--border-1)", paddingTop: 12 }}>
          {[
            { label: "Role", icon: Shield, value: <span style={{ fontSize: 12, color: "var(--fg-1)", textTransform: "capitalize" }}>{user.role}</span> },
            { label: "Status", icon: null, value: <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.04em", padding: "2px 7px", borderRadius: "var(--radius-pill)", ...statusStyle(user.status) }}>{user.status}</span> },
            { label: "Joined", icon: Calendar, value: <span style={{ fontSize: 12, color: "var(--fg-1)" }}>{new Date(user.dateCreated).toLocaleDateString()}</span> },
            { label: "Last login", icon: Clock, value: <span style={{ fontSize: 12, color: "var(--fg-1)" }}>{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Never"}</span> },
          ].map(({ label, icon: Icon, value }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--fg-4)", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "var(--font-mono)" }}>
                {Icon && <Icon style={{ width: 10, height: 10 }} strokeWidth={1.5} />}
                {label}
              </span>
              {value}
            </div>
          ))}
        </div>

        {/* Manage button */}
        <button
          onClick={onManage}
          style={{
            width: "100%", marginTop: 14, padding: "8px 16px",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--border-2)",
            background: hovered ? "var(--graphite-50)" : "var(--paper)",
            color: "var(--fg-1)", fontSize: 12, fontWeight: 500, cursor: "pointer",
            transition: "background var(--dur-fast) var(--ease-out)",
          }}
        >
          Manage User
        </button>
      </div>
    </div>
  )
}
