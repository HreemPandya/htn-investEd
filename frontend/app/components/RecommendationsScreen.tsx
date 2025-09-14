"use client"

import { useState, useEffect } from "react"
import type React from "react"

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
  onBack?: (screen: string) => void
}

const RecommendationsScreen = ({ userData, onNext, onBack }: RecommendationsScreenProps) => {
  const [selectedTier, setSelectedTier] = useState<Tier | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(true)
  const [spendingData, setSpendingData] = useState<SpendingData | null>(null)

  // Simulate AI analysis
  useEffect(() => {
    setTimeout(() => {
      // Mock spending analysis based on user data
      const mockSpendingData = {
        monthlySpending: Math.max(800, Number.parseInt(userData.monthlyIncome || "1000") * 0.6),
        categories: {
          food: 0.35,
          entertainment: 0.25,
          transport: 0.2,
          shopping: 0.15,
          other: 0.05,
        },
        savingsRate: Math.max(
          0.1,
          Math.min(0.4, (Number.parseInt(userData.monthlyIncome || "1000") - 800) / Number.parseInt(userData.monthlyIncome || "1000")),
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

    const availableAmount = Number.parseInt(userData.monthlyIncome || "1000") - spendingData.monthlySpending
    const totalGoalAmount = (userData.goals || []).reduce((sum: number, goal: any) => sum + goal.suggestedAmount, 0)
    const averageTimeline =
      (userData.goals || []).reduce((sum: number, goal: any) => sum + Number.parseInt(goal.timeline), 0) / (userData.goals?.length || 1)

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
        spendingAnalysis: spendingData || undefined,
      })
    }
  }

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse shadow-lg" style={{ background: 'linear-gradient(135deg, #005DAA 0%, #3B82F6 100%)' }}>
            <span className="text-4xl">🧙‍♂️</span>
          </div>
          <div className="rounded-2xl p-6 shadow-sm relative mb-8 max-w-md mx-auto" style={{ backgroundColor: '#FFDBAC' }}>
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-6 h-6 rotate-45" style={{ backgroundColor: '#FFDBAC' }}></div>
            <p className="text-lg font-semibold" style={{ color: '#23231A' }}>
              <span className="font-bold" style={{ color: '#005DAA' }}>Portfolius:</span> "Here's a suggestion based on your habits.
              Pick what works for you."
            </p>
          </div>
          <h2 className="text-3xl font-bold mb-3" style={{ color: '#23231A' }}>Analyzing your spending habits...</h2>
          <p className="text-lg mb-8" style={{ color: '#91918D' }}>Our AI is reviewing your goals and creating personalized recommendations</p>

          <div className="flex items-center justify-center space-x-3">
            <div className="w-4 h-4 rounded-full animate-bounce" style={{ backgroundColor: '#005DAA' }}></div>
            <div className="w-4 h-4 rounded-full animate-bounce" style={{ backgroundColor: '#005DAA', animationDelay: "0.1s" }}></div>
            <div className="w-4 h-4 rounded-full animate-bounce" style={{ backgroundColor: '#005DAA', animationDelay: "0.2s" }}></div>
          </div>

          <div className="mt-8 text-base space-y-2" style={{ color: '#91918D' }}>
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
    <div className="min-h-screen bg-white">
{/* Header with back + progress bar */}
<div className="p-6 flex justify-between items-center">
  {onBack ? (
    <button
      onClick={() => onBack("goals")}
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

  {/* Progress bar */}
  <div className="flex-1 mx-6">
    <div className="flex justify-between text-sm mb-1" style={{ color: "#91918D" }}>
      <span>Step 3 of 3</span>
      <span>100%</span>
    </div>
    <div className="w-full rounded-full h-2 bg-gray-200">
      <div
        className="h-2 rounded-full transition-all duration-300"
        style={{
          backgroundColor: "#005DAA",
          width: "100%",
        }}
      />
    </div>
  </div>

  {/* Right spacer for symmetry */}
  <div className="w-12" />
</div>


        {/* Spending Insights Summary */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <h3 className="font-bold text-2xl mb-6" style={{ color: '#23231A' }}>📈 Your Spending Analysis</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-6 rounded-2xl bg-white shadow-sm">
              <div className="text-3xl font-bold mb-2" style={{ color: '#005DAA' }}>${spendingData?.monthlySpending.toLocaleString()}</div>
              <div className="text-base" style={{ color: '#91918D' }}>Monthly Spending</div>
            </div>

            <div className="text-center p-6 rounded-2xl bg-white shadow-sm">
              <div className="text-3xl font-bold mb-2" style={{ color: '#10B981' }}>{Math.round((spendingData?.savingsRate || 0) * 100)}%</div>
              <div className="text-base" style={{ color: '#91918D' }}>Savings Rate</div>
            </div>

            <div className="text-center p-6 rounded-2xl bg-white shadow-sm">
              <div className="text-3xl font-bold mb-2" style={{ color: '#F59E0B' }}>
                ${Math.max(0, Number.parseInt(userData.monthlyIncome || "1000") - (spendingData?.monthlySpending || 0)).toLocaleString()}
              </div>
              <div className="text-base" style={{ color: '#91918D' }}>Available Monthly</div>
            </div>

            <div className="text-center p-6 rounded-2xl bg-white shadow-sm">
              <div className="text-3xl font-bold mb-2 capitalize" style={{ color: '#8B5CF6' }}>{spendingData?.riskProfile}</div>
              <div className="text-base" style={{ color: '#91918D' }}>Risk Profile</div>
            </div>
          </div>
        </div>

        {/* Tier Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {tiers.map((tier) => {
            const isSelected = selectedTier?.id === tier.id

            return (
              <div
                key={tier.id}
                onClick={() => handleTierSelect(tier)}
                className={`relative cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  isSelected ? "ring-4" : ""
                }`}
                style={{ 
                  '--tw-ring-color': isSelected ? '#005DAA' : 'transparent',
                  '--tw-ring-opacity': isSelected ? 0.3 : 0
                } as React.CSSProperties}
              >
                <div
                  className={`p-8 rounded-2xl border-2 bg-white ${
                    isSelected ? "shadow-xl" : "shadow-sm hover:shadow-lg"
                  }`}
                  style={{ 
                    borderColor: isSelected ? '#005DAA' : '#E5E7EB'
                  }}
                >
                  {/* Badge */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span 
                      className="px-4 py-2 text-white text-sm font-bold rounded-full"
                      style={{ backgroundColor: '#005DAA' }}
                    >
                      {tier.badge}
                    </span>
                  </div>

                  {/* Header */}
                  <div className="text-center mb-8 mt-6">
                    <h3 className="text-2xl font-bold mb-2" style={{ color: '#23231A' }}>{tier.name}</h3>
                    <p className="text-base mb-4" style={{ color: '#91918D' }}>{tier.subtitle}</p>
                    <div className="mt-4">
                      <div className="text-4xl font-bold mb-1" style={{ color: '#005DAA' }}>${tier.monthlyAmount}</div>
                      <div className="text-base" style={{ color: '#91918D' }}>per month</div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-4 mb-8">
                    {tier.features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <span className="text-lg mt-1" style={{ color: '#005DAA' }}>•</span>
                        <span className="text-base" style={{ color: '#23231A' }}>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Pros & Cons */}
                  <div className="grid grid-cols-1 gap-4 text-sm">
                    <div>
                      <div className="font-semibold mb-2" style={{ color: '#10B981' }}>✅ Pros:</div>
                      <ul className="space-y-2">
                        {tier.pros.map((pro, index) => (
                          <li key={index} style={{ color: '#91918D' }}>
                            • {pro}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <div className="font-semibold mb-2" style={{ color: '#F59E0B' }}>⚠️ Considerations:</div>
                      <ul className="space-y-2">
                        {tier.cons.map((con, index) => (
                          <li key={index} style={{ color: '#91918D' }}>
                            • {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-sm" style={{ backgroundColor: '#005DAA' }}>
                      <span className="text-white text-lg font-bold">✓</span>
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
              {(userData.goals || []).map((goal: any, index: number) => {
                const monthsNeeded = Math.ceil(
                  goal.suggestedAmount / (selectedTier.monthlyAmount / (userData.goals?.length || 1)),
                )
                const achievableDate = new Date()
                achievableDate.setMonth(achievableDate.getMonth() + monthsNeeded)

                return (
                  <div key={goal.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{goal.icon}</span>
                      <div>
                        <div className="font-medium">{goal.name}</div>
                        <div className="text-sm text-gray-600">  ${(goal.suggestedAmount ?? 0).toLocaleString()} 
                          target
                          </div>

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
            className="px-12 py-4 text-white font-semibold rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg text-lg"
            style={{ 
              backgroundColor: selectedTier ? '#005DAA' : '#91918D',
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
              letterSpacing: '0.5px'
            }}
          >
            Continue with {selectedTier?.name || "Selected Plan"}
          </button>
        </div>
        </div>
  )
}

export default RecommendationsScreen
