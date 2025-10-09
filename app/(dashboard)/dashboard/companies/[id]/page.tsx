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
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Users,
  Pencil,
} from "lucide-react"

export default async function CompanyDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return null
  }

  const company = await prisma.company.findUnique({
    where: { id: params.id },
    include: {
      contacts: {
        orderBy: [
          { isPrimary: 'desc' },
          { createdAt: 'desc' }
        ]
      },
      deals: {
        take: 5,
        orderBy: { createdAt: 'desc' }
      },
      projects: {
        take: 5,
        orderBy: { createdAt: 'desc' }
      },
      invoices: {
        take: 5,
        orderBy: { createdAt: 'desc' }
      },
    },
  })

  if (!company) {
    notFound()
  }

  const stats = {
    contacts: company.contacts.length,
    deals: company.deals.length,
    projects: company.projects.length,
    invoices: company.invoices.length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link href="/dashboard/companies">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Companies
          </Button>
        </Link>
      </div>

      {/* Company Info */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          {company.logo ? (
            <div className="relative h-20 w-20 rounded-lg overflow-hidden border">
              <Image
                src={company.logo}
                alt={company.name}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-primary/10 border">
              <Building2 className="h-10 w-10 text-primary" />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{company.name}</h1>
            <p className="text-muted-foreground mt-1">{company.industry || "No industry specified"}</p>
            <div className="flex gap-2 mt-2">
              <Badge variant={company.isActive ? "default" : "secondary"}>
                {company.isActive ? "Active" : "Inactive"}
              </Badge>
              {company.taxId && (
                <Badge variant="outline">Tax ID: {company.taxId}</Badge>
              )}
            </div>
          </div>
        </div>
        <Link href={`/dashboard/companies/${company.id}/edit`}>
          <Button>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Company
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contacts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.contacts}</div>
            <p className="text-xs text-muted-foreground">
              Contact persons
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deals</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.deals}</div>
            <p className="text-xs text-muted-foreground">
              Active deals
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.projects}</div>
            <p className="text-xs text-muted-foreground">
              Projects
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Invoices</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.invoices}</div>
            <p className="text-xs text-muted-foreground">
              Total invoices
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {company.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${company.email}`} className="hover:underline">
                  {company.email}
                </a>
              </div>
            )}
            {company.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a href={`tel:${company.phone}`} className="hover:underline">
                  {company.phone}
                </a>
              </div>
            )}
            {company.website && (
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {company.website}
                </a>
              </div>
            )}
            {(company.address || company.city || company.province) && (
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="text-sm">
                  {company.address && <div>{company.address}</div>}
                  <div>
                    {[company.city, company.province, company.postalCode]
                      .filter(Boolean)
                      .join(", ")}
                  </div>
                  {company.country && <div>{company.country}</div>}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact Persons */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Contact Persons ({company.contacts.length})</span>
              <Link href={`/dashboard/contacts/new?companyId=${company.id}`}>
                <Button size="sm" variant="outline">
                  Add Contact
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {company.contacts.length === 0 ? (
                <p className="text-sm text-muted-foreground">No contacts yet</p>
              ) : (
                company.contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0"
                  >
                    {contact.image ? (
                      <div className="relative h-10 w-10 rounded-full overflow-hidden">
                        <Image
                          src={contact.image}
                          alt={`${contact.firstName} ${contact.lastName}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <span className="text-sm font-semibold text-primary">
                          {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/contacts/${contact.id}/edit`}
                          className="font-medium hover:underline"
                        >
                          {contact.firstName} {contact.lastName}
                        </Link>
                        {contact.isPrimary && (
                          <Badge variant="outline" className="text-xs">
                            Primary
                          </Badge>
                        )}
                      </div>
                      {contact.position && (
                        <p className="text-sm text-muted-foreground">
                          {contact.position}
                        </p>
                      )}
                      <div className="text-sm space-y-1 mt-1">
                        {contact.email && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            <a href={`mailto:${contact.email}`} className="hover:underline">
                              {contact.email}
                            </a>
                          </div>
                        )}
                        {contact.phone && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            <a href={`tel:${contact.phone}`} className="hover:underline">
                              {contact.phone}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Files / Assets */}
        <ActivityFiles companyId={company.id} />
      </div>

      {/* Notes */}
      {company.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{company.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Activity Timeline */}
      <ActivityTimelineWrapper
        companyId={company.id}
        showContactName={true}
        title="Recent Activities"
        description="All contact activities for this company"
      />
    </div>
  )
}
