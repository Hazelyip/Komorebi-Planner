import React, { useState, useEffect } from 'react';
import { Search, X, ArrowLeft, Calendar, Tag as TagIcon, Smile } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import type { JournalEntry, MoodType } from '../../types';
import { MOOD_OPTIONS } from '../../types';
import { journalService } from '../../services/journalService';
import { EmptyState } from '../common/EmptyState';
import { useLanguage } from '../../i18n/LanguageContext';

interface JournalSearchViewProps {
  onSelectEntry: (entry: JournalEntry) => void;
  onBack: () => void;
}

export const JournalSearchView: React.FC<JournalSearchViewProps> = ({
  onSelectEntry,
  onBack,
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
  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [results, setResults] = useState<JournalEntry[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    async function load() {
      const res = await journalService.searchEntries(query, selectedTag, selectedMood);
      setResults(res);

      // Collect unique tags
      const allEntries = await journalService.getAllEntries();
      const tagSet = new Set<string>();
      allEntries.forEach((e) => e.tags?.forEach((tag) => tagSet.add(tag)));
      setAllTags(Array.from(tagSet));
    }
    load();
  }, [query, selectedTag, selectedMood]);

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 flex flex-col h-[580px] sm:h-[640px]">
      {/* Fixed Top Controls */}
      <div className="flex-shrink-0 space-y-4 mb-4">
        {/* Top Header */}
        <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-[#e0dad2] shadow-2xs">
          <button
            type="button"
            onClick={onBack}
            className="p-1.5 rounded-full text-[#8a847a] hover:bg-[#f0ede6] hover:text-[#5a5a40] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="font-serif text-lg font-light text-[#5a5a40]">{t.journal.searchPlaceholder}</h2>
        </div>

        {/* Search Input Bar */}
        <div className="p-5 bg-white rounded-xl border border-[#e0dad2] shadow-2xs space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-[#a09a90] absolute left-3.5 top-3" />
            <input
              type="text"
              autoFocus
              placeholder={t.journal.searchPlaceholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 text-sm bg-[#f8f6f2] border border-[#e0dad2] rounded-lg focus:outline-none focus:border-[#5a5a40] text-[#3a3a3a]"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-3 top-3 text-[#a09a90] hover:text-[#3a3a3a]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filters Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#e0dad2] text-xs">
            {/* Tag Filter */}
            {allTags.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[#a09a90] flex items-center gap-1">
                  <TagIcon className="w-3 h-3" /> Tag:
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedTag('')}
                  className={`px-2.5 py-0.5 rounded-full transition-colors cursor-pointer ${
                    selectedTag === ''
                      ? 'bg-[#5a5a40] text-white font-medium'
                      : 'bg-[#f0ede6] text-[#8a847a] hover:bg-[#e0dad2]'
                  }`}
                >
                  All
                </button>
                {allTags.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSelectedTag(selectedTag === t ? '' : t)}
                    className={`px-2.5 py-0.5 rounded-full transition-colors cursor-pointer ${
                      selectedTag === t
                        ? 'bg-[#5a5a40] text-white font-medium'
                        : 'bg-[#f0ede6] text-[#8a847a] hover:bg-[#e0dad2]'
                    }`}
                  >
                    #{t}
                  </button>
                ))}
              </div>
            )}

            {/* Mood Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[#a09a90] flex items-center gap-1">
                <Smile className="w-3 h-3" /> {t.journal.mood}
              </span>
              <button
                type="button"
                onClick={() => setSelectedMood(null)}
                className={`px-2.5 py-0.5 rounded-full transition-colors cursor-pointer ${
                  selectedMood === null
                    ? 'bg-[#5a5a40] text-white font-medium'
                    : 'bg-[#f0ede6] text-[#8a847a] hover:bg-[#e0dad2]'
                }`}
              >
                {language === 'zh' ? '全部' : language === 'ja' ? 'すべて' : 'All'}
              </button>
              {MOOD_OPTIONS.map((m) => (
                <button
                  key={m.type}
                  type="button"
                  onClick={() => setSelectedMood(selectedMood === m.type ? null : m.type)}
                  className={`p-1 rounded-lg transition-colors cursor-pointer ${
                    selectedMood === m.type ? 'bg-[#e0dad2]' : 'hover:bg-[#f0ede6]'
                  }`}
                  title={m.label}
                >
                  {m.emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Search Results List Container - internal scrolling */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar touch-pan-y">
        {results.length === 0 ? (
          <EmptyState
            title={t.journal.noMatchingEntries}
            description={t.journal.adjustQueryOrFilters}
          />
        ) : (
          results.map((entry) => {
            let parsedDate = new Date();
            try {
              parsedDate = parseISO(entry.date);
            } catch {
              // fallback
            }

            const moodObj = entry.mood
              ? MOOD_OPTIONS.find((m) => m.type === entry.mood)
              : null;

            return (
              <article
                key={entry.id}
                onClick={() => onSelectEntry(entry)}
                className="p-5 bg-white rounded-xl border border-[#e0dad2] hover:border-[#a09a90] shadow-2xs transition-all cursor-pointer select-none space-y-2"
              >
                <div className="flex items-center justify-between text-xs text-[#a09a90] font-serif">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#5a5a40]" />
                    <span>{formatDateLocalized(parsedDate)}</span>
                  </div>
                  {moodObj && <span>{moodObj.emoji}</span>}
                </div>

                <h3 className="font-serif text-base font-medium text-[#3a3a3a]">
                  {entry.title || 'Untitled Journal'}
                </h3>

                <p className="font-serif text-xs text-[#8a847a] line-clamp-2 leading-relaxed">
                  {entry.plainText}
                </p>

                {entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {entry.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-[#f0ede6] text-[#8a847a]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>
    </div>
  );
};
