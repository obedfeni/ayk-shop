import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

export function Card({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('bg-white rounded-2xl border border-ayk-border shadow-sm', className)} {...props}>
      {children}
    </div>
  );
}

type BadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'info';

const badgeStyles: Record<BadgeVariant, string> = {
  primary: 'bg-amber-100 text-amber-800',
  success: 'bg-emerald-100 text-emerald-800',
  warning: 'bg-orange-100 text-orange-800',
  error: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-800',
};

export function Badge({ children, variant = 'primary', className }: { children: React.ReactNode; variant?: BadgeVariant; className?: string }) {
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold', badgeStyles[variant], className)}>
      {children}
    </span>
  );
}
