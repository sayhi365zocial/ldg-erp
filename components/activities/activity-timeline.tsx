"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Phone, Mail, Users, FileText, CheckSquare, MessageSquare, Paperclip, ExternalLink, Download, MoreVertical, Pencil, Trash, Search } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ActivityEditDialog } from "./activity-edit-dialog"
import Link from "next/link"

const activityIcons = {
  CALL: Phone,
  EMAIL: Mail,
  MEETING: Users,
  NOTE: FileText,
  TASK: CheckSquare,
  OTHER: MessageSquare,
}

const activityColors = {
  CALL: "bg-blue-100 text-blue-700 border-blue-200",
  EMAIL: "bg-purple-100 text-purple-700 border-purple-200",
  MEETING: "bg-green-100 text-green-700 border-green-200",
  NOTE: "bg-gray-100 text-gray-700 border-gray-200",
  TASK: "bg-orange-100 text-orange-700 border-orange-200",
  OTHER: "bg-pink-100 text-pink-700 border-pink-200",
}

interface Attachment {
  type: string
  url: string
  name: string
}

interface Activity {
  id: string
  type: string
  title: string
  description: string | null
  createdAt: Date
  isCompleted: boolean
  metadata: any
  user: {
    name: string | null
    email: string
  }
  contact?: {
    id: string
    firstName: string
    lastName: string
  } | null
}

interface ActivityTimelineProps {
  contactId?: string
  companyId?: string
  showContactName?: boolean
  search?: string
  onSearchChange?: (value: string) => void
}

export function ActivityTimeline({ contactId, companyId, showContactName = false, search = "", onSearchChange }: ActivityTimelineProps) {
  const router = useRouter()
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editActivity, setEditActivity] = useState<Activity | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  async function loadActivities() {
    try {
      const params = new URLSearchParams()
      if (contactId) params.set("contactId", contactId)
      if (companyId) params.set("companyId", companyId)

      const response = await fetch(`/api/activities?${params}`)
      if (!response.ok) throw new Error("Failed to load activities")

      const data = await response.json()
      setActivities(data)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this activity?")) return

    try {
      const response = await fetch(`/api/activities?id=${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete activity")

      router.refresh()
      loadActivities()
    } catch (error) {
      console.error(error)
      alert("Failed to delete activity")
    }
  }

  useEffect(() => {
    loadActivities()
  }, [contactId, companyId])

  const filteredActivities = activities.filter(activity => {
    const searchLower = search.toLowerCase()

    // Search in title, description, type
    const matchesBasic =
      activity.title.toLowerCase().includes(searchLower) ||
      activity.description?.toLowerCase().includes(searchLower) ||
      activity.type.toLowerCase().includes(searchLower)

    // Search in attachment names
    const matchesAttachments = activity.metadata?.attachments?.some((att: Attachment) =>
      att.name.toLowerCase().includes(searchLower)
    )

    return matchesBasic || matchesAttachments
  })

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading activities...</div>
  }

  if (activities.length === 0) {
    return (
      <div className="text-center text-sm text-muted-foreground py-8">
        No activities yet. Start logging interactions!
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {filteredActivities.length === 0 ? (
        <div className="text-center text-sm text-muted-foreground py-8">
          {search ? `No activities found matching "${search}"` : "No activities found"}
        </div>
      ) : (
        filteredActivities.map((activity, index) => {
        const Icon = activityIcons[activity.type as keyof typeof activityIcons] || FileText
        const colorClass = activityColors[activity.type as keyof typeof activityColors] || activityColors.NOTE

        return (
          <div key={activity.id} className="relative pl-8 pb-4">
            {/* Timeline line */}
            {index !== filteredActivities.length - 1 && (
              <div className="absolute left-[13px] top-8 bottom-0 w-px bg-border" />
            )}

            {/* Icon */}
            <div className={`absolute left-0 top-0 flex h-7 w-7 items-center justify-center rounded-full border ${colorClass}`}>
              <Icon className="h-3.5 w-3.5" />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm">{activity.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {activity.type}
                    </Badge>
                  </div>
                  {showContactName && activity.contact && (
                    <Link
                      href={`/dashboard/contacts/${activity.contact.id}/edit`}
                      className="text-xs text-muted-foreground hover:underline"
                    >
                      {activity.contact.firstName} {activity.contact.lastName}
                    </Link>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(activity.createdAt).toLocaleDateString("th-TH", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>

                  {/* Actions Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <MoreVertical className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setEditActivity(activity)
                          setEditDialogOpen(true)
                        }}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDelete(activity.id)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {activity.description && (
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {activity.description}
                </p>
              )}

              {/* Attachments */}
              {activity.metadata?.attachments && activity.metadata.attachments.length > 0 && (
                <div className="space-y-1 mt-2">
                  <div className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <Paperclip className="h-3 w-3" />
                    Attachments ({activity.metadata.attachments.length})
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activity.metadata.attachments.map((attachment: Attachment, idx: number) => (
                      <a
                        key={idx}
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/50 border rounded-md text-xs hover:bg-accent transition-colors"
                      >
                        {attachment.type === "file" ? (
                          <Download className="h-3.5 w-3.5 text-blue-600" />
                        ) : (
                          <ExternalLink className="h-3.5 w-3.5 text-green-600" />
                        )}
                        <span className="truncate max-w-[200px] font-medium">{attachment.name}</span>
                        {attachment.type !== "file" && attachment.type !== "link" && (
                          <Badge variant="secondary" className="text-[10px] px-1 py-0">
                            {attachment.type}
                          </Badge>
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>by {activity.user.name || activity.user.email}</span>
              </div>
            </div>
          </div>
        )
      })
      )}

      {/* Edit Dialog */}
      <ActivityEditDialog
        activity={editActivity}
        open={editDialogOpen}
        onOpenChange={(open) => {
          setEditDialogOpen(open)
          if (!open) {
            setEditActivity(null)
            loadActivities()
          }
        }}
      />
    </div>
  )
}
