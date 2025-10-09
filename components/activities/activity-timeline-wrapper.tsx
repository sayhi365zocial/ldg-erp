"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { ActivityForm } from "./activity-form"
import { ActivityTimeline } from "./activity-timeline"

interface ActivityTimelineWrapperProps {
  contactId?: string
  companyId?: string
  showContactName?: boolean
  title?: string
  description?: string
}

export function ActivityTimelineWrapper({
  contactId,
  companyId,
  showContactName = false,
  title = "Activity Timeline",
  description
}: ActivityTimelineWrapperProps) {
  const [search, setSearch] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-1">
            <div className="flex flex-col">
              <CardTitle>{title}</CardTitle>
              {description && (
                <p className="text-sm text-muted-foreground mt-1">{description}</p>
              )}
            </div>

            {!searchOpen ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchOpen(true)}
                className="h-7 w-7 p-0"
              >
                <Search className="h-4 w-4" />
              </Button>
            ) : (
              <div className="relative flex-1 max-w-xs animate-in fade-in slide-in-from-left-2 duration-200">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search activities..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 pr-8 h-8"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchOpen(false)
                    setSearch("")
                  }}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                >
                  ×
                </Button>
              </div>
            )}
          </div>

          {contactId && <ActivityForm contactId={contactId} />}
        </div>
      </CardHeader>
      <CardContent>
        <ActivityTimeline
          contactId={contactId}
          companyId={companyId}
          showContactName={showContactName}
          search={search}
        />
      </CardContent>
    </Card>
  )
}
