import { Suspense } from "react"
import { prisma } from "@/lib/prisma"
import { CompaniesTable } from "@/components/companies/companies-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

async function getCompanies() {
  const companies = await prisma.company.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      _count: {
        select: {
          contacts: true,
          deals: true,
          projects: true,
        }
      }
    }
  })
  return companies
}

export default async function CompaniesPage() {
  const companies = await getCompanies()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Companies</h1>
          <p className="text-muted-foreground">
            Manage your client companies
          </p>
        </div>
        <Link href="/dashboard/companies/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Company
          </Button>
        </Link>
      </div>

      {/* Table */}
      <Suspense fallback={<div>Loading...</div>}>
        <CompaniesTable companies={companies} />
      </Suspense>
    </div>
  )
}
