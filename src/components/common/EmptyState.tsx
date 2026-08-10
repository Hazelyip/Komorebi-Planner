import React from 'react';
import { Feather } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'A quiet space.',
  description = 'Nothing waiting here right now.',
  action,
  icon = <Feather className="w-8 h-8 text-[#a09a90] stroke-[1.25]" />,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center rounded-xl bg-[#f8f6f2] border border-dashed border-[#e0dad2]">
      <div className="mb-3 p-3 rounded-full bg-white border border-[#e0dad2] shadow-2xs">
        {icon}
      </div>
      <h3 className="text-base font-serif font-medium text-[#5a5a40]">{title}</h3>
      <p className="mt-1 text-xs text-[#a09a90] max-w-xs">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};
