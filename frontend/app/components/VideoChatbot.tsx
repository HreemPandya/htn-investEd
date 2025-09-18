"use client"

import { useState, useRef, useEffect } from "react"

interface VideoChatbotProps {
  videoUrl?: string
  videoScript?: string
  onClose: () => void
}

interface ChatMessage {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
}

const VideoChatbot = ({ videoUrl, videoScript, onClose }: VideoChatbotProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      content: videoScript 
        ? `I just created a video about: "${videoScript.substring(0, 100)}..." What would you like to know about this topic?`
        : "Hi! I'm here to help you understand the video content. What questions do you have?",
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateBotResponse = async (userMessage: string): Promise<string> => {
    try {
      // Call the backend API to get Cohere response
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          videoScript: videoScript,
          context: 'investment_education'
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get response from chatbot')
      }

      const data = await response.json()
      return data.response || "I'm sorry, I couldn't generate a response right now. Please try again."
    } catch (error) {
      console.error('Error calling chatbot API:', error)
      return "I'm having trouble connecting to the AI service. Please try again in a moment."
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    try {
      // Get AI response from Cohere
      const botResponseText = await generateBotResponse(inputMessage)
      
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botResponseText,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, botResponse])
    } catch (error) {
      console.error('Error generating bot response:', error)
      const errorResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: "I'm sorry, I'm having trouble responding right now. Please try again.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorResponse])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl h-[600px] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold" style={{ color: '#23231A' }}>
              Video Assistant
            </h2>
            <p className="text-sm" style={{ color: '#91918D' }}>
              Ask questions about the video content
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
            style={{ color: '#91918D' }}
          >
            ✕
          </button>
        </div>

        {/* Video Preview */}
        {videoUrl && (
          <div className="p-4 border-b border-gray-200">
            <div className="bg-gray-50 rounded-xl p-3">
              <video 
                controls 
                className="w-full max-w-sm mx-auto rounded-lg"
                style={{ backgroundColor: '#F3F4F6' }}
              >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                  message.type === 'user'
                    ? 'rounded-br-sm'
                    : 'rounded-bl-sm'
                }`}
                style={{
                  backgroundColor: message.type === 'user' ? '#005DAA' : '#F3F4F6',
                  color: message.type === 'user' ? 'white' : '#23231A'
                }}
              >
                <p className="text-sm">{message.content}</p>
                <p 
                  className="text-xs mt-1 opacity-70"
                  style={{ 
                    color: message.type === 'user' ? 'white' : '#91918D' 
                  }}
                >
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div 
                className="max-w-xs px-4 py-3 rounded-2xl rounded-bl-sm"
                style={{ backgroundColor: '#F3F4F6', color: '#23231A' }}
              >
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex space-x-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question about the video..."
              className="flex-1 px-4 py-3 rounded-xl border-2 transition-colors focus:outline-none"
              style={{ 
                backgroundColor: '#F9FAFB',
                borderColor: '#E5E7EB',
                color: '#23231A'
              }}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
              className="px-6 py-3 font-semibold rounded-xl transition-colors disabled:opacity-50"
              style={{ 
                backgroundColor: '#005DAA',
                color: 'white',
                border: 'none',
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
              }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoChatbot
