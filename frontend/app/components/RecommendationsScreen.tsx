"use client"

import { useState } from "react"

interface RecommendationsScreenProps {
  onNext: (screen: string) => void
  onBack?: (screen: string) => void
}

const RecommendationsScreen = ({ onNext, onBack }: RecommendationsScreenProps) => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  // Hardcoded mock data
  const spendingData = {
    monthlySpending: 1200,
    savingsRate: 0.25,
    available: 400,
    riskProfile: "Moderate",
  }

  const plans = [
    { id: "starter", name: "Starter Saver", amount: 50, badge: "SAFE", color: "#23231a" },
    { id: "balanced", name: "Balanced Builder", amount: 150, badge: "RECOMMENDED", color: "#ffd200" },
    { id: "accelerated", name: "Goal Accelerator", amount: 300, badge: "AMBITIOUS", color: "#23231a" },
  ]

  const goals = [
    { id: "laptop", name: "Laptop", icon: "💻", target: 1200 },
    { id: "trip", name: "Trip", icon: "✈️", target: 2000 },
  ]

  const handleContinue = () => {
    if (selectedPlan) {
      onNext("dashboard") // 🔗 go to next screen
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header with Back + Progress */}
      <div className="p-6 flex justify-between items-center">
        {onBack ? (
          <button
            onClick={() => onBack("goals")}
            className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 transition flex items-center justify-center"
            aria-label="Back"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-[#23231a]"
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
          <div className="flex justify-between text-sm mb-1" style={{ color: "#91918d" }}>
            <span>Step 3 of 3</span>
            <span>100%</span>
          </div>
          <div className="w-full rounded-full h-2 bg-gray-200">
            <div
              className="h-2 rounded-full"
              style={{ backgroundColor: "#005daa", width: "100%" }}
            />
          </div>
        </div>

        <div className="w-12" />
      </div>

      {/* Spending Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <div className="text-xl font-bold" style={{ color: "#005daa" }}>
            ${spendingData.monthlySpending}
          </div>
          <p className="text-sm" style={{ color: "#91918d" }}>Spent</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <div className="text-xl font-bold" style={{ color: "#005daa" }}>
            {spendingData.savingsRate * 100}%
          </div>
          <p className="text-sm" style={{ color: "#91918d" }}>Savings</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <div className="text-xl font-bold" style={{ color: "#005daa" }}>
            ${spendingData.available}
          </div>
          <p className="text-sm" style={{ color: "#91918d" }}>Available</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <div className="text-xl font-bold capitalize" style={{ color: "#005daa" }}>
            {spendingData.riskProfile}
          </div>
          <p className="text-sm" style={{ color: "#91918d" }}>Risk</p>
        </div>
      </div>

      {/* Plans */}
      <div className="grid md:grid-cols-3 gap-6 p-6">
        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.id
          return (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative cursor-pointer rounded-2xl p-6 text-center shadow transition transform hover:scale-105 ${
                isSelected ? "ring-4" : ""
              }`}
              style={{
                border: `2px solid ${isSelected ? plan.color : "#E5E7EB"}`,
                "--tw-ring-color": plan.color,
              } as React.CSSProperties}
            >
              <span
                className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-bold rounded-full text-white"
                style={{ backgroundColor: plan.color }}
              >
                {plan.badge}
              </span>
              <h3 className="text-lg font-bold mb-2" style={{ color: "#23231a" }}>
                {plan.name}
              </h3>
              <p className="text-3xl font-bold" style={{ color: plan.color }}>
                ${plan.amount}
              </p>
              <p className="text-sm mt-1" style={{ color: "#91918d" }}>per month</p>
            </div>
          )
        })}
      </div>

      {/* Goals Timeline */}
      {selectedPlan && (
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4" style={{ color: "#23231a" }}>
            🎯 Your Goals
          </h2>
          <div className="space-y-3">
            {goals.map((goal) => {
              const months = Math.ceil(goal.target / (plans.find((p) => p.id === selectedPlan)?.amount || 1))
              return (
                <div key={goal.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{goal.icon}</span>
                    <div>
                      <div className="font-medium" style={{ color: "#23231a" }}>{goal.name}</div>
                      <div className="text-sm" style={{ color: "#91918d" }}>${goal.target}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold" style={{ color: "#005daa" }}>{months} months</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Continue Button */}
      <div className="p-6 text-center mt-auto">
        <button
          onClick={handleContinue}
          disabled={!selectedPlan}
          className="px-10 py-4 rounded-xl font-semibold text-white transition disabled:opacity-50 shadow-lg"
          style={{ backgroundColor: selectedPlan ? "#005daa" : "#91918d" }}
        >
          Continue
        </button>
      </div>
    </div>
  )
}

export default RecommendationsScreen
