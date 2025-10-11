import { Metadata } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { AdminTasksPageClient } from "@/components/tasks/admin-tasks-page-client"

export const metadata: Metadata = {
  title: "All Tasks (Admin) | LDG ERP",
  description: "View and manage all tasks",
}

export default async function AdminTasksPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  // Only admins can access this page
  if (session.user.role !== "ADMIN") {
    redirect("/dashboard/tasks")
  }

  // Fetch all tasks
  const tasks = await prisma.task.findMany({
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
        }
      }
    },
    orderBy: [
      { status: 'asc' },
      { dueDate: 'asc' },
      { createdAt: 'desc' },
    ],
  })

  // Get tasks by user
  const tasksByUser = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      _count: {
        select: {
          tasks: true,
        }
      }
    },
    orderBy: { name: 'asc' },
  })

  return <AdminTasksPageClient tasks={tasks} tasksByUser={tasksByUser} />
}
