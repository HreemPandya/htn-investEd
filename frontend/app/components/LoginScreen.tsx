"use client"

import { Button } from "../components/ui/button"

interface UserData {
  hasRBCAccount?: boolean
  name?: string
  accountType?: string
  [key: string]: any
}

interface LoginScreenProps {
  onNext: (screen: string, data?: UserData) => void
}

export default function LoginScreen({ onNext }: LoginScreenProps) {
  const handleSignIn = () => {
    onNext("personalization", { hasRBCAccount: false })
  }

  const handleRBCLogin = () => {
    onNext("personalization", { hasRBCAccount: true })
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 py-12">
      {/* Header / Logo */}
      <div className="p-8 flex justify-center items-center">
      <h1
        className="text-5xl md:text-5xl font-bold font-poppins"
        style={{ color: "#23231A" }}
      >
        InvestEd
      </h1>
      </div>

      {/* Tagline */}
      <div className="text-center px-6 pb-8">
        <span className="text-lg md:text-2xl font-large text-gray-700">
          From saving cents to achieving milestones...
        </span>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center px-6 w-full">
        <div className="w-full max-w-md p-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm rounded-3xl transition-all duration-300">
          <div className="space-y-6">
            {/* Email Login */}
            <Button
              onClick={handleSignIn}
              className="w-full h-16 rounded-2xl font-semibold text-xl"
              style={{
                backgroundColor: "#ffd200",
                color: "#23231A",
                border: "none",
                fontFamily:
                  'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                letterSpacing: "0.5px",
              }}
            >
              Login with Email
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span
                  className="w-full border-t"
                  style={{ borderColor: "#91918d" }}
                />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2" style={{ color: "#91918d" }}>
                  Or continue with
                </span>
              </div>
            </div>

            {/* RBC Login */}
            <Button
              onClick={handleRBCLogin}
              className="w-full h-16 rounded-2xl font-semibold text-xl"
              style={{
                backgroundColor: "#005DAA",
                color: "white",
                border: "none",
                fontFamily:
                  'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                letterSpacing: "0.5px",
              }}
            >
              Connect with RBC
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
