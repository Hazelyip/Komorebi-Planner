import React from 'react';
import { Calendar, Plus, BookOpen, Search, Tag as TagIcon } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import type { JournalEntry } from '../../types';
import { MOOD_OPTIONS } from '../../types';
import { EmptyState } from '../common/EmptyState';
import { useLanguage } from '../../i18n/LanguageContext';

interface JournalTimelineProps {
  entries: JournalEntry[];
  onSelectEntry: (entry: JournalEntry) => void;
  onNewEntry: () => void;
  onOpenSearch: () => void;
}

export const JournalTimeline: React.FC<JournalTimelineProps> = ({
  entries,
  onSelectEntry,
  onNewEntry,
  onOpenSearch,
}) => {
  const { t, language } = useLanguage();

  const formatDateLocalized = (date: Date) => {
    const localeCode = language === 'zh' ? 'zh-CN' : language === 'ja' ? 'ja-JP' : 'en-US';
    return date.toLocaleDateString(localeCode, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    });
  };

  if (entries.length === 0) {
    return (
      <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-6">
        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-[#e0dad2] shadow-2xs">
          <h2 className="font-serif text-xl font-light text-[#5a5a40]">{t.nav.journal}</h2>
          <button
            type="button"
            onClick={onNewEntry}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-[#5a5a40] hover:bg-[#4a4a34] rounded-full shadow-xs cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{t.journal.newEntry}</span>
          </button>
        </div>
        <EmptyState
          title={t.journal.noEntries}
          description={t.journal.writeFirst}
          action={
            <button
              type="button"
              onClick={onNewEntry}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#5a5a40] hover:bg-[#4a4a34] rounded-full cursor-pointer transition-colors"
            >
              {t.journal.newEntry}
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 flex flex-col h-[580px] sm:h-[640px]">
      {/* Top Header */}
      <div className="flex-shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white rounded-xl border border-[#e0dad2] shadow-2xs mb-4">
        <div>
          <h2 className="font-serif text-xl font-light text-[#5a5a40]">{t.nav.journal}</h2>
          <p className="text-xs text-[#a09a90] mt-0.5">
            {t.journal.entriesCount(entries.length)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenSearch}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#8a847a] bg-[#f8f6f2] border border-[#e0dad2] hover:bg-[#f0ede6] rounded-full cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-[#5a5a40]" />
            <span>{t.journal.searchPlaceholder}</span>
          </button>

          <button
            type="button"
            onClick={onNewEntry}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#5a5a40] hover:bg-[#4a4a34] rounded-full shadow-xs cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{t.journal.newEntry}</span>
          </button>
        </div>
      </div>

      {/* Timeline List Container - fixed height + internal scrolling */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4 custom-scrollbar touch-pan-y">
        {entries.map((entry) => {
          let parsedDate = new Date();
          try {
            parsedDate = parseISO(entry.date);
          } catch {
            // fallback
          }

          const moodObj = entry.mood ? MOOD_OPTIONS.find((m) => m.type === entry.mood) : null;

          return (
            <article
              key={entry.id}
              onClick={() => onSelectEntry(entry)}
              className="group p-5 bg-white rounded-xl border border-[#e0dad2] hover:border-[#a09a90] shadow-2xs hover:shadow-xs transition-all cursor-pointer select-none space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-[#a09a90]">
                  <Calendar className="w-3.5 h-3.5 text-[#5a5a40]" />
                  <span>{formatDateLocalized(parsedDate)}</span>
                </div>
                {moodObj && (
                  <span className="text-base" title={moodObj.label}>
                    {moodObj.emoji}
                  </span>
                )}
              </div>

              <h3 className="font-serif text-lg font-medium text-[#5a5a40] group-hover:text-[#3a3a3a] transition-colors">
                {entry.title || 'Untitled Entry'}
              </h3>

              <p className="text-xs text-[#8a847a] line-clamp-2 leading-relaxed font-serif italic">
                {entry.plainText || 'No plain text content.'}
              </p>

              {entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {entry.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-medium bg-[#f0ede6] text-[#8a847a] rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
};

