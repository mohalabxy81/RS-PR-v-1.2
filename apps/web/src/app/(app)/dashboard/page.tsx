'use client';

import { useQuery } from '@tanstack/react-query';
import { apiHelpers } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';
import { 
  Users, 
  Building, 
  Briefcase, 
  TrendingUp, 
  Calendar,
  CheckCircle2,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuthStore();

  const { data: metrics, isLoading: isMetricsLoading } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: () => apiHelpers.dashboard.getMetrics(),
  });

  const { data: activitiesData, isLoading: isActivitiesLoading } = useQuery({
    queryKey: ['dashboard-activities'],
    queryFn: () => apiHelpers.dashboard.getActivities(5),
  });

  const activities = activitiesData?.data || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Welcome back, {user?.firstName}</h1>
          <p className="page-subtitle">Here&apos;s what&apos;s happening in your workspace today.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/leads/new" className="btn-secondary">Add Lead</Link>
          <Link href="/deals/new" className="btn-primary">New Deal</Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Active Leads"
          value={isMetricsLoading ? '...' : metrics?.leadsCount || 0}
          icon={Users}
          trend="+12% from last month"
          trendUp={true}
        />
        <div className="stat-card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-[hsl(var(--foreground-muted))]">Pipeline Value</p>
              <h3 className="text-2xl font-bold mt-1 text-[hsl(var(--foreground))]">
                {isMetricsLoading ? '...' : formatCurrency(metrics?.pipelineValue)}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[hsl(var(--brand)/0.15)] text-[hsl(var(--brand))] flex items-center justify-center">
              <TrendingUp size={20} />
            </div>
          </div>
          <p className="text-xs text-[hsl(var(--success))] mt-1 flex items-center gap-1">
            <ArrowUpRight size={14} /> +5.2% vs last quarter
          </p>
        </div>
        <StatCard
          title="Open Deals"
          value={isMetricsLoading ? '...' : metrics?.openDealsCount || 0}
          icon={Briefcase}
        />
        <StatCard
          title="Active Properties"
          value={isMetricsLoading ? '...' : metrics?.propertiesCount || 0}
          icon={Building}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Main Chart Area Placeholder */}
        <div className="lg:col-span-2 card p-5 min-h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Revenue Forecast</h3>
            <select className="input !py-1 !px-2 w-auto text-xs bg-[hsl(var(--surface))]">
              <option>This Year</option>
              <option>Last 6 Months</option>
            </select>
          </div>
          <div className="flex-1 border border-dashed border-[hsl(var(--surface-border))] rounded-lg flex items-center justify-center text-[hsl(var(--foreground-subtle))]">
            [Chart Area: Install Recharts/Chart.js in next phase]
          </div>
        </div>

        {/* Activity Feed */}
        <div className="card p-0 flex flex-col h-full">
          <div className="p-5 border-b border-[hsl(var(--surface-border))]">
            <h3 className="text-lg font-semibold">Recent Activity</h3>
          </div>
          
          <div className="flex-1 p-5 overflow-y-auto">
            {isActivitiesLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full skeleton flex-shrink-0" />
                    <div className="space-y-2 flex-1 pt-1">
                      <div className="h-4 w-3/4 skeleton" />
                      <div className="h-3 w-1/2 skeleton" />
                    </div>
                  </div>
                ))}
              </div>
            ) : activities.length > 0 ? (
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                {activities.map((activity: any, index: number) => (
                  <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full border border-[hsl(var(--surface-border))] bg-[hsl(var(--surface))] text-[hsl(var(--brand))] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
                      <Clock size={14} />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] card p-3 rounded shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm text-[hsl(var(--foreground))] capitalize">
                          {activity.entityType} {activity.action.replace('_', ' ')}
                        </span>
                        <time className="text-xs text-[hsl(var(--foreground-muted))]">
                          {formatRelativeTime(activity.createdAt)}
                        </time>
                      </div>
                      <div className="text-sm text-[hsl(var(--foreground-muted))]">
                        {activity.description || 'System action'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p className="text-[hsl(var(--foreground-muted))] text-sm">No recent activities.</p>
              </div>
            )}
          </div>
          
          <div className="p-3 border-t border-[hsl(var(--surface-border))]">
            <button className="w-full text-center text-sm text-[hsl(var(--brand))] hover:underline font-medium">
              View all activity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend, trendUp }: any) {
  return (
    <div className="stat-card">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-[hsl(var(--foreground-muted))]">{title}</p>
          <h3 className="text-2xl font-bold mt-1 text-[hsl(var(--foreground))]">{value}</h3>
        </div>
        <div className="w-10 h-10 rounded-lg bg-[hsl(var(--brand)/0.15)] text-[hsl(var(--brand))] flex items-center justify-center">
          <Icon size={20} />
        </div>
      </div>
      {trend && (
        <p className={cn("text-xs mt-1 flex items-center gap-1", trendUp ? "text-[hsl(var(--success))]" : "text-[hsl(var(--danger))]")}>
          <ArrowUpRight size={14} className={cn(!trendUp && "rotate-180")} /> {trend}
        </p>
      )}
    </div>
  );
}
