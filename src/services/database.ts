import Dexie, { type Table } from 'dexie';
import type { Todo, JournalEntry, Tag, UserSettings } from '../types';

export class KomorebiDatabase extends Dexie {
  todos!: Table<Todo, string>;
  journalEntries!: Table<JournalEntry, string>;
  tags!: Table<Tag, string>;
  settings!: Table<UserSettings, string>;

  constructor() {
    super('komorebi_planner_db');
    
    this.version(1).stores({
      todos: 'id, startDate, dueDate, completed, priority, createdAt',
      journalEntries: 'id, &date, mood, createdAt, updatedAt',
      tags: 'id, &name',
      settings: 'id'
    });
  }
}

export const db = new KomorebiDatabase();

// Seed initial settings if empty
export async function initializeDatabase() {
  const settingsCount = await db.settings.count();
  if (settingsCount === 0) {
    await db.settings.put({
      id: 'default',
      theme: 'paper',
      locale: 'en-US',
      firstDayOfWeek: 1, // Monday
    });
  }

  // Seed sample welcome data if brand new
  const todoCount = await db.todos.count();
  const journalCount = await db.journalEntries.count();

  if (todoCount === 0 && journalCount === 0) {
    const todayStr = new Date().toISOString().split('T')[0];

    try {
      await db.todos.bulkPut([
        {
          id: 'welcome-1',
          title: 'Explore Komorebi Planner',
          description: 'Welcome to your new calm personal digital journal and planner.',
          completed: false,
          startDate: todayStr,
          dueDate: todayStr,
          priority: 'high',
          tags: ['welcome'],
          createdAt: Date.now(),
          completedAt: null
        },
        {
          id: 'welcome-2',
          title: 'Write your first journal entry',
          description: 'Reflect on your goals for today.',
          completed: false,
          startDate: todayStr,
          dueDate: todayStr,
          priority: 'medium',
          tags: ['journal'],
          createdAt: Date.now(),
          completedAt: null
        },
        {
          id: 'welcome-inbox-1',
          title: 'Review backup and export settings',
          description: 'Keep your data safe with offline JSON backup.',
          completed: false,
          startDate: null,
          dueDate: null,
          priority: 'low',
          tags: ['settings'],
          createdAt: Date.now(),
          completedAt: null
        }
      ]);

      await db.journalEntries.put({
        id: 'welcome-journal-1',
        date: todayStr,
        title: 'Welcome to Komorebi Planner 🌿',
        content: '<h2>A new chapter begins</h2><p>Welcome to <strong>Komorebi Planner</strong>. Sunlight filtering through the trees — a calm space to organize your tasks, journal your thoughts, and reflect on your growth.</p><ul><li>Organize tasks by date or keep them in your Inbox</li><li>Write rich-text journal entries with moods and tags</li><li>Track your habits and daily completion statistics</li></ul><p>Everything is saved securely inside your browser using IndexedDB.</p>',
        plainText: 'A new chapter begins. Welcome to Komorebi Planner. Sunlight filtering through the trees - a calm space to organize your tasks, journal your thoughts, and reflect on your growth.',
        mood: 'good',
        tags: ['welcome', 'journal'],
        images: [],
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
    } catch (err) {
      console.warn('Initial seed skipped or failed silently:', err);
    }
  }
}
