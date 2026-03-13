import { cn } from '@/lib/utils';
import { COLORS } from '@/lib/constants';
import { Loader2 } from 'lucide-react';
import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export function Button({ children, variant = 'primary', size = 'md', isLoading, className, disabled, ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-5 py-2.5 text-sm', lg: 'px-6 py-3 text-base' };
  const variants = {
    primary: 'bg-gradient-to-br from-ayk-primary to-ayk-primary-dark text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 focus:ring-ayk-primary',
    secondary: 'bg-white border border-ayk-border text-ayk-text hover:bg-gray-50 focus:ring-ayk-primary',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
    ghost: 'text-ayk-text hover:bg-gray-100 focus:ring-gray-300',
  };
  return (
    <button className={cn(base, sizes[size], variants[variant], className)} disabled={disabled || isLoading} {...props}>
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
}
