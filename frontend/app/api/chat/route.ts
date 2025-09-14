import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, videoScript, context } = body

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Create a finance professional prompt for younger audiences
    const financePrompt = `You are a friendly and knowledgeable finance professional who specializes in explaining complex financial concepts to young people (ages 16-25). Your job is to make investing, saving, and financial planning accessible and exciting.

Key guidelines:
- Use simple, clear language that anyone can understand
- Avoid jargon - if you must use financial terms, explain them
- Use relatable examples (like buying a car, saving for college, etc.)
- Be encouraging and positive about financial literacy
- Keep responses concise but informative (2-3 sentences max)
- If asked about specific topics, provide practical, actionable advice

Context: ${context || 'general financial education'}
${videoScript ? `Video content: ${videoScript}` : ''}

User question: ${message}

Answer as a helpful finance mentor:`

    // Call the backend chatbot endpoint
    const response = await fetch(`${BACKEND_URL}/chatbot/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: financePrompt
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Backend error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()

    return NextResponse.json({
      response: data.response || "I'm here to help with your financial questions! What would you like to know?"
    })

  } catch (error) {
    console.error('Error in chat API:', error)
    
    // Fallback responses for common financial questions
    const fallbackResponses = {
      'investing': "Great question! Investing is like planting seeds for your future. Start small with index funds or ETFs - they're like buying a little piece of many companies at once!",
      'saving': "Saving money is your financial foundation! Try the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings and investing.",
      'budget': "Budgeting is just tracking what you earn vs what you spend. Use apps like Mint or YNAB, or start simple with a spreadsheet!",
      'debt': "Debt isn't always bad - student loans and mortgages can be investments in your future. Focus on high-interest debt first!",
      'credit': "Your credit score is like a financial report card. Pay bills on time, keep credit card balances low, and don't open too many accounts at once."
    }

    const lowerMessage = message.toLowerCase()
    let fallbackResponse = "I'm having trouble connecting right now, but I'm here to help with your financial questions! Try asking about investing, saving, budgeting, or credit."

    for (const [topic, response] of Object.entries(fallbackResponses)) {
      if (lowerMessage.includes(topic)) {
        fallbackResponse = response
        break
      }
    }

    return NextResponse.json({
      response: fallbackResponse
    })
  }
}
