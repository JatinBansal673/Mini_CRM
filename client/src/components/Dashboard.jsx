"use client"

import { useEffect, useState } from "react"
import { useAuth } from "./AuthContext"
import { useLocation, useNavigate, Link } from "react-router-dom"
import { toast } from "react-toastify"
import axios from "axios"
import { Target, Clock, Upload } from "lucide-react"
import { PageHeader } from "./page-header"
import { DashboardStats } from "./dashboard-stats"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"

const Dashboard = () => {
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [stats, setStats] = useState({})

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (params.get("loggedIn") === "true") {
      toast.success("Login Successful!")
      params.delete("loggedIn")
      navigate({ pathname: location.pathname, search: params.toString() }, { replace: true })
    }
  }, [location, navigate])

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/customers/summary", {
        withCredentials: true,
      })
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Error fetching summary:", err))
  }, [])

  const actionCards = [
    {
      title: "Create Campaign",
      description: "Build audience rules and send targeted messages",
      icon: <Target className="h-6 w-6" />,
      color: "bg-blue-50 text-blue-600",
      link: "/create",
    },
    {
      title: "View History",
      description: "Review your previous campaigns and performance",
      icon: <Clock className="h-6 w-6" />,
      color: "bg-emerald-50 text-emerald-600",
      link: "/history",
    },
    {
      title: "Upload Customers",
      description: "Import customer data from CSV files",
      icon: <Upload className="h-6 w-6" />,
      color: "bg-violet-50 text-violet-600",
      link: "/upload",
    },
  ]

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title={`Welcome Back, ${user?.displayName || "CRM User"}`}
        description="Track performance, manage campaigns, and engage your customers smarter."
      />

      <div className="space-y-8">
        <DashboardStats stats={stats} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {actionCards.map((card, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow flex flex-col">
              <CardContent className="p-6 flex flex-col flex-1">
                <div className={`p-3 rounded-full inline-flex w-11 ${card.color} mb-4`}>{card.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
                <p className="text-gray-500 mb-4">{card.description}</p>
                <div className="mt-auto pt-4">
                <Link to={card.link}><Button variant="outline" className="w-full" asChild>Get Started</Button></Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
