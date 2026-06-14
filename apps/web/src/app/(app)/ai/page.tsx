'use client';

import React from 'react';
import { Sparkles, MessageSquare, Settings, BarChart3, Database } from 'lucide-react';
import Link from 'next/link';

export default function AiDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="text-[hsl(var(--brand))]" />
          AI Copilot Hub
        </h1>
        <p className="text-[hsl(var(--foreground-muted))] mt-1">Manage and monitor your AI features.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/ai/chat" className="bg-[hsl(var(--surface))] border border-[hsl(var(--surface-border))] p-6 rounded-xl hover:border-[hsl(var(--brand)/0.5)] hover:shadow-lg transition-all group">
          <div className="w-12 h-12 rounded-lg bg-[hsl(var(--brand)/0.1)] text-[hsl(var(--brand))] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <MessageSquare size={24} />
          </div>
          <h3 className="font-semibold text-lg mb-1">Full-Screen Chat</h3>
          <p className="text-sm text-[hsl(var(--foreground-muted))]">Access the AI Copilot in a dedicated full-screen interface.</p>
        </Link>

        <Link href="/ai/analytics" className="bg-[hsl(var(--surface))] border border-[hsl(var(--surface-border))] p-6 rounded-xl hover:border-[hsl(var(--brand)/0.5)] hover:shadow-lg transition-all group">
          <div className="w-12 h-12 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <BarChart3 size={24} />
          </div>
          <h3 className="font-semibold text-lg mb-1">Usage Analytics</h3>
          <p className="text-sm text-[hsl(var(--foreground-muted))]">Monitor token usage, request volume, and estimated costs.</p>
        </Link>

        <Link href="/ai/prompts" className="bg-[hsl(var(--surface))] border border-[hsl(var(--surface-border))] p-6 rounded-xl hover:border-[hsl(var(--brand)/0.5)] hover:shadow-lg transition-all group">
          <div className="w-12 h-12 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Settings size={24} />
          </div>
          <h3 className="font-semibold text-lg mb-1">Prompt Library</h3>
          <p className="text-sm text-[hsl(var(--foreground-muted))]">Manage system prompts and customize AI behavior.</p>
        </Link>

        <div className="bg-[hsl(var(--surface))] border border-[hsl(var(--surface-border))] p-6 rounded-xl opacity-60 cursor-not-allowed">
          <div className="w-12 h-12 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4">
            <Database size={24} />
          </div>
          <h3 className="font-semibold text-lg mb-1">Knowledge Base</h3>
          <p className="text-sm text-[hsl(var(--foreground-muted))]">Manage embedded documents and training data. (Coming soon)</p>
        </div>
      </div>
      
      <div className="bg-[hsl(var(--surface))] border border-[hsl(var(--surface-border))] rounded-xl p-6 mt-8">
        <h2 className="text-lg font-semibold mb-4">Getting Started with AI</h2>
        <div className="space-y-4">
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-[hsl(var(--background-secondary))] flex items-center justify-center font-bold text-[hsl(var(--brand))] shrink-0">1</div>
            <div>
              <h4 className="font-medium">Use the Floating Copilot</h4>
              <p className="text-sm text-[hsl(var(--foreground-muted))] mt-1">Click the sparkles icon in the bottom right corner of any page to open the AI assistant. It automatically knows what you're looking at.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-[hsl(var(--background-secondary))] flex items-center justify-center font-bold text-[hsl(var(--brand))] shrink-0">2</div>
            <div>
              <h4 className="font-medium">Generate Content</h4>
              <p className="text-sm text-[hsl(var(--foreground-muted))] mt-1">Look for AI buttons on properties and leads to instantly generate descriptions, emails, and WhatsApp messages.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-[hsl(var(--background-secondary))] flex items-center justify-center font-bold text-[hsl(var(--brand))] shrink-0">3</div>
            <div>
              <h4 className="font-medium">Review Insights</h4>
              <p className="text-sm text-[hsl(var(--foreground-muted))] mt-1">Check the AI insights panels on Deals and Customers to identify risks and get recommendations for next steps.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
