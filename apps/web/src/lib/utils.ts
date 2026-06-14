import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return '—';
  return format(new Date(date), 'MMM d, yyyy');
}

export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return '—';
  return format(new Date(date), 'MMM d, yyyy h:mm a');
}

export function formatRelativeTime(date: string | Date | null | undefined): string {
  if (!date) return '—';
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function formatCurrency(amount: number | null | undefined, currency = 'AED'): string {
  if (amount == null) return '—';
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(n: number | null | undefined): string {
  if (n == null) return '0';
  return new Intl.NumberFormat('en').format(n);
}

export function getInitials(firstName?: string, lastName?: string): string {
  const f = firstName?.[0] ?? '';
  const l = lastName?.[0] ?? '';
  return `${f}${l}`.toUpperCase();
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export const LEAD_STATUS_COLORS: Record<string, string> = {
  NEW: 'bg-blue-500/15 text-blue-400',
  CONTACTED: 'bg-indigo-500/15 text-indigo-400',
  QUALIFIED: 'bg-cyan-500/15 text-cyan-400',
  VIEWING_SCHEDULED: 'bg-purple-500/15 text-purple-400',
  NEGOTIATION: 'bg-orange-500/15 text-orange-400',
  WON: 'bg-emerald-500/15 text-emerald-400',
  LOST: 'bg-red-500/15 text-red-400',
  ARCHIVED: 'bg-gray-500/15 text-gray-400',
};

export const DEAL_STAGE_COLORS: Record<string, string> = {
  LEAD: 'bg-blue-500/15 text-blue-400',
  QUALIFIED: 'bg-cyan-500/15 text-cyan-400',
  VIEWING: 'bg-purple-500/15 text-purple-400',
  OFFER: 'bg-orange-500/15 text-orange-400',
  NEGOTIATION: 'bg-amber-500/15 text-amber-400',
  CLOSED_WON: 'bg-emerald-500/15 text-emerald-400',
  CLOSED_LOST: 'bg-red-500/15 text-red-400',
};

export const TASK_PRIORITY_COLORS: Record<string, string> = {
  LOW: 'bg-gray-500/15 text-gray-400',
  MEDIUM: 'bg-blue-500/15 text-blue-400',
  HIGH: 'bg-orange-500/15 text-orange-400',
  URGENT: 'bg-red-500/15 text-red-400',
};
