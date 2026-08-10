import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../services/database';
import { journalService } from '../services/journalService';
import type { JournalEntry, MoodType } from '../types';

export function useJournals() {
  const entries = useLiveQuery(() => db.journalEntries.orderBy('date').reverse().toArray(), []) || [];

  const getEntryForDate = (dateStr: string): JournalEntry | undefined => {
    return entries.find(e => e.date === dateStr);
  };

  const saveEntry = async (data: {
    date: string;
    title: string;
    content: string;
    mood?: MoodType | null;
    tags?: string[];
    images?: string[];
  }) => {
    return await journalService.createOrUpdateEntry(data);
  };

  const updateMood = async (dateStr: string, mood: MoodType | null) => {
    return await journalService.updateMood(dateStr, mood);
  };

  const deleteEntry = async (id: string) => {
    return await journalService.deleteEntry(id);
  };

  return {
    entries,
    getEntryForDate,
    saveEntry,
    updateMood,
    deleteEntry,
  };
}
