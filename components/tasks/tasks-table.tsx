"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react"

interface TasksTableProps {
  tasks: any[]
  showUser?: boolean
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

export function TasksTable({ tasks, showUser = false }: TasksTableProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this task?")) return

    setDeletingId(id)
    try {
      const response = await fetch(`/api/tasks?id=${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete task")

      router.refresh()
    } catch (error) {
      console.error(error)
      alert("Failed to delete task")
    } finally {
      setDeletingId(null)
    }
  }

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

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            {showUser && <TableHead>Assigned To</TableHead>}
            <TableHead>Company</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={showUser ? 8 : 7} className="text-center text-muted-foreground">
                No tasks found
              </TableCell>
            </TableRow>
          ) : (
            tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">
                  <div>
                    <div>{task.title}</div>
                    {task.description && (
                      <div className="text-sm text-muted-foreground truncate max-w-xs">
                        {task.description}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={statusColors[task.status as keyof typeof statusColors]}>
                    {task.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={priorityColors[task.priority as keyof typeof priorityColors]}>
                    {task.priority}
                  </Badge>
                </TableCell>
                {showUser && (
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {task.user?.image && (
                        <img
                          src={task.user.image}
                          alt={task.user.name}
                          className="h-6 w-6 rounded-full"
                        />
                      )}
                      <span className="text-sm">{task.user?.name || "-"}</span>
                    </div>
                  </TableCell>
                )}
                <TableCell>{task.company?.name || "-"}</TableCell>
                <TableCell>
                  {task.contact
                    ? `${task.contact.firstName} ${task.contact.lastName}`
                    : "-"}
                </TableCell>
                <TableCell>
                  <div className={task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "DONE" ? "text-red-600 font-medium" : ""}>
                    {formatDate(task.dueDate)}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/tasks/${task.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/tasks/${task.id}/edit`}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(task.id)}
                        disabled={deletingId === task.id}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {deletingId === task.id ? "Deleting..." : "Delete"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
