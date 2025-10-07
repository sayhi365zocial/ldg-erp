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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ThaiAddressSelect } from "@/components/forms/thai-address-select"
import { ImageUpload } from "@/components/forms/image-upload"
import { industries } from "@/lib/industry-data"

export function CompanyForm({ company }: { company?: any }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [logoUrl, setLogoUrl] = useState(company?.logo || "")
  const [selectedIndustry, setSelectedIndustry] = useState(company?.industry || "")

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name"),
      logo: formData.get("logo") || logoUrl,
      industry: formData.get("industry"),
      website: formData.get("website"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      address: formData.get("address"),
      city: formData.get("city"),
      province: formData.get("province"),
      postalCode: formData.get("postalCode"),
      country: formData.get("country") || "Thailand",
      taxId: formData.get("taxId"),
      notes: formData.get("notes"),
    }

    try {
      const response = await fetch("/api/companies", {
        method: company ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(company ? { ...data, id: company.id } : data),
      })

      if (!response.ok) throw new Error("Failed to save company")

      router.push("/dashboard/companies")
      router.refresh()
    } catch (error) {
      console.error(error)
      alert("Failed to save company")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Logo Upload */}
        <div className="md:col-span-2">
          <ImageUpload
            value={logoUrl}
            onChange={setLogoUrl}
            label="Company Logo"
          />
        </div>

        {/* Basic Info */}
        <div className="space-y-2">
          <Label htmlFor="name">Company Name *</Label>
          <Input
            id="name"
            name="name"
            defaultValue={company?.name}
            required
            placeholder="Acme Corporation"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="industry">Industry</Label>
          <Select
            value={selectedIndustry}
            onValueChange={setSelectedIndustry}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              {industries.map((group) => (
                <SelectGroup key={group.category}>
                  <SelectLabel>{group.category}</SelectLabel>
                  {group.items.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item.replace(`${group.category} - `, "")}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
          <input type="hidden" name="industry" value={selectedIndustry} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            name="website"
            type="url"
            defaultValue={company?.website}
            placeholder="https://example.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="taxId">Tax ID</Label>
          <Input
            id="taxId"
            name="taxId"
            defaultValue={company?.taxId}
            placeholder="0123456789012"
          />
        </div>

        {/* Contact Info */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={company?.email}
            placeholder="contact@example.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            defaultValue={company?.phone}
            placeholder="02-123-4567"
          />
        </div>

        {/* Address */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            name="address"
            defaultValue={company?.address}
            placeholder="123 Main Street"
            rows={2}
          />
        </div>

        {/* Thai Address Selection */}
        <div className="md:col-span-2">
          <ThaiAddressSelect
            defaultProvince={company?.province}
            onSubdistrictChange={(value, zipCode) => {
              if (zipCode) {
                const postalCodeInput = document.getElementById('postalCode') as HTMLInputElement
                if (postalCodeInput) postalCodeInput.value = zipCode.toString()
              }
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="postalCode">รหัสไปรษณีย์ (Postal Code)</Label>
          <Input
            id="postalCode"
            name="postalCode"
            defaultValue={company?.postalCode}
            placeholder="10110"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            name="country"
            defaultValue={company?.country || "Thailand"}
            placeholder="Thailand"
          />
        </div>

        {/* Notes */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            name="notes"
            defaultValue={company?.notes}
            placeholder="Additional information..."
            rows={3}
          />
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
          {isLoading ? "Saving..." : company ? "Update Company" : "Create Company"}
        </Button>
      </div>
    </form>
  )
}
