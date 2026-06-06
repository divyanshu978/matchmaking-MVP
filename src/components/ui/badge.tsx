import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: 'default' | 'success' | 'warning' | 'danger' | 'outline';
};

const tones: Record<NonNullable<BadgeProps['tone']>, string> = {
  default: 'border-rose-400/30 bg-rose-500/15 text-rose-100',
  success: 'border-emerald-400/30 bg-emerald-500/15 text-emerald-100',
  warning: 'border-amber-400/30 bg-amber-500/15 text-amber-100',
  danger: 'border-red-400/30 bg-red-500/15 text-red-100',
  outline: 'border-slate-700 bg-transparent text-slate-200'
};

export function Badge({ className, tone = 'default', ...props }: BadgeProps) {
  return <span className={cn('inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium', tones[tone], className)} {...props} />;
}