"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface TaskFormProps {
  task?: any
  users?: Array<{ id: string; name: string }>
  companies?: Array<{ id: string; name: string }>
  contacts?: Array<{ id: string; firstName: string; lastName: string; companyId: string }>
  isAdmin?: boolean
}

export function TaskForm({ task, users, companies, contacts, isAdmin }: TaskFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState(task?.status || "PENDING")
  const [priority, setPriority] = useState(task?.priority || "MEDIUM")
  const [selectedUser, setSelectedUser] = useState(task?.userId || "")
  const [selectedCompany, setSelectedCompany] = useState(task?.companyId || "")
  const [selectedContact, setSelectedContact] = useState(task?.contactId || "")
  const [attachments, setAttachments] = useState<string[]>(task?.attachments || [])
  const [uploadProgress, setUploadProgress] = useState(false)

  // Filter contacts based on selected company
  const filteredContacts = useMemo(() => {
    if (!selectedCompany || !contacts) {
      return []
    }
    return contacts.filter(contact => contact.companyId === selectedCompany)
  }, [selectedCompany, contacts])

  // Reset contact selection when company changes
  useEffect(() => {
    if (selectedCompany && selectedContact) {
      const contactBelongsToCompany = contacts?.find(
        c => c.id === selectedContact && c.companyId === selectedCompany
      )
      if (!contactBelongsToCompany) {
        setSelectedContact("")
      }
    }
  }, [selectedCompany, selectedContact, contacts])

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files) return

    setUploadProgress(true)
    try {
      const uploadedUrls: string[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const formData = new FormData()
        formData.append("file", file)
        formData.append("type", "tasks")

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) throw new Error("Failed to upload file")

        const data = await response.json()
        uploadedUrls.push(data.url)
      }

      setAttachments([...attachments, ...uploadedUrls])
    } catch (error) {
      console.error(error)
      alert("Failed to upload files")
    } finally {
      setUploadProgress(false)
    }
  }

  function removeAttachment(index: number) {
    setAttachments(attachments.filter((_, i) => i !== index))
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      title: formData.get("title"),
      description: formData.get("description") || null,
      status,
      priority,
      dueDate: formData.get("dueDate") || null,
      notes: formData.get("notes") || null,
      attachments,
      userId: isAdmin && selectedUser ? selectedUser : undefined,
      companyId: selectedCompany || null,
      contactId: selectedContact || null,
    }

    try {
      const response = await fetch("/api/tasks", {
        method: task ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task ? { ...data, id: task.id } : data),
      })

      if (!response.ok) throw new Error("Failed to save task")

      router.push("/dashboard/tasks")
      router.refresh()
    } catch (error) {
      console.error(error)
      alert("Failed to save task")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Title */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="title">Task Title *</Label>
          <Input
            id="title"
            name="title"
            defaultValue={task?.title}
            required
            placeholder="Enter task title..."
          />
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status">Status *</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="DOING">Doing</SelectItem>
              <SelectItem value="DONE">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Priority */}
        <div className="space-y-2">
          <Label htmlFor="priority">Priority *</Label>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LOW">Low</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
              <SelectItem value="URGENT">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Due Date */}
        <div className="space-y-2">
          <Label htmlFor="dueDate">Due Date</Label>
          <Input
            id="dueDate"
            name="dueDate"
            type="datetime-local"
            defaultValue={task?.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : ""}
          />
        </div>

        {/* Assign to User (Admin only) */}
        {isAdmin && users && users.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="user">Assign To</Label>
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger>
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Company */}
        {companies && companies.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="company">Related Company</Label>
            <Select value={selectedCompany || undefined} onValueChange={setSelectedCompany}>
              <SelectTrigger>
                <SelectValue placeholder="Select company (optional)" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Contact */}
        {selectedCompany && filteredContacts.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="contact">Related Contact</Label>
            <Select value={selectedContact || undefined} onValueChange={setSelectedContact}>
              <SelectTrigger>
                <SelectValue placeholder="Select contact (optional)" />
              </SelectTrigger>
              <SelectContent>
                {filteredContacts.map((contact) => (
                  <SelectItem key={contact.id} value={contact.id}>
                    {contact.firstName} {contact.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        {selectedCompany && filteredContacts.length === 0 && (
          <div className="space-y-2">
            <Label htmlFor="contact">Related Contact</Label>
            <p className="text-sm text-muted-foreground">No contacts available for this company</p>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={task?.description || ""}
          placeholder="Enter task description..."
          rows={4}
        />
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          defaultValue={task?.notes || ""}
          placeholder="Additional notes..."
          rows={3}
        />
      </div>

      {/* Attachments */}
      <div className="space-y-2">
        <Label htmlFor="attachments">Attachments</Label>
        <Input
          id="attachments"
          name="attachments"
          type="file"
          multiple
          onChange={handleFileChange}
          disabled={uploadProgress}
        />
        <p className="text-xs text-muted-foreground">
          {uploadProgress ? "Uploading..." : "Upload files (max 5MB each)"}
        </p>

        {attachments.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium">Uploaded Files:</p>
            <div className="space-y-2">
              {attachments.map((url, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline truncate flex-1"
                  >
                    {url.split('/').pop()}
                  </a>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAttachment(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : task ? "Update Task" : "Create Task"}
        </Button>
      </div>
    </form>
  )
}
