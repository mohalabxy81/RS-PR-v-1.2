'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Building, 
  Briefcase, 
  CalendarDays, 
  CheckSquare, 
  BarChart3, 
  Settings,
  Building2,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/lib/auth-store';
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Leads', href: '/leads', icon: Users },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Properties', href: '/properties', icon: Building },
  { name: 'Deals', href: '/deals', icon: Briefcase },
  { name: 'Appointments', href: '/appointments', icon: CalendarDays },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'AI Copilot', href: '/ai', icon: Sparkles },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);

  // Simplified RBAC logic for the UI (real enforcement is backend)
  const isOwnerOrManager = user?.roleName === 'Company Owner' || user?.roleName === 'Branch Manager';

  return (
    <div
      className={cn(
        'h-screen flex flex-col bg-[hsl(var(--sidebar-bg))] border-r border-[hsl(var(--sidebar-border))] sidebar-transition flex-shrink-0 z-20',
        collapsed ? 'w-[72px]' : 'w-64'
      )}
    >
      {/* Brand area */}
      <div className="h-16 flex items-center px-4 border-b border-[hsl(var(--sidebar-border))] justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded bg-[hsl(var(--brand)/0.15)] text-[hsl(var(--brand))] flex items-center justify-center flex-shrink-0">
            <Building2 size={18} />
          </div>
          {!collapsed && (
            <span className="font-bold text-lg tracking-tight whitespace-nowrap text-white">REIS</span>
          )}
        </div>
        
        {/* Collapse toggle (visible on hover or focus) */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-[hsl(var(--foreground-muted))] hover:text-white transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1 scrollbar-hide">
        <div className={cn("text-xs font-semibold text-[hsl(var(--foreground-subtle))] mb-2 px-3 uppercase tracking-wider", collapsed && "sr-only")}>
          Platform
        </div>
        
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'nav-item',
                isActive && 'active',
                collapsed && 'justify-center px-0'
              )}
              title={collapsed ? item.name : undefined}
            >
              <item.icon size={20} className="flex-shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-[hsl(var(--sidebar-border))]">
        <Link
          href="/settings"
          className={cn(
            'nav-item',
            pathname.startsWith('/settings') && 'active',
            collapsed && 'justify-center px-0'
          )}
          title={collapsed ? "Settings" : undefined}
        >
          <Settings size={20} className="flex-shrink-0" />
          {!collapsed && <span>Settings</span>}
        </Link>
      </div>
    </div>
  );
}
