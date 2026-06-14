'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Plus, Edit2, CheckCircle2, Loader2 } from 'lucide-react';
import { apiHelpers } from '@/lib/api';

export default function AiPromptsPage() {
  const [prompts, setPrompts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);
  const [newContent, setNewContent] = useState('');

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${baseUrl}/api/v1/ai/admin/prompts`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setPrompts(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveVersion = async () => {
    if (!editing) return;
    try {
      const token = localStorage.getItem('access_token');
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${baseUrl}/api/v1/ai/admin/prompts/${editing.id}/versions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ content: newContent })
      });
      if (res.ok) {
        setEditing(null);
        fetchPrompts();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleActivate = async (promptId: string, versionId: string) => {
    try {
      const token = localStorage.getItem('access_token');
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      await fetch(`${baseUrl}/api/v1/ai/admin/prompts/${promptId}/versions/${versionId}/activate`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchPrompts();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-[hsl(var(--brand))]" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="text-[hsl(var(--brand))]" />
            Prompt Library
          </h1>
          <p className="text-[hsl(var(--foreground-muted))] mt-1">Manage system prompts and agent instructions.</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={16} /> New Prompt
        </button>
      </div>

      <div className="grid gap-6">
        {prompts.map(prompt => {
          const activeVersion = prompt.versions?.find((v: any) => v.isActive) || prompt.versions?.[0];
          const isEditing = editing?.id === prompt.id;

          return (
            <div key={prompt.id} className="bg-[hsl(var(--surface))] border border-[hsl(var(--surface-border))] rounded-xl overflow-hidden">
              <div className="p-4 border-b border-[hsl(var(--surface-border))] bg-[hsl(var(--background))] flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg">{prompt.name}</h3>
                  <div className="text-sm text-[hsl(var(--foreground-muted))] mt-1">Category: {prompt.category} | Active Version: {activeVersion?.version || 'None'}</div>
                </div>
                {!isEditing && (
                  <button onClick={() => { setEditing(prompt); setNewContent(activeVersion?.content || ''); }} className="btn-secondary flex items-center gap-2">
                    <Edit2 size={14} /> Edit Prompt
                  </button>
                )}
              </div>
              
              <div className="p-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <textarea 
                      value={newContent}
                      onChange={e => setNewContent(e.target.value)}
                      className="w-full h-48 bg-[hsl(var(--background))] border border-[hsl(var(--surface-border))] rounded-lg p-3 font-mono text-sm"
                    />
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => setEditing(null)} className="btn-secondary">Cancel</button>
                      <button onClick={handleSaveVersion} className="btn-primary">Save New Version</button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[hsl(var(--background-secondary))] border border-[hsl(var(--surface-border))] rounded-lg p-4 font-mono text-sm whitespace-pre-wrap max-h-60 overflow-y-auto">
                    {activeVersion?.content || 'No versions available.'}
                  </div>
                )}

                {!isEditing && prompt.versions?.length > 1 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-semibold mb-3">Version History</h4>
                    <div className="space-y-2">
                      {prompt.versions.map((v: any) => (
                        <div key={v.id} className="flex items-center justify-between p-3 bg-[hsl(var(--background))] border border-[hsl(var(--surface-border))] rounded-lg">
                          <div className="text-sm">Version {v.version} - {new Date(v.createdAt).toLocaleDateString()}</div>
                          {v.isActive ? (
                            <span className="flex items-center gap-1 text-sm text-green-500 font-medium"><CheckCircle2 size={14} /> Active</span>
                          ) : (
                            <button onClick={() => handleActivate(prompt.id, v.id)} className="text-sm text-[hsl(var(--brand))] hover:underline">Activate</button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
