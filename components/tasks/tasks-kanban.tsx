"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  DragOverEvent,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Calendar, Building2, User } from "lucide-react"
import { TaskQuickViewModal } from "./task-quick-view-modal"

interface TasksKanbanProps {
  tasks: any[]
  showUser?: boolean
}

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-300",
  DOING: "bg-blue-100 text-blue-800 border-blue-300",
  DONE: "bg-green-100 text-green-800 border-green-300",
}

const priorityColors = {
  LOW: "bg-gray-100 text-gray-800",
  MEDIUM: "bg-blue-100 text-blue-800",
  HIGH: "bg-orange-100 text-orange-800",
  URGENT: "bg-red-100 text-red-800",
}

const columns = [
  { id: "PENDING", title: "Pending", color: "border-yellow-300" },
  { id: "DOING", title: "Doing", color: "border-blue-300" },
  { id: "DONE", title: "Done", color: "border-green-300" },
]

export function TasksKanban({ tasks, showUser = false }: TasksKanbanProps) {
  const router = useRouter()
  const [activeTask, setActiveTask] = useState<any>(null)
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  async function handleDragStart(event: DragStartEvent) {
    const task = tasks.find((t) => t.id === event.active.id)
    setActiveTask(task)
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveTask(null)

    if (!over || active.id === over.id) return

    const taskId = active.id as string
    const newStatus = over.id as string

    // Optimistically update UI
    const task = tasks.find((t) => t.id === taskId)
    if (!task || task.status === newStatus) return

    try {
      const response = await fetch("/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: taskId,
          ...task,
          status: newStatus,
        }),
      })

      if (!response.ok) throw new Error("Failed to update task")

      router.refresh()
    } catch (error) {
      console.error(error)
      alert("Failed to update task status")
      router.refresh()
    }
  }

  function handleQuickView(task: any) {
    setSelectedTask(task)
    setIsQuickViewOpen(true)
  }

  function getTasksByStatus(status: string) {
    return tasks.filter((task) => task.status === status)
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCorners}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((column) => {
            const columnTasks = getTasksByStatus(column.id)

            return (
              <DroppableColumn
                key={column.id}
                id={column.id}
                title={column.title}
                color={column.color}
                count={columnTasks.length}
              >
                {columnTasks.map((task) => (
                  <DraggableTask
                    key={task.id}
                    task={task}
                    showUser={showUser}
                    onQuickView={handleQuickView}
                  />
                ))}

                {columnTasks.length === 0 && (
                  <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
                    No tasks
                  </div>
                )}
              </DroppableColumn>
            )
          })}
        </div>

        <DragOverlay>
          {activeTask && (
            <div className="opacity-50 rotate-3">
              <TaskCard
                task={activeTask}
                showUser={showUser}
                onQuickView={handleQuickView}
              />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      <TaskQuickViewModal
        task={selectedTask}
        open={isQuickViewOpen}
        onOpenChange={setIsQuickViewOpen}
      />
    </>
  )
}

// Droppable Column Component
interface DroppableColumnProps {
  id: string
  title: string
  color: string
  count: number
  children: React.ReactNode
}

function DroppableColumn({ id, title, color, count, children }: DroppableColumnProps) {
  const { setNodeRef } = useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col border-t-4 ${color} bg-muted/30 rounded-lg p-4`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">{title}</h3>
        <Badge variant="outline">{count}</Badge>
      </div>
      <div className="flex-1 space-y-3 min-h-[200px]">
        {children}
      </div>
    </div>
  )
}

// Draggable Task Component
interface DraggableTaskProps {
  task: any
  showUser?: boolean
  onQuickView: (task: any) => void
}

function DraggableTask({ task, showUser, onQuickView }: DraggableTaskProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} showUser={showUser} onQuickView={onQuickView} isDragging={isDragging} />
    </div>
  )
}

// Task Card Component
interface TaskCardProps {
  task: any
  showUser?: boolean
  onQuickView: (task: any) => void
  isDragging?: boolean
}

function TaskCard({ task, showUser, onQuickView, isDragging }: TaskCardProps) {
  const isOverdue =
    task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "DONE"

  function formatDate(date: string | null) {
    if (!date) return ""
    return new Date(date).toLocaleDateString("th-TH", {
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div
      className={`bg-white rounded-lg border p-4 shadow-sm hover:shadow-md transition-shadow cursor-move ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      {/* Priority Badge */}
      <div className="flex items-start justify-between mb-2">
        <Badge
          className={`${priorityColors[task.priority as keyof typeof priorityColors]} text-xs`}
        >
          {task.priority}
        </Badge>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onQuickView(task)
          }}
          className="h-6 w-6 p-0"
        >
          <Eye className="h-4 w-4" />
        </Button>
      </div>

      {/* Title */}
      <h4 className="font-medium mb-2 line-clamp-2">{task.title}</h4>

      {/* Description Preview */}
      {task.description && (
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Meta Information */}
      <div className="space-y-2 text-xs text-muted-foreground">
        {/* Due Date */}
        {task.dueDate && (
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span className={isOverdue ? "text-red-600 font-semibold" : ""}>
              {formatDate(task.dueDate)}
              {isOverdue && " (Overdue)"}
            </span>
          </div>
        )}

        {/* Company */}
        {task.company && (
          <div className="flex items-center gap-1">
            <Building2 className="h-3 w-3" />
            <span className="truncate">{task.company.name}</span>
          </div>
        )}

        {/* User */}
        {showUser && task.user && (
          <div className="flex items-center gap-2">
            {task.user.image ? (
              <img
                src={task.user.image}
                alt={task.user.name}
                className="h-5 w-5 rounded-full"
              />
            ) : (
              <User className="h-3 w-3" />
            )}
            <span className="truncate">{task.user.name}</span>
          </div>
        )}
      </div>

      {/* Attachments Badge */}
      {task.attachments && task.attachments.length > 0 && (
        <div className="mt-2 pt-2 border-t">
          <Badge variant="outline" className="text-xs">
            📎 {task.attachments.length} files
          </Badge>
        </div>
      )}
    </div>
  )
}
