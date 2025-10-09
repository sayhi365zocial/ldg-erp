"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Link2, Upload, X, FileText, ExternalLink } from "lucide-react"

const activityTypes = [
  { value: "CALL", label: "📞 Phone Call" },
  { value: "EMAIL", label: "📧 Email" },
  { value: "MEETING", label: "👥 Meeting" },
  { value: "NOTE", label: "📝 Note" },
  { value: "TASK", label: "✅ Task" },
  { value: "OTHER", label: "💬 LINE/Chat" },
]

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
  metadata: {
    attachments?: Attachment[]
  } | null
}

interface ActivityEditDialogProps {
  activity: Activity | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ActivityEditDialog({ activity, open, onOpenChange }: ActivityEditDialogProps) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedType, setSelectedType] = useState(activity?.type || "NOTE")
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [linkInput, setLinkInput] = useState("")
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (activity) {
      setSelectedType(activity.type)
      setAttachments(activity.metadata?.attachments || [])
    }
  }, [activity])

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("type", "activities")

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) throw new Error("Failed to upload file")

        const data = await response.json()
        setAttachments(prev => [...prev, {
          type: "file",
          url: data.url,
          name: file.name
        }])
      }
    } catch (error) {
      console.error(error)
      alert("Failed to upload file")
    } finally {
      setUploading(false)
    }
  }

  function handleAddLink() {
    if (!linkInput.trim()) return

    // Auto-detect link type
    let linkType = "link"
    if (linkInput.includes("docs.google.com")) linkType = "google-docs"
    else if (linkInput.includes("sheets.google.com")) linkType = "google-sheets"
    else if (linkInput.includes("canva.com")) linkType = "canva"
    else if (linkInput.includes("drive.google.com")) linkType = "google-drive"

    setAttachments(prev => [...prev, {
      type: linkType,
      url: linkInput,
      name: linkInput
    }])
    setLinkInput("")
  }

  function removeAttachment(index: number) {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!activity) return

    setIsLoading(true)

    const formData = new FormData(e.currentTarget)

    // Prepare metadata with attachments
    const metadata = attachments.length > 0 ? { attachments } : null

    const data = {
      id: activity.id,
      type: selectedType,
      title: formData.get("title"),
      description: formData.get("description"),
      metadata: metadata,
    }

    try {
      const response = await fetch("/api/activities", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error("Failed to update activity")

      // Refresh and close
      router.refresh()
      setTimeout(() => {
        onOpenChange(false)
      }, 300)
    } catch (error) {
      console.error(error)
      alert("Failed to update activity")
    } finally {
      setIsLoading(false)
    }
  }

  if (!activity) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Activity</DialogTitle>
        </DialogHeader>
        <form ref={formRef} onSubmit={onSubmit} className="space-y-4">
          {/* Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Activity Type *</Label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {activityTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              name="title"
              required
              defaultValue={activity.title}
              placeholder="e.g., Discussed project requirements"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Details</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={activity.description || ""}
              placeholder="Add notes about this activity..."
              rows={4}
            />
          </div>

          {/* Attachments */}
          <div className="space-y-2">
            <Label>Attachments</Label>

            {/* File Upload */}
            <div className="flex gap-2">
              <label className="flex-1">
                <div className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-accent">
                  <Upload className="h-4 w-4" />
                  <span className="text-sm">{uploading ? "Uploading..." : "Upload Files"}</span>
                </div>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>

            {/* Link Input */}
            <div className="flex gap-2">
              <Input
                value={linkInput}
                onChange={(e) => setLinkInput(e.target.value)}
                placeholder="Paste link (Google Docs, Sheets, Canva, etc.)"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddLink())}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleAddLink}
                disabled={!linkInput.trim()}
              >
                <Link2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Attachments List */}
            {attachments.length > 0 && (
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 p-2 bg-muted rounded-md"
                  >
                    <div className="flex items-start gap-2 flex-1 min-w-0 overflow-hidden">
                      {attachment.type === "file" ? (
                        <FileText className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      ) : (
                        <ExternalLink className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-medium truncate">
                            {attachment.type === "file"
                              ? attachment.name
                              : new URL(attachment.url).hostname
                            }
                          </span>
                          <Badge variant="secondary" className="text-xs flex-shrink-0">
                            {attachment.type}
                          </Badge>
                        </div>
                        {attachment.type !== "file" && (
                          <p className="text-xs text-muted-foreground break-all line-clamp-2" title={attachment.url}>
                            {attachment.url}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 flex-shrink-0"
                      onClick={() => removeAttachment(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
