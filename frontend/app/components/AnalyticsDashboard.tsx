"use client"

import { Button } from "../components/ui/button"
import { Line, LineChart, XAxis, YAxis, ResponsiveContainer } from "recharts"

// Sample data showing investment vs spending
const investmentData = [
  { month: "Jan", wasted: 0, invested: 0 },
  { month: "Feb", wasted: 245, invested: 280 },
  { month: "Mar", wasted: 490, invested: 620 },
  { month: "Apr", wasted: 735, invested: 1020 },
  { month: "May", wasted: 980, invested: 1480 },
  { month: "Jun", wasted: 1225, invested: 2000 },
]

interface AnalyticsDashboardProps {
  userData?: any
  onNext?: (screen: string, data?: any) => void
}

export default function AnalyticsDashboard({ userData, onNext }: AnalyticsDashboardProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="p-6 flex justify-between items-center">
        {onNext && (
          <button
            onClick={() => onNext("dashboard")}
            className="px-6 py-3 font-semibold text-lg rounded-2xl transition-colors"
            style={{ 
              backgroundColor: '#F3F4F6',
              color: '#23231A',
              border: 'none',
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
            }}
          >
            ← Back
          </button>
        )}
        <img 
          src="/images/investEd-logo.png" 
          alt="InvestEd Logo"
          className="h-24 w-auto object-contain"
        />
        <div className="w-24"></div> {/* Spacer for centering */}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8">
        <div className="w-full max-w-sm space-y-6">
          {/* Speech Bubble */}
          <div className="relative mb-6">
            <div 
              className="rounded-3xl p-6 mx-auto max-w-sm relative"
              style={{ backgroundColor: '#FFDBAC' }}
            >
              <p className="text-lg font-semibold" style={{ color: '#23231A' }}>
                Based on the last 30 days, you spent $877 on non-essentials that could have been invested instead.
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

          {/* Wizard Character */}
          <div className="text-center mb-6">
            <div className="w-32 h-32 mx-auto relative">
              <img 
                src="/images/wizard-charcter.png" 
                alt="Portfolius the Wizard"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Title */}
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold" style={{ color: '#23231A' }}>Investment Projection</h2>
            <p className="text-lg" style={{ color: '#91918D' }}>
              Based on my calculations, if you invested that money instead of spending it, here's what would happen:
            </p>
          </div>

          {/* Chart */}
          <div className="rounded-2xl p-6" style={{ backgroundColor: '#F3F4F6' }}>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={investmentData}>
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: "#91918D" }} 
                  />
                  <YAxis hide />
                  <Line
                    type="monotone"
                    dataKey="wasted"
                    stroke="#EF4444"
                    strokeWidth={3}
                    dot={{ fill: "#EF4444", strokeWidth: 0, r: 4 }}
                    name="Money Wasted"
                  />
                  <Line
                    type="monotone"
                    dataKey="invested"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={{ fill: "#10B981", strokeWidth: 0, r: 4 }}
                    name="If Invested"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="flex justify-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm" style={{ color: '#91918D' }}>Money Wasted</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm" style={{ color: '#91918D' }}>If Invested</span>
              </div>
            </div>
          </div>

          {/* Extra Amount Card */}
          <div className="rounded-2xl p-6 text-center" style={{ backgroundColor: '#EFF6FF' }}>
            <div className="text-3xl font-bold mb-2" style={{ color: '#005DAA' }}>$775</div>
            <div className="text-lg mb-1" style={{ color: '#23231A' }}>Extra you'd have by now</div>
            <div className="text-sm" style={{ color: '#91918D' }}>With 8% annual returns</div>
          </div>

          {/* Action Button */}
          <Button 
            className="w-full h-16 rounded-2xl font-semibold text-xl"
            style={{ 
              backgroundColor: '#005DAA',
              color: 'white',
              border: 'none',
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
              letterSpacing: '0.5px'
            }}
          >
            Should I set this up for you?
          </Button>
        </div>
      </div>
    </div>
  )
}
