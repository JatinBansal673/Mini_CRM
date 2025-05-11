import { Card, CardContent } from "./ui/card"
import { Users, Activity, TrendingUp } from "lucide-react"

export function DashboardStats({ stats }) {
  const statItems = [
    {
      title: "Total Customers",
      value: stats.totalCustomers || 0,
      icon: <Users className="h-5 w-5" />,
      color: "text-indigo-600 bg-indigo-100",
    },
    {
      title: "Active Customers",
      value: stats.activeCustomers || 0,
      icon: <Activity className="h-5 w-5" />,
      color: "text-emerald-600 bg-emerald-100",
    },
    {
      title: "Total Turnover",
      value: `₹${stats.totalTurnover || 0}`,
      icon: <TrendingUp className="h-5 w-5" />,
      color: "text-violet-600 bg-violet-100",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statItems.map((item, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{item.title}</p>
                <p className="text-3xl font-bold mt-1">{item.value}</p>
              </div>
              <div className={`p-3 rounded-full ${item.color}`}>{item.icon}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
