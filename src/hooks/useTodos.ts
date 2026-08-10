import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../services/database';
import { todoService } from '../services/todoService';
import type { Todo, Priority } from '../types';

export function useTodos() {
  const allTodos = useLiveQuery(() => db.todos.orderBy('createdAt').reverse().toArray(), []) || [];

  const getTodosForDate = (dateStr: string): Todo[] => {
    return allTodos.filter(t => t.startDate === dateStr);
  };

  const inboxTodos = allTodos.filter(t => t.startDate === null);

  const addTodo = async (data: {
    title: string;
    description?: string;
    startDate?: string | null;
    dueDate?: string | null;
    priority?: Priority;
    tags?: string[];
  }) => {
    return await todoService.createTodo(data);
  };

  const toggleTodo = async (id: string) => {
    return await todoService.toggleTodo(id);
  };

  const updateTodo = async (id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>) => {
    return await todoService.updateTodo(id, updates);
  };

  const scheduleTodo = async (id: string, targetDate: string | null) => {
    return await todoService.scheduleTodo(id, targetDate);
  };

  const deleteTodo = async (id: string) => {
    return await todoService.deleteTodo(id);
  };

  return {
    todos: allTodos,
    inboxTodos,
    getTodosForDate,
    addTodo,
    toggleTodo,
    updateTodo,
    scheduleTodo,
    deleteTodo,
  };
}
