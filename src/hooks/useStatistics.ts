import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../services/database';
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, parseISO } from 'date-fns';
import type { MoodType } from '../types';

export function useStatistics(selectedMonthDate: Date = new Date()) {
  const todos = useLiveQuery(() => db.todos.toArray(), []) || [];
  const journalEntries = useLiveQuery(() => db.journalEntries.toArray(), []) || [];

  const todayStr = format(new Date(), 'yyyy-MM-dd');

  // 1. Today Stats
  const todayTodos = todos.filter(t => t.startDate === todayStr);
  const todayCompleted = todayTodos.filter(t => t.completed).length;
  const todayPending = todayTodos.length - todayCompleted;
  const todayCompletionRate = todayTodos.length > 0 ? Math.round((todayCompleted / todayTodos.length) * 100) : 0;
  const todayJournal = journalEntries.find(j => j.date === todayStr);

  // 2. Weekly Stats (Last 7 Days)
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = subDays(new Date(), 6 - i);
    const dateStr = format(d, 'yyyy-MM-dd');
    const dayName = format(d, 'EEE'); // Mon, Tue...
    
    const dayTodos = todos.filter(t => t.startDate === dateStr);
    const completed = dayTodos.filter(t => t.completed).length;
    const total = dayTodos.length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    const hasJournal = journalEntries.some(j => j.date === dateStr);

    return {
      date: dateStr,
      dayName,
      completed,
      total,
      rate,
      hasJournal,
    };
  });

  // 3. Monthly Stats
  const monthStart = startOfMonth(selectedMonthDate);
  const monthEnd = endOfMonth(selectedMonthDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const monthTodos = todos.filter(t => {
    if (!t.startDate) return false;
    try {
      const d = parseISO(t.startDate);
      return isSameMonth(d, selectedMonthDate);
    } catch {
      return false;
    }
  });

  const monthCompleted = monthTodos.filter(t => t.completed).length;
  const monthPending = monthTodos.length - monthCompleted;
  const monthCompletionRate = monthTodos.length > 0 ? Math.round((monthCompleted / monthTodos.length) * 100) : 0;

  const monthJournals = journalEntries.filter(j => {
    try {
      const d = parseISO(j.date);
      return isSameMonth(d, selectedMonthDate);
    } catch {
      return false;
    }
  });

  // 4. Streak Calculation
  // Streak = consecutive days going backwards from today/yesterday that had at least 1 completed todo OR 1 journal entry
  let currentStreak = 0;
  let checkDate = new Date();
  
  for (let i = 0; i < 365; i++) {
    const dateStr = format(checkDate, 'yyyy-MM-dd');
    const hasCompletedTodo = todos.some(t => t.startDate === dateStr && t.completed);
    const hasJournal = journalEntries.some(j => j.date === dateStr);

    if (hasCompletedTodo || hasJournal) {
      currentStreak++;
      checkDate = subDays(checkDate, 1);
    } else {
      // If today hasn't had activity yet, don't break streak if yesterday had activity
      if (i === 0 && dateStr === todayStr) {
        checkDate = subDays(checkDate, 1);
        continue;
      }
      break;
    }
  }

  return {
    today: {
      date: todayStr,
      total: todayTodos.length,
      completed: todayCompleted,
      pending: todayPending,
      rate: todayCompletionRate,
      journal: todayJournal,
      mood: todayJournal?.mood || null,
    },
    weekly: last7Days,
    monthly: {
      monthName: format(selectedMonthDate, 'MMMM yyyy'),
      completed: monthCompleted,
      pending: monthPending,
      total: monthTodos.length,
      rate: monthCompletionRate,
      journalCount: monthJournals.length,
    },
    streak: currentStreak,
  };
}
