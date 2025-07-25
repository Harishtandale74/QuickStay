import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User, Sparkles, MapPin, Calendar, DollarSign, Minimize2, Maximize2 } from 'lucide-react';

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
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Namaste! 🙏 I'm your AI travel assistant for Nagpur. I can help you find the perfect hotel, plan your trip, or answer questions about the Orange City. How can I assist you today?",
      timestamp: new Date(),
      suggestions: [
        "Find hotels in Sitabuldi",
        "Best time to visit Nagpur",
        "Local attractions",
        "Nagpur weather today"
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
    
    // Nagpur-specific responses
    if (lowerMessage.includes('nagpur') || lowerMessage.includes('orange city')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: "Nagpur is the Orange City of India! 🍊 It's famous for its oranges, rich history, and central location. I can help you find great hotels in areas like Sitabuldi, Civil Lines, or Dharampeth. What specific area interests you?",
        timestamp: new Date(),
        suggestions: ["Hotels in Sitabuldi", "Civil Lines area", "Dharampeth hotels", "Near airport"]
      };
    } else if (lowerMessage.includes('sitabuldi')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: "Sitabuldi is the heart of Nagpur! 🏛️ It's the main commercial area with great shopping, restaurants, and the famous Sitabuldi Fort. I found some excellent hotels here with easy access to major attractions.",
        timestamp: new Date(),
        data: {
          hotels: [
            { name: "The Pride Hotel Nagpur", price: 3200, rating: 4.5, area: "Sitabuldi" },
            { name: "Hotel Centre Point", price: 2800, rating: 4.3, area: "Sitabuldi" }
          ]
        },
        suggestions: ["Show more Sitabuldi hotels", "Sitabuldi attractions", "Restaurants nearby"]
      };
    } else if (lowerMessage.includes('weather') || lowerMessage.includes('temperature')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: "Nagpur has a tropical climate! 🌤️ Currently it's around 28°C with pleasant weather. Winter (Oct-Feb) is the best time to visit with temperatures between 10-30°C. Summer can get quite hot (up to 45°C).",
        timestamp: new Date(),
        suggestions: ["Best time to visit", "What to pack", "Indoor attractions", "Weather forecast"]
      };
    } else if (lowerMessage.includes('attractions') || lowerMessage.includes('places') || lowerMessage.includes('visit')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: "Nagpur has amazing attractions! 🏛️ Must-visit places include Deekshabhoomi (Buddhist monument), Ambazari Lake, Sitabuldi Fort, and Raman Science Centre. Each offers unique experiences!",
        timestamp: new Date(),
        data: {
          attractions: [
            { name: "Deekshabhoomi", type: "Religious", rating: 4.8 },
            { name: "Ambazari Lake", type: "Nature", rating: 4.5 },
            { name: "Sitabuldi Fort", type: "Historical", rating: 4.3 }
          ]
        },
        suggestions: ["Religious sites", "Nature spots", "Historical places", "Family attractions"]
      };
    } else if (lowerMessage.includes('food') || lowerMessage.includes('restaurant') || lowerMessage.includes('eat')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: "Nagpur's food scene is incredible! 🍛 You must try the famous Saoji cuisine (spicy mutton curry), Tarri Poha (local breakfast), and of course, fresh Nagpur oranges! I can recommend the best restaurants.",
        timestamp: new Date(),
        data: {
          restaurants: [
            { name: "Saoji Bhojnalaya", cuisine: "Traditional Saoji", rating: 4.7 },
            { name: "Tarri Poha Center", cuisine: "Local Breakfast", rating: 4.5 }
          ]
        },
        suggestions: ["Saoji restaurants", "Local breakfast spots", "Orange-based dishes", "Vegetarian options"]
      };
    } else if (lowerMessage.includes('booking') || lowerMessage.includes('reservation') || lowerMessage.includes('book')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: "I can help you with hotel bookings! 🏨 Our platform offers instant confirmation, best price guarantee, and 24/7 support. What dates are you planning to visit Nagpur?",
        timestamp: new Date(),
        suggestions: ["Check availability", "Best deals", "Cancellation policy", "Payment options"]
      };
    } else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('budget')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: "Hotel prices in Nagpur vary by area and season! 💰 Budget hotels start from ₹1,000/night, mid-range from ₹2,500/night, and luxury hotels from ₹4,000/night. Winter season has higher rates due to peak tourism.",
        timestamp: new Date(),
        suggestions: ["Budget hotels", "Luxury options", "Best value deals", "Seasonal pricing"]
      };
    } else if (lowerMessage.includes('airport') || lowerMessage.includes('transport')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: "Nagpur has excellent connectivity! ✈️ Dr. Babasaheb Ambedkar International Airport is well-connected. For local transport, auto-rickshaws, taxis, and city buses are available. Metro is coming soon!",
        timestamp: new Date(),
        suggestions: ["Airport hotels", "City transport", "Taxi booking", "Metro updates"]
      };
    } else {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: "I'm here to help with your Nagpur travel needs! 🧳 I can assist with hotel recommendations, local attractions, food suggestions, weather updates, and booking assistance. What would you like to know about the Orange City?",
        timestamp: new Date(),
        suggestions: ["Find hotels", "Local attractions", "Food recommendations", "Weather info"]
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
        className={`fixed bottom-6 right-6 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 z-50 transform hover:scale-110 ${
          isOpen ? 'scale-0' : 'scale-100'
        }`}
      >
        <MessageCircle className="h-6 w-6" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed bottom-6 right-6 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 transition-all duration-300 ${
          isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
        } flex flex-col`}>
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Nagpur AI Assistant</h3>
                  <div className="flex items-center space-x-1 text-orange-100 text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Online • Speaks Hindi & English</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-white/80 hover:text-white transition-colors p-1"
                >
                  {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white transition-colors p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                      <div
                        className={`p-3 rounded-2xl ${
                          message.type === 'user'
                            ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                            : 'bg-white text-gray-900 shadow-md border border-gray-200'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        
                        {/* Hotel Data */}
                        {message.data?.hotels && (
                          <div className="mt-3 space-y-2">
                            {message.data.hotels.map((hotel: any, index: number) => (
                              <div key={index} className="bg-black/10 rounded-lg p-3">
                                <div className="font-medium">{hotel.name}</div>
                                <div className="text-xs opacity-90 flex items-center justify-between">
                                  <span>₹{hotel.price}/night • {hotel.rating}★</span>
                                  <span>{hotel.area}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Attractions Data */}
                        {message.data?.attractions && (
                          <div className="mt-3 space-y-2">
                            {message.data.attractions.map((attraction: any, index: number) => (
                              <div key={index} className="bg-black/10 rounded-lg p-3">
                                <div className="font-medium">{attraction.name}</div>
                                <div className="text-xs opacity-90">
                                  {attraction.type} • {attraction.rating}★
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Restaurants Data */}
                        {message.data?.restaurants && (
                          <div className="mt-3 space-y-2">
                            {message.data.restaurants.map((restaurant: any, index: number) => (
                              <div key={index} className="bg-black/10 rounded-lg p-3">
                                <div className="font-medium">{restaurant.name}</div>
                                <div className="text-xs opacity-90">
                                  {restaurant.cuisine} • {restaurant.rating}★
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
                              className="block w-full text-left text-xs bg-white hover:bg-orange-50 text-gray-700 hover:text-orange-700 px-3 py-2 rounded-lg transition-colors border border-gray-200 hover:border-orange-200"
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
                      message.type === 'user' ? 'order-1 ml-2 bg-gradient-to-r from-orange-500 to-red-600' : 'order-2 mr-2 bg-gradient-to-r from-orange-500 to-red-600'
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
                    <div className="bg-white rounded-2xl p-3 shadow-md border border-gray-200">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask about Nagpur hotels, attractions, food..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-10"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Sparkles className="h-4 w-4 text-orange-500" />
                    </div>
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white p-3 rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
                
                {/* Quick Actions */}
                <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                  <span>Powered by AI • Speaks Hindi & English</span>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span>Nagpur Specialist</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ChatBot;