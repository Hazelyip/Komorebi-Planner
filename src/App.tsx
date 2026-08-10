import React, { useState, useEffect } from 'react';
import type { NavTab } from './components/layout/Sidebar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { Header } from './components/layout/Header';
import { CalendarView } from './components/calendar/CalendarView';
import { InboxView } from './components/todo/InboxView';
import { JournalTimeline } from './components/journal/JournalTimeline';
import { JournalEditor } from './components/journal/JournalEditor';
import { JournalSearchView } from './components/journal/JournalSearchView';
import { StatisticsView } from './components/statistics/StatisticsView';
import { SettingsView } from './components/settings/SettingsView';
import { CreateTodoModal } from './components/todo/CreateTodoModal';

import { initializeDatabase } from './services/database';
import { useTodos } from './hooks/useTodos';
import { useJournals } from './hooks/useJournals';
import type { JournalEntry } from './types';
import { format } from 'date-fns';
import { LanguageProvider } from './i18n/LanguageContext';

function MainApp() {
  const [currentTab, setCurrentTab] = useState<NavTab>('calendar');
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddDefaultDate, setQuickAddDefaultDate] = useState<string | null>(null);

  // Journal Sub-state
  const [journalMode, setJournalMode] = useState<'timeline' | 'editor' | 'search'>('timeline');
  const [activeJournalDate, setActiveJournalDate] = useState<string>(
    format(new Date(), 'yyyy-MM-dd')
  );
  const [activeJournalEntry, setActiveJournalEntry] = useState<JournalEntry | undefined>(undefined);

  // Load hooks
  const { todos, inboxTodos, addTodo, toggleTodo, scheduleTodo, deleteTodo } = useTodos();
  const { entries: journalEntries, getEntryForDate, saveEntry, deleteEntry } = useJournals();

  useEffect(() => {
    initializeDatabase().catch(console.error);
  }, []);

  // Handlers
  const handleOpenQuickAdd = (defaultDate: string | null = null) => {
    setQuickAddDefaultDate(defaultDate);
    setIsQuickAddOpen(true);
  };

  const handleCreateTodo = async (data: any) => {
    await addTodo(data);
  };

  const handleOpenJournalEditorForDate = (dateStr: string) => {
    setActiveJournalDate(dateStr);
    const existing = getEntryForDate(dateStr);
    setActiveJournalEntry(existing);
    setJournalMode('editor');
    setCurrentTab('journal');
  };

  const handleNewJournalEntry = (dateStr: string = format(new Date(), 'yyyy-MM-dd')) => {
    setActiveJournalDate(dateStr);
    setActiveJournalEntry(undefined);
    setJournalMode('editor');
    setCurrentTab('journal');
  };

  const handleSelectJournalEntry = (entry: JournalEntry) => {
    setActiveJournalDate(entry.date);
    setActiveJournalEntry(entry);
    setJournalMode('editor');
  };

  const handleSaveJournal = async (data: any) => {
    const saved = await saveEntry(data);
    setActiveJournalEntry(saved);
  };

  const handleDeleteJournal = async (id: string) => {
    await deleteEntry(id);
    setActiveJournalEntry(undefined);
    setJournalMode('timeline');
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#fcfaf7] text-[#3a3a3a]">
      {/* Desktop Left Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          if (tab === 'journal') setJournalMode('timeline');
        }}
        onOpenQuickAdd={() => handleOpenQuickAdd(null)}
        inboxCount={inboxTodos.length}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        <Header
          currentTab={currentTab}
          onOpenQuickAdd={() => handleOpenQuickAdd(null)}
        />

        <main className="flex-1 overflow-y-auto pb-20 md:pb-6">
          {currentTab === 'calendar' && (
            <CalendarView
              todos={todos}
              journalEntries={journalEntries}
              onToggleTodo={toggleTodo}
              onScheduleTodo={scheduleTodo}
              onDeleteTodo={deleteTodo}
              onAddTodoForDate={(dateStr) => handleOpenQuickAdd(dateStr)}
              onOpenJournalEditor={handleOpenJournalEditorForDate}
            />
          )}

          {currentTab === 'inbox' && (
            <InboxView
              todos={todos}
              onToggle={toggleTodo}
              onSchedule={scheduleTodo}
              onDelete={deleteTodo}
              onOpenQuickAdd={() => handleOpenQuickAdd(null)}
            />
          )}

          {currentTab === 'journal' && (
            <>
              {journalMode === 'timeline' && (
                <JournalTimeline
                  entries={journalEntries}
                  onSelectEntry={handleSelectJournalEntry}
                  onNewEntry={() => handleNewJournalEntry()}
                  onOpenSearch={() => setJournalMode('search')}
                />
              )}

              {journalMode === 'search' && (
                <JournalSearchView
                  onSelectEntry={handleSelectJournalEntry}
                  onBack={() => setJournalMode('timeline')}
                />
              )}

              {journalMode === 'editor' && (
                <JournalEditor
                  dateStr={activeJournalDate}
                  initialEntry={activeJournalEntry}
                  onSave={handleSaveJournal}
                  onDelete={handleDeleteJournal}
                  onBack={() => setJournalMode('timeline')}
                />
              )}
            </>
          )}

          {currentTab === 'statistics' && <StatisticsView />}

          {currentTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Mobile Navigation */}
      <MobileNav
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          if (tab === 'journal') setJournalMode('timeline');
        }}
        inboxCount={inboxTodos.length}
      />

      {/* Global Quick Add Modal */}
      <CreateTodoModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onSubmit={handleCreateTodo}
        defaultDate={quickAddDefaultDate}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <MainApp />
    </LanguageProvider>
  );
}

