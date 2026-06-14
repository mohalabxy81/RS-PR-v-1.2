'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from './auth-store';

const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const isPublic = publicRoutes.some((route) => pathname.startsWith(route));

    if (!isAuthenticated && !isPublic) {
      router.replace('/login');
    } else if (isAuthenticated && isPublic) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, pathname, mounted, router]);

  // Prevent hydration mismatch by not rendering anything until mounted
  if (!mounted) return null;

  // If we are redirecting, don't flash the protected content
  const isPublic = publicRoutes.some((route) => pathname.startsWith(route));
  if (!isAuthenticated && !isPublic) return null;
  if (isAuthenticated && isPublic) return null;

  return <>{children}</>;
}
