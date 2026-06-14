'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, AlertTriangle, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { apiHelpers } from '@/lib/api';

interface LeadScoreData {
  score: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  likelihoodToClose: 'HIGH' | 'MEDIUM' | 'LOW';
  reasons: string[];
  recommendedActions: string[];
  urgency: 'IMMEDIATE' | 'THIS_WEEK' | 'THIS_MONTH' | 'NURTURE';
}

export function LeadScoreCard({ leadId }: { leadId: string }) {
  const [data, setData] = useState<LeadScoreData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const res = await fetch(`${baseUrl}/api/v1/ai/score/lead/${leadId}`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          setData(await res.json());
        }
      } catch (e) {
        console.error('Failed to fetch lead score', e);
      } finally {
        setLoading(false);
      }
    };
    
    fetchScore();
  }, [leadId]);

  if (loading) {
    return (
      <div className="bg-[hsl(var(--surface))] border border-[hsl(var(--surface-border))] rounded-xl p-6 flex items-center justify-center min-h-[200px]">
        <Loader2 className="animate-spin text-[hsl(var(--brand))]" size={24} />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="bg-[hsl(var(--surface))] border border-[hsl(var(--surface-border))] rounded-xl overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[hsl(var(--brand))] to-indigo-500"></div>
      
      <div className="p-5 border-b border-[hsl(var(--surface-border))] flex items-center justify-between">
        <div className="flex items-center gap-2 text-[hsl(var(--brand))]">
          <Sparkles size={18} />
          <h3 className="font-semibold text-lg text-[hsl(var(--foreground))]">AI Lead Score</h3>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-[hsl(var(--foreground-muted))]">Probability</div>
            <div className="font-bold text-[hsl(var(--foreground))]">{data.likelihoodToClose}</div>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-[hsl(var(--brand))] flex items-center justify-center font-bold text-xl text-[hsl(var(--brand))] relative">
            <div className="absolute inset-0 rounded-full border-4 border-[hsl(var(--brand)/0.2)]"></div>
            {data.score}
          </div>
        </div>
      </div>

      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-semibold text-[hsl(var(--foreground-muted))] uppercase tracking-wider mb-3 flex items-center gap-2">
            <TrendingUp size={16} /> Why this score?
          </h4>
          <ul className="space-y-2">
            {data.reasons.map((reason, i) => (
              <li key={i} className="text-sm text-[hsl(var(--foreground))] flex items-start gap-2">
                <span className="text-[hsl(var(--brand))] mt-0.5">•</span>
                {reason}
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4 className="text-sm font-semibold text-[hsl(var(--foreground-muted))] uppercase tracking-wider mb-3 flex items-center gap-2">
            <AlertTriangle size={16} /> Recommended Actions
          </h4>
          <ul className="space-y-3">
            {data.recommendedActions.map((action, i) => (
              <li key={i} className="text-sm bg-[hsl(var(--background))] border border-[hsl(var(--surface-border))] rounded-lg p-2 flex items-center justify-between group cursor-pointer hover:border-[hsl(var(--brand)/0.5)] transition-colors">
                <span className="text-[hsl(var(--foreground))]">{action}</span>
                <ChevronRight size={16} className="text-[hsl(var(--foreground-muted))] group-hover:text-[hsl(var(--brand))] transition-colors" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
