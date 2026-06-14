'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Cpu, DollarSign, Loader2 } from 'lucide-react';

export default function AiAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const res = await fetch(`${baseUrl}/api/v1/ai/analytics?days=30`, {
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
    fetchAnalytics();
  }, []);

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-[hsl(var(--brand))]" /></div>;
  if (!data) return <div>Failed to load analytics.</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="text-indigo-500" />
          AI Usage Analytics
        </h1>
        <p className="text-[hsl(var(--foreground-muted))] mt-1">Monitor your 30-day AI consumption and costs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[hsl(var(--surface))] border border-[hsl(var(--surface-border))] p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-2 text-[hsl(var(--foreground-muted))]">
            <TrendingUp size={18} /> <h3 className="font-medium">Total Requests</h3>
          </div>
          <div className="text-3xl font-bold">{data.summary.totalRequests.toLocaleString()}</div>
        </div>

        <div className="bg-[hsl(var(--surface))] border border-[hsl(var(--surface-border))] p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-2 text-[hsl(var(--foreground-muted))]">
            <Cpu size={18} /> <h3 className="font-medium">Total Tokens</h3>
          </div>
          <div className="text-3xl font-bold">{data.summary.totalTokens.toLocaleString()}</div>
          <div className="text-xs text-[hsl(var(--foreground-muted))] mt-1">In: {data.summary.inputTokens} | Out: {data.summary.outputTokens}</div>
        </div>

        <div className="bg-[hsl(var(--surface))] border border-[hsl(var(--surface-border))] p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-2 text-[hsl(var(--foreground-muted))]">
            <DollarSign size={18} /> <h3 className="font-medium">Estimated Cost</h3>
          </div>
          <div className="text-3xl font-bold">${data.summary.estimatedCost.toFixed(2)}</div>
        </div>

        <div className="bg-[hsl(var(--surface))] border border-[hsl(var(--surface-border))] p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-2 text-[hsl(var(--foreground-muted))]">
            <BarChart3 size={18} /> <h3 className="font-medium">Satisfaction</h3>
          </div>
          <div className="text-3xl font-bold text-green-500">{data.summary.satisfactionRate ? `${data.summary.satisfactionRate}%` : 'N/A'}</div>
          <div className="text-xs text-[hsl(var(--foreground-muted))] mt-1">{data.feedback.total} feedback responses</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[hsl(var(--surface))] border border-[hsl(var(--surface-border))] rounded-xl p-6">
          <h3 className="font-semibold text-lg mb-4">Usage by Feature</h3>
          <div className="space-y-4">
            {data.featureBreakdown.map((f: any) => (
              <div key={f.feature}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{f.feature}</span>
                  <span className="font-mono text-[hsl(var(--foreground-muted))]">{f.requests} req</span>
                </div>
                <div className="w-full bg-[hsl(var(--background-secondary))] rounded-full h-2">
                  <div 
                    className="bg-indigo-500 h-2 rounded-full" 
                    style={{ width: `${Math.max(5, (f.requests / data.summary.totalRequests) * 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
