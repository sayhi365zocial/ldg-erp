"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

const EVENT_COLORS = [
  { value: "primary", label: "Primary", class: "bg-primary" },
  { value: "success", label: "Success", class: "bg-green-500" },
  { value: "warning", label: "Warning", class: "bg-yellow-500" },
  { value: "danger", label: "Danger", class: "bg-red-500" },
]

interface Event {
  id: string
  title: string
  startDate: string
  endDate: string
  color: string
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [events, setEvents] = useState<Event[]>([])
  const [formData, setFormData] = useState({
    title: "",
    startDate: "",
    endDate: "",
    color: "primary"
  })

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // Get first day of month
  const firstDay = new Date(year, month, 1).getDay()

  // Get number of days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // Get number of days in previous month
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  // Create calendar grid
  const calendarDays = []

  // Previous month days
  for (let i = firstDay - 1; i >= 0; i--) {
    calendarDays.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      isToday: false,
      date: new Date(year, month - 1, daysInPrevMonth - i)
    })
  }

  // Current month days
  const today = new Date()
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({
      day: i,
      isCurrentMonth: true,
      isToday:
        i === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear(),
      date: new Date(year, month, i)
    })
  }

  // Next month days
  const remainingDays = 42 - calendarDays.length
  for (let i = 1; i <= remainingDays; i++) {
    calendarDays.push({
      day: i,
      isCurrentMonth: false,
      isToday: false,
      date: new Date(year, month + 1, i)
    })
  }

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const handleAddEvent = () => {
    const newEvent: Event = {
      id: Date.now().toString(),
      ...formData
    }
    setEvents([...events, newEvent])
    setIsDialogOpen(false)
    setFormData({ title: "", startDate: "", endDate: "", color: "primary" })
  }

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return events.filter(event => {
      return dateStr >= event.startDate && dateStr <= event.endDate
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">
            Manage your tasks and events
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <CardTitle className="text-2xl">
                {MONTHS[month]} {year}
              </CardTitle>
              <Button variant="outline" size="sm" onClick={goToToday}>
                Today
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={goToPreviousMonth}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={goToNextMonth}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardDescription>
            Click "Add Event" to create a new event
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Day Headers */}
            {DAYS.map((day) => (
              <div
                key={day}
                className="text-center text-sm font-semibold text-muted-foreground py-2"
              >
                {day}
              </div>
            ))}

            {/* Calendar Days */}
            {calendarDays.map((item, index) => {
              const dayEvents = getEventsForDate(item.date)
              return (
                <div
                  key={index}
                  className={cn(
                    "relative aspect-square border rounded-lg p-2 hover:bg-accent cursor-pointer transition-colors min-h-[100px]",
                    !item.isCurrentMonth && "bg-muted/30 text-muted-foreground",
                    item.isToday && "border-primary border-2 bg-primary/5"
                  )}
                >
                  <div className="flex flex-col h-full">
                    <span className={cn("text-sm", item.isToday && "font-bold text-primary")}>
                      {item.day}
                    </span>
                    {/* Events */}
                    <div className="mt-1 space-y-1 flex-1 overflow-y-auto">
                      {dayEvents.map(event => {
                        const colorClass = EVENT_COLORS.find(c => c.value === event.color)?.class
                        return (
                          <div
                            key={event.id}
                            className={cn(
                              "text-xs px-1 py-0.5 rounded text-white truncate",
                              colorClass
                            )}
                            title={event.title}
                          >
                            {event.title}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Add Event Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Event</DialogTitle>
            <DialogDescription>
              Create a new event on your calendar
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                placeholder="Enter event title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Event Color</Label>
              <div className="flex gap-2">
                {EVENT_COLORS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, color: color.value })}
                    className={cn(
                      "h-10 w-10 rounded-full border-2 transition-all",
                      color.class,
                      formData.color === color.value ? "border-foreground scale-110" : "border-transparent"
                    )}
                    title={color.label}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={handleAddEvent} disabled={!formData.title || !formData.startDate || !formData.endDate}>
              Add Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
