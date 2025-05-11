import { useEffect, useState } from "react"
import axios from "axios"
import { Button } from "../components/ui/button"

const Settings = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true) // Track loading state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  useEffect(() => {
    axios.get("http://localhost:5000/api/auth/user", { withCredentials: true })
      .then((res) => {
        setUser(res.data)
      })
      .catch(() => {
        setUser(null)
      })
      .finally(() => {
        setLoading(false) // Once data fetch is complete, set loading to false
      })
  }, [])

  const handleExport = () => {
    // Stub for export functionality
    alert("Data export initiated!")
  }

  const handleLogout = () => {
    window.location.href = "http://localhost:5000/api/auth/logout"
  }

  if (loading) {
    return <div>Loading...</div> // Loading state to show until data is fetched
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      {user && (
        <div className="bg-white shadow p-4 rounded border">
          <h2 className="font-semibold text-lg mb-2">Account Info</h2>
          <p><strong>Name:</strong> {user.displayName}</p>
          <p><strong>Email:</strong> {user.emails?.[0]?.value}</p>
        </div>
      )}

      <div className="bg-white shadow p-4 rounded border">
        <h2 className="font-semibold text-lg mb-2">Notification Preferences</h2>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={notificationsEnabled}
            onChange={() => setNotificationsEnabled(!notificationsEnabled)}
          />
          Enable Email Notifications
        </label>
      </div>

      <div className="bg-white shadow p-4 rounded border space-y-2">
        <h2 className="font-semibold text-lg">Actions</h2>
        <Button onClick={handleExport}>Export My Data</Button>
        <Button variant="destructive" onClick={handleLogout}>Logout</Button>
      </div>
    </div>
  )
}

export default Settings
