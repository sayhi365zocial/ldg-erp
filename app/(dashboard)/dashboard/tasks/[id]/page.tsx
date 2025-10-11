import { Metadata } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pencil, ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Task Details | LDG ERP",
  description: "View task details",
}

interface TaskDetailPageProps {
  params: {
    id: string
  }
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

export default async function TaskDetailPage({ params }: TaskDetailPageProps) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  const task = await prisma.task.findUnique({
    where: { id: params.id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        }
      },
      company: {
        select: {
          id: true,
          name: true,
        }
      },
      contact: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
        }
      }
    },
  })

  if (!task) {
    notFound()
  }

  // Check access - user must own the task or be admin
  if (task.userId !== session.user.id && session.user.role !== "ADMIN") {
    redirect("/dashboard/tasks")
  }

  function formatDate(date: Date | null) {
    if (!date) return "-"
    return new Date(date).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/tasks">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{task.title}</h1>
            <p className="text-muted-foreground">Task details</p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/dashboard/tasks/${task.id}/edit`}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Task
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Status & Priority */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Status</h3>
            <Badge className={statusColors[task.status as keyof typeof statusColors]}>
              {task.status}
            </Badge>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Priority</h3>
            <Badge className={priorityColors[task.priority as keyof typeof priorityColors]}>
              {task.priority}
            </Badge>
          </div>
        </div>

        {/* Dates */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Due Date</h3>
            <p className={task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "DONE" ? "text-red-600 font-medium" : ""}>
              {formatDate(task.dueDate)}
            </p>
          </div>
          {task.completedAt && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Completed At</h3>
              <p>{formatDate(task.completedAt)}</p>
            </div>
          )}
        </div>

        {/* Assigned User */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Assigned To</h3>
          <div className="flex items-center gap-3">
            {task.user?.image && (
              <img
                src={task.user.image}
                alt={task.user.name}
                className="h-10 w-10 rounded-full"
              />
            )}
            <div>
              <p className="font-medium">{task.user?.name}</p>
              <p className="text-sm text-muted-foreground">{task.user?.email}</p>
            </div>
          </div>
        </div>

        {/* Related Company */}
        {task.company && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Related Company</h3>
            <Link
              href={`/dashboard/companies/${task.company.id}`}
              className="text-blue-600 hover:underline"
            >
              {task.company.name}
            </Link>
          </div>
        )}

        {/* Related Contact */}
        {task.contact && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Related Contact</h3>
            <div>
              <Link
                href={`/dashboard/contacts/${task.contact.id}`}
                className="text-blue-600 hover:underline font-medium"
              >
                {task.contact.firstName} {task.contact.lastName}
              </Link>
              <p className="text-sm text-muted-foreground">{task.contact.email}</p>
              {task.contact.phone && (
                <p className="text-sm text-muted-foreground">{task.contact.phone}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      {task.description && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
          <div className="rounded-lg border p-4 whitespace-pre-wrap">
            {task.description}
          </div>
        </div>
      )}

      {/* Notes */}
      {task.notes && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Notes</h3>
          <div className="rounded-lg border p-4 whitespace-pre-wrap">
            {task.notes}
          </div>
        </div>
      )}

      {/* Attachments */}
      {task.attachments && task.attachments.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Attachments</h3>
          <div className="space-y-2">
            {task.attachments.map((url, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {url.split('/').pop()}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="text-sm text-muted-foreground space-y-1">
        <p>Created: {formatDate(task.createdAt)}</p>
        <p>Last Updated: {formatDate(task.updatedAt)}</p>
      </div>
    </div>
  )
}
