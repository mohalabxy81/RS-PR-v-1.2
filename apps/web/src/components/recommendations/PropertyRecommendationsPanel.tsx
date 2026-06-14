import React from 'react';
import { Sparkles, Home, Building, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface PropertyRecommendationsPanelProps {
  leadId: string;
}

// Mock Data for MVP
const RECOMMENDATIONS = [
  { id: 'prop-1', name: 'Marina Luxury Villa', type: 'Villa', price: '$2,500,000', score: 98, reason: 'Exact match for budget and location. High intent.' },
  { id: 'prop-2', name: 'Downtown Penthouse', type: 'Apartment', price: '$1,800,000', score: 85, reason: 'Alternative option based on similar saved properties.' },
];

export function PropertyRecommendationsPanel({ leadId }: PropertyRecommendationsPanelProps) {
  return (
    <div className="card p-5 border-l-4 border-l-purple-500 bg-gradient-to-br from-white to-purple-50/30">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-600" /> 
          AI Recommended Properties
        </h3>
        <span className="text-[10px] uppercase font-bold tracking-wider text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">
          Vector Match
        </span>
      </div>

      <div className="space-y-3">
        {RECOMMENDATIONS.map((prop) => (
          <div key={prop.id} className="p-3 rounded-lg border border-purple-100 bg-white hover:border-purple-300 transition-colors group cursor-pointer">
            <div className="flex justify-between items-start mb-1">
              <div className="flex items-center gap-2">
                {prop.type === 'Villa' ? <Home size={14} className="text-zinc-500"/> : <Building size={14} className="text-zinc-500"/>}
                <span className="text-sm font-semibold text-zinc-900">{prop.name}</span>
              </div>
              <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-none">
                {prop.score}% Match
              </Badge>
            </div>
            <div className="text-xs font-medium text-zinc-700 mb-2">{prop.price}</div>
            
            <div className="flex items-start gap-1.5 p-2 bg-purple-50/50 rounded text-xs text-zinc-600">
              <CheckCircle2 size={12} className="text-purple-500 mt-0.5 shrink-0" />
              <span>{prop.reason}</span>
            </div>
            
            <button className="mt-3 w-full text-xs font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 py-1.5 rounded transition-colors flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
              Send via WhatsApp <ChevronRight size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
