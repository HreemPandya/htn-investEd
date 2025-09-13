"use client"

import { useState } from "react"

interface Goal {
  id: string
  name: string
  icon: string
  description: string
  suggestedAmount: number
  timeline: string
  color: string
  isCustom?: boolean
}

interface UserData {
  hasRBCAccount?: boolean
  name?: string
  accountType?: string
  [key: string]: any
}

interface GoalSettingScreenProps {
  userData: UserData
  onNext: (screen: string, data?: UserData) => void
}

const GoalSettingScreen = ({ userData, onNext }: GoalSettingScreenProps) => {
  const [selectedGoals, setSelectedGoals] = useState<Goal[]>([])
  const [customGoal, setCustomGoal] = useState({ name: "", amount: "", timeline: "" })
  const [showCustomForm, setShowCustomForm] = useState(false)

  const predefinedGoals = [
    {
      id: "car",
      name: "First Car",
      icon: "🚗",
      description: "Get the freedom to go anywhere",
      suggestedAmount: 15000,
      timeline: "24 months",
      color: "bg-blue-50 text-rbc-blue border-blue-200",
    },
    {
      id: "trip",
      name: "Dream Trip",
      icon: "✈️",
      description: "Europe backpacking, Japan adventure...",
      suggestedAmount: 4000,
      timeline: "18 months",
      color: "bg-green-50 text-growth-green border-green-200",
    },
    {
      id: "laptop",
      name: "New Laptop",
      icon: "💻",
      description: "MacBook, gaming rig, or work setup",
      suggestedAmount: 2000,
      timeline: "8 months",
      color: "bg-purple-50 text-purple-600 border-purple-200",
    },
    {
      id: "emergency",
      name: "Emergency Fund",
      icon: "🛡️",
      description: "Peace of mind for unexpected expenses",
      suggestedAmount: 3000,
      timeline: "12 months",
      color: "bg-orange-50 text-orange-600 border-orange-200",
    },
    {
      id: "graduation",
      name: "Graduation Celebration",
      icon: "🎓",
      description: "Party, formal wear, memories",
      suggestedAmount: 1500,
      timeline: "36 months",
      color: "bg-pink-50 text-pink-600 border-pink-200",
    },
    {
      id: "apartment",
      name: "First Apartment",
      icon: "🏠",
      description: "Deposit, furniture, independence",
      suggestedAmount: 8000,
      timeline: "24 months",
      color: "bg-indigo-50 text-indigo-600 border-indigo-200",
    },
  ]

  const handleGoalSelect = (goal: Goal) => {
    const isSelected = selectedGoals.some((g) => g.id === goal.id)

    if (isSelected) {
      setSelectedGoals(selectedGoals.filter((g) => g.id !== goal.id))
    } else {
      setSelectedGoals([...selectedGoals, goal])
    }
  }

  const handleCustomGoalSubmit = () => {
    if (customGoal.name && customGoal.amount && customGoal.timeline) {
      const newGoal = {
        id: "custom_" + Date.now(),
        name: customGoal.name,
        icon: "🎯",
        description: "Your custom goal",
        suggestedAmount: Number.parseInt(customGoal.amount),
        timeline: customGoal.timeline + " months",
        color: "bg-gray-50 text-gray-700 border-gray-200",
        isCustom: true,
      }

      setSelectedGoals([...selectedGoals, newGoal as Goal])
      setCustomGoal({ name: "", amount: "", timeline: "" })
      setShowCustomForm(false)
    }
  }

  const handleNext = () => {
    onNext("recommendations", {
      ...userData,
      goals: selectedGoals.map((goal: Goal) => ({
        ...goal,
        priority: selectedGoals.indexOf(goal) + 1,
      })),
    })
  }

  const totalGoalAmount = selectedGoals.reduce((sum: number, goal: Goal) => sum + goal.suggestedAmount, 0)
  const averageTimeline =
    selectedGoals.length > 0
      ? Math.round(selectedGoals.reduce((sum: number, goal: Goal) => sum + Number.parseInt(goal.timeline), 0) / selectedGoals.length)
      : 0

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-rbc-blue to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-3xl">🧙‍♂️</span>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-100 relative mb-6 max-w-md mx-auto">
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-blue-100 rotate-45"></div>
            <p className="text-sm text-gray-700">
              <span className="font-bold text-rbc-blue">Portfolius:</span> "As a financially responsible student, what
              goals are you aiming for?"
            </p>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">What are your goals?</h1>
          <p className="text-gray-600 text-lg text-balance">
            Let's identify what you're working towards. Pick the goals that matter most to you!
          </p>
        </div>

        {/* Goal Selection Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {predefinedGoals.map((goal) => {
            const isSelected = selectedGoals.some((g: Goal) => g.id === goal.id)

            return (
              <div
                key={goal.id}
                onClick={() => handleGoalSelect(goal)}
                className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${
                  isSelected
                    ? `${goal.color} border-current shadow-lg scale-105`
                    : "bg-white border-gray-200 hover:border-gray-300"
                }`}
              >
                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute top-3 right-3 w-7 h-7 bg-current rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                )}

                <div className="text-center">
                  <div className="text-4xl mb-3">{goal.icon}</div>
                  <h3 className="font-semibold text-lg mb-2">{goal.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 text-balance">{goal.description}</p>

                  <div className="space-y-1">
                    <div className="text-sm font-bold">${goal.suggestedAmount.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Target: {goal.timeline}</div>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Add Custom Goal Card */}
          <div
            onClick={() => setShowCustomForm(true)}
            className="p-6 rounded-xl border-2 border-dashed border-gray-300 cursor-pointer transition-all duration-200 hover:border-rbc-blue hover:bg-blue-50 flex items-center justify-center"
          >
            <div className="text-center">
              <div className="text-4xl mb-3">➕</div>
              <h3 className="font-semibold text-gray-600">Add Custom Goal</h3>
              <p className="text-sm text-gray-500 mt-1">Something else in mind?</p>
            </div>
          </div>
        </div>

        {/* Custom Goal Form Modal */}
        {showCustomForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Add Your Custom Goal</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Goal Name</label>
                  <input
                    type="text"
                    value={customGoal.name}
                    onChange={(e) => setCustomGoal({ ...customGoal, name: e.target.value })}
                    placeholder="e.g., Gaming Setup, Study Abroad..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rbc-blue focus:border-rbc-blue transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Amount ($)</label>
                  <input
                    type="number"
                    value={customGoal.amount}
                    onChange={(e) => setCustomGoal({ ...customGoal, amount: e.target.value })}
                    placeholder="5000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rbc-blue focus:border-rbc-blue transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Timeline (months)</label>
                  <input
                    type="number"
                    value={customGoal.timeline}
                    onChange={(e) => setCustomGoal({ ...customGoal, timeline: e.target.value })}
                    placeholder="12"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rbc-blue focus:border-rbc-blue transition-colors"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowCustomForm(false)}
                  className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCustomGoalSubmit}
                  className="flex-1 px-4 py-2 bg-rbc-blue text-white rounded-xl hover:bg-blue-800 transition-colors"
                >
                  Add Goal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Selected Goals Summary */}
        {selectedGoals.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
            <h3 className="font-semibold text-lg mb-4">Your Selected Goals ({selectedGoals.length})</h3>

            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="text-center p-4 bg-rbc-blue/5 rounded-xl">
                <div className="text-2xl font-bold text-rbc-blue">${totalGoalAmount.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Target Amount</div>
              </div>

              <div className="text-center p-4 bg-growth-green/5 rounded-xl">
                <div className="text-2xl font-bold text-growth-green">{averageTimeline} months</div>
                <div className="text-sm text-gray-600">Average Timeline</div>
              </div>

              <div className="text-center p-4 bg-warm-yellow/10 rounded-xl">
                <div className="text-2xl font-bold text-yellow-600">
                  ${Math.round(totalGoalAmount / averageTimeline)}
                </div>
                <div className="text-sm text-gray-600">Monthly Target</div>
              </div>
            </div>

            <div className="space-y-2">
              {selectedGoals.map((goal: Goal, index: number) => (
                <div key={goal.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{goal.icon}</span>
                    <div>
                      <div className="font-medium">{goal.name}</div>
                      <div className="text-sm text-gray-600">
                        ${goal.suggestedAmount.toLocaleString()} in {goal.timeline}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleGoalSelect(goal)}
                    className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-center">
          <button
            onClick={handleNext}
            disabled={selectedGoals.length === 0}
            className="px-8 py-3 bg-rbc-blue text-white font-semibold rounded-xl hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
          >
            Continue with {selectedGoals.length} goal{selectedGoals.length !== 1 ? "s" : ""}
          </button>
        </div>

        {/* Motivational Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            💡 Tip: Start with 1-3 goals to keep things manageable. You can always add more later!
          </p>
        </div>
      </div>
    </div>
  )
}

export default GoalSettingScreen
