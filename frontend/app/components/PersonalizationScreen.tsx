"use client"

import { useState } from "react"

interface UserData {
  hasRBCAccount?: boolean
  name?: string
  accountType?: string
  [key: string]: any
}

interface PersonalizationScreenProps {
  userData: UserData
  onNext: (screen: string, data?: UserData) => void
  onBack?: (screen: string) => void
}

const PersonalizationScreen = ({ userData, onNext, onBack }: PersonalizationScreenProps) => {
  const [formData, setFormData] = useState({
    name: userData.name || "",
    university: "",
    program: "",
  })

  const [currentStep, setCurrentStep] = useState(0)

  const universities = [
    "University of Toronto",
    "University of Waterloo",
    "McGill University",
    "University of British Columbia",
    "McMaster University",
    "Queen's University",
    "Western University",
    "York University",
    "Carleton University",
  ]

  const programs = [
    "Computer Science",
    "Business Administration",
    "Engineering",
    "Medicine",
    "Arts & Humanities",
    "Sciences",
    "Social Sciences",
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    onNext("goals", { ...userData, ...formData })
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    return formData.name && formData.university && formData.program
  }

  const renderStep = () => {
    return (
      <div className="space-y-8">
        {/* Wizard Character */}
        <div className="text-center mb-8">
          {/* Speech Bubble */}
          <div className="relative mb-6">
            <div 
              className="rounded-3xl p-6 mx-auto max-w-sm relative"
              style={{ backgroundColor: '#FFDBAC' }}
            >
              <p className="text-lg font-semibold" style={{ color: '#23231A' }}>
                Great to meet you, {userData.name || "there"}! Let's set you up for success.
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

          <div className="w-32 h-32 mx-auto relative">
            <img 
              src="/images/wizard-charcter.png" 
              alt="Portfolius the Wizard"
              className="w-full h-full object-contain"
            />
          </div>

          <h2 className="text-3xl font-bold mb-2" style={{ color: '#23231A' }}>
            {userData.hasRBCAccount ? `Nice to meet you, ${userData.name}!` : "Let's get acquainted!"}
          </h2>
          <p className="text-lg" style={{ color: '#91918D' }}>Tell us about your academic journey</p>
        </div>

        {!userData.hasRBCAccount && (
          <div>
            <label className="block text-lg font-semibold mb-3" style={{ color: '#23231A' }}>What should we call you?</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Your preferred name"
              className="w-full px-6 py-4 rounded-2xl text-lg font-medium transition-colors"
              style={{ 
                backgroundColor: '#F3F4F6',
                color: '#23231A',
                border: 'none',
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
              }}
            />
          </div>
        )}

        <div>
          <label className="block text-lg font-semibold mb-3" style={{ color: '#23231A' }}>Which university do you attend?</label>
          <select
            value={formData.university}
            onChange={(e) => handleInputChange("university", e.target.value)}
            className="w-full px-6 py-4 rounded-2xl text-lg font-medium transition-colors"
            style={{ 
              backgroundColor: '#F3F4F6',
              color: '#23231A',
              border: 'none',
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
            }}
          >
            <option value="">Select your university</option>
            {universities.map((uni) => (
              <option key={uni} value={uni}>
                {uni}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-lg font-semibold mb-3" style={{ color: '#23231A' }}>What's your program/major?</label>
          <select
            value={formData.program}
            onChange={(e) => handleInputChange("program", e.target.value)}
            className="w-full px-6 py-4 rounded-2xl text-lg font-medium transition-colors"
            style={{ 
              backgroundColor: '#F3F4F6',
              color: '#23231A',
              border: 'none',
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
            }}
          >
            <option value="">Select your program</option>
            {programs.map((program) => (
              <option key={program} value={program}>
                {program}
              </option>
            ))}
          </select>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="p-6 flex justify-between items-center">
        {onBack && (
          <button
            onClick={() => onBack("login")}
            className="px-6 py-3 font-semibold text-lg rounded-2xl transition-colors"
            style={{ 
              backgroundColor: '#F3F4F6',
              color: '#23231A',
              border: 'none',
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
            }}
          >
            ← Back
          </button>
        )}
        <img 
          src="/images/investEd-logo.png" 
          alt="InvestEd Logo"
          className="h-24 w-auto object-contain"
        />
        <div className="w-24"></div> {/* Spacer for centering */}
      </div>

      {/* Progress Bar */}
      <div className="px-6 mb-6">
        <div className="flex justify-between text-sm mb-2" style={{ color: '#91918D' }}>
          <span>Step 1 of 3</span>
          <span>33%</span>
        </div>
        <div className="w-full rounded-full h-2" style={{ backgroundColor: '#E5E7EB' }}>
          <div
            className="h-2 rounded-full transition-all duration-300"
            style={{ 
              backgroundColor: '#005DAA',
              width: '33%' 
            }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col px-6 pb-8">
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="px-6 pb-8">
        <div className="flex justify-center items-center">
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="px-8 py-4 font-semibold text-lg rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            style={{ 
              backgroundColor: canProceed() ? '#005DAA' : '#91918D',
              color: 'white',
              border: 'none',
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
              letterSpacing: '0.5px'
            }}
          >
            Continue to Goals
          </button>
        </div>
      </div>
    </div>
  )
}

export default PersonalizationScreen
