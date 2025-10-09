"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, ExternalLink, FileText, Image as ImageIcon, File } from "lucide-react"

interface Attachment {
  type: string
  url: string
  name: string
  activityTitle?: string
  activityDate?: Date
}

interface Activity {
  id: string
  title: string
  createdAt: Date
  metadata: {
    attachments?: Attachment[]
  } | null
}

interface ActivityFilesProps {
  contactId?: string
  companyId?: string
}

export function ActivityFiles({ contactId, companyId }: ActivityFilesProps) {
  const [files, setFiles] = useState<Attachment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadFiles() {
      try {
        const queryParam = contactId
          ? `contactId=${contactId}`
          : `companyId=${companyId}`
        const response = await fetch(`/api/activities?${queryParam}`)
        if (!response.ok) throw new Error("Failed to load activities")

        const activities: Activity[] = await response.json()

        // Extract all attachments from activities
        const allFiles: Attachment[] = []
        activities.forEach((activity) => {
          if (activity.metadata?.attachments) {
            activity.metadata.attachments.forEach((attachment) => {
              allFiles.push({
                ...attachment,
                activityTitle: activity.title,
                activityDate: activity.createdAt,
              })
            })
          }
        })

        setFiles(allFiles)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    loadFiles()
  }, [contactId, companyId])

  const getFileIcon = (attachment: Attachment) => {
    if (attachment.type === "file") {
      const ext = attachment.name.split(".").pop()?.toLowerCase()
      if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext || "")) {
        return <ImageIcon className="h-4 w-4 text-purple-600" />
      }
      if (["pdf"].includes(ext || "")) {
        return <FileText className="h-4 w-4 text-red-600" />
      }
      return <File className="h-4 w-4 text-gray-600" />
    }
    return <ExternalLink className="h-4 w-4 text-green-600" />
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      "google-docs": "Google Docs",
      "google-sheets": "Google Sheets",
      "google-drive": "Google Drive",
      "canva": "Canva",
      "file": "File",
      "link": "Link",
    }
    return labels[type] || type
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Files / Assets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">Loading files...</div>
        </CardContent>
      </Card>
    )
  }

  if (files.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Files / Assets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-sm text-muted-foreground py-4">
            No files or assets yet
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Files / Assets</CardTitle>
          <Badge variant="secondary">{files.length} items</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2 max-h-[400px] overflow-y-auto">
          {files.map((file, idx) => (
            <a
              key={idx}
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent transition-colors"
            >
              <div className="mt-0.5 flex-shrink-0">{getFileIcon(file)}</div>

              <div className="flex-1 min-w-0 overflow-hidden">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-sm truncate max-w-[200px]" title={file.name}>
                    {file.name}
                  </p>
                  <Badge variant="outline" className="text-xs flex-shrink-0">
                    {getTypeLabel(file.type)}
                  </Badge>
                </div>

                {file.activityTitle && (
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    From: {file.activityTitle}
                  </p>
                )}

                {file.activityDate && (
                  <p className="text-xs text-muted-foreground">
                    {new Date(file.activityDate).toLocaleDateString("th-TH", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                )}
              </div>

              <div className="flex-shrink-0">
                {file.type === "file" ? (
                  <Download className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
