'use client';

import React, { useState } from 'react';
import { Sparkles, Copy, Loader2, Check } from 'lucide-react';

interface Props {
  propertyId: string;
}

export function PropertyDescriptionGenerator({ propertyId }: Props) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Record<string, string> | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${baseUrl}/api/v1/ai/generate/property-description`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ propertyId, formats: ['professional', 'luxury', 'short', 'seo'] })
      });
      if (res.ok) {
        setResult(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="bg-[hsl(var(--surface))] border border-[hsl(var(--surface-border))] rounded-xl overflow-hidden">
      <div className="p-4 border-b border-[hsl(var(--surface-border))] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-[hsl(var(--brand))]" />
          <h3 className="font-semibold text-[hsl(var(--foreground))]">AI Description Generator</h3>
        </div>
        <button 
          onClick={handleGenerate}
          disabled={loading}
          className="btn-primary py-1.5 px-4 text-sm"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : 'Generate'}
        </button>
      </div>

      {result && (
        <div className="p-4 flex flex-col gap-4">
          {Object.entries(result).map(([format, text]) => (
            <div key={format} className="border border-[hsl(var(--surface-border))] rounded-lg overflow-hidden">
              <div className="bg-[hsl(var(--background))] px-3 py-2 border-b border-[hsl(var(--surface-border))] flex items-center justify-between">
                <span className="text-xs font-semibold uppercase text-[hsl(var(--foreground-muted))]">{format} Format</span>
                <button 
                  onClick={() => handleCopy(format, text as string)}
                  className="text-[hsl(var(--foreground-muted))] hover:text-[hsl(var(--foreground))] transition-colors"
                >
                  {copiedKey === format ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                </button>
              </div>
              <div className="p-3 text-sm leading-relaxed text-[hsl(var(--foreground))]">
                {text as string}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
