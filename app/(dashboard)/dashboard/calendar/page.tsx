import { Metadata } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import CalendarClient from "@/components/calendar/calendar-client"

export const metadata: Metadata = {
  title: "Calendar | LDG ERP",
  description: "Manage your tasks and events",
}

export default async function CalendarPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  // Fetch tasks with due dates for the user
  const tasks = await prisma.task.findMany({
    where: {
      userId: session.user.id,
      dueDate: {
        not: null,
      },
    },
    select: {
      id: true,
      title: true,
      dueDate: true,
      status: true,
      priority: true,
    },
    orderBy: {
      dueDate: 'asc',
    },
  })

  // Convert dates to serializable format
  const serializedTasks = tasks.map(task => ({
    ...task,
    dueDate: task.dueDate ? task.dueDate.toISOString() : null,
  }))

  return <CalendarClient tasks={serializedTasks as any} />
}
