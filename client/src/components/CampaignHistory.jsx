"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { CheckCircle, AlertCircle, MessageSquare, Calendar, Clock } from "lucide-react"
import { PageHeader } from "./page-header"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"

function CampaignHistory() {
  const [campaigns, setCampaigns] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    axios
      .get("http://localhost:5000/api/campaigns", { withCredentials: true })
      .then((res) => {
        setCampaigns(res.data)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching campaigns:", err)
        setIsLoading(false)
      })
  }, [])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        title="Campaign History"
        description="Review your previous campaigns and analyze delivery performance."
      />

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">Loading campaigns...</p>
        </div>
      ) : campaigns.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              You haven't created any campaigns yet. Start by creating your first campaign.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {campaigns.map((campaign, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between py-4">
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 text-indigo-500 mr-2" />
                  Campaign #{index + 1}
                </CardTitle>
                <Badge variant={campaign.sent > 0 ? "success" : "secondary"}>
                  {campaign.sent > 0 ? "Delivered" : "Processed"}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-gray-700 whitespace-pre-wrap">{campaign.message}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-indigo-50 p-3 rounded-md flex items-center">
                    <div className="p-2 bg-indigo-100 rounded-full mr-3">
                      <MessageSquare className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs text-indigo-600 font-medium">Audience Size</p>
                      <p className="text-lg font-semibold text-indigo-900">{campaign.audienceSize}</p>
                    </div>
                  </div>

                  <div className="bg-emerald-50 p-3 rounded-md flex items-center">
                    <div className="p-2 bg-emerald-100 rounded-full mr-3">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs text-emerald-600 font-medium">Successfully Sent</p>
                      <p className="text-lg font-semibold text-emerald-900">{campaign.sent}</p>
                    </div>
                  </div>

                  <div className="bg-rose-50 p-3 rounded-md flex items-center">
                    <div className="p-2 bg-rose-100 rounded-full mr-3">
                      <AlertCircle className="h-4 w-4 text-rose-600" />
                    </div>
                    <div>
                      <p className="text-xs text-rose-600 font-medium">Failed</p>
                      <p className="text-lg font-semibold text-rose-900">{campaign.failed}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center text-gray-500 text-sm">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span className="mr-4">{formatDate(campaign.createdAt).split(",")[0]}</span>
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{formatDate(campaign.createdAt).split(",")[1]}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default CampaignHistory
