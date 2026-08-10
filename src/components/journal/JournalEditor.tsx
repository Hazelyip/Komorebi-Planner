import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Link from '@tiptap/extension-link';

import {
  Bold,
  Italic,
  List,
  ListOrdered,
  ListTodo,
  Quote,
  Heading1,
  Heading2,
  Image as ImageIcon,
  Minus,
  Save,
  ArrowLeft,
  Trash2,
  Calendar,
  Tag as TagIcon,
  Smile,
} from 'lucide-react';
import type { JournalEntry, MoodType } from '../../types';
import { MoodSelector } from '../common/MoodSelector';
import { useLanguage } from '../../i18n/LanguageContext';

interface JournalEditorProps {
  dateStr: string;
  initialEntry?: JournalEntry;
  onSave: (data: {
    date: string;
    title: string;
    content: string;
    mood?: MoodType | null;
    tags?: string[];
    images?: string[];
  }) => void;
  onDelete?: (id: string) => void;
  onBack: () => void;
}

export const JournalEditor: React.FC<JournalEditorProps> = ({
  dateStr,
  initialEntry,
  onSave,
  onDelete,
  onBack,
}) => {
  const { t } = useLanguage();
  const [currentDate, setCurrentDate] = useState(dateStr);
  const [title, setTitle] = useState(initialEntry?.title || '');
  const [mood, setMood] = useState<MoodType | null>(initialEntry?.mood || null);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(initialEntry?.tags || []);
  const [images, setImages] = useState<string[]>(initialEntry?.images || []);
  const [savedNotification, setSavedNotification] = useState(false);

  useEffect(() => {
    if (initialEntry) {
      setTitle(initialEntry.title || '');
      setMood(initialEntry.mood || null);
      setTags(initialEntry.tags || []);
      setImages(initialEntry.images || []);
    } else {
      setTitle('');
      setMood(null);
      setTags([]);
      setImages([]);
    }
    setCurrentDate(dateStr);
  }, [dateStr, initialEntry]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: '...',
      }),
      Image.configure({
        allowBase64: true,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: initialEntry?.content || '',
    editorProps: {
      attributes: {
        class:
          'prose prose-stone max-w-none focus:outline-none min-h-[280px] p-4 bg-white rounded-b-xl text-[#3a3a3a] font-serif leading-relaxed text-sm md:text-base',
      },
    },
  });

  useEffect(() => {
    if (editor) {
      const targetContent = initialEntry?.content || '';
      if (editor.getHTML() !== targetContent) {
        editor.commands.setContent(targetContent);
      }
    }
  }, [initialEntry, editor]);

  const handleSave = () => {
    if (!editor) return;
    const contentHtml = editor.getHTML();

    onSave({
      date: currentDate,
      title: title.trim() || 'Untitled Journal',
      content: contentHtml,
      mood,
      tags,
      images,
    });

    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2000);
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim().toLowerCase().replace(/^#/, '');
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target?.result as string;
      if (base64Url) {
        editor.chain().focus().setImage({ src: base64Url }).run();
        setImages([...images, base64Url]);
      }
    };
    reader.readAsDataURL(file);
  };

  if (!editor) return null;

  return (
    <div className="max-w-4xl mx-auto p-3 md:p-6 space-y-4">
      {/* Top Header Controls */}
      <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-[#e0dad2] shadow-2xs">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-[#8a847a] hover:text-[#5a5a40] hover:bg-[#f0ede6] rounded-full transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.journal.back}</span>
        </button>

        <div className="flex items-center gap-2">
          {initialEntry && onDelete && (
            <button
              type="button"
              onClick={() => {
                if (confirm('Delete this journal entry?')) {
                  onDelete(initialEntry.id);
                  onBack();
                }
              }}
              className="p-2 text-[#a09a90] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              title={t.journal.deleteTitle}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#5a5a40] hover:bg-[#4a4a34] rounded-full shadow-xs cursor-pointer transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>{t.journal.saveEntry}</span>
          </button>
        </div>
      </div>

      {savedNotification && (
        <div className="p-3 bg-[#f0ede6] border border-[#e0dad2] text-[#5a5a40] text-xs font-medium rounded-lg text-center animate-fade-in">
          {t.journal.saveEntry} ✓
        </div>
      )}

      {/* Editor Body */}
      <div className="bg-white rounded-xl border border-[#e0dad2] shadow-2xs p-5 space-y-4">
        {/* Date and Mood Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#e0dad2]">
          <div className="flex items-center gap-2 text-xs font-serif text-[#a09a90]">
            <Calendar className="w-4 h-4 text-[#5a5a40]" />
            <input
              type="date"
              value={currentDate}
              onChange={(e) => setCurrentDate(e.target.value)}
              className="bg-[#f8f6f2] border border-[#e0dad2] rounded-lg px-2.5 py-1 text-xs text-[#3a3a3a] focus:outline-none focus:border-[#5a5a40]"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-serif text-[#8a847a]">{t.journal.mood}</span>
            <MoodSelector selectedMood={mood} onSelectMood={setMood} />
          </div>
        </div>

        {/* Title Input */}
        <div>
          <input
            type="text"
            placeholder={t.journal.titlePlaceholder}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full font-serif text-xl md:text-2xl font-light text-[#5a5a40] placeholder-[#a09a90] bg-transparent border-none focus:outline-none"
          />
        </div>

        {/* Tags Row */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#f0ede6]">
          <TagIcon className="w-3.5 h-3.5 text-[#a09a90]" />
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

          <input
            type="text"
            placeholder={t.journal.addTag}
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTag();
              }
            }}
            className="text-xs bg-transparent border-none focus:outline-none text-[#5a5a40] placeholder-[#a09a90] w-24"
          />
        </div>

        {/* Editor Toolbar & Content */}
        <div className="border border-[#e0dad2] rounded-xl overflow-hidden mt-4">
          <div className="flex flex-wrap items-center gap-1 p-2 bg-[#f8f6f2] border-b border-[#e0dad2]">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-1.5 rounded-md hover:bg-[#e0dad2] transition-colors ${
                editor.isActive('bold') ? 'bg-[#e0dad2] text-[#5a5a40]' : 'text-[#8a847a]'
              }`}
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-1.5 rounded-md hover:bg-[#e0dad2] transition-colors ${
                editor.isActive('italic') ? 'bg-[#e0dad2] text-[#5a5a40]' : 'text-[#8a847a]'
              }`}
            >
              <Italic className="w-4 h-4" />
            </button>

            <span className="w-px h-4 bg-[#e0dad2] mx-1" />

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={`p-1.5 rounded-md hover:bg-[#e0dad2] transition-colors ${
                editor.isActive('heading', { level: 1 }) ? 'bg-[#e0dad2] text-[#5a5a40]' : 'text-[#8a847a]'
              }`}
            >
              <Heading1 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`p-1.5 rounded-md hover:bg-[#e0dad2] transition-colors ${
                editor.isActive('heading', { level: 2 }) ? 'bg-[#e0dad2] text-[#5a5a40]' : 'text-[#8a847a]'
              }`}
            >
              <Heading2 className="w-4 h-4" />
            </button>

            <span className="w-px h-4 bg-[#e0dad2] mx-1" />

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-1.5 rounded-md hover:bg-[#e0dad2] transition-colors ${
                editor.isActive('bulletList') ? 'bg-[#e0dad2] text-[#5a5a40]' : 'text-[#8a847a]'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-1.5 rounded-md hover:bg-[#e0dad2] transition-colors ${
                editor.isActive('orderedList') ? 'bg-[#e0dad2] text-[#5a5a40]' : 'text-[#8a847a]'
              }`}
            >
              <ListOrdered className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleTaskList().run()}
              className={`p-1.5 rounded-md hover:bg-[#e0dad2] transition-colors ${
                editor.isActive('taskList') ? 'bg-[#e0dad2] text-[#5a5a40]' : 'text-[#8a847a]'
              }`}
            >
              <ListTodo className="w-4 h-4" />
            </button>

            <span className="w-px h-4 bg-[#e0dad2] mx-1" />

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`p-1.5 rounded-md hover:bg-[#e0dad2] transition-colors ${
                editor.isActive('blockquote') ? 'bg-[#e0dad2] text-[#5a5a40]' : 'text-[#8a847a]'
              }`}
            >
              <Quote className="w-4 h-4" />
            </button>

            <label className="p-1.5 rounded-md hover:bg-[#e0dad2] text-[#8a847a] cursor-pointer transition-colors">
              <ImageIcon className="w-4 h-4" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
};

