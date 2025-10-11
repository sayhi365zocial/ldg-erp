"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pencil, ExternalLink } from "lucide-react"
import Link from "next/link"

interface TaskQuickViewModalProps {
  task: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  DOING: "bg-blue-100 text-blue-800",
  DONE: "bg-green-100 text-green-800",
}

const priorityColors = {
  LOW: "bg-gray-100 text-gray-800",
  MEDIUM: "bg-blue-100 text-blue-800",
  HIGH: "bg-orange-100 text-orange-800",
  URGENT: "bg-red-100 text-red-800",
}

export function TaskQuickViewModal({ task, open, onOpenChange }: TaskQuickViewModalProps) {
  if (!task) return null

  function formatDate(date: string | null) {
    if (!date) return "-"
    return new Date(date).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "DONE"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{task.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Status & Priority */}
          <div className="flex items-center gap-3">
            <Badge className={statusColors[task.status as keyof typeof statusColors]}>
              {task.status}
            </Badge>
            <Badge className={priorityColors[task.priority as keyof typeof priorityColors]}>
              {task.priority}
            </Badge>
          </div>

          {/* Due Date */}
          {task.dueDate && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Due Date</p>
              <p className={isOverdue ? "text-red-600 font-semibold" : ""}>
                {formatDate(task.dueDate)}
                {isOverdue && " (Overdue)"}
              </p>
            </div>
          )}

          {/* Assigned To */}
          {task.user && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Assigned To</p>
              <div className="flex items-center gap-2">
                {task.user.image && (
                  <img
                    src={task.user.image}
                    alt={task.user.name}
                    className="h-8 w-8 rounded-full"
                  />
                )}
                <div>
                  <p className="font-medium">{task.user.name}</p>
                  <p className="text-sm text-muted-foreground">{task.user.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Company & Contact */}
          <div className="grid grid-cols-2 gap-4">
            {task.company && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Company</p>
                <Link
                  href={`/dashboard/companies/${task.company.id}`}
                  className="text-blue-600 hover:underline"
                >
                  {task.company.name}
                </Link>
              </div>
            )}

            {task.contact && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Contact</p>
                <Link
                  href={`/dashboard/contacts/${task.contact.id}`}
                  className="text-blue-600 hover:underline"
                >
                  {task.contact.firstName} {task.contact.lastName}
                </Link>
              </div>
            )}
          </div>

          {/* Description */}
          {task.description && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Description</p>
              <p className="text-sm whitespace-pre-wrap bg-muted p-3 rounded-md">
                {task.description}
              </p>
            </div>
          )}

          {/* Notes */}
          {task.notes && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Notes</p>
              <p className="text-sm whitespace-pre-wrap bg-muted p-3 rounded-md">
                {task.notes}
              </p>
            </div>
          )}

          {/* Attachments */}
          {task.attachments && task.attachments.length > 0 && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Attachments ({task.attachments.length})
              </p>
              <div className="space-y-1">
                {task.attachments.slice(0, 3).map((url: string, index: number) => (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline block truncate"
                  >
                    {url.split('/').pop()}
                  </a>
                ))}
                {task.attachments.length > 3 && (
                  <p className="text-sm text-muted-foreground">
                    +{task.attachments.length - 3} more files
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Completed At */}
          {task.completedAt && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Completed At</p>
              <p className="text-sm">{formatDate(task.completedAt)}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button asChild variant="outline" className="flex-1">
              <Link href={`/dashboard/tasks/${task.id}`}>
                <ExternalLink className="mr-2 h-4 w-4" />
                View Full Details
              </Link>
            </Button>
            <Button asChild className="flex-1">
              <Link href={`/dashboard/tasks/${task.id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Task
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
