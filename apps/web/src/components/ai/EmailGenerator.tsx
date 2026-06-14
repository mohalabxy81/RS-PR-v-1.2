'use client';

import React, { useState } from 'react';
import { Sparkles, Copy, Mail, Loader2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmailGeneratorProps {
  entityType: 'Lead' | 'Deal' | 'Customer';
  entityId: string;
}

export function EmailGenerator({ entityType, entityId }: EmailGeneratorProps) {
  const [type, setType] = useState('Follow Up');
  const [tone, setTone] = useState('Professional');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ subject: string; body: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${baseUrl}/api/v1/ai/generate/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ type, tone, entityType, entityId })
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

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(`Subject: ${result.subject}\n\n${result.body}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-[hsl(var(--surface))] border border-[hsl(var(--surface-border))] rounded-xl overflow-hidden">
      <div className="p-4 border-b border-[hsl(var(--surface-border))] bg-[hsl(var(--background))] flex items-center gap-2">
        <Sparkles size={18} className="text-[hsl(var(--brand))]" />
        <h3 className="font-semibold text-[hsl(var(--foreground))]">AI Email Generator</h3>
      </div>
      
      <div className="p-4 flex flex-wrap gap-4 border-b border-[hsl(var(--surface-border))]">
        <select 
          value={type} 
          onChange={(e) => setType(e.target.value)}
          className="input flex-1 min-w-[150px] bg-[hsl(var(--background))]"
        >
          <option value="Follow Up">Follow Up</option>
          <option value="Meeting Request">Meeting Request</option>
          <option value="Property Recommendation">Property Recommendation</option>
          <option value="Check In">Check In</option>
          <option value="Thank You">Thank You</option>
        </select>
        
        <select 
          value={tone} 
          onChange={(e) => setTone(e.target.value)}
          className="input flex-1 min-w-[150px] bg-[hsl(var(--background))]"
        >
          <option value="Professional">Professional</option>
          <option value="Friendly">Friendly</option>
          <option value="Urgent">Urgent</option>
          <option value="Persuasive">Persuasive</option>
        </select>
        
        <button 
          onClick={handleGenerate}
          disabled={loading}
          className="btn-primary"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : 'Generate Draft'}
        </button>
      </div>

      {result && (
        <div className="p-4 bg-[hsl(var(--background-secondary))]">
          <div className="mb-4 flex items-center justify-between">
            <div className="font-medium">Subject: <span className="font-normal text-[hsl(var(--foreground-muted))]">{result.subject}</span></div>
            <button 
              onClick={handleCopy}
              className="text-[hsl(var(--foreground-muted))] hover:text-[hsl(var(--foreground))] transition-colors p-2 rounded hover:bg-[hsl(var(--surface))]"
            >
              {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
            </button>
          </div>
          <div className="bg-[hsl(var(--background))] p-4 rounded-lg border border-[hsl(var(--surface-border))] text-sm whitespace-pre-wrap leading-relaxed font-mono">
            {result.body}
          </div>
        </div>
      )}
    </div>
  );
}
