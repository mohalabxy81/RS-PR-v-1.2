'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, MessageSquarePlus, Sparkles } from 'lucide-react';
import { AiMessageBubble } from '@/components/ai/AiMessageBubble';
import { AiMessage } from '@/lib/ai-store';
import { cn } from '@/lib/utils';

export default function AiChatPage() {
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessageContent = input;
    setInput('');
    const newMessage = {
      id: crypto.randomUUID(),
      role: 'user' as const,
      content: userMessageContent,
      createdAt: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, newMessage]);
    setIsTyping(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const token = localStorage.getItem('access_token');
      
      const res = await fetch(`${baseUrl}/api/v1/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: userMessageContent,
          conversationId: activeConversationId
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (!activeConversationId) {
          setActiveConversationId(data.conversationId);
        }
        setMessages(prev => [...prev, {
          id: data.messageId,
          role: 'assistant',
          content: data.content,
          createdAt: new Date().toISOString()
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'system',
        content: 'Error: Failed to connect to AI Copilot.',
        createdAt: new Date().toISOString()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const startNew = () => {
    setActiveConversationId(null);
    setMessages([]);
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col bg-[hsl(var(--surface))] border border-[hsl(var(--surface-border))] rounded-xl overflow-hidden shadow-sm">
      <div className="h-16 border-b border-[hsl(var(--surface-border))] flex items-center justify-between px-6 bg-[hsl(var(--background))]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[hsl(var(--brand)/0.1)] flex items-center justify-center text-[hsl(var(--brand))]">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="font-semibold">AI Copilot Chat</h2>
            <p className="text-xs text-[hsl(var(--foreground-muted))]">Full screen experience</p>
          </div>
        </div>
        <button onClick={startNew} className="btn-secondary flex items-center gap-2">
          <MessageSquarePlus size={16} /> New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-[hsl(var(--background-secondary))]">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto opacity-70">
            <Sparkles size={64} className="text-[hsl(var(--brand))] mb-6 opacity-50" />
            <h3 className="text-2xl font-semibold mb-2">Welcome to AI Copilot</h3>
            <p className="text-[hsl(var(--foreground-muted))]">
              Ask me to generate content, analyze data, or help you manage your real estate CRM.
            </p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto flex flex-col">
            {messages.map((msg) => (
              <AiMessageBubble key={msg.id} message={msg} />
            ))}
            {isTyping && (
              <div className="flex items-start mb-4">
                <div className="bg-[hsl(var(--surface))] border border-[hsl(var(--surface-border))] rounded-2xl rounded-bl-sm px-4 py-3 flex gap-2 items-center">
                  <Loader2 size={16} className="animate-spin text-[hsl(var(--brand))]" />
                  <span className="text-sm text-[hsl(var(--foreground-muted))]">Copilot is thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="p-4 bg-[hsl(var(--background))] border-t border-[hsl(var(--surface-border))]">
        <div className="max-w-3xl mx-auto relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type your message here..."
            className="w-full bg-[hsl(var(--surface))] border border-[hsl(var(--surface-border))] rounded-xl pl-4 pr-16 py-4 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand)/0.5)] resize-none shadow-sm"
            rows={3}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="absolute right-3 bottom-3 p-3 bg-[hsl(var(--brand))] text-white rounded-lg hover:bg-[hsl(var(--brand-hover))] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
          >
            <Send size={18} className={cn(isTyping && "opacity-0", !isTyping && "translate-x-[1px]")} />
            {isTyping && <Loader2 size={18} className="absolute top-3 left-3 animate-spin" />}
          </button>
        </div>
      </div>
    </div>
  );
}
