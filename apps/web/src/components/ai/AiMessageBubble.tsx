import React, { useState } from 'react';
import { AiMessage } from '@/lib/ai-store';
import { ThumbsUp, ThumbsDown, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AiMessageBubble({ message }: { message: AiMessage }) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<'positive' | 'negative' | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFeedback = async (isPositive: boolean) => {
    setFeedback(isPositive ? 'positive' : 'negative');
    // We would call the feedback API here
  };

  return (
    <div className={cn("flex flex-col mb-4", isUser ? "items-end" : "items-start")}>
      <div className={cn(
        "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
        isUser 
          ? "bg-[hsl(var(--brand))] text-white rounded-br-sm" 
          : "bg-[hsl(var(--surface))] border border-[hsl(var(--surface-border))] text-[hsl(var(--foreground))] rounded-bl-sm"
      )}>
        <div className="whitespace-pre-wrap">{message.content}</div>
      </div>
      
      {!isUser && (
        <div className="flex items-center gap-2 mt-1 ml-2 text-[hsl(var(--foreground-muted))]">
          <button 
            onClick={handleCopy}
            className="p-1 hover:text-[hsl(var(--foreground))] rounded transition-colors"
            title="Copy response"
          >
            {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
          </button>
          
          <div className="w-px h-3 bg-[hsl(var(--surface-border))]"></div>
          
          <button 
            onClick={() => handleFeedback(true)}
            className={cn("p-1 rounded transition-colors", feedback === 'positive' ? "text-green-500" : "hover:text-green-500")}
            title="Helpful"
          >
            <ThumbsUp size={14} />
          </button>
          <button 
            onClick={() => handleFeedback(false)}
            className={cn("p-1 rounded transition-colors", feedback === 'negative' ? "text-red-500" : "hover:text-red-500")}
            title="Not helpful"
          >
            <ThumbsDown size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
