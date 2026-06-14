import React from 'react';
import { useAiContext } from '@/hooks/use-ai-context';
import { Sparkles, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AiContextBadge() {
  const { entityType, entityName, clearContext } = useAiContext();

  if (!entityType || !entityName) return null;

  return (
    <div className="flex items-center justify-between px-3 py-2 bg-[hsl(var(--brand)/0.1)] border-b border-[hsl(var(--brand)/0.2)]">
      <div className="flex items-center gap-2 overflow-hidden text-sm">
        <Sparkles size={14} className="text-[hsl(var(--brand))] flex-shrink-0" />
        <span className="text-[hsl(var(--foreground-muted))] whitespace-nowrap">Context:</span>
        <span className="font-medium text-[hsl(var(--brand))] truncate">{entityType} — {entityName}</span>
      </div>
      <button 
        onClick={clearContext}
        className="p-1 text-[hsl(var(--foreground-muted))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--surface))] rounded"
        title="Clear Context"
      >
        <X size={14} />
      </button>
    </div>
  );
}
