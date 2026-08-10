import React from 'react';
import { Inbox as InboxIcon, Calendar, Plus } from 'lucide-react';
import type { Todo } from '../../types';
import { TodoList } from './TodoList';
import { useLanguage } from '../../i18n/LanguageContext';

interface InboxViewProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onSchedule: (id: string, newDate: string | null) => void;
  onDelete: (id: string) => void;
  onOpenQuickAdd: () => void;
}

export const InboxView: React.FC<InboxViewProps> = ({
  todos = [],
  onToggle,
  onSchedule,
  onDelete,
  onOpenQuickAdd,
}) => {
  const { t } = useLanguage();

  const unscheduledTodos = todos.filter((item) => !item.startDate);
  const scheduledTodos = todos
    .filter((item) => !!item.startDate)
    .sort((a, b) => (a.startDate! > b.startDate! ? 1 : -1));

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white rounded-xl border border-[#e0dad2] shadow-2xs">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-[#fcfaf7] border border-[#e0dad2] text-[#5a5a40]">
            <InboxIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-lg font-light text-[#5a5a40]">{t.inbox.title}</h2>
            <p className="text-xs text-[#a09a90] mt-0.5">
              {t.inbox.subtitle}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenQuickAdd}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#5a5a40] hover:bg-[#4a4a34] rounded-full shadow-xs cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>{t.inbox.addUnscheduled}</span>
        </button>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1: Unscheduled / 未安排日期的任务 */}
        <div className="flex flex-col p-4 bg-white/70 rounded-xl border border-[#e0dad2] shadow-2xs h-[480px] sm:h-[540px]">
          <h3 className="font-serif text-sm font-semibold text-[#5a5a40] flex items-center justify-between pb-2 border-b border-[#e0dad2] shrink-0">
            <span className="flex items-center gap-2">
              <InboxIcon className="w-4 h-4 text-[#5a5a40]" />
              <span>{t.inbox.unscheduledColumnTitle}</span>
            </span>
            <span className="text-xs font-normal text-[#8a847a]">({unscheduledTodos.length})</span>
          </h3>

          <div className="flex-1 overflow-y-auto pr-1 mt-3 custom-scrollbar touch-pan-y">
            <TodoList
              todos={unscheduledTodos}
              onToggle={onToggle}
              onSchedule={onSchedule}
              onDelete={onDelete}
              emptyTitle={t.inbox.emptyTitle}
              emptyDescription={t.inbox.emptyDesc}
            />
          </div>
        </div>

        {/* Column 2: Scheduled / 已安排日期的任务 (Sorted by date ascending) */}
        <div className="flex flex-col p-4 bg-white/70 rounded-xl border border-[#e0dad2] shadow-2xs h-[480px] sm:h-[540px]">
          <h3 className="font-serif text-sm font-semibold text-[#5a5a40] flex items-center justify-between pb-2 border-b border-[#e0dad2] shrink-0">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#5a5a40]" />
              <span>{t.inbox.scheduledColumnTitle}</span>
            </span>
            <span className="text-xs font-normal text-[#8a847a]">({scheduledTodos.length})</span>
          </h3>

          <div className="flex-1 overflow-y-auto pr-1 mt-3 custom-scrollbar touch-pan-y">
            <TodoList
              todos={scheduledTodos}
              onToggle={onToggle}
              onSchedule={onSchedule}
              onDelete={onDelete}
              emptyTitle={t.inbox.noScheduledTasks}
              emptyDescription={t.inbox.noScheduledDesc}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
