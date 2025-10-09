import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ContactForm } from "@/components/contacts/contact-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { notFound } from "next/navigation"

export default async function EditContactPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return null
  }

  const contact = await prisma.contactPerson.findUnique({
    where: { id: params.id },
    include: {
      company: true,
    },
  })

  if (!contact) {
    notFound()
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
        <h1 className="text-3xl font-bold tracking-tight">Edit Contact</h1>
        <p className="text-muted-foreground">
          Update contact information for {contact.firstName} {contact.lastName}
        </p>
      </div>

      <div className="max-w-3xl">
        <ContactForm contact={contact} companies={companies} />
      </div>
    </div>
  )
}
