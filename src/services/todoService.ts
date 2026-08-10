import { db } from './database';
import type { Todo, Priority } from '../types';

export const todoService = {
  async getAllTodos(): Promise<Todo[]> {
    return await db.todos.orderBy('createdAt').reverse().toArray();
  },

  async getTodosByDate(dateStr: string): Promise<Todo[]> {
    return await db.todos.filter(todo => todo.startDate === dateStr).toArray();
  },

  async getInboxTodos(): Promise<Todo[]> {
    return await db.todos.filter(todo => todo.startDate === null).toArray();
  },

  async getTodoById(id: string): Promise<Todo | undefined> {
    return await db.todos.get(id);
  },

  async createTodo(data: {
    title: string;
    description?: string;
    startDate?: string | null;
    dueDate?: string | null;
    priority?: Priority;
    tags?: string[];
  }): Promise<Todo> {
    const newTodo: Todo = {
      id: `todo-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: data.title.trim(),
      description: data.description?.trim() || '',
      completed: false,
      startDate: data.startDate ?? null,
      dueDate: data.dueDate ?? (data.startDate || null),
      priority: data.priority || 'medium',
      tags: data.tags || [],
      createdAt: Date.now(),
      completedAt: null,
    };

    await db.todos.put(newTodo);
    return newTodo;
  },

  async updateTodo(id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>): Promise<Todo | undefined> {
    const existing = await db.todos.get(id);
    if (!existing) return undefined;

    const updated: Todo = {
      ...existing,
      ...updates,
      completedAt: updates.completed !== undefined
        ? (updates.completed ? (existing.completedAt || Date.now()) : null)
        : existing.completedAt,
    };

    await db.todos.put(updated);
    return updated;
  },

  async toggleTodo(id: string): Promise<Todo | undefined> {
    const existing = await db.todos.get(id);
    if (!existing) return undefined;

    const nextCompleted = !existing.completed;
    const updated: Todo = {
      ...existing,
      completed: nextCompleted,
      completedAt: nextCompleted ? Date.now() : null,
    };

    await db.todos.put(updated);
    return updated;
  },

  async scheduleTodo(id: string, targetDate: string | null): Promise<Todo | undefined> {
    const existing = await db.todos.get(id);
    if (!existing) return undefined;

    const updated: Todo = {
      ...existing,
      startDate: targetDate,
      dueDate: targetDate || existing.dueDate,
    };

    await db.todos.put(updated);
    return updated;
  },

  async deleteTodo(id: string): Promise<void> {
    await db.todos.delete(id);
  }
};
