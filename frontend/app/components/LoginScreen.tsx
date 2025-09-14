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
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="p-6 flex justify-center items-center">
        <img 
          src="/images/investEd-logo.png" 
          alt="InvestEd Logo"
          className="h-24 w-auto object-contain"
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8">
        {/* Wizard Character */}
        <div className="text-center mb-8">
          {/* Speech Bubble */}
          <div className="relative mb-6">
            <div 
              className="rounded-3xl p-6 mx-auto max-w-sm relative"
              style={{ backgroundColor: '#FFDBAC' }}
            >
              <p className="text-lg font-semibold" style={{ color: '#23231A' }}>
                Hi user! Let's get you in!
              </p>
              {/* Speech bubble tail */}
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                <div 
                  className="w-6 h-6 transform rotate-45"
                  style={{ backgroundColor: '#FFDBAC' }}
                />
              </div>
            </div>
          </div>

          {/* Wizard Image - Made HUGE */}
          <div className="w-64 h-64 mx-auto relative">
            <img 
              src="/images/wizard-charcter.png" 
              alt="Portfolius the Wizard"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Login Form */}
        <div className="w-full max-w-sm space-y-5">
          <Button 
            onClick={handleSignIn} 
            className="w-full h-16 rounded-2xl font-semibold text-xl"
            style={{ 
              backgroundColor: '#FFDBAC',
              color: '#23231A',
              border: 'none',
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
              letterSpacing: '0.5px'
            }}
          >
            Login
          </Button>

          <Button
            onClick={handleRBCLogin}
            className="w-full h-16 rounded-2xl font-semibold text-xl"
            style={{ 
              backgroundColor: '#005DAA',
              color: 'white',
              border: 'none',
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
              letterSpacing: '0.5px'
            }}
          >
            Connect With RBC
          </Button>
        </div>
      </div>
    </div>
  )
}
