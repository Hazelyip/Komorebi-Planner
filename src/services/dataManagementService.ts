import { db } from './database';
import type { BackupData, Todo, JournalEntry, Tag, UserSettings } from '../types';

export const dataManagementService = {
  async exportBackup(): Promise<string> {
    const todos = await db.todos.toArray();
    const journalEntries = await db.journalEntries.toArray();
    const tags = await db.tags.toArray();
    const settingsArr = await db.settings.toArray();

    const backup: BackupData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      todos,
      journalEntries,
      tags,
      settings: settingsArr[0] || undefined,
    };

    return JSON.stringify(backup, null, 2);
  },

  validateBackup(jsonString: string): { valid: boolean; data?: BackupData; error?: string } {
    try {
      const parsed = JSON.parse(jsonString);

      if (!parsed || typeof parsed !== 'object') {
        return { valid: false, error: 'Invalid backup format: Not a JSON object.' };
      }

      if (!Array.isArray(parsed.todos) || !Array.isArray(parsed.journalEntries)) {
        return { valid: false, error: 'Invalid backup structure: Missing todos or journalEntries arrays.' };
      }

      return { valid: true, data: parsed as BackupData };
    } catch (err: any) {
      return { valid: false, error: `JSON Parse Error: ${err.message}` };
    }
  },

  async importBackup(backupData: BackupData, overwrite = false): Promise<{ success: boolean; message: string }> {
    try {
      await db.transaction('rw', [db.todos, db.journalEntries, db.tags, db.settings], async () => {
        if (overwrite) {
          await db.todos.clear();
          await db.journalEntries.clear();
          await db.tags.clear();
          await db.settings.clear();
        }

        if (backupData.todos && backupData.todos.length > 0) {
          await db.todos.bulkPut(backupData.todos);
        }

        if (backupData.journalEntries && backupData.journalEntries.length > 0) {
          await db.journalEntries.bulkPut(backupData.journalEntries);
        }

        if (backupData.tags && backupData.tags.length > 0) {
          await db.tags.bulkPut(backupData.tags);
        }

        if (backupData.settings) {
          await db.settings.put(backupData.settings);
        }
      });

      return {
        success: true,
        message: `Successfully imported ${backupData.todos?.length || 0} todos and ${backupData.journalEntries?.length || 0} journal entries.`,
      };
    } catch (err: any) {
      return { success: false, message: `Import failed: ${err.message}` };
    }
  },

  async clearAllData(): Promise<void> {
    await db.transaction('rw', [db.todos, db.journalEntries, db.tags], async () => {
      await db.todos.clear();
      await db.journalEntries.clear();
      await db.tags.clear();
    });
  }
};
