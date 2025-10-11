"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, LayoutGrid, Table, Users } from "lucide-react"
import { TasksTable } from "./tasks-table"
import { TasksKanban } from "./tasks-kanban"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

interface TasksPageClientProps {
  tasks: any[]
  showUser?: boolean
  isAdmin?: boolean
}

export function TasksPageClient({ tasks, showUser = false, isAdmin = false }: TasksPageClientProps) {
  const [viewMode, setViewMode] = useState<"table" | "kanban">("kanban")

  const pendingTasks = tasks.filter(task => task.status === "PENDING")
  const doingTasks = tasks.filter(task => task.status === "DOING")
  const doneTasks = tasks.filter(task => task.status === "DONE")

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
          <p className="text-muted-foreground">
            Manage your tasks and to-do list
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

          {/* Admin View Button */}
          {isAdmin && (
            <Button asChild variant="outline">
              <Link href="/dashboard/tasks/admin">
                <Users className="mr-2 h-4 w-4" />
                View All Tasks
              </Link>
            </Button>
          )}

          <Button asChild>
            <Link href="/dashboard/tasks/new">
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Link>
          </Button>
        </div>
      </div>

      {/* Kanban View */}
      {viewMode === "kanban" && (
        <TasksKanban tasks={tasks} showUser={showUser} />
      )}

      {/* Table View */}
      {viewMode === "table" && (
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">
              All ({tasks.length})
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
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <TasksTable tasks={tasks} showUser={showUser} />
          </TabsContent>

          <TabsContent value="pending" className="mt-6">
            <TasksTable tasks={pendingTasks} showUser={showUser} />
          </TabsContent>

          <TabsContent value="doing" className="mt-6">
            <TasksTable tasks={doingTasks} showUser={showUser} />
          </TabsContent>

          <TabsContent value="done" className="mt-6">
            <TasksTable tasks={doneTasks} showUser={showUser} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
