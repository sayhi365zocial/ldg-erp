"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, LayoutGrid, Table, User } from "lucide-react"
import { TasksTable } from "./tasks-table"
import { TasksKanban } from "./tasks-kanban"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

interface AdminTasksPageClientProps {
  tasks: any[]
  tasksByUser: any[]
}

export function AdminTasksPageClient({ tasks, tasksByUser }: AdminTasksPageClientProps) {
  const [viewMode, setViewMode] = useState<"table" | "kanban">("kanban")

  const pendingTasks = tasks.filter(task => task.status === "PENDING")
  const doingTasks = tasks.filter(task => task.status === "DOING")
  const doneTasks = tasks.filter(task => task.status === "DONE")

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Tasks (Admin View)</h1>
          <p className="text-muted-foreground">
            View and manage all tasks across the organization
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center border rounded-lg p-1">
            <Button
              variant={viewMode === "kanban" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("kanban")}
              className="h-8"
            >
              <LayoutGrid className="h-4 w-4 mr-1" />
              Board
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="h-8"
            >
              <Table className="h-4 w-4 mr-1" />
              List
            </Button>
          </div>

          {/* My Tasks Button */}
          <Button asChild variant="outline">
            <Link href="/dashboard/tasks">
              <User className="mr-2 h-4 w-4" />
              My Tasks
            </Link>
          </Button>

          <Button asChild>
            <Link href="/dashboard/tasks/new">
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Link>
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border p-4">
          <h3 className="text-sm font-medium text-muted-foreground">Total Tasks</h3>
          <p className="text-2xl font-bold">{tasks.length}</p>
        </div>
        <div className="rounded-lg border p-4 bg-yellow-50">
          <h3 className="text-sm font-medium text-muted-foreground">Pending</h3>
          <p className="text-2xl font-bold text-yellow-700">{pendingTasks.length}</p>
        </div>
        <div className="rounded-lg border p-4 bg-blue-50">
          <h3 className="text-sm font-medium text-muted-foreground">In Progress</h3>
          <p className="text-2xl font-bold text-blue-700">{doingTasks.length}</p>
        </div>
        <div className="rounded-lg border p-4 bg-green-50">
          <h3 className="text-sm font-medium text-muted-foreground">Completed</h3>
          <p className="text-2xl font-bold text-green-700">{doneTasks.length}</p>
        </div>
      </div>

      {/* Kanban View */}
      {viewMode === "kanban" && (
        <TasksKanban tasks={tasks} showUser={true} />
      )}

      {/* Table View */}
      {viewMode === "table" && (
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">
              All Tasks ({tasks.length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({pendingTasks.length})
            </TabsTrigger>
            <TabsTrigger value="doing">
              Doing ({doingTasks.length})
            </TabsTrigger>
            <TabsTrigger value="done">
              Done ({doneTasks.length})
            </TabsTrigger>
            <TabsTrigger value="users">
              By User
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <TasksTable tasks={tasks} showUser={true} />
          </TabsContent>

          <TabsContent value="pending" className="mt-6">
            <TasksTable tasks={pendingTasks} showUser={true} />
          </TabsContent>

          <TabsContent value="doing" className="mt-6">
            <TasksTable tasks={doingTasks} showUser={true} />
          </TabsContent>

          <TabsContent value="done" className="mt-6">
            <TasksTable tasks={doneTasks} showUser={true} />
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <div className="rounded-md border">
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-4">Tasks by User</h3>
                <div className="space-y-4">
                  {tasksByUser.map((user) => {
                    const userTasks = tasks.filter(task => task.userId === user.id)
                    const userPending = userTasks.filter(task => task.status === "PENDING").length
                    const userDoing = userTasks.filter(task => task.status === "DOING").length
                    const userDone = userTasks.filter(task => task.status === "DONE").length

                    return (
                      <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {user.image && (
                            <img
                              src={user.image}
                              alt={user.name}
                              className="h-10 w-10 rounded-full"
                            />
                          )}
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 text-sm">
                          <div className="text-center">
                            <p className="text-muted-foreground">Total</p>
                            <p className="font-bold text-lg">{user._count.tasks}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-muted-foreground">Pending</p>
                            <p className="font-bold text-lg text-yellow-600">{userPending}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-muted-foreground">Doing</p>
                            <p className="font-bold text-lg text-blue-600">{userDoing}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-muted-foreground">Done</p>
                            <p className="font-bold text-lg text-green-600">{userDone}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
