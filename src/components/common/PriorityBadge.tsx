import React from 'react';
import type { Priority } from '../../types';

interface PriorityBadgeProps {
  priority: Priority;
  size?: 'sm' | 'md';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'sm' }) => {
  const sizeClasses = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  switch (priority) {
    case 'high':
      return (
        <span className={`inline-flex items-center gap-1 font-medium rounded-md bg-[#FDF2F2] text-[#9B1C1C] border border-[#F87171]/20 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
          High
        </span>
      );
    case 'medium':
      return (
        <span className={`inline-flex items-center gap-1 font-medium rounded-md bg-[#FFFBEB] text-[#92400E] border border-[#FBBF24]/20 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
          Medium
        </span>
      );
    case 'low':
      return (
        <span className={`inline-flex items-center gap-1 font-medium rounded-md bg-[#f0ede6] text-[#8a847a] border border-[#e0dad2] ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#a09a90]" />
          Low
        </span>
      );
  }
};
