"use client"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "./ui/card"

const Login = () => {
  const handleLogin = () => {
    window.location.href = `${process.env.REACT_APP_BACKEND_BASE_URL}/api/auth/google`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome to Mini CRM</CardTitle>
          <CardDescription>Manage campaigns, audience, and messaging smartly</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-indigo-50 p-4 rounded-md text-sm text-indigo-700">
            <p>Sign in with your Google account to access the CRM dashboard and manage your campaigns.</p>
          </div>

          <Button onClick={handleLogin} className="w-full bg-red-500 hover:bg-red-600">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
              />
            </svg>
            Sign in with Google
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-6">
          <p className="text-sm text-gray-500">By signing in, you agree to our Terms of Service and Privacy Policy</p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Login
