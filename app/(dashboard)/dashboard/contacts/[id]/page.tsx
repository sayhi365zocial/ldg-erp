import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ActivityTimelineWrapper } from "@/components/activities/activity-timeline-wrapper"
import { ActivityFiles } from "@/components/activities/activity-files"
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  Pencil,
  Briefcase,
} from "lucide-react"

export default async function ContactDetailPage({
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link href="/dashboard/contacts">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Contacts
          </Button>
        </Link>
      </div>

      {/* Contact Info */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          {contact.image ? (
            <div className="relative h-20 w-20 rounded-full overflow-hidden border">
              <Image
                src={contact.image}
                alt={`${contact.firstName} ${contact.lastName}`}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 border">
              <span className="text-2xl font-semibold text-primary">
                {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
              </span>
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {contact.firstName} {contact.lastName}
            </h1>
            {contact.position && (
              <p className="text-muted-foreground mt-1">{contact.position}</p>
            )}
            <div className="flex gap-2 mt-2">
              <Badge variant={contact.isActive ? "default" : "secondary"}>
                {contact.isActive ? "Active" : "Inactive"}
              </Badge>
              {contact.isPrimary && (
                <Badge variant="outline">Primary Contact</Badge>
              )}
            </div>
          </div>
        </div>
        <Link href={`/dashboard/contacts/${contact.id}/edit`}>
          <Button>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Contact
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column */}
        <div className="md:col-span-1 space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Company */}
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <Link
                  href={`/dashboard/companies/${contact.company.id}`}
                  className="hover:underline"
                >
                  {contact.company.name}
                </Link>
              </div>

              {/* Email */}
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${contact.email}`} className="hover:underline">
                  {contact.email}
                </a>
              </div>

              {/* Phone */}
              {contact.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${contact.phone}`} className="hover:underline">
                    {contact.phone}
                  </a>
                </div>
              )}

              {/* Department */}
              {contact.department && (
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{contact.department}</span>
                </div>
              )}
            </CardContent>

            {/* Notes */}
            {contact.notes && (
              <>
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap">{contact.notes}</p>
                </CardContent>
              </>
            )}
          </Card>

          {/* Files / Assets */}
          <ActivityFiles contactId={contact.id} />
        </div>

        {/* Activity Timeline */}
        <ActivityTimelineWrapper contactId={contact.id} />
      </div>
    </div>
  )
}
