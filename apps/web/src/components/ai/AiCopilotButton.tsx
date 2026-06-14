'use client';

import React from 'react';
import { useAiStore } from '@/lib/ai-store';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AiCopilotButton() {
  const { togglePanel, isOpen } = useAiStore();

  return (
    <button
      onClick={togglePanel}
      className={cn(
        "fixed bottom-6 right-6 p-4 rounded-full shadow-2xl z-40 transition-all duration-300 flex items-center justify-center group hover:scale-105",
        isOpen 
          ? "bg-[hsl(var(--surface))] text-[hsl(var(--foreground))] border border-[hsl(var(--surface-border))] opacity-0 pointer-events-none" 
          : "bg-gradient-to-tr from-[hsl(var(--brand))] to-indigo-500 text-white hover:shadow-[0_0_20px_rgba(var(--brand-rgb),0.4)]"
      )}
      title="Open AI Copilot"
    >
      <Sparkles size={24} className="group-hover:animate-pulse" />
      
      {/* Optional notification badge */}
      <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full animate-pulse"></span>
    </button>
  );
}
