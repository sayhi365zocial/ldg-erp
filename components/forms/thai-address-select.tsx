"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { provinces, districts, subdistricts } from "@/lib/thai-address-data"

interface ThaiAddressSelectProps {
  defaultProvince?: string
  defaultDistrict?: string
  defaultSubdistrict?: string
  onProvinceChange?: (value: string) => void
  onDistrictChange?: (value: string) => void
  onSubdistrictChange?: (value: string, zipCode?: number) => void
}

export function ThaiAddressSelect({
  defaultProvince,
  defaultDistrict,
  defaultSubdistrict,
  onProvinceChange,
  onDistrictChange,
  onSubdistrictChange,
}: ThaiAddressSelectProps) {
  const [selectedProvince, setSelectedProvince] = useState(defaultProvince || "")
  const [selectedDistrict, setSelectedDistrict] = useState(defaultDistrict || "")
  const [selectedSubdistrict, setSelectedSubdistrict] = useState(defaultSubdistrict || "")

  const [availableDistricts, setAvailableDistricts] = useState<any[]>([])
  const [availableSubdistricts, setAvailableSubdistricts] = useState<any[]>([])

  // Update districts when province changes
  useEffect(() => {
    if (selectedProvince) {
      const provinceId = parseInt(selectedProvince)
      const districtList = districts[provinceId] || []
      // Sort by Thai name
      const sortedDistricts = [...districtList].sort((a, b) =>
        a.name_th.localeCompare(b.name_th, 'th')
      )
      setAvailableDistricts(sortedDistricts)
      setSelectedDistrict("")
      setSelectedSubdistrict("")
      setAvailableSubdistricts([])
    }
  }, [selectedProvince])

  // Update subdistricts when district changes
  useEffect(() => {
    if (selectedDistrict) {
      const districtId = parseInt(selectedDistrict)
      const subdistrictList = subdistricts[districtId] || []
      // Sort by Thai name
      const sortedSubdistricts = [...subdistrictList].sort((a, b) =>
        a.name_th.localeCompare(b.name_th, 'th')
      )
      setAvailableSubdistricts(sortedSubdistricts)
      setSelectedSubdistrict("")
    }
  }, [selectedDistrict])

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Province */}
      <div className="space-y-2">
        <Label htmlFor="province">จังหวัด (Province)</Label>
        <Select
          value={selectedProvince}
          onValueChange={(value) => {
            setSelectedProvince(value)
            onProvinceChange?.(value)
          }}
        >
          <SelectTrigger id="province">
            <SelectValue placeholder="เลือกจังหวัด" />
          </SelectTrigger>
          <SelectContent>
            {[...provinces]
              .sort((a, b) => a.name_th.localeCompare(b.name_th, 'th'))
              .map((province) => (
                <SelectItem key={province.id} value={province.id.toString()}>
                  {province.name_th}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        <input type="hidden" name="province" value={
          provinces.find(p => p.id.toString() === selectedProvince)?.name_th || ""
        } />
      </div>

      {/* District */}
      <div className="space-y-2">
        <Label htmlFor="district">อำเภอ/เขต (District)</Label>
        <Select
          value={selectedDistrict}
          onValueChange={(value) => {
            setSelectedDistrict(value)
            onDistrictChange?.(value)
          }}
          disabled={!selectedProvince}
        >
          <SelectTrigger id="district">
            <SelectValue placeholder="เลือกอำเภอ/เขต" />
          </SelectTrigger>
          <SelectContent>
            {availableDistricts.map((district) => (
              <SelectItem key={district.id} value={district.id.toString()}>
                {district.name_th}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <input type="hidden" name="city" value={
          availableDistricts.find(d => d.id.toString() === selectedDistrict)?.name_th || ""
        } />
      </div>

      {/* Subdistrict */}
      <div className="space-y-2">
        <Label htmlFor="subdistrict">ตำบล/แขวง (Subdistrict)</Label>
        <Select
          value={selectedSubdistrict}
          onValueChange={(value) => {
            setSelectedSubdistrict(value)
            const subdistrict = availableSubdistricts.find(s => s.id.toString() === value)
            if (subdistrict) {
              onSubdistrictChange?.(value, subdistrict.zip_code)
            }
          }}
          disabled={!selectedDistrict}
        >
          <SelectTrigger id="subdistrict">
            <SelectValue placeholder="เลือกตำบล/แขวง" />
          </SelectTrigger>
          <SelectContent>
            {availableSubdistricts.map((subdistrict) => (
              <SelectItem key={subdistrict.id} value={subdistrict.id.toString()}>
                {subdistrict.name_th}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <input type="hidden" name="subdistrict" value={
          availableSubdistricts.find(s => s.id.toString() === selectedSubdistrict)?.name_th || ""
        } />
      </div>
    </div>
  )
}
