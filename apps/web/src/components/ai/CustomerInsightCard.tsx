'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, UserCheck, Search, Loader2 } from 'lucide-react';

interface Props {
  customerId: string;
}

export function CustomerInsightCard({ customerId }: Props) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const res = await fetch(`${baseUrl}/api/v1/ai/insights/customer/${customerId}`, {
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
  }, [customerId]);

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
          <h3 className="font-semibold text-[hsl(var(--foreground))]">AI Customer Insights</h3>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 bg-[hsl(var(--background))] border border-[hsl(var(--surface-border))] p-3 rounded-lg text-center">
            <div className="text-xs text-[hsl(var(--foreground-muted))] uppercase mb-1">Buying Intent</div>
            <div className="font-bold text-[hsl(var(--foreground))]">{data.buyingIntent}</div>
          </div>
          <div className="flex-1 bg-[hsl(var(--background))] border border-[hsl(var(--surface-border))] p-3 rounded-lg text-center">
            <div className="text-xs text-[hsl(var(--foreground-muted))] uppercase mb-1">Interest Level</div>
            <div className="font-bold text-[hsl(var(--brand))]">{data.interestLevel?.replace('_', ' ')}</div>
          </div>
        </div>

        <p className="text-sm text-[hsl(var(--foreground))] mb-4 leading-relaxed">{data.summary}</p>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-xs font-semibold text-[hsl(var(--foreground-muted))] uppercase mb-2 flex items-center gap-1">
              <Search size={14} /> Suggested Properties
            </h4>
            <div className="flex flex-wrap gap-2">
              {data.suggestedPropertyTypes?.map((pt: string, i: number) => (
                <span key={i} className="text-xs bg-[hsl(var(--brand)/0.1)] text-[hsl(var(--brand))] px-2 py-1 rounded-full border border-[hsl(var(--brand)/0.2)]">
                  {pt}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-[hsl(var(--foreground-muted))] uppercase mb-2 flex items-center gap-1">
              <UserCheck size={14} /> Next Best Action
            </h4>
            <div className="text-sm bg-[hsl(var(--background))] border-l-4 border-[hsl(var(--brand))] p-3 rounded shadow-sm">
              {data.nextBestAction}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
