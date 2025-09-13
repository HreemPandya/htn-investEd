"use client"

import { useState, useEffect } from "react"

interface UserData {
  hasRBCAccount?: boolean
  name?: string
  accountType?: string
  goals: Array<{
    id: string
    name: string
    icon: string
    suggestedAmount: number
    timeline: string
  }>
  monthlyIncome: string
  program?: string
  [key: string]: any
}

interface SpendingData {
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

interface Tier {
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

interface RecommendationsScreenProps {
  userData: UserData
  onNext: (screen: string, data?: UserData) => void
}

const RecommendationsScreen = ({ userData, onNext }: RecommendationsScreenProps) => {
  const [selectedTier, setSelectedTier] = useState<Tier | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(true)
  const [spendingData, setSpendingData] = useState<SpendingData | null>(null)

  // Simulate AI analysis
  useEffect(() => {
    setTimeout(() => {
      // Mock spending analysis based on user data
      const mockSpendingData = {
        monthlySpending: Math.max(800, Number.parseInt(userData.monthlyIncome) * 0.6),
        categories: {
          food: 0.35,
          entertainment: 0.25,
          transport: 0.2,
          shopping: 0.15,
          other: 0.05,
        },
        savingsRate: Math.max(
          0.1,
          Math.min(0.4, (Number.parseInt(userData.monthlyIncome) - 800) / Number.parseInt(userData.monthlyIncome)),
        ),
        riskProfile:
          userData.program === "Computer Science"
            ? "moderate"
            : userData.program === "Business Administration"
              ? "aggressive"
              : "conservative",
      }

      setSpendingData(mockSpendingData)
      setIsAnalyzing(false)
    }, 3000)
  }, [userData])

  const calculateTierRecommendations = () => {
    if (!spendingData) return []

    const availableAmount = Number.parseInt(userData.monthlyIncome) - spendingData.monthlySpending
    const totalGoalAmount = userData.goals.reduce((sum: number, goal: any) => sum + goal.suggestedAmount, 0)
    const averageTimeline =
      userData.goals.reduce((sum: number, goal: any) => sum + Number.parseInt(goal.timeline), 0) / userData.goals.length

    return [
      {
        id: "starter",
        name: "Starter Saver",
        subtitle: "Perfect for beginners",
        monthlyAmount: Math.max(50, Math.round(availableAmount * 0.3)),
        commitment: "Low commitment",
        features: [
          "High-interest savings account",
          "Goal tracking with visual progress",
          "Weekly spending insights",
          "Basic budgeting tips",
        ],
        pros: ["Low risk", "Build saving habits", "Flexible withdrawals"],
        cons: ["Lower growth potential", "May not meet aggressive timelines"],
        recommended: availableAmount < 300,
        color: "bg-growth-green/5 border-growth-green/30 text-growth-green",
        badge: "SAFE CHOICE",
      },
      {
        id: "balanced",
        name: "Balanced Builder",
        subtitle: "Recommended for you",
        monthlyAmount: Math.max(100, Math.round(availableAmount * 0.6)),
        commitment: "Moderate commitment",
        features: [
          "Mix of savings and low-risk investments",
          "Automated goal-based investing",
          "Monthly financial coaching",
          "Spending optimization alerts",
        ],
        pros: ["Balanced growth", "Professional guidance", "Automated system"],
        cons: ["Some market risk", "Requires discipline"],
        recommended: true,
        color: "bg-rbc-blue/5 border-rbc-blue/30 text-rbc-blue",
        badge: "RECOMMENDED",
      },
      {
        id: "accelerated",
        name: "Goal Accelerator",
        subtitle: "For ambitious savers",
        monthlyAmount: Math.max(200, Math.round(availableAmount * 0.8)),
        commitment: "High commitment",
        features: [
          "Aggressive investment portfolio",
          "Priority financial advisor access",
          "Advanced goal optimization",
          "Premium market insights",
        ],
        pros: ["Fastest goal achievement", "Higher growth potential", "VIP support"],
        cons: ["Higher risk", "Less flexibility", "Requires consistent income"],
        recommended: availableAmount > 500 && spendingData.riskProfile === "aggressive",
        color: "bg-purple-50 border-purple-200 text-purple-800",
        badge: "AMBITIOUS",
      },
    ]
  }

  const tiers = calculateTierRecommendations()
  const recommendedTier = tiers.find((tier) => tier.recommended)

  const handleTierSelect = (tier: Tier) => {
    setSelectedTier(tier)
  }

  const handleNext = () => {
    if (selectedTier) {
      onNext("dashboard", {
        ...userData,
        selectedTier,
        spendingAnalysis: spendingData,
      })
    }
  }

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-rbc-blue to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse shadow-lg">
            <span className="text-3xl">🧙‍♂️</span>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-100 relative mb-6 max-w-md mx-auto">
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-blue-100 rotate-45"></div>
            <p className="text-sm text-gray-700">
              <span className="font-bold text-rbc-blue">Portfolius:</span> "Here's a suggestion based on your habits.
              Pick what works for you."
            </p>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Analyzing your spending habits...</h2>
          <p className="text-gray-600 mb-6">Our AI is reviewing your goals and creating personalized recommendations</p>

          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 bg-rbc-blue rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-rbc-blue rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
            <div className="w-3 h-3 bg-rbc-blue rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          </div>

          <div className="mt-6 text-sm text-gray-500 space-y-1">
            <p>✓ Analyzing past month spending patterns</p>
            <p>✓ Calculating goal timelines</p>
            <p>✓ Assessing risk tolerance</p>
            <p>⏳ Creating tier recommendations...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-growth-green to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-3xl">📊</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Recommended Tier Plans</h1>
          <p className="text-gray-600 text-lg text-balance">
            Based on your spending habits and goals, here are your personalized savings tiers!
          </p>
        </div>

        {/* Spending Insights Summary */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <h3 className="font-semibold text-lg mb-4">📈 Your Spending Analysis</h3>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-rbc-blue/5 rounded-xl">
              <div className="text-2xl font-bold text-rbc-blue">${spendingData?.monthlySpending.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Monthly Spending</div>
            </div>

            <div className="text-center p-4 bg-growth-green/5 rounded-xl">
              <div className="text-2xl font-bold text-growth-green">{Math.round((spendingData?.savingsRate || 0) * 100)}%</div>
              <div className="text-sm text-gray-600">Savings Rate</div>
            </div>

            <div className="text-center p-4 bg-warm-yellow/10 rounded-xl">
              <div className="text-2xl font-bold text-yellow-600">
                ${Math.max(0, Number.parseInt(userData.monthlyIncome) - (spendingData?.monthlySpending || 0)).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Available Monthly</div>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <div className="text-2xl font-bold text-purple-600 capitalize">{spendingData?.riskProfile}</div>
              <div className="text-sm text-gray-600">Risk Profile</div>
            </div>
          </div>
        </div>

        {/* Tier Cards */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {tiers.map((tier) => {
            const isSelected = selectedTier?.id === tier.id

            return (
              <div
                key={tier.id}
                onClick={() => handleTierSelect(tier)}
                className={`relative cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  isSelected ? "ring-4 ring-rbc-blue/30" : ""
                }`}
              >
                <div
                  className={`p-6 rounded-xl border-2 ${tier.color} ${
                    isSelected ? "shadow-xl" : "shadow-sm hover:shadow-lg"
                  }`}
                >
                  {/* Badge */}
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="px-3 py-1 bg-current text-white text-xs font-bold rounded-full">{tier.badge}</span>
                  </div>

                  {/* Header */}
                  <div className="text-center mb-6 mt-4">
                    <h3 className="text-xl font-bold mb-1">{tier.name}</h3>
                    <p className="text-sm opacity-80">{tier.subtitle}</p>
                    <div className="mt-3">
                      <div className="text-3xl font-bold">${tier.monthlyAmount}</div>
                      <div className="text-sm opacity-80">per month</div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    {tier.features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <span className="text-current mt-1">•</span>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Pros & Cons */}
                  <div className="grid grid-cols-1 gap-3 text-xs">
                    <div>
                      <div className="font-semibold mb-1">✅ Pros:</div>
                      <ul className="space-y-1">
                        {tier.pros.map((pro, index) => (
                          <li key={index} className="opacity-80">
                            • {pro}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <div className="font-semibold mb-1">⚠️ Considerations:</div>
                      <ul className="space-y-1">
                        {tier.cons.map((con, index) => (
                          <li key={index} className="opacity-80">
                            • {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-8 h-8 bg-rbc-blue rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-white text-sm font-bold">✓</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Goal Timeline Projection */}
        {selectedTier && (
          <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
            <h3 className="font-semibold text-lg mb-4">🎯 Goal Achievement Timeline</h3>
            <div className="space-y-4">
              {userData.goals.map((goal: any, index: number) => {
                const monthsNeeded = Math.ceil(
                  goal.suggestedAmount / (selectedTier.monthlyAmount / userData.goals.length),
                )
                const achievableDate = new Date()
                achievableDate.setMonth(achievableDate.getMonth() + monthsNeeded)

                return (
                  <div key={goal.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{goal.icon}</span>
                      <div>
                        <div className="font-medium">{goal.name}</div>
                        <div className="text-sm text-gray-600">${goal.suggestedAmount.toLocaleString()} target</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-semibold text-rbc-blue">{monthsNeeded} months</div>
                      <div className="text-sm text-gray-600">
                        {achievableDate.toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="text-center">
          <button
            onClick={handleNext}
            disabled={!selectedTier}
            className="px-8 py-3 bg-rbc-blue text-white font-semibold rounded-xl hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
          >
            Continue with {selectedTier?.name || "Selected Plan"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default RecommendationsScreen
