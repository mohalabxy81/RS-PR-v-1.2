'use client';

import { Bell, Search, LogOut, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';
import { getInitials } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { apiHelpers } from '@/lib/api';

export function Header() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        await apiHelpers.auth.logout(refreshToken);
      }
    } catch (e) {
      console.error('Logout failed', e);
    } finally {
      logout();
      router.push('/login');
    }
  };

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-[hsl(var(--surface-border))] bg-[hsl(var(--background)/0.8)] backdrop-blur-md sticky top-0 z-10">
      <div className="flex items-center flex-1">
        {/* Global Search Placeholder */}
        <div className="relative w-64 max-w-md hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[hsl(var(--foreground-muted))]" />
          <input
            type="text"
            placeholder="Search leads, deals, properties..."
            className="input pl-9 h-9"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 text-[hsl(var(--foreground-muted))] hover:text-[hsl(var(--foreground))] transition-colors rounded-full hover:bg-[hsl(var(--surface))]">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-[hsl(var(--background))]"></span>
        </button>

        {/* User Menu (Simplified - replace with Radix Dropdown later) */}
        <div className="flex items-center gap-3 pl-4 border-l border-[hsl(var(--surface-border))]">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-sm font-medium leading-none">{user?.firstName} {user?.lastName}</span>
            <span className="text-xs text-[hsl(var(--foreground-muted))] mt-1">{user?.roleName}</span>
          </div>
          
          <div className="relative group cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-[hsl(var(--brand))] flex items-center justify-center text-white font-semibold text-sm border-2 border-[hsl(var(--surface-border))] group-hover:border-[hsl(var(--brand)/0.5)] transition-colors">
              {getInitials(user?.firstName, user?.lastName)}
            </div>
            
            {/* Simple dropdown */}
            <div className="absolute right-0 mt-2 w-48 bg-[hsl(var(--surface))] border border-[hsl(var(--surface-border))] rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
              <div className="p-1">
                <button 
                  onClick={() => router.push('/settings/profile')}
                  className="w-full text-left px-3 py-2 text-sm text-[hsl(var(--foreground))] hover:bg-[hsl(var(--surface-hover))] rounded flex items-center gap-2"
                >
                  <UserIcon size={16} /> Profile
                </button>
                <div className="h-px bg-[hsl(var(--surface-border))] my-1"></div>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded flex items-center gap-2"
                >
                  <LogOut size={16} /> Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
