import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday as isSameDayAsToday,
  isSameDay,
} from 'date-fns';
import type { Todo, JournalEntry } from '../../types';
import { CalendarCell } from './CalendarCell';
import { DateDetailDrawer } from './DateDetailDrawer';
import { useLanguage } from '../../i18n/LanguageContext';

interface CalendarViewProps {
  todos: Todo[];
  journalEntries: JournalEntry[];
  onToggleTodo: (id: string) => void;
  onScheduleTodo: (id: string, newDate: string | null) => void;
  onDeleteTodo: (id: string) => void;
  onAddTodoForDate: (dateStr: string) => void;
  onOpenJournalEditor: (dateStr: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  todos,
  journalEntries,
  onToggleTodo,
  onScheduleTodo,
  onDeleteTodo,
  onAddTodoForDate,
  onOpenJournalEditor,
}) => {
  const { t, language } = useLanguage();
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(
    format(new Date(), 'yyyy-MM-dd')
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Calendar Math using date-fns
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const weekDayNames =
    language === 'zh'
      ? ['一', '二', '三', '四', '五', '六', '日']
      : language === 'ja'
      ? ['月', '火', '水', '木', '金', '土', '日']
      : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const monthTitle =
    language === 'zh' || language === 'ja'
      ? format(currentMonth, 'yyyy年M月')
      : format(currentMonth, 'MMMM yyyy');

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const handleToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    setSelectedDateStr(format(today, 'yyyy-MM-dd'));
    setIsDrawerOpen(true);
  };

  const handleCellClick = (dateStr: string) => {
    setSelectedDateStr(dateStr);
    setIsDrawerOpen(true);
  };

  const selectedDateTodos = selectedDateStr
    ? todos.filter((t) => t.startDate === selectedDateStr)
    : [];

  const selectedDateJournal = selectedDateStr
    ? journalEntries.find((j) => j.date === selectedDateStr)
    : undefined;

  return (
    <div className="max-w-6xl mx-auto p-3 md:p-6 space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 md:p-6 bg-white/70 backdrop-blur-xs rounded-xl border border-[#e0dad2] shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-[#fcfaf7] border border-[#e0dad2] text-[#5a5a40]">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-xl md:text-2xl font-light text-[#5a5a40]">
              {monthTitle}
            </h2>
          </div>
        </div>

        {/* Month Navigation Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-2 rounded-lg border border-[#e0dad2] bg-[#f8f6f2] hover:bg-[#f0ede6] text-[#a09a90] hover:text-[#5a5a40] transition-colors cursor-pointer"
            title="Previous Month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleToday}
            className="px-3.5 py-1.5 text-xs uppercase tracking-widest font-semibold bg-[#5a5a40] text-white hover:bg-[#4a4a34] rounded-full shadow-xs transition-colors cursor-pointer"
          >
            {t.calendar.today}
          </button>

          <button
            type="button"
            onClick={handleNextMonth}
            className="p-2 rounded-lg border border-[#e0dad2] bg-[#f8f6f2] hover:bg-[#f0ede6] text-[#a09a90] hover:text-[#5a5a40] transition-colors cursor-pointer"
            title="Next Month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar Grid Container */}
      <div className="rounded-xl border border-[#e0dad2] bg-[#e0dad2] overflow-hidden shadow-xs">
        {/* Weekday Header */}
        <div className="grid grid-cols-7 gap-px bg-[#e0dad2] text-center select-none">
          {weekDayNames.map((day) => (
            <div
              key={day}
              className="bg-[#fcfaf7] py-2 text-center text-[10px] font-bold uppercase tracking-widest text-[#a09a90]"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-px bg-[#e0dad2]">
          {calendarDays.map((date) => {
            const dateStr = format(date, 'yyyy-MM-dd');
            const isCurrentM = isSameMonth(date, currentMonth);
            const isTod = isSameDayAsToday(date);
            const isSel = selectedDateStr === dateStr && isDrawerOpen;

            const dayTodos = todos.filter((t) => t.startDate === dateStr);
            const dayJournal = journalEntries.find((j) => j.date === dateStr);

            return (
              <CalendarCell
                key={dateStr}
                date={date}
                dateStr={dateStr}
                isCurrentMonth={isCurrentM}
                isToday={isTod}
                isSelected={isSel}
                todos={dayTodos}
                journalEntry={dayJournal}
                onClick={() => handleCellClick(dateStr)}
              />
            );
          })}
        </div>
      </div>

      {/* Detail Drawer */}
      <DateDetailDrawer
        isOpen={isDrawerOpen}
        dateStr={selectedDateStr}
        todos={selectedDateTodos}
        journalEntry={selectedDateJournal}
        onClose={() => setIsDrawerOpen(false)}
        onToggleTodo={onToggleTodo}
        onScheduleTodo={onScheduleTodo}
        onDeleteTodo={onDeleteTodo}
        onAddTodoForDate={onAddTodoForDate}
        onOpenJournalEditor={onOpenJournalEditor}
      />
    </div>
  );
};
