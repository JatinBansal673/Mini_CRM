"use client"

import { useState } from "react"
import axios from "axios"
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react"
import { PageHeader } from "./page-header"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "./ui/card"

const CustomerUpload = () => {
  const [file, setFile] = useState(null)
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState(null) // "success", "error", or null
  const [isUploading, setIsUploading] = useState(false)

  const upload = async () => {
    if (!file) {
      setMessage("Please select a CSV file first.")
      setStatus("error")
      return
    }

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await axios.post("http://localhost:5000/api/customers/upload", formData, {
        withCredentials: true,
      })

      setMessage(res.data.message || "Upload successful.")
      setStatus("success")
    } catch (err) {
      console.error("Upload failed:", err)
      setMessage("Upload failed. Please try again.")
      setStatus("error")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader
        title="Upload Customers"
        description="Import customer data from a CSV file for targeting and segmentation."
      />

      <Card>
        <CardHeader>
          <CardTitle>CSV File Upload</CardTitle>
          <CardDescription>
            Upload your customer data in CSV format. Make sure your file includes all required fields.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <FileText className="h-10 w-10 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Drop your file here or click to browse</h3>
            <p className="text-sm text-gray-500 mb-4">Supports CSV files up to 10MB</p>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full max-w-xs mx-auto block text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-medium
                file:bg-indigo-50 file:text-indigo-600
                hover:file:bg-indigo-100"
            />
          </div>

          {file && (
            <div className="bg-gray-50 p-4 rounded-md flex items-center">
              <FileText className="h-5 w-5 text-indigo-500 mr-2" />
              <span className="text-sm font-medium">{file.name}</span>
              <span className="text-xs text-gray-500 ml-2">({(file.size / 1024).toFixed(2)} KB)</span>
            </div>
          )}

          {message && (
            <div
              className={`p-4 rounded-md ${
                status === "success" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
              } flex items-start`}
            >
              {status === "success" ? (
                <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              )}
              <p>{message}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="bg-gray-50 border-t">
          <Button onClick={upload} disabled={isUploading} className="w-full">
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? "Uploading..." : "Upload Customers"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default CustomerUpload
