'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiHelpers } from '@/lib/api';
import { formatCurrency, formatDate, LEAD_STATUS_COLORS } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Plus, MoreHorizontal, Filter } from 'lucide-react';
import Link from 'next/link';

export default function LeadsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['leads', { page, search }],
    queryFn: () => apiHelpers.leads.list({ page, limit: 15, search }),
  });

  const leads = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Leads</h1>
          <p className="page-subtitle">Manage and track your prospective clients.</p>
        </div>
        <Link href="/leads/new" className="btn-primary">
          <Plus size={18} />
          New Lead
        </Link>
      </div>

      <div className="card">
        {/* Toolbar */}
        <div className="p-4 border-b border-[hsl(var(--surface-border))] flex items-center justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--foreground-muted))]" />
            <Input
              placeholder="Search by name, email, phone..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="btn-secondary">
            <Filter size={16} />
            Filters
          </button>
        </div>

        {/* Table */}
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Source</th>
                <th>Budget</th>
                <th>Assignee</th>
                <th>Created</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-[hsl(var(--foreground-muted))]">
                    Loading leads...
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="empty-state">
                      <p className="text-[hsl(var(--foreground-muted))]">No leads found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                leads.map((lead: any) => (
                  <tr key={lead.id} className="cursor-pointer group relative">
                    <td>
                      <Link href={`/leads/${lead.id}`} className="absolute inset-0 z-0" />
                      <div className="font-medium">{lead.firstName} {lead.lastName}</div>
                      <div className="text-xs text-[hsl(var(--foreground-muted))] mt-0.5">{lead.email || lead.phone || 'No contact info'}</div>
                    </td>
                    <td>
                      <Badge className={LEAD_STATUS_COLORS[lead.status] || 'bg-gray-500/15 text-gray-400'}>
                        {lead.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="text-[hsl(var(--foreground-muted))] text-sm">
                      {lead.source}
                    </td>
                    <td className="font-medium">
                      {lead.budget ? formatCurrency(lead.budget, lead.budgetCurrency) : '—'}
                    </td>
                    <td className="text-[hsl(var(--foreground-muted))] text-sm">
                      {lead.assignee ? `${lead.assignee.firstName} ${lead.assignee.lastName}` : 'Unassigned'}
                    </td>
                    <td className="text-[hsl(var(--foreground-muted))] text-sm">
                      {formatDate(lead.createdAt)}
                    </td>
                    <td className="relative z-10 text-right">
                      <button className="p-2 hover:bg-[hsl(var(--surface-hover))] rounded-md text-[hsl(var(--foreground-muted))]">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="p-4 border-t border-[hsl(var(--surface-border))] flex items-center justify-between">
            <p className="text-sm text-[hsl(var(--foreground-muted))]">
              Showing <span className="font-medium text-[hsl(var(--foreground))]">{(meta.page - 1) * meta.limit + 1}</span> to <span className="font-medium text-[hsl(var(--foreground))]">{Math.min(meta.page * meta.limit, meta.total)}</span> of <span className="font-medium text-[hsl(var(--foreground))]">{meta.total}</span> results
            </p>
            <div className="flex gap-2">
              <button
                className="btn-secondary !py-1.5"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                Previous
              </button>
              <button
                className="btn-secondary !py-1.5"
                disabled={page >= meta.totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
