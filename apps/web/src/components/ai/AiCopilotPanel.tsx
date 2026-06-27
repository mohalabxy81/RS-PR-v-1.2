'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useAiStore } from '@/lib/ai-store';
import { useAiContext } from '@/hooks/use-ai-context';
import { AiMessageBubble } from './AiMessageBubble';
import { AiContextBadge } from './AiContextBadge';
import { X, Send, Sparkles, Loader2, MessageSquarePlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { apiHelpers } from '@/lib/api';

export function AiCopilotPanel() {
  const { isOpen, setIsOpen, messages, addMessage, isTyping, setIsTyping, activeConversationId, setActiveConversationId } = useAiStore();
  const { entityType, entityId } = useAiContext();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessageContent = input;
    setInput('');
    addMessage({
      id: crypto.randomUUID(),
      role: 'user',
      content: userMessageContent,
      createdAt: new Date().toISOString()
    });
    
    setIsTyping(true);

    try {
      // Setup base URL
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
          conversationId: activeConversationId,
          contextType: entityType,
          contextId: entityId
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (!activeConversationId) {
          setActiveConversationId(data.conversationId);
        }
        addMessage({
          id: data.messageId,
          role: 'assistant',
          content: data.content,
          createdAt: new Date().toISOString()
        });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      addMessage({
        id: crypto.randomUUID(),
        role: 'system',
        content: 'Error: Failed to connect to AI Copilot. Please try again.',
        createdAt: new Date().toISOString()
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleNewConversation = () => {
    setActiveConversationId(null);
    useAiStore.getState().setMessages([]);
  };

  return (
    <div className="fixed top-0 right-0 bottom-0 w-[400px] bg-[hsl(var(--background))] border-l border-[hsl(var(--surface-border))] shadow-2xl z-50 flex flex-col transform transition-transform duration-300">
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[hsl(var(--surface-border))] bg-[hsl(var(--surface))]">
        <div className="flex items-center gap-2 text-[hsl(var(--brand))]">
          <Sparkles size={20} />
          <span className="font-semibold text-lg">AI Copilot</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleNewConversation}
            className="p-2 text-[hsl(var(--foreground-muted))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--surface-hover))] rounded-full transition-colors"
            title="New Conversation"
          >
            <MessageSquarePlus size={18} />
          </button>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 text-[hsl(var(--foreground-muted))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--surface-hover))] rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Context Badge */}
      <AiContextBadge />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-[hsl(var(--background))]">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-6 opacity-60">
            <Sparkles size={48} className="text-[hsl(var(--brand))] mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">How can I help you today?</h3>
            <p className="text-sm text-[hsl(var(--foreground-muted))]">
              I can analyze leads, write property descriptions, summarize deals, and answer questions about your data.
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            {messages.map((msg) => (
              <AiMessageBubble key={msg.id} message={msg} />
            ))}
            {isTyping && (
              <div className="flex items-start mb-4">
                <div className="bg-[hsl(var(--surface))] border border-[hsl(var(--surface-border))] rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1 items-center">
                  <Loader2 size={16} className="animate-spin text-[hsl(var(--brand))]" />
                  <span className="text-sm text-[hsl(var(--foreground-muted))] ml-2">Copilot is thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-[hsl(var(--surface-border))] bg-[hsl(var(--surface))]">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask Copilot anything..."
            className="w-full bg-[hsl(var(--background))] border border-[hsl(var(--surface-border))] rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand)/0.5)] resize-none"
            rows={2}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="absolute right-2 bottom-2 p-2 bg-[hsl(var(--brand))] text-white rounded-lg hover:bg-[hsl(var(--brand-hover))] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={16} className={cn(isTyping && "opacity-0", !isTyping && "translate-x-[1px]")} />
            {isTyping && <Loader2 size={16} className="absolute top-2 left-2 animate-spin" />}
          </button>
        </div>
        <div className="text-[10px] text-center text-[hsl(var(--foreground-muted))] mt-2">
          AI Copilot can make mistakes. Verify important information.
        </div>
      </div>
    </div>
  );
}
