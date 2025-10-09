"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ContactFormProps {
  contact?: any
  companies: Array<{ id: string; name: string }>
}

export function ContactForm({ contact, companies }: ContactFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState(
    contact?.companyId || companies[0]?.id || ""
  )
  const [isPrimary, setIsPrimary] = useState(contact?.isPrimary || false)
  const [isActive, setIsActive] = useState(contact?.isActive ?? true)
  const [imageUrl, setImageUrl] = useState(contact?.image || "")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(false)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      // Upload immediately
      await uploadFile(file)
    }
  }

  async function uploadFile(file: File) {
    setUploadProgress(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("type", "contacts")

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Failed to upload file")

      const data = await response.json()
      setImageUrl(data.url)
    } catch (error) {
      console.error(error)
      alert("Failed to upload image")
    } finally {
      setUploadProgress(false)
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone") || null,
      position: formData.get("position") || null,
      department: formData.get("department") || null,
      image: imageUrl || null,
      notes: formData.get("notes") || null,
      companyId: selectedCompany,
      isPrimary,
      isActive,
    }

    try {
      const response = await fetch("/api/contacts", {
        method: contact ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contact ? { ...data, id: contact.id } : data),
      })

      if (!response.ok) throw new Error("Failed to save contact")

      router.push("/dashboard/contacts")
      router.refresh()
    } catch (error) {
      console.error(error)
      alert("Failed to save contact")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* First Name */}
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            name="firstName"
            defaultValue={contact?.firstName}
            required
            placeholder="John"
          />
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            name="lastName"
            defaultValue={contact?.lastName}
            required
            placeholder="Doe"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={contact?.email}
            required
            placeholder="john@example.com"
          />
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={contact?.phone || ""}
            placeholder="+66 12 345 6789"
          />
        </div>

        {/* Company */}
        <div className="space-y-2">
          <Label htmlFor="company">Company *</Label>
          <Select value={selectedCompany} onValueChange={setSelectedCompany}>
            <SelectTrigger>
              <SelectValue placeholder="Select company" />
            </SelectTrigger>
            <SelectContent>
              {companies.map((company) => (
                <SelectItem key={company.id} value={company.id}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Position */}
        <div className="space-y-2">
          <Label htmlFor="position">Position</Label>
          <Input
            id="position"
            name="position"
            defaultValue={contact?.position || ""}
            placeholder="Marketing Manager"
          />
        </div>

        {/* Department */}
        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Input
            id="department"
            name="department"
            defaultValue={contact?.department || ""}
            placeholder="Marketing"
          />
        </div>

        {/* Image Upload */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="image">Profile Image</Label>
          <div className="flex items-start gap-4">
            {imageUrl && (
              <div className="relative h-20 w-20 rounded-full overflow-hidden border">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              <Input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploadProgress}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {uploadProgress ? "Uploading..." : "Upload a profile image (max 5MB)"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          defaultValue={contact?.notes || ""}
          placeholder="Additional notes about this contact..."
          rows={4}
        />
      </div>

      {/* Checkboxes */}
      <div className="flex gap-8">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isPrimary"
            checked={isPrimary}
            onChange={(e) => setIsPrimary(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300"
          />
          <Label htmlFor="isPrimary" className="cursor-pointer">
            Primary Contact
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isActive"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300"
          />
          <Label htmlFor="isActive" className="cursor-pointer">
            Active
          </Label>
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
          {isLoading ? "Saving..." : contact ? "Update Contact" : "Create Contact"}
        </Button>
      </div>
    </form>
  )
}
