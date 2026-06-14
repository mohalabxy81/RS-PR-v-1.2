'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiHelpers } from '@/lib/api';
import { formatCurrency, formatDateTime, formatRelativeTime, LEAD_STATUS_COLORS } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Building2, 
  MapPin, 
  Calendar, 
  User, 
  Clock, 
  MessageSquare,
  Edit,
  MoreVertical
} from 'lucide-react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { LeadScoreCard } from '@/components/ai/LeadScoreCard';
import { EmailGenerator } from '@/components/ai/EmailGenerator';

export default function LeadDetailPage({ params }: { params: { id: string } }) {
  const queryClient = useQueryClient();
  const [noteContent, setNoteContent] = useState('');

  const { data: lead, isLoading } = useQuery({
    queryKey: ['lead', params.id],
    queryFn: () => apiHelpers.leads.get(params.id),
  });

  const { data: timeline } = useQuery({
    queryKey: ['lead-timeline', params.id],
    queryFn: () => apiHelpers.leads.getTimeline(params.id),
  });

  const addNoteMutation = useMutation({
    mutationFn: (content: string) => apiHelpers.leads.addNote(params.id, content),
    onSuccess: () => {
      setNoteContent('');
      queryClient.invalidateQueries({ queryKey: ['lead', params.id] });
      queryClient.invalidateQueries({ queryKey: ['lead-timeline', params.id] });
    },
  });

  if (isLoading) {
    return <div className="p-8 text-center text-[hsl(var(--foreground-muted))]">Loading lead details...</div>;
  }

  if (!lead) {
    return <div className="p-8 text-center text-[hsl(var(--danger))]">Lead not found</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/leads" className="p-2 hover:bg-[hsl(var(--surface-hover))] rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="page-title">{lead.firstName} {lead.lastName}</h1>
              <Badge className={LEAD_STATUS_COLORS[lead.status] || 'bg-gray-500/15 text-gray-400'}>
                {lead.status.replace('_', ' ')}
              </Badge>
            </div>
            <p className="text-sm text-[hsl(var(--foreground-muted))] mt-1 flex items-center gap-4">
              <span className="flex items-center gap-1"><Mail size={14} /> {lead.email || 'No email'}</span>
              <span className="flex items-center gap-1"><Phone size={14} /> {lead.phone || 'No phone'}</span>
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="btn-secondary"><Edit size={16} /> Edit</button>
          <button className="btn-primary">Convert to Deal</button>
          <button className="btn-secondary px-2"><MoreVertical size={16} /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Details & Notes */}
        <div className="lg:col-span-2 space-y-6">
          <LeadScoreCard leadId={params.id} />
          
          {/* Info Card */}
          <div className="card p-6">
            <h3 className="section-title !px-0 mb-4">Lead Information</h3>
            <div className="grid grid-cols-2 gap-y-4 gap-x-8">
              <div>
                <span className="text-xs text-[hsl(var(--foreground-muted))] block mb-1">Source</span>
                <span className="font-medium">{lead.source}</span>
              </div>
              <div>
                <span className="text-xs text-[hsl(var(--foreground-muted))] block mb-1">Budget</span>
                <span className="font-medium">{lead.budget ? formatCurrency(lead.budget, lead.budgetCurrency) : '—'}</span>
              </div>
              <div>
                <span className="text-xs text-[hsl(var(--foreground-muted))] block mb-1 flex items-center gap-1"><Building2 size={12}/> Property Type</span>
                <span className="font-medium">{lead.propertyType || 'Any'}</span>
              </div>
              <div>
                <span className="text-xs text-[hsl(var(--foreground-muted))] block mb-1 flex items-center gap-1"><MapPin size={12}/> Preferred Location</span>
                <span className="font-medium">{lead.preferredLocation || '—'}</span>
              </div>
              <div>
                <span className="text-xs text-[hsl(var(--foreground-muted))] block mb-1 flex items-center gap-1"><User size={12}/> Assignee</span>
                <span className="font-medium">{lead.assignee ? `${lead.assignee.firstName} ${lead.assignee.lastName}` : 'Unassigned'}</span>
              </div>
              <div>
                <span className="text-xs text-[hsl(var(--foreground-muted))] block mb-1 flex items-center gap-1"><Calendar size={12}/> Created On</span>
                <span className="font-medium">{formatDateTime(lead.createdAt)}</span>
              </div>
            </div>

            {lead.notes && (
              <div className="mt-6 pt-6 border-t border-[hsl(var(--surface-border))]">
                <span className="text-xs text-[hsl(var(--foreground-muted))] block mb-2">Initial Notes</span>
                <p className="text-sm text-[hsl(var(--foreground))] whitespace-pre-wrap">{lead.notes}</p>
              </div>
            )}
          </div>

          {/* Notes Section */}
          <div className="card p-6">
            <h3 className="section-title !px-0 mb-4">Notes</h3>
            
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (noteContent.trim()) addNoteMutation.mutate(noteContent);
              }}
              className="mb-6 relative"
            >
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Add a note..."
                className="input min-h-[80px] py-3 pr-24 resize-y"
              />
              <button 
                type="submit" 
                disabled={!noteContent.trim() || addNoteMutation.isPending}
                className="btn-primary absolute bottom-3 right-3 py-1.5 px-3 text-xs"
              >
                Save Note
              </button>
            </form>

            <div className="space-y-4">
              {lead.leadNotes?.length > 0 ? (
                lead.leadNotes.map((note: any) => (
                  <div key={note.id} className="p-4 rounded-lg bg-[hsl(var(--surface-hover))]">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-sm flex items-center gap-2">
                        <User size={14} className="text-[hsl(var(--brand))]" />
                        {note.author.firstName} {note.author.lastName}
                      </span>
                      <span className="text-xs text-[hsl(var(--foreground-muted))]" title={formatDateTime(note.createdAt)}>
                        {formatRelativeTime(note.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[hsl(var(--foreground-muted))] text-center py-4">No notes added yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Timeline & Related Info */}
        <div className="space-y-6">
          <EmailGenerator entityType="Lead" entityId={params.id} />

          <div className="card p-5">
            <h3 className="section-title !px-0 mb-4">Activity Timeline</h3>
            
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[15px] before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[hsl(var(--surface-border))] before:via-[hsl(var(--surface-border))] before:to-transparent">
              {timeline?.length > 0 ? timeline.map((activity: any) => (
                <div key={activity.id} className="relative flex items-start gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full border border-[hsl(var(--surface-border))] bg-[hsl(var(--surface))] text-[hsl(var(--foreground-subtle))] shrink-0 z-10 shadow-sm">
                    {activity.action === 'created' ? <Plus size={14} /> :
                     activity.action === 'note_added' ? <MessageSquare size={14} /> :
                     <Clock size={14} />}
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-[hsl(var(--foreground-muted))] mt-0.5">
                      {formatRelativeTime(activity.createdAt)} by {activity.user ? `${activity.user.firstName} ${activity.user.lastName}` : 'System'}
                    </p>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-[hsl(var(--foreground-muted))] ml-10">No activities yet.</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
