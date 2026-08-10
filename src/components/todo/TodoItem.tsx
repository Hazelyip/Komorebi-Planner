import React, { useState } from 'react';
import { Check, Calendar, Trash2, Tag as TagIcon } from 'lucide-react';
import type { Todo } from '../../types';
import { PriorityBadge } from '../common/PriorityBadge';
import { useLanguage } from '../../i18n/LanguageContext';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onSchedule?: (id: string, newDate: string | null) => void;
  onDelete: (id: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onSchedule,
  onDelete,
}) => {
  const { t } = useLanguage();
  const [isEditingDate, setIsEditingDate] = useState(false);

  return (
    <div
      className={`group p-3 rounded-lg border transition-all ${
        todo.completed
          ? 'bg-[#f8f6f2] border-[#e0dad2] opacity-75'
          : 'bg-white border-[#e0dad2] hover:border-[#a09a90] shadow-2xs'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Custom Checkbox */}
        <button
          type="button"
          onClick={() => onToggle(todo.id)}
          className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 cursor-pointer ${
            todo.completed
              ? 'bg-[#5a5a40] border-[#5a5a40] text-white'
              : 'border-[#a09a90] bg-white hover:border-[#5a5a40]'
          }`}
        >
          {todo.completed && <Check className="w-3 h-3 text-white stroke-[3]" />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span
              className={`text-sm font-medium leading-tight break-words ${
                todo.completed ? 'line-through text-[#8a847a] decoration-[#a09a90]' : 'text-[#3a3a3a]'
              }`}
            >
              {todo.title}
            </span>

            <div className="flex items-center gap-1.5 shrink-0">
              <PriorityBadge priority={todo.priority} size="sm" />

              <button
                type="button"
                onClick={() => onDelete(todo.id)}
                className="p-1 rounded text-[#a09a90] hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                title={t.todo.deleteTask}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Subtitle / Details toggle */}
          {todo.description && (
            <p className="mt-1 text-xs text-[#8a847a] line-clamp-2">{todo.description}</p>
          )}

          {/* Meta Info Bar: Date & Tags */}
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[#8a847a]">
            {/* Date Badge / Change Date */}
            {isEditingDate ? (
              <div className="flex items-center gap-1.5 bg-[#f0ede6] p-1 rounded-md border border-[#e0dad2]">
                <input
                  type="date"
                  defaultValue={todo.startDate || ''}
                  onChange={(e) => {
                    onSchedule?.(todo.id, e.target.value || null);
                    setIsEditingDate(false);
                  }}
                  className="text-xs bg-white border border-[#e0dad2] rounded px-1.5 py-0.5 text-[#3a3a3a]"
                />
                <button
                  type="button"
                  onClick={() => {
                    onSchedule?.(todo.id, null);
                    setIsEditingDate(false);
                  }}
                  className="text-[11px] text-[#5a5a40] font-semibold hover:underline px-1"
                >
                  {t.todo.clearInbox}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingDate(false)}
                  className="text-[11px] text-[#8a847a] px-1"
                >
                  {t.todo.cancel}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditingDate(true)}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#f0ede6] border border-[#e0dad2] text-[#8a847a] hover:text-[#5a5a40] transition-colors cursor-pointer text-[11px]"
              >
                <Calendar className="w-3 h-3 text-[#5a5a40]" />
                <span>
                  {todo.startDate ? todo.startDate : t.todo.unscheduled}
                </span>
              </button>
            )}

            {/* Tags */}
            {todo.tags.length > 0 && (
              <div className="flex items-center gap-1">
                {todo.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-0.5 rounded-full bg-[#f0ede6] px-2 py-0.5 text-[10px] text-[#8a847a]"
                  >
                    <TagIcon className="w-2.5 h-2.5 text-[#a09a90]" />
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
