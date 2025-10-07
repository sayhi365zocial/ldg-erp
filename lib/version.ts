// Version information
export const VERSION = "0.1.0"
export const VERSION_DATE = "2025-10-07"
export const APP_NAME = "LDG ERP"

// Changelog data
export interface ChangelogEntry {
  version: string
  date: string
  changes: {
    type: "added" | "changed" | "fixed" | "removed"
    description: string
  }[]
}

export const changelog: ChangelogEntry[] = [
  {
    version: "0.1.0",
    date: "2025-10-07",
    changes: [
      {
        type: "added",
        description: "Initial release with authentication system",
      },
      {
        type: "added",
        description: "Companies CRUD with full Thai address support (77 provinces, districts, subdistricts)",
      },
      {
        type: "added",
        description: "Company logo upload functionality",
      },
      {
        type: "added",
        description: "Industry selection dropdown with 8 main categories",
      },
      {
        type: "added",
        description: "Dashboard layout with sidebar navigation",
      },
      {
        type: "added",
        description: "Database integration with Supabase PostgreSQL",
      },
    ],
  },
]
