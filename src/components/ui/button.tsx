import type { ButtonHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'default' | 'sm' | 'lg';
};

const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
  default: 'bg-rose-500 text-white hover:bg-rose-400 shadow-[0_14px_35px_-14px_rgba(244,63,94,0.55)]',
  secondary: 'border border-slate-700 bg-slate-800 text-slate-100 hover:bg-slate-700',
  outline: 'border border-slate-700 bg-transparent text-slate-100 hover:bg-slate-800',
  ghost: 'bg-transparent text-slate-200 hover:bg-slate-800',
  destructive: 'bg-red-600 text-white hover:bg-red-500'
};

const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
  default: 'h-11 px-4 py-2',
  sm: 'h-9 px-3',
  lg: 'h-12 px-6'
};

export function Button({ className, variant = 'default', size = 'default', ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}