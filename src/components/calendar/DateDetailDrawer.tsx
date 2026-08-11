import React from 'react';
import { X, Plus, BookOpen, Edit3 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { zhCN, enUS, ja } from 'date-fns/locale';
import type { Todo, JournalEntry } from '../../types';
import { MOOD_OPTIONS } from '../../types';
import { TodoList } from '../todo/TodoList';
import { useLanguage } from '../../i18n/LanguageContext';

interface DateDetailDrawerProps {
  isOpen: boolean;
  dateStr: string | null;
  todos: Todo[];
  journalEntry?: JournalEntry;
  onClose: () => void;
  onToggleTodo: (id: string) => void;
  onScheduleTodo: (id: string, newDate: string | null) => void;
  onDeleteTodo: (id: string) => void;
  onAddTodoForDate: (dateStr: string) => void;
  onOpenJournalEditor: (dateStr: string) => void;
}

export const DateDetailDrawer: React.FC<DateDetailDrawerProps> = ({
  isOpen,
  dateStr,
  todos,
  journalEntry,
  onClose,
  onToggleTodo,
  onScheduleTodo,
  onDeleteTodo,
  onAddTodoForDate,
  onOpenJournalEditor,
}) => {
  const { t, language } = useLanguage();
  if (!isOpen || !dateStr) return null;

  const parsedDate = parseISO(dateStr);

  let formattedDateDisplay = '';
  if (language === 'zh') {
    formattedDateDisplay = format(parsedDate, 'M月d日 EEEE', { locale: zhCN });
  } else if (language === 'ja') {
    formattedDateDisplay = format(parsedDate, 'M月d日 EEEE', { locale: ja });
  } else {
    formattedDateDisplay = format(parsedDate, 'MMM d · EEEE', { locale: enUS });
  }

  const completedCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const journalMood = journalEntry?.mood
    ? MOOD_OPTIONS.find((m) => m.type === journalEntry.mood)
    : null;

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/20 backdrop-blur-2xs animate-fade-in">
      <div className="w-full max-w-md h-full bg-[#fcfaf7] border-l border-[#e0dad2] shadow-xl flex flex-col select-none overflow-hidden">
        {/* Header */}
        <div className="p-4 md:p-6 bg-white/50 border-b border-[#e0dad2] flex items-center justify-between shrink-0">
          <div>
            <h3 className="font-serif text-lg text-[#5a5a40]">
              {formattedDateDisplay}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#a09a90] hover:text-[#5a5a40] hover:bg-[#f0ede6] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {/* Progress Bar Card */}
          <div className="rounded-xl bg-[#fcfaf7] p-4 border border-[#e0dad2]/50 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#a09a90]">
                {t.dateDrawer.progress}
              </span>
              <span className="text-xs font-serif italic text-[#5a5a40]">
                {t.dateDrawer.completedPct(completionRate)}
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-[#e0dad2]">
              <div
                className="h-full rounded-full bg-[#5a5a40] transition-all duration-300"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>

          {/* Today's Tasks Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#a09a90]">
                {t.dateDrawer.tasksHeader(totalCount)}
              </p>
              <button
                type="button"
                onClick={() => onAddTodoForDate(dateStr)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#5a5a40] hover:underline cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.dateDrawer.addTask}</span>
              </button>
            </div>

            <TodoList
              todos={todos}
              onToggle={onToggleTodo}
              onSchedule={onScheduleTodo}
              onDelete={onDeleteTodo}
              emptyTitle={t.dateDrawer.noTasks}
              emptyDescription={t.dateDrawer.addTaskForDate}
            />
          </div>

          {/* Today's Journal Section */}
          <div className="space-y-3 pt-6 border-t border-[#e0dad2]">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#a09a90] flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#5a5a40]" />
                <span>{t.dateDrawer.journalPreview}</span>
              </p>

              <button
                type="button"
                onClick={() => onOpenJournalEditor(dateStr)}
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-white bg-[#5a5a40] hover:bg-[#4a4a34] rounded-full shadow-2xs transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{journalEntry ? t.dateDrawer.editEntry : t.dateDrawer.writeEntry}</span>
              </button>
            </div>

            {journalEntry ? (
              <div className="p-4 bg-white rounded-xl border border-[#e0dad2] shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="font-serif font-semibold text-base text-[#5a5a40]">
                    {journalEntry.title || t.dateDrawer.untitledEntry}
                  </h5>
                  {journalMood && (
                    <span className="text-lg" title={journalMood.label}>
                      {journalMood.emoji}
                    </span>
                  )}
                </div>

                {journalEntry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {journalEntry.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-[#f0ede6] px-2 py-0.5 text-[10px] text-[#8a847a]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="font-serif italic leading-relaxed text-[#5a5a40] text-sm">
                  <p className="line-clamp-4">
                    {journalEntry.plainText || t.dateDrawer.noTextContent}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 text-center rounded-xl bg-white/50 border border-dashed border-[#e0dad2]">
                <p className="text-xs text-[#a09a90]">{t.dateDrawer.noJournalForDay}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
