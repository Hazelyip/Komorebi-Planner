export type Priority = 'low' | 'medium' | 'high';

export type MoodType = 'very_good' | 'good' | 'neutral' | 'not_good' | 'very_bad';

export interface MoodOption {
  type: MoodType;
  emoji: string;
  label: string;
  color: string;
}

export const MOOD_OPTIONS: MoodOption[] = [
  { type: 'very_good', emoji: '😄', label: 'Very Good', color: '#10B981' },
  { type: 'good', emoji: '🙂', label: 'Good', color: '#3B82F6' },
  { type: 'neutral', emoji: '😐', label: 'Neutral', color: '#6B7280' },
  { type: 'not_good', emoji: '😔', label: 'Not Good', color: '#F59E0B' },
  { type: 'very_bad', emoji: '😫', label: 'Very Bad', color: '#EF4444' },
];

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  startDate: string | null; // ISO Date YYYY-MM-DD or null for Inbox
  dueDate: string | null;   // ISO Date YYYY-MM-DD or null
  priority: Priority;
  tags: string[];
  createdAt: number;        // Timestamp
  completedAt: number | null;
}

export interface JournalEntry {
  id: string;
  date: string;            // ISO Date YYYY-MM-DD
  title: string;
  content: string;          // HTML string from Tiptap
  plainText: string;        // Search index text
  mood: MoodType | null;
  tags: string[];
  images: string[];         // Data URLs or image identifiers
  createdAt: number;
  updatedAt: number;
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
}

export interface UserSettings {
  id: string;
  theme: 'paper' | 'dark';
  locale: string;
  firstDayOfWeek: 0 | 1; // 0 = Sunday, 1 = Monday
}

export interface DailyStats {
  date: string;
  totalTodos: number;
  completedTodos: number;
  pendingTodos: number;
  completionRate: number; // 0 - 100
  hasJournal: boolean;
  mood: MoodType | null;
}

export interface BackupData {
  version: number;
  exportedAt: string;
  todos: Todo[];
  journalEntries: JournalEntry[];
  tags: Tag[];
  settings?: UserSettings;
}
