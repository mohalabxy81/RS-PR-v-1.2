'use client';

import React, { useState } from 'react';
import { GitMerge, Plus, Play, Pause, Trash2, ArrowRight, CheckCircle2, Clock, Zap } from 'lucide-react';

interface WorkflowStep {
  id: string;
  name: string;
  type: 'trigger' | 'condition' | 'action';
  config: string;
}

const STEP_TYPES = {
  trigger: { label: 'Trigger', color: 'bg-blue-500/15 text-blue-400 border-blue-500/20' },
  condition: { label: 'Condition', color: 'bg-amber-500/15 text-amber-400 border-amber-500/20' },
  action: { label: 'Action', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' },
};

const SAMPLE_WORKFLOWS = [
  {
    id: '1',
    name: 'New Lead Auto-Assignment',
    status: 'active',
    lastRun: '2 hours ago',
    runs: 142,
    steps: [
      { id: 's1', name: 'Lead Created', type: 'trigger' as const, config: 'On new lead creation' },
      { id: 's2', name: 'Check Lead Score', type: 'condition' as const, config: 'Score > 70' },
      { id: 's3', name: 'Assign to Top Agent', type: 'action' as const, config: 'Round-robin senior agents' },
      { id: 's4', name: 'Send Welcome Email', type: 'action' as const, config: 'Template: welcome_lead' },
    ],
  },
  {
    id: '2',
    name: 'Deal Stage Notification',
    status: 'active',
    lastRun: '5 hours ago',
    runs: 89,
    steps: [
      { id: 's1', name: 'Deal Stage Changed', type: 'trigger' as const, config: 'Stage: OFFER → NEGOTIATION' },
      { id: 's2', name: 'Notify Manager', type: 'action' as const, config: 'Push + Email notification' },
    ],
  },
  {
    id: '3',
    name: 'Overdue Task Escalation',
    status: 'paused',
    lastRun: '1 day ago',
    runs: 37,
    steps: [
      { id: 's1', name: 'Task Overdue', type: 'trigger' as const, config: 'Task past due date by 24h' },
      { id: 's2', name: 'Check Priority', type: 'condition' as const, config: 'Priority: HIGH or URGENT' },
      { id: 's3', name: 'Escalate to Manager', type: 'action' as const, config: 'Assign + notify branch manager' },
    ],
  },
];

export function WorkflowBuilder() {
  const [selected, setSelected] = useState<string | null>('1');

  const selectedWorkflow = SAMPLE_WORKFLOWS.find(w => w.id === selected);

  return (
    <div className="p-6 bg-[hsl(var(--surface))] rounded-xl border border-[hsl(var(--surface-border))]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center">
            <GitMerge size={18} />
          </div>
          <div>
            <h3 className="text-lg font-bold">Workflow Engine</h3>
            <p className="text-xs text-[hsl(var(--foreground-muted))]">Automate repetitive processes with no-code workflows</p>
          </div>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={16} /> New Workflow
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Workflow list */}
        <div className="space-y-2">
          {SAMPLE_WORKFLOWS.map(wf => (
            <button
              key={wf.id}
              onClick={() => setSelected(wf.id)}
              className={`w-full text-left p-3 rounded-lg border transition-all duration-150 ${
                selected === wf.id
                  ? 'bg-[hsl(var(--brand)/0.1)] border-[hsl(var(--brand)/0.3)]'
                  : 'bg-[hsl(var(--background-tertiary))] border-[hsl(var(--surface-border))] hover:border-[hsl(var(--brand)/0.2)]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-[hsl(var(--foreground))] truncate">{wf.name}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full border flex items-center gap-1 flex-shrink-0 ml-2 ${
                  wf.status === 'active' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' : 'bg-gray-500/15 text-gray-400 border-gray-500/20'
                }`}>
                  {wf.status === 'active' ? <Play size={10} /> : <Pause size={10} />}
                  {wf.status}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[hsl(var(--foreground-muted))]">
                <span className="flex items-center gap-1"><Clock size={10} /> {wf.lastRun}</span>
                <span className="flex items-center gap-1"><Zap size={10} /> {wf.runs} runs</span>
              </div>
            </button>
          ))}
        </div>

        {/* Workflow steps view */}
        <div className="md:col-span-2">
          {selectedWorkflow ? (
            <div className="p-4 border border-[hsl(var(--surface-border))] rounded-xl bg-[hsl(var(--background-tertiary))] min-h-[220px]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-[hsl(var(--foreground))]">{selectedWorkflow.name}</span>
                <div className="flex gap-2">
                  <button className="btn-secondary !py-1 !px-2 text-xs flex items-center gap-1">
                    <Play size={12} /> Run Now
                  </button>
                  <button className="btn-danger !py-1 !px-2 text-xs">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {selectedWorkflow.steps.map((step, idx) => (
                  <React.Fragment key={step.id}>
                    <div className={`flex flex-col gap-1 px-3 py-2.5 rounded-lg border text-xs min-w-[120px] ${STEP_TYPES[step.type].color}`}>
                      <span className="font-semibold uppercase tracking-wider text-[10px] opacity-70">{STEP_TYPES[step.type].label}</span>
                      <span className="font-medium text-sm">{step.name}</span>
                      <span className="opacity-70 text-[11px]">{step.config}</span>
                    </div>
                    {idx < selectedWorkflow.steps.length - 1 && (
                      <ArrowRight size={16} className="text-[hsl(var(--foreground-muted))] flex-shrink-0" />
                    )}
                  </React.Fragment>
                ))}

                <button className="flex flex-col items-center justify-center gap-1 px-3 py-2.5 rounded-lg border border-dashed border-[hsl(var(--surface-border))] hover:border-[hsl(var(--brand)/0.4)] text-[hsl(var(--foreground-muted))] hover:text-[hsl(var(--brand))] transition-colors min-w-[80px] min-h-[72px]">
                  <Plus size={16} />
                  <span className="text-[11px]">Add Step</span>
                </button>
              </div>

              <div className="mt-4 pt-3 border-t border-[hsl(var(--surface-border))] flex items-center gap-4 text-xs text-[hsl(var(--foreground-muted))]">
                <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-400" /> {selectedWorkflow.runs} successful runs</span>
                <span className="flex items-center gap-1"><Clock size={12} /> Last triggered {selectedWorkflow.lastRun}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full min-h-[220px] text-[hsl(var(--foreground-muted))] text-sm">
              Select a workflow to view its steps
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
