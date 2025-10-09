import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { ContactsTable } from "@/components/contacts/contacts-table"
import { Plus } from "lucide-react"

export default async function ContactsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return null
  }

  const contacts = await prisma.contactPerson.findMany({
    include: {
      company: {
        select: {
          id: true,
          name: true,
        }
      }
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
          <p className="text-muted-foreground">
            Manage contact persons and their information
          </p>
        </div>
        <Link href="/dashboard/contacts/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Contact
          </Button>
        </Link>
      </div>

      <ContactsTable contacts={contacts} />
    </div>
  )
}
