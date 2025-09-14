"use client"

import { useState } from "react"

interface Goal {
  id: string
  name: string
  amount: number
  timeline?: string
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
  onBack?: (screen: string) => void
}

const GoalSettingScreen = ({ userData, onNext, onBack }: GoalSettingScreenProps) => {
  const [goals, setGoals] = useState<Goal[]>([])
  const [goalName, setGoalName] = useState("")
  const [amount, setAmount] = useState(0)
  const [showWizard, setShowWizard] = useState(true)

  const handleAddGoal = () => {
    if (!goalName || amount <= 0) return
    const newGoal: Goal = {
      id: "goal_" + Date.now(),
      name: goalName,
      amount,
      isCustom: true,
    }
    setGoals([...goals, newGoal])
    setGoalName("")
    setAmount(0)
  }

  const handleNext = () => {
    onNext("recommendations", {
      ...userData,
      goals,
    })
  }

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      {/* Header with back + progress bar */}
      <div className="p-6 flex justify-between items-center">
        {onBack ? (
          <button
            onClick={() => onBack("personalization")}
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
            <span>Step 2 of 3</span>
            <span>67%</span>
          </div>
          <div className="w-full rounded-full h-2 bg-gray-200">
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{
                backgroundColor: "#005DAA",
                width: "67%",
              }}
            />
          </div>
        </div>
      </div>

      {/* Wizard Assistant at Top */}
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
            Enter your goal and how much you want to save. Start small, grow big!
            </p>
          <img
            src="/images/wizard-point.png"
            alt="Wizard Assistant"
            className="absolute bottom-0 right-0 h-24 w-24 object-contain"
          />
        </div>
      )}

      {/* Goal Form */}
      <div className="px-6 flex-1 flex items-center justify-center">
        <div className="max-w-md w-full space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#23231A" }}>
              Goal Name
            </label>
            <input
              type="text"
              value={goalName}
              onChange={(e) => setGoalName(e.target.value)}
              placeholder="e.g. Laptop"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#005DAA]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#23231A" }}>
              Amount
            </label>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setAmount((prev) => Math.max(0, prev - 100))}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
              >
                –
              </button>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full text-center px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#005DAA]"
              />
              <button
                type="button"
                onClick={() => setAmount((prev) => prev + 100)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAddGoal}
            disabled={!goalName || amount <= 0}
            className="w-full py-3 bg-[#005DAA] text-white font-semibold rounded-xl hover:bg-blue-800 disabled:opacity-50 transition shadow-md"
          >
            Add Goal
          </button>

          {/* List of added goals */}
          {goals.length > 0 && (
            <div className="mt-6 space-y-3">
              <h3 className="text-lg font-semibold" style={{ color: "#23231A" }}>
                Your Goals
              </h3>
              {goals.map((goal) => (
                <div
                  key={goal.id}
                  className="p-4 border rounded-xl flex justify-between items-center"
                >
                  <span>{goal.name} - ${goal.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Continue Button */}
      <div className="px-6 py-6 flex justify-center">
        <button
          onClick={handleNext}
          disabled={goals.length === 0}
          className="px-8 py-3 bg-[#005DAA] text-white font-semibold rounded-xl hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
        >
          Continue with {goals.length} goal{goals.length !== 1 ? "s" : ""}
        </button>
      </div>
    </div>
  )
}

export default GoalSettingScreen
