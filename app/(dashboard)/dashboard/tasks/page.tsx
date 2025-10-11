import { Metadata } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { TasksPageClient } from "@/components/tasks/tasks-page-client"

export const metadata: Metadata = {
  title: "My Tasks | LDG ERP",
  description: "Manage your tasks",
}

export default async function TasksPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  // Fetch tasks for current user
  const tasks = await prisma.task.findMany({
    where: {
      userId: session.user.id,
    },
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

  return <TasksPageClient tasks={tasks} isAdmin={session.user.role === "ADMIN"} />
}
