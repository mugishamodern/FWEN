import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ScrollArea } from './ui/scroll-area';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export function AIChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your FWEN AI assistant. I can help you with route suggestions, parcel bookings, cost estimates, and tracking. How can I assist you today?",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');

  const quickActions = [
    'Calculate delivery cost',
    'Best route to Mbale',
    'Track my parcel',
    'Schedule last-mile delivery',
  ];

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputValue('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        text: generateAIResponse(inputValue),
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const generateAIResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('cost') || lowerInput.includes('price')) {
      return "I can help you calculate the delivery cost! The price depends on:\n• Distance between districts\n• Parcel weight and size\n• Delivery priority (Standard/Express/Urgent)\n\nFor example, a 5kg parcel from Kampala to Masaka costs approximately UGX 18,000 for standard delivery. Would you like a detailed quote?";
    }
    
    if (lowerInput.includes('route') || lowerInput.includes('mbale')) {
      return "For routes to Mbale:\n• From Kampala: 4-5 hours via Easy Bus (direct route)\n• From Jinja: 2-3 hours via Easy Bus\n\nI recommend the Kampala-Mbale route for best reliability. Morning departures (6-9 AM) have 15% faster delivery times. Would you like to book a delivery?";
    }
    
    if (lowerInput.includes('track')) {
      return "To track your parcel, please provide your tracking number (format: FWEN12345678). You can also go to the Track Shipment page and enter your tracking number there for real-time updates and map visualization.";
    }
    
    if (lowerInput.includes('last-mile') || lowerInput.includes('boda') || lowerInput.includes('taxi')) {
      return "Last-mile delivery connects bus terminals to doorsteps!\n• Boda Boda: UGX 5,000 (fast & affordable)\n• Taxi: UGX 15,000 (comfortable & safe)\n\nOur AI assigns the nearest available driver for optimal delivery time. Would you like to schedule a last-mile delivery?";
    }
    
    return "I understand you're asking about delivery services. I can help with:\n• Cost calculations\n• Route recommendations\n• Parcel tracking\n• Last-mile scheduling\n• Payment methods\n\nWhat would you like to know more about?";
  };

  const handleQuickAction = (action: string) => {
    setInputValue(action);
    handleSend();
  };

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="w-16 h-16 rounded-full bg-gradient-to-r from-[#660000] to-[#4d0000] hover:from-[#4d0000] hover:to-[#330000] shadow-lg"
              size="icon"
            >
              <MessageCircle className="h-6 w-6 text-[#DAA520]" />
            </Button>
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
              className="absolute -top-1 -right-1 w-4 h-4 bg-[#DAA520] rounded-full"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)]"
          >
            <Card className="border-[#660000] shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-[#660000] to-[#4d0000] text-white">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-[#DAA520]">
                    <Sparkles className="h-5 w-5" />
                    FWEN AI Assistant
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-[#4d0000]"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {/* Messages */}
                <ScrollArea className="h-[400px] p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-4 py-2 ${
                            message.sender === 'user'
                              ? 'bg-[#660000] text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-line">{message.text}</p>
                          <p
                            className={`text-xs mt-1 ${
                              message.sender === 'user' ? 'text-gray-300' : 'text-gray-500'
                            }`}
                          >
                            {message.timestamp.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Quick Actions */}
                {messages.length === 1 && (
                  <div className="px-4 py-2 border-t bg-gray-50">
                    <p className="text-xs text-gray-600 mb-2">Quick actions:</p>
                    <div className="flex flex-wrap gap-2">
                      {quickActions.map((action) => (
                        <Button
                          key={action}
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setInputValue(action);
                            setTimeout(handleSend, 100);
                          }}
                          className="text-xs"
                        >
                          {action}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ask me anything..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSend}
                      className="bg-[#660000] hover:bg-[#4d0000]"
                      size="icon"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
