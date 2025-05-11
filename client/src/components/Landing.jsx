"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "./AuthContext"
import { ArrowRight, CheckCircle, Users, MessageSquare, BarChart3, Briefcase } from "lucide-react"
import Footer from "./Footer"
import { Button } from "./ui/button"
import Benefits from "../assets/Benefits-of-CRM.jpg"

const Landing = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) navigate("/dashboard")
  }, [user, navigate])

  const handleLogin = () => {
    window.location.href = `${process.env.REACT_APP_BACKEND_BASE_URL}/api/auth/google`
  }

  const features = [
    {
      icon: <Users className="h-6 w-6 text-indigo-600" />,
      title: "Customer Management",
      description: "Organize customers and deliver personalized experiences.",
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-violet-600" />,
      title: "Automated Messaging",
      description: "Communicate with customers efficiently through automation.",
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-indigo-600" />,
      title: "Analytics & Insights",
      description: "Make data-driven decisions with powerful CRM analytics.",
    },
    {
      icon: <Briefcase className="h-6 w-6 text-violet-600" />,
      title: "Business Growth Tools",
      description: "Boost customer retention and sales with AI-powered recommendations.",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Navigation Bar */}
      <nav className="bg-white border-b shadow-sm py-4 px-6 fixed top-0 w-full z-50">
        <div className="container mx-auto flex justify-between items-center">
          <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Mini CRM
          </h2>
          <div className="hidden md:flex gap-4">
            <Button variant="ghost" size="sm">
              Features
            </Button>
            <Button variant="ghost" size="sm">
              Pricing
            </Button>
            <Button variant="ghost" size="sm">
              Documentation
            </Button>
            <Button onClick={handleLogin} size="sm">
              Sign In
            </Button>
          </div>
          <Button onClick={handleLogin} className="md:hidden" size="sm">
            Sign In
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-32 pb-20 bg-gradient-to-br from-indigo-600 to-violet-700 text-white">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">Grow Your Business with Smart CRM</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10">
            Build stronger relationships, automate customer interactions, and drive insights with ease.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={handleLogin} size="lg" className="bg-white text-indigo-700 hover:bg-gray-100">
              Get Started
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
              Take a Tour <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Why Choose Mini CRM?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-indigo-50 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <img
                src={Benefits || "/placeholder.svg"}
                alt="Benefits of CRM"
                className="rounded-xl shadow-lg w-full object-cover"
              />
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Grow Your Business With Mini CRM</h2>
              <p className="text-lg mb-8 text-gray-600">
                Our platform helps you understand your customers better, enabling you to make data-driven decisions.
              </p>
              <ul className="space-y-4">
                {[
                  "Increase customer retention by up to 25%",
                  "Reduce response time by automating common tasks",
                  "Gain valuable insights through detailed analytics",
                  "Improve team collaboration with shared customer data",
                ].map((text, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle className="text-emerald-500 mr-3 mt-1 h-5 w-5 flex-shrink-0" />
                    <span className="text-gray-700">{text}</span>
                  </li>
                ))}
              </ul>
              <Button onClick={handleLogin} className="mt-8" size="lg">
                Sign in with Google
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-indigo-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to transform your customer relationships?</h2>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto mb-8">
            Join thousands of businesses that use Mini CRM to build better customer relationships.
          </p>
          <Button onClick={handleLogin} size="lg" className="bg-white text-indigo-700 hover:bg-gray-100 mx-auto">
            Get Started with Mini CRM
          </Button>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Landing
