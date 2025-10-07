import { APP_NAME, changelog } from "@/lib/version"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const typeColors = {
  added: "default",
  changed: "secondary",
  fixed: "destructive",
  removed: "outline",
} as const

const typeLabels = {
  added: "Added",
  changed: "Changed",
  fixed: "Fixed",
  removed: "Removed",
}

export default function ChangelogPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Changelog</h1>
        <p className="text-muted-foreground">
          All notable changes to {APP_NAME} will be documented here.
        </p>
      </div>

      <div className="space-y-6">
        {changelog.map((entry) => (
          <Card key={entry.version}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Version {entry.version}</CardTitle>
                <Badge variant="outline">{entry.date}</Badge>
              </div>
              <CardDescription>
                Released on {new Date(entry.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(
                  entry.changes.reduce((acc, change) => {
                    if (!acc[change.type]) acc[change.type] = []
                    acc[change.type].push(change.description)
                    return acc
                  }, {} as Record<string, string[]>)
                ).map(([type, descriptions]) => (
                  <div key={type}>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={typeColors[type as keyof typeof typeColors]}>
                        {typeLabels[type as keyof typeof typeLabels]}
                      </Badge>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-2">
                      {descriptions.map((description, index) => (
                        <li key={index}>{description}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
