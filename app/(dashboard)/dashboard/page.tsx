import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, TrendingUp, FolderKanban, FileText } from "lucide-react"

export default function DashboardPage() {
  const stats = [
    {
      title: "Total Companies",
      value: "0",
      description: "Active clients",
      icon: Building2,
    },
    {
      title: "Open Deals",
      value: "0",
      description: "In pipeline",
      icon: TrendingUp,
    },
    {
      title: "Active Projects",
      value: "0",
      description: "In progress",
      icon: FolderKanban,
    },
    {
      title: "Outstanding Invoices",
      value: "฿0",
      description: "Pending payment",
      icon: FileText,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to LDG ERP Management System
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
