'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { FiMessageCircle, FiX, FiSend, FiUser, FiHeadphones, FiMinimize2 } from 'react-icons/fi';
import { useToast } from '@/components/Toast';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent' | 'system';
  timestamp: Date;
}

interface ChatWidgetProps {
  isOpen?: boolean;
  onClose?: () => void;
}

// Chat context to share state across components
import { createContext, useContext } from 'react';

interface ChatContextType {
  isOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  unreadCount: number;
}

const ChatContext = createContext<ChatContextType | null>(null);

export function useChatWidget() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatWidget must be used within a ChatProvider');
  }
  return context;
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const openChat = useCallback(() => {
    setIsOpen(true);
    setUnreadCount(0);
  }, []);

  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleChat = useCallback(() => {
    setIsOpen(prev => {
      if (!prev) setUnreadCount(0);
      return !prev;
    });
  }, []);

  return (
    <ChatContext.Provider value={{ isOpen, openChat, closeChat, toggleChat, unreadCount }}>
      {children}
    </ChatContext.Provider>
  );
}

// Floating chat launcher button
export function ChatLauncher() {
  const { isOpen, toggleChat, unreadCount } = useChatWidget();

  if (isOpen) return null;

  return (
    <button
      onClick={toggleChat}
      className="fixed bottom-24 right-6 z-40 bg-accent hover:bg-accent-light text-white p-4 rounded-full shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/40 transition-all duration-300 hover:scale-110 group"
      aria-label="Отворете чата за поддръжка"
    >
      <FiMessageCircle className="text-2xl group-hover:rotate-12 transition-transform duration-300" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
          {unreadCount}
        </span>
      )}
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-primary text-white text-sm px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        Нуждаете се от помощ?
      </span>
    </button>
  );
}

// Main chat widget/modal
export function ChatWindow() {
  const { isOpen, closeChat } = useChatWidget();
  const { showToast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Здравейте! 👋 Добре дошли в AURACASE поддръжка. Как можем да ви помогнем днес?',
      sender: 'agent',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [chatStarted, setChatStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && chatStarted) {
      inputRef.current?.focus();
    }
  }, [isOpen, chatStarted]);

  // Prevent body scroll when chat is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const startChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userEmail.trim()) return;

    setChatStarted(true);
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        text: `Благодарим, ${userName}! Свързваме ви с наш консултант...`,
        sender: 'system',
        timestamp: new Date(),
      },
    ]);

    // Simulate agent response after a delay
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: `Здравейте, ${userName}! Аз съм Мария от екипа за поддръжка. Как мога да ви помогна?`,
          sender: 'agent',
          timestamp: new Date(),
        },
      ]);
    }, 2000);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate sending to backend and getting response
    try {
      // In production, this would be an API call
      // await fetch('/api/chat', { method: 'POST', body: JSON.stringify({ message: userMessage.text, email: userEmail }) });
      
      // Simulate agent typing and response
      setTimeout(() => {
        setIsTyping(false);
        const responses = [
          'Разбирам ви напълно. Нека проверя това за вас.',
          'Благодаря за информацията! Работя по вашия въпрос.',
          'Това е отличен въпрос! Ще ви помогна веднага.',
          'Моля, изчакайте момент докато проверя детайлите.',
          'Благодаря за търпението ви. Ето какво открих...',
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        setMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            text: randomResponse,
            sender: 'agent',
            timestamp: new Date(),
          },
        ]);
      }, 1500 + Math.random() * 1500);
    } catch {
      setIsTyping(false);
      showToast('Грешка при изпращане на съобщението. Моля, опитайте отново.', 'error');
    }
  };

  const handleOfflineSubmit = async () => {
    if (!userName.trim() || !userEmail.trim()) {
      showToast('Моля, попълнете име и имейл.', 'error');
      return;
    }

    const chatHistory = messages.map(m => `[${m.sender}]: ${m.text}`).join('\n');
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userName,
          email: userEmail,
          subject: 'Чат запитване',
          message: `Чат история:\n\n${chatHistory}`,
        }),
      });

      if (response.ok) {
        showToast('Съобщението е изпратено! Ще се свържем с вас скоро.', 'success');
        closeChat();
      } else {
        throw new Error('Failed to send');
      }
    } catch {
      showToast('Грешка при изпращане. Моля, опитайте отново.', 'error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm sm:bg-transparent sm:backdrop-blur-none"
        onClick={closeChat}
      />
      
      {/* Chat window */}
      <div className="relative w-full max-w-md h-[600px] max-h-[85vh] bg-background-secondary rounded-2xl shadow-2xl shadow-black/50 flex flex-col overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-accent to-accent-light p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-full">
              <FiHeadphones className="text-white text-xl" />
            </div>
            <div>
              <h3 className="text-white font-bold">AURACASE Поддръжка</h3>
              <p className="text-white/80 text-sm flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                Онлайн
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={closeChat}
              className="text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Минимизирай чата"
            >
              <FiMinimize2 className="text-xl" />
            </button>
            <button
              onClick={closeChat}
              className="text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Затвори чата"
            >
              <FiX className="text-xl" />
            </button>
          </div>
        </div>

        {/* Chat content */}
        {!chatStarted ? (
          /* Pre-chat form */
          <div className="flex-1 p-6 flex flex-col justify-center">
            <div className="text-center mb-6">
              <div className="bg-accent/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiMessageCircle className="text-accent text-3xl" />
              </div>
              <h4 className="text-white text-xl font-bold mb-2">Започнете чат</h4>
              <p className="text-gray-400 text-sm">
                Моля, въведете вашите данни за да се свържете с нашия екип.
              </p>
            </div>
            <form onSubmit={startChat} className="space-y-4">
              <div>
                <label htmlFor="chat-name" className="block text-gray-300 text-sm mb-1">
                  Вашето име
                </label>
                <input
                  id="chat-name"
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Иван Иванов"
                  className="w-full bg-primary border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors"
                  required
                />
              </div>
              <div>
                <label htmlFor="chat-email" className="block text-gray-300 text-sm mb-1">
                  Имейл адрес
                </label>
                <input
                  id="chat-email"
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="ivan@example.com"
                  className="w-full bg-primary border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-accent hover:bg-accent-light text-white py-3 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center space-x-2"
              >
                <FiMessageCircle />
                <span>Започнете чат</span>
              </button>
            </form>
          </div>
        ) : (
          <>
            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.sender === 'user'
                        ? 'bg-accent text-white rounded-br-md'
                        : message.sender === 'system'
                        ? 'bg-gray-700 text-gray-300 text-sm italic'
                        : 'bg-primary text-white rounded-bl-md'
                    }`}
                  >
                    {message.sender === 'agent' && (
                      <div className="flex items-center space-x-2 mb-1">
                        <FiHeadphones className="text-accent text-sm" />
                        <span className="text-accent text-xs font-medium">Поддръжка</span>
                      </div>
                    )}
                    {message.sender === 'user' && (
                      <div className="flex items-center justify-end space-x-2 mb-1">
                        <span className="text-white/70 text-xs font-medium">Вие</span>
                        <FiUser className="text-white/70 text-sm" />
                      </div>
                    )}
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-white/60' : 'text-gray-500'}`}>
                      {message.timestamp.toLocaleTimeString('bg-BG', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-primary rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex space-x-1">
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="p-4 border-t border-gray-700">
              <form onSubmit={sendMessage} className="flex items-center space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Напишете съобщение..."
                  className="flex-1 bg-primary border border-gray-600 rounded-full px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="bg-accent hover:bg-accent-light disabled:bg-gray-600 disabled:cursor-not-allowed text-white p-3 rounded-full transition-colors duration-300"
                  aria-label="Изпратете съобщение"
                >
                  <FiSend className="text-lg" />
                </button>
              </form>
              <div className="mt-3 text-center">
                <button
                  onClick={handleOfflineSubmit}
                  className="text-gray-500 hover:text-accent text-xs transition-colors"
                >
                  Изпратете като имейл вместо това
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

// Combined widget export for easy use
export default function ChatWidget() {
  return (
    <>
      <ChatLauncher />
      <ChatWindow />
    </>
  );
}
