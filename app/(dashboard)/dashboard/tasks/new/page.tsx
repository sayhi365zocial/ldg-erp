import { Metadata } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { TaskForm } from "@/components/tasks/task-form"

export const metadata: Metadata = {
  title: "New Task | LDG ERP",
  description: "Create a new task",
}

export default async function NewTaskPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  // Fetch companies and contacts for dropdowns
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
        <h1 className="text-3xl font-bold tracking-tight">Create New Task</h1>
        <p className="text-muted-foreground">
          Add a new task to your to-do list
        </p>
      </div>

      <div className="max-w-3xl">
        <TaskForm
          companies={companies}
          contacts={contacts}
          users={users}
          isAdmin={session.user.role === "ADMIN"}
        />
      </div>
    </div>
  )
}
