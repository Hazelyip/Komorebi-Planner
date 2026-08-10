import React, { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon, Tag as TagIcon, Check } from 'lucide-react';
import type { Priority } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';

interface CreateTodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description?: string;
    startDate?: string | null;
    dueDate?: string | null;
    priority: Priority;
    tags: string[];
  }) => void;
  defaultDate?: string | null;
}

export const CreateTodoModal: React.FC<CreateTodoModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  defaultDate = null,
}) => {
  const { t } = useLanguage();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState<string | null>(defaultDate);
  const [priority, setPriority] = useState<Priority>('medium');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setSelectedDate(defaultDate);
      setTitle('');
      setDescription('');
      setPriority('medium');
      setTagInput('');
      setTags([]);
    }
  }, [isOpen, defaultDate]);

  if (!isOpen) return null;

  const handleAddTag = () => {
    const trimmed = tagInput.trim().toLowerCase().replace(/^#/, '');
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      startDate: selectedDate || null,
      dueDate: selectedDate || null,
      priority,
      tags,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-[#e0dad2] p-6 select-none">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#e0dad2]">
          <h3 className="font-serif text-lg font-light text-[#5a5a40]">{t.quickAddModal.title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-[#a09a90] hover:text-[#5a5a40] hover:bg-[#f0ede6] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-[#8a847a] uppercase tracking-wider mb-1">
              {t.quickAddModal.taskTitlePlaceholder} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder={t.quickAddModal.taskTitlePlaceholder}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-[#f8f6f2] border border-[#e0dad2] rounded-lg focus:outline-none focus:border-[#5a5a40] focus:ring-1 focus:ring-[#5a5a40] text-[#3a3a3a]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-[#8a847a] uppercase tracking-wider mb-1">
              {t.quickAddModal.taskDescPlaceholder}
            </label>
            <textarea
              rows={2}
              placeholder={t.quickAddModal.taskDescPlaceholder}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-[#f8f6f2] border border-[#e0dad2] rounded-lg focus:outline-none focus:border-[#5a5a40] focus:ring-1 focus:ring-[#5a5a40] text-[#3a3a3a] resize-none"
            />
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-semibold text-[#8a847a] uppercase tracking-wider mb-1">
              {t.quickAddModal.dateLabel}
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1 flex items-center justify-between px-3 py-1.5 text-sm bg-[#f8f6f2] border border-[#e0dad2] rounded-lg focus-within:border-[#5a5a40] focus-within:ring-1 focus-within:ring-[#5a5a40]">
                <span className={selectedDate ? 'text-[#3a3a3a] font-medium' : 'text-[#a09a90] font-mono text-xs'}>
                  {selectedDate ? selectedDate.replace(/-/g, '/') : 'yyyy/mm/dd'}
                </span>
                <CalendarIcon className="w-4 h-4 text-[#8a847a] pointer-events-none" />
                <input
                  type="date"
                  value={selectedDate || ''}
                  onChange={(e) => setSelectedDate(e.target.value || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-sm"
                />
              </div>
              <button
                type="button"
                onClick={() => setSelectedDate(null)}
                className={`px-3 py-1.5 text-xs rounded-full border transition-colors cursor-pointer shrink-0 ${
                  selectedDate === null
                    ? 'bg-[#5a5a40] text-white border-[#5a5a40]'
                    : 'bg-white border-[#e0dad2] text-[#8a847a] hover:bg-[#f0ede6]'
                }`}
              >
                {t.quickAddModal.inboxOption}
              </button>
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-semibold text-[#8a847a] uppercase tracking-wider mb-1.5">
              {t.quickAddModal.priorityLabel}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['low', 'medium', 'high'] as Priority[]).map((p) => {
                const isSelected = priority === p;
                const label = t.quickAddModal.priorities[p];
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`py-1.5 text-xs font-medium capitalize rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? p === 'high'
                          ? 'bg-[#fdf2f2] border-[#ef4444] text-[#9b1c1c]'
                          : p === 'medium'
                          ? 'bg-[#fffbeb] border-[#f59e0b] text-[#92400e]'
                          : 'bg-[#f0ede6] border-[#5a5a40] text-[#5a5a40]'
                        : 'bg-white border-[#e0dad2] text-[#8a847a] hover:bg-[#f0ede6]'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-[#8a847a] uppercase tracking-wider mb-1">
              Tags
            </label>
            <div className="flex items-center gap-2 mb-2">
              <div className="relative flex-1">
                <TagIcon className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#a09a90]" />
                <input
                  type="text"
                  placeholder={t.quickAddModal.tagsPlaceholder}
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#f8f6f2] border border-[#e0dad2] rounded-lg focus:outline-none focus:border-[#5a5a40] text-[#3a3a3a]"
                />
              </div>
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-1.5 text-xs bg-[#e0dad2] text-[#3a3a3a] rounded-lg hover:bg-[#d0c2b4] cursor-pointer"
              >
                +
              </button>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full bg-[#f0ede6] border border-[#e0dad2] px-2.5 py-0.5 text-xs text-[#8a847a]"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-red-600 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#e0dad2]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#8a847a] hover:bg-[#f0ede6] rounded-full cursor-pointer"
            >
              {t.quickAddModal.cancel}
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#5a5a40] hover:bg-[#4a4a34] rounded-full shadow-xs cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{t.quickAddModal.save}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

