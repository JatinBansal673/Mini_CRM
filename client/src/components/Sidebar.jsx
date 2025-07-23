"use client"
import { Link, useLocation } from "react-router-dom"
import { Home, Target, Clock, Upload, Users, Settings, X } from "lucide-react"
import { cn } from "./lib/utils"

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation()

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: <Home className="h-5 w-5" /> },
    { path: "/create", label: "Create Campaign", icon: <Target className="h-5 w-5" /> },
    { path: "/history", label: "Campaign History", icon: <Clock className="h-5 w-5" /> },
    { path: "/upload", label: "Upload Customers", icon: <Upload className="h-5 w-5" /> },
    { path: "/customers", label: "Customers", icon: <Users className="h-5 w-5" /> },
    { path: "/settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
  ]

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={toggleSidebar} />}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:z-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b md:hidden">
            <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Mini CRM
            </h2>
            <button onClick={toggleSidebar} className="p-2 rounded-md hover:bg-gray-100">
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  location.pathname === item.path ? "bg-indigo-50 text-indigo-700" : "text-gray-700 hover:bg-gray-100",
                )}
                onClick={() => {
                  if (window.innerWidth < 768) {
                    toggleSidebar()
                  }
                }}
              >
                <span
                  className={cn(
                    "p-1.5 rounded-md",
                    location.pathname === item.path ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-700",
                  )}
                >
                  {item.icon}
                </span>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t">
            <div className="bg-indigo-50 rounded-md p-4">
              <h3 className="font-medium text-indigo-900 mb-1">Need Help?</h3>
              <p className="text-sm text-indigo-700 mb-3">Check our documentation or contact support</p>
              <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
                View Documentation →
              </a>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
