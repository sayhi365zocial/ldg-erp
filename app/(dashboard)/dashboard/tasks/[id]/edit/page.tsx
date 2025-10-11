import { Metadata } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { TaskForm } from "@/components/tasks/task-form"

export const metadata: Metadata = {
  title: "Edit Task | LDG ERP",
  description: "Edit task",
}

interface EditTaskPageProps {
  params: {
    id: string
  }
}

export default async function EditTaskPage({ params }: EditTaskPageProps) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  const task = await prisma.task.findUnique({
    where: { id: params.id },
    include: {
      user: true,
      company: true,
      contact: true,
    },
  })

  if (!task) {
    notFound()
  }

  // Check access - user must own the task or be admin
  if (task.userId !== session.user.id && session.user.role !== "ADMIN") {
    redirect("/dashboard/tasks")
  }

  // Fetch companies, contacts, and users for dropdowns
  const [companies, contacts, users] = await Promise.all([
    prisma.company.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: 'asc' },
    }),
    prisma.contactPerson.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        companyId: true,
      },
      orderBy: { firstName: 'asc' },
    }),
    session.user.role === "ADMIN"
      ? prisma.user.findMany({
          select: {
            id: true,
            name: true,
          },
          orderBy: { name: 'asc' },
        })
      : [],
  ])

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Task</h1>
        <p className="text-muted-foreground">
          Update task information
        </p>
      </div>

      <div className="max-w-3xl">
        <TaskForm
          task={task}
          companies={companies}
          contacts={contacts}
          users={users}
          isAdmin={session.user.role === "ADMIN"}
        />
      </div>
    </div>
  )
}
