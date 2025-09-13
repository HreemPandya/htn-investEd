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
      color: "bg-blue-50 text-blue-600 border-blue-200",
    },
    {
      id: "house",
      name: "First House",
      icon: "🏠",
      description: "Down payment for your dream home",
      suggestedAmount: 50000,
      timeline: "60 months",
      color: "bg-green-50 text-green-600 border-green-200",
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
          {/* Speech Bubble */}
          <div className="relative mb-6">
            <div 
              className="rounded-3xl p-6 mx-auto max-w-sm relative"
              style={{ backgroundColor: '#FFDBAC' }}
            >
              <p className="text-lg font-semibold" style={{ color: '#23231A' }}>
                As a financially responsible student, what goals are you aiming for?
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

          <div className="w-32 h-32 mx-auto mb-6 relative">
            <img 
              src="/images/wizard-point.png" 
              alt="Portfolius the Wizard"
              className="w-full h-full object-contain"
            />
          </div>

          <h1 className="text-3xl font-bold mb-2" style={{ color: '#23231A' }}>What are your goals?</h1>
          <p className="text-lg text-balance" style={{ color: '#91918D' }}>
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
                className={`relative p-8 rounded-2xl border-2 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${
                  isSelected
                    ? "shadow-lg scale-105"
                    : "bg-white border-gray-200 hover:border-gray-300"
                }`}
                style={isSelected ? {
                  backgroundColor: goal.id === 'car' ? '#EFF6FF' : '#F0FDF4',
                  borderColor: goal.id === 'car' ? '#3B82F6' : '#22C55E'
                } : {}}
              >
                {/* Selection Indicator */}
                {isSelected && (
                  <div 
                    className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center shadow-sm"
                    style={{ 
                      backgroundColor: goal.id === 'car' ? '#3B82F6' : '#22C55E'
                    }}
                  >
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                )}

                <div className="text-center">
                  <div className="text-5xl mb-4">{goal.icon}</div>
                  <h3 className="font-semibold text-xl mb-3" style={{ color: '#23231A' }}>{goal.name}</h3>
                  <p className="text-base mb-4 text-balance" style={{ color: '#91918D' }}>{goal.description}</p>

                  <div className="space-y-2">
                    <div className="text-lg font-bold" style={{ color: '#23231A' }}>${goal.suggestedAmount.toLocaleString()}</div>
                    <div className="text-sm" style={{ color: '#91918D' }}>Target: {goal.timeline}</div>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Add Custom Goal Card */}
          <div
            onClick={() => setShowCustomForm(true)}
            className="p-8 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 flex items-center justify-center"
            style={{ 
              borderColor: '#91918D',
              backgroundColor: '#F9FAFB'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#005DAA'
              e.currentTarget.style.backgroundColor = '#F0F9FF'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#91918D'
              e.currentTarget.style.backgroundColor = '#F9FAFB'
            }}
          >
            <div className="text-center">
              <div className="text-5xl mb-4">➕</div>
              <h3 className="font-semibold text-xl mb-2" style={{ color: '#23231A' }}>Add Custom Goal</h3>
              <p className="text-base" style={{ color: '#91918D' }}>Something else in mind?</p>
            </div>
          </div>
        </div>

        {/* Custom Goal Form Modal */}
        {showCustomForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
              <h3 className="text-2xl font-bold mb-6" style={{ color: '#23231A' }}>Add Your Custom Goal</h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-lg font-semibold mb-3" style={{ color: '#23231A' }}>Goal Name</label>
                  <input
                    type="text"
                    value={customGoal.name}
                    onChange={(e) => setCustomGoal({ ...customGoal, name: e.target.value })}
                    placeholder="e.g., Gaming Setup, Study Abroad..."
                    className="w-full px-6 py-4 rounded-2xl text-lg font-medium transition-colors"
                    style={{ 
                      backgroundColor: '#F3F4F6',
                      color: '#23231A',
                      border: 'none',
                      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
                    }}
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold mb-3" style={{ color: '#23231A' }}>Target Amount ($)</label>
                  <input
                    type="number"
                    value={customGoal.amount}
                    onChange={(e) => setCustomGoal({ ...customGoal, amount: e.target.value })}
                    placeholder="5000"
                    className="w-full px-6 py-4 rounded-2xl text-lg font-medium transition-colors"
                    style={{ 
                      backgroundColor: '#F3F4F6',
                      color: '#23231A',
                      border: 'none',
                      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
                    }}
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold mb-3" style={{ color: '#23231A' }}>Timeline (months)</label>
                  <input
                    type="number"
                    value={customGoal.timeline}
                    onChange={(e) => setCustomGoal({ ...customGoal, timeline: e.target.value })}
                    placeholder="12"
                    className="w-full px-6 py-4 rounded-2xl text-lg font-medium transition-colors"
                    style={{ 
                      backgroundColor: '#F3F4F6',
                      color: '#23231A',
                      border: 'none',
                      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
                    }}
                  />
                </div>
              </div>

              <div className="flex space-x-4 mt-8">
                <button
                  onClick={() => setShowCustomForm(false)}
                  className="flex-1 px-6 py-4 font-semibold text-lg rounded-2xl transition-colors"
                  style={{ 
                    backgroundColor: '#F3F4F6',
                    color: '#23231A',
                    border: 'none',
                    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCustomGoalSubmit}
                  className="flex-1 px-6 py-4 font-semibold text-lg rounded-2xl transition-colors"
                  style={{ 
                    backgroundColor: '#005DAA',
                    color: 'white',
                    border: 'none',
                    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    letterSpacing: '0.5px'
                  }}
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
