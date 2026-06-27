'use client';

import { useQuery } from '@tanstack/react-query';
import { apiHelpers } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';
import { 
  Users, 
  Building, 
  Briefcase, 
  TrendingUp, 
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { cn, formatCurrency, formatRelativeTime } from '@/lib/utils';
import Link from 'next/link';
import { useState } from 'react';

// TODO(security): Tokens are currently stored in localStorage, which exposes them to XSS.
// A future migration should use HttpOnly cookies served by a BFF or the API itself.

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
        {/* Revenue Chart */}
        <div className="lg:col-span-2 card p-5 min-h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Revenue Forecast</h3>
            <select className="input !py-1 !px-2 w-auto text-xs bg-[hsl(var(--surface))]">
              <option>This Year</option>
              <option>Last 6 Months</option>
            </select>
          </div>
          <div className="flex-1">
            <RevenueChart />
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
                {activities.map((activity: any) => (
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

// ── Revenue SVG Bar Chart ─────────────────────────────────────────────────────
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Simulated monthly revenue in AED (thousands) — will be replaced by real API data
const REVENUE_DATA = [420, 680, 590, 810, 740, 920, 1050, 970, 1120, 1030, 890, 1240];
const FORECAST_DATA: (number | null)[] = [null, null, null, null, null, null, null, null, null, 1100, 1250, 1380];

function RevenueChart() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const chartH = 220;
  const barWidth = 5.5;
  const gap = 2.8;
  const maxVal = Math.max(...REVENUE_DATA, ...(FORECAST_DATA.filter(Boolean) as number[]));
  const padTop = 12;
  const padBottom = 26;
  const innerH = chartH - padTop - padBottom;

  const totalWidth = MONTHS.length * (barWidth + gap) - gap;
  const xScale = 100 / totalWidth;

  const getBarY = (val: number) => padTop + innerH - (val / maxVal) * innerH;
  const getBarH = (val: number) => (val / maxVal) * innerH;

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(f => Math.round(f * maxVal));

  const linePoints = REVENUE_DATA.map((val, i) => {
    const x = (i * (barWidth + gap) + barWidth / 2) * xScale;
    const y = getBarY(val);
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = [
    `0,${chartH - padBottom}`,
    ...REVENUE_DATA.map((val, i) => {
      const x = (i * (barWidth + gap) + barWidth / 2) * xScale;
      return `${x},${getBarY(val)}`;
    }),
    `100,${chartH - padBottom}`,
  ].join(' ');

  return (
    <div className="w-full h-full flex flex-col">
      {/* Legend */}
      <div className="flex items-center gap-5 mb-4 text-xs text-[hsl(var(--foreground-muted))]">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm" style={{ background: 'hsl(222, 89%, 55%)' }} />
          Actual Revenue
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm" style={{ background: 'hsl(199, 89%, 50%)', opacity: 0.5 }} />
          Forecast
        </span>
      </div>

      <svg
        viewBox={`0 0 100 ${chartH}`}
        preserveAspectRatio="none"
        className="w-full overflow-visible"
        style={{ minHeight: 180, flex: 1 }}
        aria-label="Monthly revenue bar chart"
        role="img"
      >
        <defs>
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(222, 89%, 60%)" stopOpacity="1" />
            <stop offset="100%" stopColor="hsl(222, 89%, 42%)" stopOpacity="0.85" />
          </linearGradient>
          <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(199, 89%, 55%)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="hsl(199, 89%, 40%)" stopOpacity="0.25" />
          </linearGradient>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(222, 89%, 55%)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="hsl(222, 89%, 55%)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Y-axis grid lines + labels */}
        {yTicks.map((tick) => {
          const y = getBarY(tick);
          return (
            <g key={tick}>
              <line
                x1="0" y1={y} x2="100" y2={y}
                stroke="hsl(220, 10%, 18%)" strokeWidth="0.3" strokeDasharray="1,1.5"
              />
              <text
                x="-0.5" y={y + 1.2}
                textAnchor="end"
                fontSize="2.8"
                fill="hsl(220, 10%, 42%)"
              >
                {tick >= 1000 ? `${(tick / 1000).toFixed(0)}k` : tick}
              </text>
            </g>
          );
        })}

        {/* Area fill under trend line */}
        <polygon points={areaPoints} fill="url(#areaGrad)" />

        {/* Bars */}
        {MONTHS.map((month, i) => {
          const x = (i * (barWidth + gap)) * xScale;
          const val = REVENUE_DATA[i];
          const forecast = FORECAST_DATA[i];
          const bH = getBarH(val);
          const bY = getBarY(val);
          const isHovered = hoveredIndex === i;

          return (
            <g key={month}>
              {/* Actual bar */}
              <rect
                x={x}
                y={bY}
                width={barWidth * xScale}
                height={bH}
                rx="0.8"
                fill={isHovered ? 'hsl(222, 89%, 70%)' : 'url(#barGrad)'}
                style={{ transition: 'fill 0.15s ease', cursor: 'crosshair' }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              />

              {/* Forecast overlay bar */}
              {forecast !== null && (
                <rect
                  x={x}
                  y={getBarY(forecast)}
                  width={barWidth * xScale}
                  height={getBarH(forecast)}
                  rx="0.8"
                  fill="url(#forecastGrad)"
                  pointerEvents="none"
                />
              )}

              {/* Hover tooltip */}
              {isHovered && (() => {
                const tooltipX = Math.min(x - 0.5, 79);
                return (
                  <g pointerEvents="none">
                    <rect
                      x={tooltipX}
                      y={bY - 10}
                      width={21}
                      height={8}
                      rx="1.2"
                      fill="hsl(222, 89%, 48%)"
                    />
                    <text
                      x={tooltipX + 10.5}
                      y={bY - 5}
                      textAnchor="middle"
                      fontSize="2.8"
                      fill="white"
                      fontWeight="600"
                    >
                      {val >= 1000 ? `${(val / 1000).toFixed(2)}M` : `${val}K`} AED
                    </text>
                  </g>
                );
              })()}

              {/* Month label */}
              <text
                x={x + (barWidth * xScale) / 2}
                y={chartH - padBottom + 7}
                textAnchor="middle"
                fontSize="2.9"
                fill={isHovered ? 'hsl(222, 89%, 65%)' : 'hsl(220, 10%, 44%)'}
                style={{ transition: 'fill 0.15s' }}
              >
                {month}
              </text>
            </g>
          );
        })}

        {/* Trend line */}
        <polyline
          points={linePoints}
          fill="none"
          stroke="hsl(222, 89%, 68%)"
          strokeWidth="0.55"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data-point dots on trend line */}
        {REVENUE_DATA.map((val, i) => {
          const x = (i * (barWidth + gap) + barWidth / 2) * xScale;
          const y = getBarY(val);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={hoveredIndex === i ? 1.4 : 0.8}
              fill="hsl(222, 89%, 70%)"
              stroke="hsl(220, 16%, 8%)"
              strokeWidth="0.3"
              style={{ transition: 'r 0.15s ease' }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          );
        })}
      </svg>

      {/* Summary row */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-[hsl(var(--surface-border))] text-xs text-[hsl(var(--foreground-muted))]">
        <span>
          Total YTD:{' '}
          <span className="text-[hsl(var(--foreground))] font-semibold">
            {formatCurrency(REVENUE_DATA.reduce((a, b) => a + b, 0) * 1000)}
          </span>
        </span>
        <span className="flex items-center gap-1" style={{ color: 'hsl(158, 64%, 40%)' }}>
          <ArrowUpRight size={12} /> +18.3% vs last year
        </span>
      </div>
    </div>
  );
}
