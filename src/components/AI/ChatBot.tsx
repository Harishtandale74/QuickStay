import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User, Sparkles, MapPin, Calendar, DollarSign } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  data?: any;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hi! I'm your AI travel assistant. I can help you find the perfect hotel, plan your trip, or answer any questions about your bookings. How can I assist you today?",
      timestamp: new Date(),
      suggestions: [
        "Find hotels in Paris",
        "Best deals this weekend",
        "Hotels with spa",
        "Family-friendly options"
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Simple AI response logic (in real app, this would be an API call)
    if (lowerMessage.includes('paris') || lowerMessage.includes('france')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: "Great choice! Paris is amazing. I found some excellent hotels for you. The Grand Hotel du Louvre is particularly popular with travelers, offering luxury accommodations near major attractions.",
        timestamp: new Date(),
        data: {
          hotels: [
            { name: "Grand Hotel du Louvre", price: 280, rating: 4.8 },
            { name: "Hotel des Grands Boulevards", price: 195, rating: 4.6 }
          ]
        },
        suggestions: ["Show me more Paris hotels", "What about restaurants?", "Best time to visit Paris"]
      };
    } else if (lowerMessage.includes('spa') || lowerMessage.includes('wellness')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: "I'd love to help you find a relaxing spa hotel! Based on your preferences, I recommend these wellness retreats with world-class spa facilities.",
        timestamp: new Date(),
        suggestions: ["Mountain spa retreats", "Beachfront wellness resorts", "City spa hotels", "Yoga retreats"]
      };
    } else if (lowerMessage.includes('family') || lowerMessage.includes('kids')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: "Family travel is wonderful! I can help you find family-friendly hotels with amenities like kids' clubs, pools, and connecting rooms. What destination are you considering?",
        timestamp: new Date(),
        suggestions: ["Beach resorts for families", "City hotels with family rooms", "All-inclusive family resorts"]
      };
    } else if (lowerMessage.includes('deal') || lowerMessage.includes('discount') || lowerMessage.includes('cheap')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: "I love helping travelers save money! Here are some current deals I found. These offers are time-sensitive, so book soon!",
        timestamp: new Date(),
        data: {
          deals: [
            { location: "Bali", discount: 40, savings: 120 },
            { location: "Thailand", discount: 35, savings: 95 }
          ]
        },
        suggestions: ["Show more deals", "Weekend getaway deals", "Last-minute offers"]
      };
    } else if (lowerMessage.includes('booking') || lowerMessage.includes('reservation')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: "I can help you with your bookings! You can view your current reservations in your dashboard, modify dates, or cancel if needed. What would you like to do?",
        timestamp: new Date(),
        suggestions: ["View my bookings", "Modify a booking", "Cancel a reservation", "Booking policies"]
      };
    } else {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: "I understand you're looking for travel assistance. Could you tell me more about what you're looking for? I can help with hotel recommendations, booking questions, or travel planning.",
        timestamp: new Date(),
        suggestions: ["Find hotels", "Travel tips", "Booking help", "Destination guides"]
      };
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const botResponse = generateBotResponse(inputValue);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 ${
          isOpen ? 'scale-0' : 'scale-100'
        }`}
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">AI Travel Assistant</h3>
                  <div className="flex items-center space-x-1 text-purple-100 text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Online</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                  <div
                    className={`p-3 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    
                    {/* Hotel Data */}
                    {message.data?.hotels && (
                      <div className="mt-3 space-y-2">
                        {message.data.hotels.map((hotel: any, index: number) => (
                          <div key={index} className="bg-white/10 rounded-lg p-2">
                            <div className="font-medium">{hotel.name}</div>
                            <div className="text-xs opacity-90">
                              ${hotel.price}/night • {hotel.rating}★
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Deals Data */}
                    {message.data?.deals && (
                      <div className="mt-3 space-y-2">
                        {message.data.deals.map((deal: any, index: number) => (
                          <div key={index} className="bg-white/10 rounded-lg p-2">
                            <div className="font-medium">{deal.location}</div>
                            <div className="text-xs opacity-90">
                              {deal.discount}% OFF • Save ${deal.savings}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Suggestions */}
                  {message.suggestions && (
                    <div className="mt-2 space-y-1">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="block w-full text-left text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 px-3 py-2 rounded-lg transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === 'user' ? 'order-1 ml-2 bg-primary-600' : 'order-2 mr-2 bg-gradient-to-r from-purple-500 to-pink-500'
                }`}>
                  {message.type === 'user' ? (
                    <User className="h-4 w-4 text-white" />
                  ) : (
                    <Bot className="h-4 w-4 text-white" />
                  )}
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl p-3">
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
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about travel..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Sparkles className="h-4 w-4 text-purple-500" />
                </div>
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-2 rounded-full hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;