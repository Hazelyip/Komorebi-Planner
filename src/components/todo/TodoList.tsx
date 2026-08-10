import React, { useState } from 'react';
import type { Todo } from '../../types';
import { TodoItem } from './TodoItem';
import { EmptyState } from '../common/EmptyState';
import { useLanguage } from '../../i18n/LanguageContext';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onSchedule?: (id: string, newDate: string | null) => void;
  onDelete: (id: string) => void;
  emptyTitle?: string;
  emptyDescription?: string;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  onToggle,
  onSchedule,
  onDelete,
  emptyTitle = 'No tasks found.',
  emptyDescription = 'Add a task to stay organized.',
}) => {
  const { t } = useLanguage();
  const [showCompleted, setShowCompleted] = useState(true);

  if (todos.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  const pendingTodos = todos.filter((t) => !t.completed);
  const completedTodos = todos.filter((t) => t.completed);

  return (
    <div className="space-y-4">
      {/* Pending Todos */}
      <div className="space-y-2">
        {pendingTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            onSchedule={onSchedule}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* Completed Section Toggle */}
      {completedTodos.length > 0 && (
        <div className="pt-2 border-t border-[#EAE5DC]">
          <button
            type="button"
            onClick={() => setShowCompleted(!showCompleted)}
            className="flex items-center gap-1.5 text-xs font-medium text-[#78716C] hover:text-[#2D2B28] cursor-pointer mb-2"
          >
            <span>
              {t.todo.completedCount(completedTodos.length)}
            </span>
          </button>

          {showCompleted && (
            <div className="space-y-2 opacity-80">
              {completedTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={onToggle}
                  onSchedule={onSchedule}
                  onDelete={onDelete}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
