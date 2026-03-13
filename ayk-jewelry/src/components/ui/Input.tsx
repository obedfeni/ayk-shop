import { cn } from '@/lib/utils';
import { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

export function Input({ label, error, icon, className, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-semibold text-ayk-text mb-1.5">{label}</label>}
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ayk-text-muted">{icon}</span>}
        <input
          className={cn(
            'w-full rounded-xl border border-ayk-border bg-white px-4 py-2.5 text-sm text-ayk-text placeholder:text-ayk-text-muted',
            'focus:outline-none focus:ring-2 focus:ring-ayk-primary/30 focus:border-ayk-primary transition-all',
            error && 'border-red-400 focus:ring-red-200',
            icon && 'pl-10',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
