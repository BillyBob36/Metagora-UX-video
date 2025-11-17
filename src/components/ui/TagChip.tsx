import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TagChipProps {
  label: string;
  onRemove?: () => void;
  variant?: 'default' | 'primary' | 'success' | 'warning';
  className?: string;
}

export function TagChip({ label, onRemove, variant = 'default', className }: TagChipProps) {
  const variants = {
    default: 'bg-gray-100 text-gray-700 border-gray-200',
    primary: 'bg-blue-100 text-blue-700 border-blue-200',
    success: 'bg-green-100 text-green-700 border-green-200',
    warning: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border',
        variants[variant],
        className
      )}
    >
      {label}
      {onRemove && (
        <button
          onClick={onRemove}
          className="hover:opacity-70 transition-opacity"
          type="button"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
}
