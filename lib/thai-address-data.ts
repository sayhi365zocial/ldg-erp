// Thai Province, District, Sub-district Data
import thaiProvinceData from './thai-provinces.json'

// Type definitions
export interface SubDistrict {
  id: number
  zip_code: number
  name_th: string
  name_en: string
  district_id: number
}

export interface District {
  id: number
  name_th: string
  name_en: string
  province_id: number
  sub_districts: SubDistrict[]
}

export interface Province {
  id: number
  name_th: string
  name_en: string
  geography_id: number
  districts: District[]
}

// Export the complete data
export const provinces: Province[] = thaiProvinceData as Province[]

// Build lookup dictionaries for faster access
export const districts: Record<number, District[]> = {}
export const subdistricts: Record<number, SubDistrict[]> = {}

// Populate lookup dictionaries
provinces.forEach(province => {
  districts[province.id] = province.districts

  province.districts.forEach(district => {
    subdistricts[district.id] = district.sub_districts
  })
})
