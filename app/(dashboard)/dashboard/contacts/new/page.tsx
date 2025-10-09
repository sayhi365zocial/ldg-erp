import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ContactForm } from "@/components/contacts/contact-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function NewContactPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return null
  }

  // Fetch companies for the dropdown
  const companies = await prisma.company.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
    },
    orderBy: { name: 'asc' },
  })

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard/contacts">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Contacts
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Contact</h1>
        <p className="text-muted-foreground">
          Create a new contact person
        </p>
      </div>

      <div className="max-w-3xl">
        <ContactForm companies={companies} />
      </div>
    </div>
  )
}
