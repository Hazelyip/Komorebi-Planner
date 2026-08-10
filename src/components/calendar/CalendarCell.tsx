import React from 'react';
import { Check, Circle, BookOpen } from 'lucide-react';
import type { Todo, JournalEntry } from '../../types';
import { MOOD_OPTIONS } from '../../types';

interface CalendarCellProps {
  date: Date;
  dateStr: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  todos: Todo[];
  journalEntry?: JournalEntry;
  onClick: () => void;
}

export const CalendarCell: React.FC<CalendarCellProps> = ({
  date,
  dateStr,
  isCurrentMonth,
  isToday,
  isSelected,
  todos,
  journalEntry,
  onClick,
}) => {
  const dayNumber = date.getDate();

  const completedCount = todos.filter((t) => t.completed).length;
  const pendingCount = todos.length - completedCount;
  const hasHighPriority = todos.some((t) => t.priority === 'high' && !t.completed);

  const journalMood = journalEntry?.mood
    ? MOOD_OPTIONS.find((m) => m.type === journalEntry.mood)
    : null;

  return (
    <div
      onClick={onClick}
      className={`relative min-h-[88px] md:min-h-[96px] p-2 flex flex-col justify-between transition-all cursor-pointer select-none ${
        !isCurrentMonth
          ? 'bg-[#f9f8f5] text-[#d1cdc7]'
          : isSelected || isToday
          ? 'bg-[#f0ede6] text-[#3a3a3a]'
          : 'bg-white text-[#3a3a3a] hover:bg-[#f0ede6]/50'
      } ${isSelected ? 'ring-2 ring-inset ring-[#5a5a40]' : ''}`}
    >
      {/* Top row: Day Number & High Priority Indicator */}
      <div className="flex items-center justify-between">
        <span
          className={`text-xs md:text-sm font-medium w-5 h-5 flex items-center justify-center rounded-full ${
            isToday
              ? 'bg-[#5a5a40] text-white font-semibold'
              : isCurrentMonth
              ? 'text-[#3a3a3a]'
              : 'text-[#d1cdc7]'
          }`}
        >
          {dayNumber}
        </span>

        {/* High Priority Warning Dot */}
        {hasHighPriority && (
          <span
            className="w-1.5 h-1.5 rounded-full bg-[#ef4444]"
            title="High priority pending task"
          />
        )}
      </div>

      {/* Middle/Bottom: Indicators */}
      <div className="mt-1 space-y-1">
        {/* Task Indicators */}
        {todos.length > 0 && (
          <div className="flex items-center gap-1 text-[11px] text-[#8a847a] bg-[#f8f6f2] px-1.5 py-0.5 rounded border border-[#e0dad2]">
            {completedCount > 0 && (
              <span className="flex items-center gap-0.5 text-[#5a5a40] font-medium">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
                <span>{completedCount}</span>
              </span>
            )}
            {pendingCount > 0 && (
              <span className="flex items-center gap-0.5 text-[#a09a90]">
                <Circle className="w-2.5 h-2.5" />
                <span>{pendingCount}</span>
              </span>
            )}
          </div>
        )}

        {/* Journal Indicator */}
        {journalEntry && (
          <div
            className="flex items-center gap-1 text-[10px] text-[#5a5a40] bg-[#f0ede6] px-1.5 py-0.5 rounded border border-[#e0dad2] truncate font-medium"
            title={journalEntry.title || 'Journal Entry'}
          >
            {journalMood ? (
              <span className="text-xs">{journalMood.emoji}</span>
            ) : (
              <BookOpen className="w-2.5 h-2.5 shrink-0 text-[#5a5a40]" />
            )}
            <span className="truncate hidden sm:inline">{journalEntry.title || 'Journal'}</span>
          </div>
        )}
      </div>
    </div>
  );
};
