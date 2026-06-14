'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiHelpers } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const createLeadSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  source: z.enum(['WEBSITE', 'PORTAL', 'REFERRAL', 'WALK_IN', 'COLD_CALL', 'SOCIAL_MEDIA', 'OTHER']).optional(),
  status: z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'VIEWING_SCHEDULED', 'NEGOTIATION', 'WON', 'LOST']).optional(),
  budget: z.coerce.number().min(0).optional(),
  propertyType: z.enum(['APARTMENT', 'VILLA', 'TOWNHOUSE', 'PENTHOUSE', 'PLOT', 'COMMERCIAL', 'OFFICE']).optional(),
  preferredLocation: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof createLeadSchema>;

export default function NewLeadPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(createLeadSchema) as any,
    defaultValues: {
      source: 'WEBSITE',
      status: 'NEW',
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setIsLoading(true);
      setError(null);
      // Clean up empty strings to undefined to match Prisma schema constraints
      const cleanedData = {
        ...data,
        email: data.email || undefined,
        phone: data.phone || undefined,
      };
      const res = await apiHelpers.leads.create(cleanedData);
      router.push(`/leads/${res.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create lead');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-4 mb-2">
        <Link href="/leads" className="p-2 hover:bg-[hsl(var(--surface-hover))] rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="page-title">New Lead</h1>
          <p className="page-subtitle">Enter details for the new prospective client.</p>
        </div>
      </div>

      <div className="card p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="section-title !px-0">Personal Info</div>
              <div className="form-group">
                <label className="label">First Name *</label>
                <Input {...register('firstName')} />
                {errors.firstName && <p className="text-xs text-red-400">{errors.firstName.message}</p>}
              </div>
              <div className="form-group">
                <label className="label">Last Name *</label>
                <Input {...register('lastName')} />
                {errors.lastName && <p className="text-xs text-red-400">{errors.lastName.message}</p>}
              </div>
              <div className="form-group">
                <label className="label">Email Address</label>
                <Input {...register('email')} type="email" />
                {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
              </div>
              <div className="form-group">
                <label className="label">Phone Number</label>
                <Input {...register('phone')} />
                {errors.phone && <p className="text-xs text-red-400">{errors.phone.message}</p>}
              </div>
            </div>

            <div className="space-y-4">
              <div className="section-title !px-0">Lead Details</div>
              <div className="form-group">
                <label className="label">Status</label>
                <select {...register('status')} className="input">
                  <option value="NEW">New</option>
                  <option value="CONTACTED">Contacted</option>
                  <option value="QUALIFIED">Qualified</option>
                  <option value="VIEWING_SCHEDULED">Viewing Scheduled</option>
                </select>
              </div>
              <div className="form-group">
                <label className="label">Source</label>
                <select {...register('source')} className="input">
                  <option value="WEBSITE">Website</option>
                  <option value="PORTAL">Property Portal</option>
                  <option value="REFERRAL">Referral</option>
                  <option value="WALK_IN">Walk In</option>
                  <option value="COLD_CALL">Cold Call</option>
                  <option value="SOCIAL_MEDIA">Social Media</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="label">Budget (AED)</label>
                <Input {...register('budget')} type="number" step="1000" />
              </div>
              <div className="form-group">
                <label className="label">Property Type</label>
                <select {...register('propertyType')} className="input">
                  <option value="">Any</option>
                  <option value="APARTMENT">Apartment</option>
                  <option value="VILLA">Villa</option>
                  <option value="TOWNHOUSE">Townhouse</option>
                  <option value="PENTHOUSE">Penthouse</option>
                  <option value="PLOT">Plot</option>
                  <option value="COMMERCIAL">Commercial</option>
                  <option value="OFFICE">Office</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4 divider pt-6">
            <div className="form-group">
              <label className="label">Preferred Location</label>
              <Input {...register('preferredLocation')} placeholder="e.g. Downtown Dubai, Palm Jumeirah" />
            </div>
            <div className="form-group">
              <label className="label">Notes / Requirements</label>
              <textarea 
                {...register('notes')} 
                className="input min-h-[100px] py-3 resize-y"
                placeholder="Enter any specific requirements or background info..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 divider pt-6">
            <button type="button" onClick={() => router.back()} className="btn-secondary" disabled={isLoading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Create Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
