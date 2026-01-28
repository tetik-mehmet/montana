import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default';
}

export default function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  const variants = {
    success: 'bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-800 border-emerald-200/50 shadow-sm shadow-emerald-500/10 hover:shadow-emerald-500/20',
    warning: 'bg-gradient-to-r from-amber-100 to-amber-50 text-amber-800 border-amber-200/50 shadow-sm shadow-amber-500/10 hover:shadow-amber-500/20',
    danger: 'bg-gradient-to-r from-red-100 to-red-50 text-red-800 border-red-200/50 shadow-sm shadow-red-500/10 hover:shadow-red-500/20',
    info: 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 border-blue-200/50 shadow-sm shadow-blue-500/10 hover:shadow-blue-500/20',
    default: 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 border-gray-200/50 shadow-sm hover:shadow-md',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm transition-all duration-300 hover:scale-105',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
