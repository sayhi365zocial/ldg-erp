"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const roles = [
  { value: "ADMIN", label: "Admin - Full access" },
  { value: "MANAGER", label: "Manager - Manage teams" },
  { value: "SALES", label: "Sales - Manage deals & customers" },
  { value: "FINANCE", label: "Finance - Manage invoices" },
  { value: "USER", label: "User - Basic access" },
]

export function UserForm({ user }: { user?: any }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState(user?.role || "USER")

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      role: selectedRole,
    }

    try {
      const response = await fetch("/api/users", {
        method: user ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user ? { ...data, id: user.id } : data),
      })

      if (!response.ok) throw new Error("Failed to save user")

      router.push("/dashboard/users")
      router.refresh()
    } catch (error) {
      console.error(error)
      alert("Failed to save user")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            name="name"
            defaultValue={user?.name}
            required
            placeholder="John Doe"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={user?.email}
            required
            placeholder="john@example.com"
          />
        </div>

        {/* Password */}
        {!user && (
          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              minLength={6}
            />
          </div>
        )}

        {/* Role */}
        <div className="space-y-2">
          <Label htmlFor="role">Role *</Label>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : user ? "Update User" : "Create User"}
        </Button>
      </div>
    </form>
  )
}
