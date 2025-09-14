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
  const [showWizard, setShowWizard] = useState(true)

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

  const canProceed = () => {
    return formData.name && formData.university && formData.program
  }

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      {/* Header with back + progress bar */}
      <div className="p-6 flex justify-between items-center">
        {onBack ? (
          <button
            onClick={() => onBack("login")}
            className="px-5 py-2.5 text-base font-medium rounded-xl bg-gray-200 hover:bg-gray-300 transition flex items-center justify-center"
            aria-label="Back"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-[#23231A]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        ) : (
          <div className="w-12" />
        )}

        <div className="flex-1 mx-6">
          <div className="flex justify-between text-sm mb-1" style={{ color: "#91918D" }}>
            <span>Step 1 of 3</span>
            <span>33%</span>
          </div>
          <div className="w-full rounded-full h-2 bg-gray-200">
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{
                backgroundColor: "#005DAA",
                width: "33%",
              }}
            />
          </div>
        </div>
      </div>

      {/* Wizard Assistant (collapsible) */}
      {showWizard && (
        <div className="mx-6 mb-4 bg-[#FFDBAC] rounded-2xl p-4 shadow-md relative">
          <button
            onClick={() => setShowWizard(false)}
            className="absolute top-2 right-2 text-gray-700 hover:text-black"
            aria-label="Close Wizard"
          >
            ✕
          </button>

          <p className="text-sm font-semibold mb-2" style={{ color: "#23231A" }}>
            💡 Portfolius says:
          </p>
          <p
            className="text-sm"
            style={{ color: "#23231A", maxWidth: "60%", wordBreak: "break-word" }}
          >
            Hi {userData.name || "there"}! Let’s set you up for success. Fill in your details to personalize your journey.
          </p>
          <img
            src="/images/wizard-charcter.png"
            alt="Wizard Assistant"
            className="absolute bottom-0 right-0 h-24 w-24 object-contain"
          />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 px-6 pb-6 space-y-8">
        <h2 className="text-2xl font-bold text-[#23231A]">
          {userData.hasRBCAccount
            ? `Nice to meet you, ${userData.name}!`
            : "Let’s get acquainted!"}
        </h2>
        <p className="text-gray-500">Tell us about your academic journey</p>

        {/* Form Section */}
        <div className="space-y-6">
          {!userData.hasRBCAccount && (
            <div>
              <label className="block text-lg font-semibold mb-2 text-[#23231A]">
                What should we call you?
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Your preferred name"
                className="w-full px-5 py-3 rounded-xl bg-gray-100 text-[#23231A] focus:ring-2 focus:ring-[#005DAA] outline-none transition"
              />
            </div>
          )}

          <div>
            <label className="block text-lg font-semibold mb-2 text-[#23231A]">
              Which university do you attend?
            </label>
            <select
              value={formData.university}
              onChange={(e) => handleInputChange("university", e.target.value)}
              className="w-full px-5 py-3 rounded-xl bg-gray-100 text-[#23231A] focus:ring-2 focus:ring-[#005DAA] outline-none transition"
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
            <label className="block text-lg font-semibold mb-2 text-[#23231A]">
              What’s your program/major?
            </label>
            <select
              value={formData.program}
              onChange={(e) => handleInputChange("program", e.target.value)}
              className="w-full px-5 py-3 rounded-xl bg-gray-100 text-[#23231A] focus:ring-2 focus:ring-[#005DAA] outline-none transition"
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
      </div>

      {/* Navigation */}
      <div className="px-6 pb-8">
        <button
          onClick={handleNext}
          disabled={!canProceed()}
          className={`w-full py-4 rounded-xl font-semibold text-lg tracking-wide transition 
            ${
              canProceed()
                ? "bg-[#005DAA] text-white hover:bg-[#004080]"
                : "bg-gray-300 text-white cursor-not-allowed opacity-70"
            }
          `}
        >
          Continue to Goals
        </button>
      </div>
    </div>
  )
}

export default PersonalizationScreen
