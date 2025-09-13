"use client"

import { useState } from "react"
import LoginScreen from "./components/LoginScreen"
import PersonalizationScreen from "./components/PersonalizationScreen"
import GoalSettingScreen from "./components/GoalSettingScreen"
import RecommendationsScreen from "./components/RecommendationsScreen"
import InsightsDashboard from "./components/InsightsDashboard"

interface UserData {
  hasRBCAccount?: boolean
  name?: string
  accountType?: string
  university?: string
  program?: string
  year?: string
  monthlyIncome?: string
  livingArrangement?: string
  goals?: Array<{
    id: string
    name: string
    icon: string
    description: string
    suggestedAmount: number
    timeline: string
    color: string
    priority?: number
    isCustom?: boolean
  }>
  selectedTier?: {
    id: string
    name: string
    subtitle: string
    monthlyAmount: number
    commitment: string
    features: string[]
    pros: string[]
    cons: string[]
    recommended: boolean
    color: string
    badge: string
  }
  spendingAnalysis?: {
    monthlySpending: number
    categories: {
      food: number
      entertainment: number
      transport: number
      shopping: number
      other: number
    }
    savingsRate: number
    riskProfile: string
  }
}

const DemoMode = ({ onNext }: { onNext: (screen: string, data?: UserData) => void }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">👀</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">Demo Mode - Coming Soon! 🚧</h1>

        <p className="text-gray-600 text-lg mb-8">
          We're building an awesome demo experience for you. For now, why not create your real plan?
        </p>

        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <h3 className="text-lg font-semibold mb-4">What you'll get with a real account:</h3>
          <div className="grid md:grid-cols-2 gap-4 text-left">
            <div className="flex items-center space-x-3">
              <span className="text-green-500">✅</span>
              <span>Personalized goal tracking</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-green-500">✅</span>
              <span>AI spending analysis</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-green-500">✅</span>
              <span>Investment recommendations</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-green-500">✅</span>
              <span>Educational content library</span>
            </div>
          </div>
        </div>

        <div className="space-x-4">
          <button
            onClick={() => onNext("personalization", { hasRBCAccount: false })}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create My Plan Now
          </button>

          <button
            onClick={() => onNext("login")}
            className="px-8 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
          >
            Back to Login
          </button>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          🔒 Takes less than 5 minutes • Completely secure • No commitment required
        </p>
      </div>
    </div>
  )
}

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<string>("login")
  const [userData, setUserData] = useState<UserData>({})

  const handleNavigation = (nextScreen: string, newUserData: UserData = {}) => {
    setUserData((prevData) => ({ ...prevData, ...newUserData }))
    setCurrentScreen(nextScreen)
  }

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case "login":
        return <LoginScreen onNext={handleNavigation} />

      case "personalization":
        return <PersonalizationScreen userData={userData} onNext={handleNavigation} />

      case "goals":
        return <GoalSettingScreen userData={userData} onNext={handleNavigation} />

      case "recommendations":
        return <RecommendationsScreen userData={userData} onNext={handleNavigation} />

      case "dashboard":
        return <InsightsDashboard userData={userData} />

      case "demo":
        return <DemoMode onNext={handleNavigation} />

      default:
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Screen not found</h1>
              <button
                onClick={() => setCurrentScreen("login")}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Go to Login
              </button>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {renderCurrentScreen()}
    </div>
  )
}
