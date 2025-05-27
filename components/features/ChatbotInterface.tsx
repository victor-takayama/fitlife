
import React, { useState, useEffect, useRef, useContext } from 'react';
import { ChatMessage } from '../../types';
import { createFitLifeChat, sendChatMessageStream, sendChatMessage } from '../../services/geminiService'; // sendChatMessage for non-stream
import { Chat as GeminiChat } from '@google/genai'; // Renamed to avoid conflict
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Send, User, Bot, CornerDownLeft } from 'lucide-react';
import LoadingSpinner from '../ui/LoadingSpinner';
import { AuthContext, AuthContextType } from '../../contexts/AuthContext';

interface ChatbotInterfaceProps {
  initialMessage?: string; // For specific contexts, e.g., "Help me with nutrition"
  onAiResponse?: (response: string) => void; // Callback for external handling of AI responses
  heightClass?: string; // e.g. 'h-[500px]'
  enableStreaming?: boolean; // Toggle streaming
}

const ChatbotInterface: React.FC<ChatbotInterfaceProps> = ({ initialMessage, onAiResponse, heightClass = 'h-[calc(100vh-200px)] md:h-[500px]', enableStreaming = true }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState<GeminiChat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useContext(AuthContext) as AuthContextType;

  useEffect(() => {
    const newChat = createFitLifeChat();
    setChatSession(newChat);

    const greetingMessage: ChatMessage = {
      id: 'system-greeting',
      text: `Olá ${user?.name || 'usuário'}! Eu sou seu assistente FitLife AI. Como posso te ajudar hoje? Você pode pedir um plano de treino, dicas de nutrição, ou apenas conversar sobre seus objetivos!`,
      sender: 'ai',
      timestamp: new Date(),
    };
    setMessages([greetingMessage]);

    if (initialMessage && newChat) {
      handleSendMessage(initialMessage, newChat); // Send initial message if provided
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialMessage, user]); // Rerun if initialMessage changes or user logs in/out

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (messageText?: string, currentChatSession?: GeminiChat | null) => {
    const textToSend = messageText || input;
    if (!textToSend.trim()) return;

    const currentSession = currentChatSession || chatSession;
    if (!currentSession) {
      // Handle case where chat session is not initialized (e.g., API key missing)
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        text: "Desculpe, não consigo me conectar ao serviço de IA no momento.",
        sender: 'system',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: textToSend,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    if (enableStreaming) {
      let aiResponseText = '';
      const aiMessageId = `ai-${Date.now()}`;
      // Add a placeholder for streaming AI message
      setMessages(prev => [...prev, { id: aiMessageId, text: '', sender: 'ai', timestamp: new Date(), isLoading: true }]);

      await sendChatMessageStream(currentSession, textToSend, (chunk) => {
        aiResponseText += chunk;
        setMessages(prev => prev.map(msg => 
          msg.id === aiMessageId ? { ...msg, text: aiResponseText, isLoading: true } : msg
        ));
      });
      // Finalize AI message
      setMessages(prev => prev.map(msg => 
        msg.id === aiMessageId ? { ...msg, text: aiResponseText, isLoading: false, timestamp: new Date() } : msg
      ));
      if (onAiResponse) onAiResponse(aiResponseText);

    } else {
      // Non-streaming version
      const aiResponseMessage = await sendChatMessage(currentSession, textToSend);
      setMessages(prev => [...prev, aiResponseMessage]);
      if (onAiResponse) onAiResponse(aiResponseMessage.text);
    }

    setIsLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  return (
    <div className={`flex flex-col bg-white dark:bg-slate-800 shadow-xl rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 ${heightClass}`}>
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-neutral-dark dark:text-white flex items-center">
          <Bot size={22} className="mr-2 text-primary" /> FitLife AI Coach
        </h3>
      </div>
      <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-800/50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-xl shadow ${
              msg.sender === 'user' 
                ? 'bg-primary text-white rounded-br-none' 
                : 'bg-white dark:bg-slate-700 text-neutral-dark dark:text-neutral-light rounded-bl-none'
            } ${msg.sender === 'system' ? '!bg-amber-100 dark:!bg-amber-800 !text-amber-700 dark:!text-amber-200' : ''}`}>
              <div className="flex items-center mb-1">
                {msg.sender === 'ai' && <Bot size={16} className="mr-2 text-primary" />}
                {msg.sender === 'user' && <User size={16} className="mr-2 text-white" />}
                <span className="text-xs opacity-75">
                  {msg.sender === 'user' ? (user?.name || 'Você') : (msg.sender === 'system' ? 'Sistema' : 'FitLife AI')} - {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              {msg.isLoading && msg.sender === 'ai' && msg.text === '' ? (
                 <LoadingSpinner size="sm" color="text-primary dark:text-primary-light" />
              ) : (
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              )}
               {msg.isLoading && msg.sender === 'ai' && msg.text !== '' && enableStreaming && (
                 <span className="inline-block w-2 h-2 bg-primary dark:bg-primary-light rounded-full animate-pulse ml-1"></span>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-grow !py-2"
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()} aria-label="Enviar mensagem">
            {isLoading ? <LoadingSpinner size="sm" color="text-white" /> : <Send size={20} />}
          </Button>
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 text-right">Pressione Shift+Enter para nova linha.</p>
      </form>
    </div>
  );
};

export default ChatbotInterface;
    