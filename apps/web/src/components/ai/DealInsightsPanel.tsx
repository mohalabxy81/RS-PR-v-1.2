'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, AlertCircle, TrendingUp, CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  dealId: string;
}

export function DealInsightsPanel({ dealId }: Props) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const res = await fetch(`${baseUrl}/api/v1/ai/insights/deal/${dealId}`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          setData(await res.json());
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, [dealId]);

  if (loading) {
    return (
      <div className="bg-[hsl(var(--surface))] border border-[hsl(var(--surface-border))] rounded-xl p-6 flex items-center justify-center min-h-[150px]">
        <Loader2 className="animate-spin text-[hsl(var(--brand))]" size={24} />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="bg-[hsl(var(--surface))] border border-[hsl(var(--surface-border))] rounded-xl overflow-hidden">
      <div className="p-4 border-b border-[hsl(var(--surface-border))] bg-[hsl(var(--background))] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-[hsl(var(--brand))]" />
          <h3 className="font-semibold text-[hsl(var(--foreground))]">AI Deal Analysis</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[hsl(var(--foreground-muted))]">Probability</span>
          <div className="bg-[hsl(var(--background-secondary))] px-2 py-1 rounded text-sm font-bold text-[hsl(var(--brand))]">
            {data.probabilityToClose}%
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <p className="text-sm text-[hsl(var(--foreground))] mb-4 leading-relaxed">{data.summary}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-semibold text-[hsl(var(--foreground-muted))] uppercase mb-2 flex items-center gap-1">
                <AlertCircle size={14} className="text-amber-500" /> Risks
              </h4>
              <ul className="space-y-1">
                {data.risks?.map((r: string, i: number) => (
                  <li key={i} className="text-sm text-[hsl(var(--foreground))] bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20">{r}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-[hsl(var(--foreground-muted))] uppercase mb-2 flex items-center gap-1">
                <CheckCircle2 size={14} className="text-blue-500" /> Missing Info
              </h4>
              <ul className="space-y-1">
                {data.missingInformation?.map((m: string, i: number) => (
                  <li key={i} className="text-sm text-[hsl(var(--foreground))] pl-4 relative before:absolute before:left-1 before:top-2 before:w-1.5 before:h-1.5 before:bg-[hsl(var(--foreground-muted))] before:rounded-full">{m}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div>
            <h4 className="text-xs font-semibold text-[hsl(var(--foreground-muted))] uppercase mb-2 flex items-center gap-1">
              <TrendingUp size={14} className="text-green-500" /> Recommended Actions
            </h4>
            <div className="space-y-2">
              {data.actionRecommendations?.map((a: string, i: number) => (
                <div key={i} className="text-sm bg-[hsl(var(--background))] border border-[hsl(var(--surface-border))] p-3 rounded-lg shadow-sm">
                  <span className="font-semibold text-[hsl(var(--brand))] mr-2">#{i+1}</span>
                  {a}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
