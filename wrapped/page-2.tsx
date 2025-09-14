"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Share2,
  Sparkles,
  AlertTriangle,
  PiggyBank,
  TrendingUp,
  DollarSign,
  Calendar,
  CreditCard,
  Coffee,
  MapPin,
  Car,
} from "lucide-react"

export default function Home() {
  const [currentSection, setCurrentSection] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const HeroCard = () => (
    <Card className="p-8 text-center bg-primary text-primary-foreground border-0 shadow-2xl animate-slide-in-left relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary to-primary/80 pointer-events-none" />
      <div className="relative z-10 space-y-6">
        <div className="flex justify-center">
          <div className="relative">
            <Sparkles className="h-16 w-16 text-accent animate-pulse" />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full animate-bounce" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-primary-foreground text-balance leading-tight">Your 2025</h1>
          <h2 className="text-5xl font-black text-accent text-balance">Finance Wrapped</h2>
        </div>
        <p className="text-lg text-primary-foreground/95 text-pretty">
          Let's dive into your financial journey this year
        </p>
        <div className="pt-4">
          <div className="inline-flex items-center gap-2 bg-accent backdrop-blur-sm px-4 py-2 rounded-full border border-accent">
            <span className="text-sm font-medium text-primary">InvestED</span>
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </Card>
  )

  const OverspendingCard = () => {
    const [amount, setAmount] = useState(0)
    const targetAmount = 877

    useEffect(() => {
      const timer = setTimeout(() => {
        const interval = setInterval(() => {
          setAmount((prev) => {
            if (prev >= targetAmount) {
              clearInterval(interval)
              return targetAmount
            }
            return prev + Math.ceil(targetAmount / 50)
          })
        }, 30)
        return () => clearInterval(interval)
      }, 300)
      return () => clearTimeout(timer)
    }, [])

    return (
      <Card className="p-8 text-center bg-gradient-to-br from-muted via-card to-muted/50 border-2 border-destructive/20 shadow-xl animate-count-up">
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-10 w-10 text-destructive animate-pulse" />
              </div>
              <div className="absolute -top-1 -right-1 text-2xl animate-bounce">🍔</div>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-card-foreground">Your biggest splurge was</h3>
            <h2 className="text-4xl font-black text-destructive">Dining Out</h2>
          </div>
          <div className="space-y-4">
            <div className="text-6xl font-black text-destructive animate-pulse">${amount.toLocaleString()}</div>
            <p className="text-lg text-muted-foreground text-pretty">That's 47 fancy dinners! 🍽️</p>
          </div>
          <div className="bg-destructive/5 p-4 rounded-lg">
            <p className="text-sm text-card-foreground/80">But hey, you've got to treat yourself sometimes!</p>
          </div>
        </div>
      </Card>
    )
  }

  const SavingsCard = () => {
    const [amount, setAmount] = useState(0)
    const [progress, setProgress] = useState(0)
    const targetAmount = 1200
    const targetProgress = 75

    useEffect(() => {
      const timer = setTimeout(() => {
        const amountInterval = setInterval(() => {
          setAmount((prev) => {
            if (prev >= targetAmount) {
              clearInterval(amountInterval)
              return targetAmount
            }
            return prev + Math.ceil(targetAmount / 60)
          })
        }, 25)

        const progressInterval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= targetProgress) {
              clearInterval(progressInterval)
              return targetProgress
            }
            return prev + 1
          })
        }, 40)

        return () => {
          clearInterval(amountInterval)
          clearInterval(progressInterval)
        }
      }, 300)
      return () => clearTimeout(timer)
    }, [])

    return (
      <Card className="p-8 text-center bg-gradient-to-br from-accent/10 via-card to-accent/5 border-2 border-accent/30 shadow-xl animate-count-up">
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center animate-pulse-glow">
                <PiggyBank className="h-10 w-10 text-accent" />
              </div>
              <div className="absolute -top-1 -right-1 text-2xl animate-bounce">🎉</div>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-card-foreground">You saved an amazing</h3>
            <div className="text-6xl font-black text-accent animate-pulse">${amount.toLocaleString()}</div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Goal Progress</span>
                <span className="font-medium text-accent">{progress}%</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>
            <div className="flex items-center justify-center gap-2 text-accent">
              <TrendingUp className="h-5 w-5" />
              <span className="font-semibold">+15% from last year!</span>
            </div>
          </div>
          <div className="bg-accent/10 p-4 rounded-lg">
            <p className="text-sm text-card-foreground/80 text-pretty">
              You're crushing your savings goals! Keep it up! 💪
            </p>
          </div>
        </div>
      </Card>
    )
  }

  const InvestmentCard = () => {
    const [growth, setGrowth] = useState(0)
    const [potential, setPotential] = useState(0)
    const targetGrowth = 1250
    const targetPotential = 775

    useEffect(() => {
      const timer = setTimeout(() => {
        const growthInterval = setInterval(() => {
          setGrowth((prev) => {
            if (prev >= targetGrowth) {
              clearInterval(growthInterval)
              return targetGrowth
            }
            return prev + Math.ceil(targetGrowth / 50)
          })
        }, 30)

        const potentialInterval = setInterval(() => {
          setPotential((prev) => {
            if (prev >= targetPotential) {
              clearInterval(potentialInterval)
              return targetPotential
            }
            return prev + Math.ceil(targetPotential / 50)
          })
        }, 35)

        return () => {
          clearInterval(growthInterval)
          clearInterval(potentialInterval)
        }
      }, 300)
      return () => clearTimeout(timer)
    }, [])

    return (
      <Card className="p-8 text-center bg-gradient-to-br from-primary/5 via-card to-primary/10 border-2 border-primary/20 shadow-xl animate-count-up">
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                <TrendingUp className="h-10 w-10 text-primary animate-pulse" />
              </div>
              <div className="absolute -top-1 -right-1 text-2xl animate-bounce">📈</div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold text-card-foreground mb-2">Investment Growth</h3>
              <div className="text-5xl font-black text-primary animate-pulse">+${growth.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground mt-1">Your portfolio grew by 12.5% this year! 🚀</p>
            </div>
            <div className="border-t pt-4">
              <h4 className="text-lg font-semibold text-card-foreground mb-2">Missed Opportunity</h4>
              <div className="flex items-center justify-center gap-2">
                <DollarSign className="h-6 w-6 text-accent" />
                <span className="text-3xl font-bold text-accent">+${potential.toLocaleString()}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1 text-pretty">
                If you invested that dining money instead
              </p>
            </div>
          </div>
          <div className="bg-primary/5 p-4 rounded-lg">
            <p className="text-sm text-card-foreground/80 text-pretty">
              Small changes, big returns! Consider investing more next year 💡
            </p>
          </div>
        </div>
      </Card>
    )
  }

  const QuirkyInsights = () => {
    const insights = [
      {
        icon: <Calendar className="h-8 w-8 text-destructive" />,
        emoji: "☀️",
        title: "Your most expensive month",
        value: "July",
        subtitle: "Summer vacation vibes hit different!",
      },
      {
        icon: <CreditCard className="h-8 w-8 text-accent" />,
        emoji: "💸",
        title: "ATM fees paid",
        value: "$50",
        subtitle: "That's 10 fancy coffees!",
      },
      {
        icon: <Coffee className="h-8 w-8 text-primary" />,
        emoji: "☕",
        title: "Coffee shop visits",
        value: "127",
        subtitle: "Basically every other day!",
      },
      {
        icon: <MapPin className="h-8 w-8 text-secondary" />,
        emoji: "🛍️",
        title: "Most shopped location",
        value: "Downtown",
        subtitle: "You love that shopping district!",
      },
    ]

    return (
      <Card className="p-8 bg-gradient-to-br from-card via-muted/30 to-card border-2 border-accent/20 shadow-xl animate-count-up">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-card-foreground mb-2">Fun Facts About You</h2>
            <p className="text-muted-foreground">Some quirky insights from your spending</p>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {insights.map((insight, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-background/50 rounded-lg border border-border/50 hover:border-accent/30 transition-all duration-300 animate-slide-in-left"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative">
                  {insight.icon}
                  <span className="absolute -top-1 -right-1 text-lg">{insight.emoji}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{insight.title}</p>
                  <p className="text-xl font-bold text-card-foreground">{insight.value}</p>
                  <p className="text-xs text-muted-foreground">{insight.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center pt-4">
            <div className="inline-flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full">
              <span className="text-sm font-medium text-accent">That's a wrap! 🎬</span>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  const MilestoneProgress = () => {
    const [progressValue, setProgressValue] = useState(0)

    useEffect(() => {
      const timer = setTimeout(() => setProgressValue(73), 500)
      return () => clearTimeout(timer)
    }, [])

    const milestoneData = {
      goal: "Dream Car",
      targetAmount: 45000,
      currentAmount: 32850,
      withoutInvesting: 28200,
      timeToGoal: "2.1 years",
      monthsAhead: 8,
    }

    const progressPercentage = (milestoneData.currentAmount / milestoneData.targetAmount) * 100

    return (
      <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-primary via-primary/90 to-secondary p-8 text-primary-foreground border-0 shadow-2xl">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <Car className="h-12 w-12 text-accent animate-bounce" />
            </div>
            <h2 className="text-3xl font-bold">Your {milestoneData.goal}</h2>
            <p className="text-primary-foreground/80">is getting closer!</p>
          </div>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-accent">${milestoneData.currentAmount.toLocaleString()}</div>
              <div className="text-sm text-primary-foreground/70">
                of ${milestoneData.targetAmount.toLocaleString()} goal
              </div>
            </div>
            <div className="space-y-2">
              <Progress value={progressValue} className="h-3 bg-primary-foreground/20" />
              <div className="flex justify-between text-sm">
                <span>{Math.round(progressPercentage)}% there</span>
                <span>{milestoneData.timeToGoal} to go</span>
              </div>
            </div>
          </div>
          <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 text-accent">
              <TrendingUp className="h-5 w-5" />
              <span className="font-semibold">Investment Impact</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Without investing:</span>
                <span className="font-medium">${milestoneData.withoutInvesting.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">With investing:</span>
                <span className="font-bold text-accent">${milestoneData.currentAmount.toLocaleString()}</span>
              </div>
              <div className="border-t border-primary-foreground/20 pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">You're ahead by:</span>
                  <span className="font-bold text-accent">
                    ${(milestoneData.currentAmount - milestoneData.withoutInvesting).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center bg-accent/20 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Calendar className="h-5 w-5 text-accent" />
              <span className="font-semibold text-accent">Time Saved</span>
            </div>
            <div className="text-2xl font-bold">{milestoneData.monthsAhead} months</div>
            <div className="text-sm text-primary-foreground/70">ahead of schedule</div>
          </div>
          <div className="text-center space-y-2">
            <p className="text-lg font-semibold">Keep it up! 🚗✨</p>
            <p className="text-sm text-primary-foreground/80">Your investments are accelerating your dreams</p>
          </div>
        </div>
      </Card>
    )
  }

  const sections = [
    { id: "hero", component: <HeroCard /> },
    { id: "overspending", component: <OverspendingCard /> },
    { id: "savings", component: <SavingsCard /> },
    { id: "investment", component: <InvestmentCard /> },
    { id: "insights", component: <QuirkyInsights /> },
    { id: "milestone", component: <MilestoneProgress /> },
  ]

  const nextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1)
    }
  }

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10">
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-accent/20 rounded-full blur-xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-primary/10 rounded-full blur-xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-secondary/30 rounded-full blur-lg animate-bounce" />
        </div>

        {/* Main content */}
        <div
          className={`w-full max-w-md transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          {sections[currentSection].component}
        </div>

        {/* Navigation dots */}
        <div className="flex gap-2 mt-8">
          {sections.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSection(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSection ? "bg-accent scale-125" : "bg-muted hover:bg-accent/50"
              }`}
            />
          ))}
        </div>

        {/* Navigation buttons */}
        <div className="flex gap-4 mt-6">
          <Button
            variant="outline"
            onClick={prevSection}
            disabled={currentSection === 0}
            className="px-6 bg-transparent"
          >
            Previous
          </Button>
          <Button
            onClick={nextSection}
            disabled={currentSection === sections.length - 1}
            className="px-6 bg-primary hover:bg-primary/90"
          >
            Next
          </Button>
        </div>

        {/* Share button - only show on last section */}
        {currentSection === sections.length - 1 && (
          <div className="mt-8 space-y-4 text-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-accent to-secondary hover:from-accent/90 hover:to-secondary/90 text-accent-foreground font-bold px-8 py-4 text-lg animate-pulse-glow"
            >
              <Share2 className="mr-2 h-5 w-5" />
              Share Your Wrapped
            </Button>
          </div>
        )}
      </div>
    </main>
  )
}
