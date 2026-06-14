'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Building2 } from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';
import { apiHelpers } from '@/lib/api';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await apiHelpers.auth.login(data);
      setUser(res.user, res.accessToken, res.refreshToken);
      // AuthGuard will handle the redirect
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card p-8 glow-brand">
      <div className="flex flex-col items-center mb-8">
        <div className="w-12 h-12 bg-[hsl(var(--brand)/0.15)] rounded-xl flex items-center justify-center mb-4 text-[hsl(var(--brand))]">
          <Building2 size={24} />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-sm text-[hsl(var(--foreground-muted))] mt-1">
          Enter your credentials to access your account
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2">
            {error}
          </div>
        )}

        <div className="form-group">
          <label className="label">Email</label>
          <input
            {...register('email')}
            type="email"
            className="input"
            placeholder="name@company.com"
            autoComplete="email"
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="form-group">
          <div className="flex items-center justify-between mb-1.5">
            <label className="label !mb-0">Password</label>
            <Link
              href="/forgot-password"
              className="text-xs text-[hsl(var(--brand))] hover:underline"
              tabIndex={-1}
            >
              Forgot password?
            </Link>
          </div>
          <input
            {...register('password')}
            type="password"
            className="input"
            autoComplete="current-password"
            disabled={isLoading}
          />
          {errors.password && (
            <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>
          )}
        </div>

        <button type="submit" className="btn-primary w-full mt-6" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-[hsl(var(--foreground-muted))]">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-[hsl(var(--brand))] hover:underline font-medium">
          Create a workspace
        </Link>
      </div>
    </div>
  );
}
