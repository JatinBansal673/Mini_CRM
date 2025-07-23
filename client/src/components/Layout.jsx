"use client"

import { useState } from "react"
import Header from "./Header"
import Footer from "./Footer"
import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import { useEffect } from "react"

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Function to toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header toggleSidebar={toggleSidebar} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="container mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}

export default Layout
