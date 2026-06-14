'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Building2, CheckCircle2 } from 'lucide-react';
import { apiHelpers } from '@/lib/api';

const registerSchema = z.object({
  companyName: z.string().min(2, 'Company name is required'),
  companySlug: z.string()
    .min(3, 'Slug must be at least 3 characters')
    .regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers, and hyphens only'),
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  // Auto-generate slug from company name if user hasn't typed in the slug field
  const companyName = watch('companyName');
  const companySlug = watch('companySlug');

  const handleCompanyNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue('companyName', val);
    if (!companySlug || companySlug === val.slice(0, -1).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')) {
      setValue('companySlug', val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setIsLoading(true);
      setError(null);
      await apiHelpers.auth.register(data);
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create workspace. The slug or email might be taken.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="card p-8 text-center glow-brand">
        <div className="w-16 h-16 bg-emerald-500/15 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-500">
          <CheckCircle2 size={32} />
        </div>
        <h2 className="text-2xl font-bold mb-2">Workspace Created!</h2>
        <p className="text-[hsl(var(--foreground-muted))] mb-8">
          Your workspace has been set up successfully. We&apos;ve sent a verification email to your address.
        </p>
        <Link href="/login" className="btn-primary w-full">
          Continue to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="card p-8 glow-brand">
      <div className="flex flex-col items-center mb-8">
        <div className="w-12 h-12 bg-[hsl(var(--brand)/0.15)] rounded-xl flex items-center justify-center mb-4 text-[hsl(var(--brand))]">
          <Building2 size={24} />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Create Workspace</h1>
        <p className="text-sm text-[hsl(var(--foreground-muted))] mt-1">
          Set up a new REIS environment for your company
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-4 divider pt-4 mt-2 border-t-0">
          <div className="section-title !px-0 !mb-3">Company Details</div>
          
          <div className="form-group">
            <label className="label">Company Name</label>
            <input
              {...register('companyName')}
              onChange={handleCompanyNameChange}
              className="input"
              placeholder="Acme Real Estate"
              disabled={isLoading}
            />
            {errors.companyName && <p className="text-xs text-red-400 mt-1">{errors.companyName.message}</p>}
          </div>

          <div className="form-group">
            <label className="label">Workspace URL</label>
            <div className="flex items-center">
              <span className="inline-flex items-center px-3 text-sm text-[hsl(var(--foreground-muted))] bg-[hsl(var(--surface-border))] border border-r-0 border-[hsl(var(--surface-border))] rounded-l-lg">
                app.reis.io/
              </span>
              <input
                {...register('companySlug')}
                className="input rounded-l-none"
                placeholder="acme"
                disabled={isLoading}
              />
            </div>
            {errors.companySlug && <p className="text-xs text-red-400 mt-1">{errors.companySlug.message}</p>}
          </div>
        </div>

        <div className="space-y-4 divider pt-4">
          <div className="section-title !px-0 !mb-3">Admin Account</div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="label">First Name</label>
              <input {...register('firstName')} className="input" placeholder="John" disabled={isLoading} />
              {errors.firstName && <p className="text-xs text-red-400 mt-1">{errors.firstName.message}</p>}
            </div>
            <div className="form-group">
              <label className="label">Last Name</label>
              <input {...register('lastName')} className="input" placeholder="Doe" disabled={isLoading} />
              {errors.lastName && <p className="text-xs text-red-400 mt-1">{errors.lastName.message}</p>}
            </div>
          </div>

          <div className="form-group">
            <label className="label">Email Address</label>
            <input {...register('email')} type="email" className="input" placeholder="admin@company.com" disabled={isLoading} />
            {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
          </div>

          <div className="form-group">
            <label className="label">Password</label>
            <input {...register('password')} type="password" className="input" disabled={isLoading} />
            {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
          </div>
        </div>

        <button type="submit" className="btn-primary w-full mt-6" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating Workspace...
            </>
          ) : (
            'Create Workspace'
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-[hsl(var(--foreground-muted))]">
        Already have an account?{' '}
        <Link href="/login" className="text-[hsl(var(--brand))] hover:underline font-medium">
          Sign in
        </Link>
      </div>
    </div>
  );
}
