"use client"
import { useNavigate, Link } from "react-router-dom"
import { Menu, LogOut, Home } from "lucide-react"
import { Button } from "./ui/button"

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate()

  const handleLogout = () => {
    fetch("http://localhost:5000/api/auth/logout", {
      credentials: "include",
    }).finally(() => {
      navigate("/")
      window.location.reload()
    })
  }

  return (
    <header className="bg-white border-b sticky top-0 z-40">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </button>

          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="bg-indigo-600 text-white p-1.5 rounded">
              <Home className="h-4 w-4" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Mini CRM
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Log Out
          </Button>
        </div>
      </div>
    </header>
  )
}

export default Header
