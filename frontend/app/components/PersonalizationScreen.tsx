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
}

const PersonalizationScreen = ({ userData, onNext }: PersonalizationScreenProps) => {
  const [formData, setFormData] = useState({
    name: userData.name || "",
    university: "",
    program: "",
    year: "",
    monthlyIncome: "",
    livingArrangement: "",
    primaryAccount: "",
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
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1)
    } else {
      onNext("goals", { ...userData, ...formData })
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return formData.name && formData.university && formData.program
      case 1:
        return formData.year && formData.monthlyIncome
      case 2:
        return formData.livingArrangement
      default:
        return false
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-rbc-blue to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-3xl">🧙‍♂️</span>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-100 relative mb-4">
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-blue-100 rotate-45"></div>
                <p className="text-sm text-gray-700">
                  <span className="font-bold text-rbc-blue">Portfolius:</span> "Great to meet you,{" "}
                  {userData.name || "there"}! Let's set you up for success."
                </p>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {userData.hasRBCAccount ? `Nice to meet you, ${userData.name}!` : "Let's get acquainted!"}
              </h2>
              <p className="text-gray-600">Tell us about your academic journey</p>
            </div>

            {!userData.hasRBCAccount && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">What should we call you?</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Your preferred name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rbc-blue focus:border-rbc-blue transition-colors"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Which university do you attend?</label>
              <select
                value={formData.university}
                onChange={(e) => handleInputChange("university", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rbc-blue focus:border-rbc-blue transition-colors"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">What's your program/major?</label>
              <select
                value={formData.program}
                onChange={(e) => handleInputChange("program", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rbc-blue focus:border-rbc-blue transition-colors"
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

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-growth-green to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-3xl">📚</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Academic Details</h2>
              <p className="text-gray-600">Help us understand your timeline and resources</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">What year are you in?</label>
              <div className="grid grid-cols-2 gap-3">
                {["1st Year", "2nd Year", "3rd Year", "4th Year", "Graduate Student"].map((year) => (
                  <button
                    key={year}
                    onClick={() => handleInputChange("year", year)}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      formData.year === year
                        ? "border-rbc-blue bg-blue-50 text-rbc-blue shadow-sm"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly income (part-time jobs, family support, etc.)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={formData.monthlyIncome}
                  onChange={(e) => handleInputChange("monthlyIncome", e.target.value)}
                  placeholder="0"
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rbc-blue focus:border-rbc-blue transition-colors"
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">This helps us suggest realistic goals</p>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-3xl">🏠</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Living Situation</h2>
              <p className="text-gray-600">Understanding your expenses helps us plan better</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Where do you live?</label>
              <div className="space-y-3">
                {[
                  { value: "dorm", label: "Campus Residence/Dorm", icon: "🏫" },
                  { value: "parents", label: "With Parents/Family", icon: "🏡" },
                  { value: "shared", label: "Shared Apartment/House", icon: "🏠" },
                  { value: "own", label: "Own Apartment", icon: "🏢" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleInputChange("livingArrangement", option.value)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center space-x-3 ${
                      formData.livingArrangement === option.value
                        ? "border-rbc-blue bg-blue-50 text-rbc-blue shadow-sm"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-2xl">{option.icon}</span>
                    <span className="font-medium">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {!userData.hasRBCAccount && (
              <div className="bg-warm-yellow/10 border border-warm-yellow/30 rounded-xl p-4">
                <h4 className="font-medium text-yellow-800 mb-2 flex items-center">
                  <span className="mr-2">💳</span>
                  Account Setup
                </h4>
                <p className="text-sm text-yellow-700 mb-3">
                  To track your spending and help you save, we'll need to connect a bank account.
                </p>
                <button className="text-sm bg-warm-yellow/20 text-yellow-800 px-4 py-2 rounded-lg hover:bg-warm-yellow/30 transition-colors font-medium">
                  Set up RBC Student Account →
                </button>
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-lg mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Step {currentStep + 1} of 3</span>
            <span>{Math.round(((currentStep + 1) / 3) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-rbc-blue to-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl p-6 shadow-sm">{renderStep()}</div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="px-6 py-3 text-gray-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:text-gray-800 transition-colors"
          >
            Back
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="px-8 py-3 bg-rbc-blue text-white font-semibold rounded-xl hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
          >
            {currentStep === 2 ? "Continue" : "Next"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PersonalizationScreen
