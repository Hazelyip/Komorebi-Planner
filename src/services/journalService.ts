import { db } from './database';
import type { JournalEntry, MoodType } from '../types';

function extractPlainText(html: string): string {
  if (typeof window === 'undefined') return html;
  const temp = document.createElement('div');
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || '';
}

export const journalService = {
  async getAllEntries(): Promise<JournalEntry[]> {
    return await db.journalEntries.orderBy('date').reverse().toArray();
  },

  async getEntryByDate(dateStr: string): Promise<JournalEntry | undefined> {
    return await db.journalEntries.where('date').equals(dateStr).first();
  },

  async getEntryById(id: string): Promise<JournalEntry | undefined> {
    return await db.journalEntries.get(id);
  },

  async createOrUpdateEntry(data: {
    date: string;
    title: string;
    content: string;
    mood?: MoodType | null;
    tags?: string[];
    images?: string[];
  }): Promise<JournalEntry> {
    const existing = await this.getEntryByDate(data.date);
    const plainText = extractPlainText(data.content);
    const now = Date.now();

    if (existing) {
      const updated: JournalEntry = {
        ...existing,
        title: data.title.trim(),
        content: data.content,
        plainText,
        mood: data.mood !== undefined ? data.mood : existing.mood,
        tags: data.tags || existing.tags,
        images: data.images || existing.images,
        updatedAt: now,
      };
      await db.journalEntries.put(updated);
      return updated;
    } else {
      const newEntry: JournalEntry = {
        id: `journal-${data.date}-${Date.now()}`,
        date: data.date,
        title: data.title.trim() || 'Untitled Journal',
        content: data.content,
        plainText,
        mood: data.mood ?? null,
        tags: data.tags || [],
        images: data.images || [],
        createdAt: now,
        updatedAt: now,
      };
      await db.journalEntries.put(newEntry);
      return newEntry;
    }
  },

  async updateMood(dateStr: string, mood: MoodType | null): Promise<JournalEntry | undefined> {
    const existing = await this.getEntryByDate(dateStr);
    if (!existing) {
      // Create empty entry with mood
      return await this.createOrUpdateEntry({
        date: dateStr,
        title: '',
        content: '',
        mood,
      });
    }

    const updated = { ...existing, mood, updatedAt: Date.now() };
    await db.journalEntries.put(updated);
    return updated;
  },

  async deleteEntry(id: string): Promise<void> {
    await db.journalEntries.delete(id);
  },

  async searchEntries(query: string, tagFilter?: string, moodFilter?: MoodType | null): Promise<JournalEntry[]> {
    let entries = await db.journalEntries.orderBy('date').reverse().toArray();

    if (tagFilter) {
      entries = entries.filter(e => e.tags.includes(tagFilter));
    }

    if (moodFilter) {
      entries = entries.filter(e => e.mood === moodFilter);
    }

    if (query.trim()) {
      const q = query.toLowerCase().trim();
      entries = entries.filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.plainText.toLowerCase().includes(q) ||
        e.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    return entries;
  }
};
