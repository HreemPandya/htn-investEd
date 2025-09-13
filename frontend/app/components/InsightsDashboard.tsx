"use client"

import { useState } from "react"

interface UserData {
  hasRBCAccount?: boolean
  name?: string
  accountType?: string
  goals?: Array<{
    id: string
    name: string
    icon: string
    suggestedAmount: number
    timeline: string
  }>
  selectedTier?: {
    name: string
    monthlyAmount: number
  }
  monthlyIncome?: string
  [key: string]: any
}

interface Video {
  id: number
  title: string
  description: string
  duration: string
  thumbnail: string
  difficulty: string
}

interface InsightsDashboardProps {
  userData: UserData
}

const InsightsDashboard = ({ userData }: InsightsDashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview")
  const [showVideo, setShowVideo] = useState<Video | null>(null)

  // Mock data for demonstration
  const spendingCategories = [
    { name: "Food & Dining", amount: 450, percentage: 35, color: "bg-red-500", isNecessary: true },
    { name: "Entertainment", amount: 320, percentage: 25, color: "bg-warm-yellow", isNecessary: false },
    { name: "Transportation", amount: 260, percentage: 20, color: "bg-rbc-blue", isNecessary: true },
    { name: "Shopping", amount: 195, percentage: 15, color: "bg-purple-500", isNecessary: false },
    { name: "Other", amount: 65, percentage: 5, color: "bg-gray-500", isNecessary: true },
  ]

  const totalSpending = spendingCategories.reduce((sum, cat) => sum + cat.amount, 0)
  const unnecessarySpending = spendingCategories
    .filter((cat) => !cat.isNecessary)
    .reduce((sum, cat) => sum + cat.amount, 0)
  const necessarySpending = totalSpending - unnecessarySpending

  const educationalVideos = [
    {
      id: 1,
      title: "What is a TFSA?",
      description: "Learn about Tax-Free Savings Accounts for students",
      duration: "3:45",
      thumbnail: "🏦",
      difficulty: "Beginner",
    },
    {
      id: 2,
      title: "Show me a video about diversification",
      description: "Understanding how to spread investment risk",
      duration: "4:20",
      thumbnail: "📊",
      difficulty: "Intermediate",
    },
    {
      id: 3,
      title: "Student Budgeting 101",
      description: "Practical tips for managing money in university",
      duration: "5:15",
      thumbnail: "🎓",
      difficulty: "Beginner",
    },
    {
      id: 4,
      title: "Emergency Fund Basics",
      description: "Why every student needs a financial safety net",
      duration: "3:30",
      thumbnail: "🛡️",
      difficulty: "Beginner",
    },
  ]

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Goals Progress */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold mb-4">🎯 Goals Progress</h3>
        <div className="space-y-4">
          {userData.goals?.map((goal: any, index: number) => {
            const progress = Math.random() * 40 // Mock progress
            const monthsElapsed = 3 // Mock elapsed time
            const totalMonths = Number.parseInt(goal.timeline)

            return (
              <div key={goal.id} className="border border-gray-200 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{goal.icon}</span>
                    <span className="font-medium">{goal.name}</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    ${Math.round((goal.suggestedAmount * progress) / 100).toLocaleString()} / $
                    {goal.suggestedAmount.toLocaleString()}
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div
                    className="bg-gradient-to-r from-rbc-blue to-growth-green h-3 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                  <span>{progress.toFixed(1)}% complete</span>
                  <span>{totalMonths - monthsElapsed} months remaining</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm text-center">
          <div className="text-3xl font-bold text-growth-green mb-2">${userData.selectedTier?.monthlyAmount || 0}</div>
          <div className="text-gray-600">Monthly Investment</div>
          <div className="text-sm text-growth-green mt-1">+12% from last month</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm text-center">
          <div className="text-3xl font-bold text-rbc-blue mb-2">{userData.goals?.length || 0}</div>
          <div className="text-gray-600">Active Goals</div>
          <div className="text-sm text-rbc-blue mt-1">On track</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {Math.round(
              ((userData.selectedTier?.monthlyAmount || 0) / Number.parseInt(userData.monthlyIncome || "1000")) * 100,
            )}
            %
          </div>
          <div className="text-gray-600">Savings Rate</div>
          <div className="text-sm text-purple-600 mt-1">Above average</div>
        </div>
      </div>
    </div>
  )

  const renderSpendingTab = () => (
    <div className="space-y-6">
      {/* Pie Chart Alternative - Spending Breakdown */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">💳 Spending Breakdown</h3>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">${totalSpending}</div>
            <div className="text-sm text-gray-600">This month</div>
          </div>
        </div>

        {/* Visual Bar Chart */}
        <div className="space-y-4 mb-6">
          {spendingCategories.map((category) => (
            <div key={category.name}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-700">{category.name}</span>
                <span className="text-sm text-gray-600">${category.amount}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`${category.color} h-3 rounded-full transition-all duration-500`}
                  style={{ width: `${category.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Necessary vs Unnecessary */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
          <div className="text-center p-4 bg-growth-green/5 rounded-xl">
            <div className="text-2xl font-bold text-growth-green mb-1">${necessarySpending}</div>
            <div className="text-sm text-green-700">Necessary Spending</div>
            <div className="text-xs text-gray-600 mt-1">
              {Math.round((necessarySpending / totalSpending) * 100)}% of total
            </div>
          </div>

          <div className="text-center p-4 bg-red-50 rounded-xl">
            <div className="text-2xl font-bold text-red-600 mb-1">${unnecessarySpending}</div>
            <div className="text-sm text-red-700">Discretionary Spending</div>
            <div className="text-xs text-gray-600 mt-1">
              {Math.round((unnecessarySpending / totalSpending) * 100)}% of total
            </div>
          </div>
        </div>
      </div>

      {/* Spending Insights */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">💡 Smart Insights</h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3 p-3 bg-warm-yellow/10 border border-warm-yellow/30 rounded-xl">
            <span className="text-yellow-600">⚠️</span>
            <div>
              <div className="font-medium text-yellow-800">High Entertainment Spending</div>
              <div className="text-sm text-yellow-700">
                You spent 25% on entertainment. Consider reducing by $100/month to accelerate your goals.
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 bg-growth-green/5 border border-growth-green/30 rounded-xl">
            <span className="text-growth-green">✅</span>
            <div>
              <div className="font-medium text-green-800">Great Transportation Management</div>
              <div className="text-sm text-green-700">
                Your transport costs are 15% below average for students in your area!
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 bg-rbc-blue/5 border border-rbc-blue/30 rounded-xl">
            <span className="text-rbc-blue">💡</span>
            <div>
              <div className="font-medium text-blue-800">Money-Saving Opportunity</div>
              <div className="text-sm text-blue-700">
                Switch to meal prep twice a week to save ~$80/month on dining out.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderEducationTab = () => (
    <div className="space-y-6">
      {/* Video Learning Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold mb-4">🎥 Financial Education</h3>
        <p className="text-gray-600 mb-6">
          Short explainer videos and text about investing basics. Learn at your own pace!
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {educationalVideos.map((video) => (
            <div
              key={video.id}
              onClick={() => setShowVideo(video)}
              className="border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-rbc-blue hover:shadow-md transition-all"
            >
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 bg-rbc-blue/10 rounded-xl flex items-center justify-center text-xl">
                  {video.thumbnail}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{video.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{video.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{video.difficulty}</span>
                    <span className="text-xs text-gray-500">{video.duration}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reading Materials */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">📚 Recommended Reading</h3>
        <div className="space-y-3">
          {[
            "The Wealthy Barber Returns - Canadian Financial Planning",
            "Millionaire Teacher - Simple Investment Strategies",
            "The Index Card - Why Personal Finance Doesn't Have to be Complicated",
            "Your Money or Your Life - Financial Independence Guide",
          ].map((book, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 p-3 border border-gray-200 rounded-xl hover:bg-gray-50"
            >
              <span className="text-rbc-blue">📖</span>
              <span className="text-gray-700">{book}</span>
              <button className="ml-auto text-rbc-blue text-sm hover:underline">Learn More</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const tabs = [
    { id: "overview", name: "Overview", icon: "📊" },
    { id: "spending", name: "Spending", icon: "💳" },
    { id: "education", name: "Learn", icon: "🎓" },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-rbc-blue to-blue-700 rounded-xl p-6 text-white mb-6 relative overflow-hidden">
          <div className="absolute top-4 right-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">🧙‍♂️</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">Welcome back, {userData.name}! 👋</h1>
              <p className="opacity-90">Here's your financial overview • {userData.selectedTier?.name} Plan</p>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-80">Next Goal</div>
              <div className="font-semibold">
                {userData.goals?.[0]?.name} in {Number.parseInt(userData.goals?.[0]?.timeline || "0") - 3} months
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                  activeTab === tab.id
                    ? "text-rbc-blue border-b-2 border-rbc-blue"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && renderOverviewTab()}
        {activeTab === "spending" && renderSpendingTab()}
        {activeTab === "education" && renderEducationTab()}

        {/* Video Modal */}
        {showVideo && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">{showVideo.title}</h3>
                <button onClick={() => setShowVideo(null)} className="text-gray-400 hover:text-gray-600">
                  ✕
                </button>
              </div>

              {/* Mock Video Player */}
              <div className="bg-gray-900 aspect-video rounded-xl flex items-center justify-center mb-4">
                <div className="text-center text-white">
                  <div className="text-6xl mb-4">▶️</div>
                  <div className="text-lg font-medium">{showVideo.title}</div>
                  <div className="text-sm opacity-75">{showVideo.duration}</div>
                </div>
              </div>

              <p className="text-gray-600 mb-4">{showVideo.description}</p>

              <div className="flex justify-between items-center">
                <span className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded">
                  {showVideo.difficulty} Level
                </span>
                <div className="space-x-3">
                  <button className="px-4 py-2 bg-rbc-blue text-white rounded-xl hover:bg-blue-800 transition-colors">
                    Watch Now
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                    Save for Later
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="bg-gradient-to-br from-growth-green to-green-600 rounded-xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">🚀 Want to learn more?</h3>
            <p className="text-sm opacity-90 mb-4">
              Explore advanced investing strategies and get personalized advice from RBC advisors.
            </p>
            <button className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-xl hover:bg-opacity-30 transition-colors">
              Check this short video for more information! →
            </button>
          </div>

          <div className="bg-gradient-to-br from-rbc-blue to-blue-700 rounded-xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">💡 Optimize Your Plan</h3>
            <p className="text-sm opacity-90 mb-4">
              Based on your progress, we have suggestions to help you reach your goals faster.
            </p>
            <button className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-xl hover:bg-opacity-30 transition-colors">
              View Recommendations →
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500">
          <p className="text-sm">
            🔒 Your financial data is secure and encrypted •
            <span className="text-rbc-blue hover:underline cursor-pointer"> Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default InsightsDashboard
