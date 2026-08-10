import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Flame, CheckCircle2, Circle, BookOpen, TrendingUp, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStatistics } from '../../hooks/useStatistics';
import { addMonths, subMonths, format } from 'date-fns';
import { MOOD_OPTIONS } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';

export const StatisticsView: React.FC = () => {
  const { t, language } = useLanguage();
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const { today, weekly, monthly, streak } = useStatistics(selectedMonth);

  const formattedMonth =
    language === 'zh' || language === 'ja'
      ? format(selectedMonth, 'yyyy年M月')
      : format(selectedMonth, 'MMMM yyyy');

  const todayMoodObj = today.mood ? MOOD_OPTIONS.find((m) => m.type === today.mood) : null;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white rounded-xl border border-[#e0dad2] shadow-2xs">
        <div>
          <h2 className="font-serif text-xl font-light text-[#5a5a40]">{t.statistics.title}</h2>
          <p className="text-xs text-[#a09a90] mt-0.5">
            {t.statistics.subtitle}
          </p>
        </div>

        {/* Streak Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#f8f6f2] border border-[#e0dad2] rounded-xl text-[#5a5a40]">
          <Flame className="w-5 h-5 text-[#5a5a40] fill-[#5a5a40]/20" />
          <div>
            <span className="text-xs font-serif font-bold text-[#5a5a40]">
              {streak} {t.statistics.streak}
            </span>
            <p className="text-[10px] text-[#a09a90]">{t.statistics.streakActive}</p>
          </div>
        </div>
      </div>

      {/* 1. Today's Overview Card */}
      <div className="p-5 bg-white rounded-xl border border-[#e0dad2] shadow-2xs space-y-4">
        <h3 className="font-serif text-sm font-semibold text-[#5a5a40] flex items-center gap-1.5">
          <CalendarIcon className="w-4 h-4 text-[#5a5a40]" />
          <span>{t.statistics.todaySummary}</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-[#f8f6f2] rounded-lg border border-[#e0dad2]">
            <span className="text-[11px] text-[#a09a90]">{t.statistics.completionRate}</span>
            <p className="font-serif text-2xl font-bold text-[#5a5a40] mt-1">{today.rate}%</p>
          </div>

          <div className="p-3 bg-[#f8f6f2] rounded-lg border border-[#e0dad2]">
            <span className="text-[11px] text-[#a09a90]">{t.statistics.tasksDone}</span>
            <p className="font-serif text-2xl font-bold text-[#3a3a3a] mt-1">
              {today.completed} <span className="text-xs font-normal text-[#a09a90]">/ {today.total}</span>
            </p>
          </div>

          <div className="p-3 bg-[#f8f6f2] rounded-lg border border-[#e0dad2]">
            <span className="text-[11px] text-[#a09a90]">{t.nav.journal}</span>
            <p className="font-serif text-sm font-semibold text-[#5a5a40] mt-2">
              {today.journal ? '✓' : '○'}
            </p>
          </div>

          <div className="p-3 bg-[#f8f6f2] rounded-lg border border-[#e0dad2]">
            <span className="text-[11px] text-[#a09a90]">{t.journal.mood}</span>
            <p className="font-serif text-lg font-semibold text-[#3a3a3a] mt-1">
              {todayMoodObj ? `${todayMoodObj.emoji} ${todayMoodObj.label}` : '-'}
            </p>
          </div>
        </div>
      </div>


      {/* 2. Weekly Activity Chart */}
      <div className="p-5 bg-white rounded-xl border border-[#e0dad2] shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-sm font-semibold text-[#5a5a40] flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-[#5a5a40]" />
            <span>{t.statistics.weeklyActivity}</span>
          </h3>
          <span className="text-xs text-[#a09a90]">{t.statistics.completedTasksPerDay}</span>
        </div>

        <div className="h-48 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weekly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="dayName"
                tick={{ fontSize: 11, fill: '#a09a90' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11, fill: '#a09a90' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="p-2.5 bg-white border border-[#e0dad2] rounded-lg shadow-md text-xs font-serif">
                        <p className="font-bold text-[#3a3a3a]">{data.date}</p>
                        <p className="text-[#5a5a40] mt-1">{t.statistics.tooltipCompleted(data.completed)}</p>
                        <p className="text-[#a09a90]">{t.statistics.tooltipTotal(data.total)}</p>
                        {data.hasJournal && <p className="text-[#5a5a40] mt-1">{t.statistics.tooltipJournalWritten}</p>}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="completed" radius={[4, 4, 0, 0]}>
                {weekly.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.completed > 0 ? '#5a5a40' : '#e0dad2'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Monthly Metrics */}
      <div className="p-5 bg-white rounded-xl border border-[#e0dad2] shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-sm font-semibold text-[#5a5a40] flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-[#5a5a40]" />
            <span>{t.statistics.monthlyOverview}</span>
          </h3>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedMonth(subMonths(selectedMonth, 1))}
              className="p-1 rounded border border-[#e0dad2] hover:bg-[#f0ede6] text-[#8a847a] cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-serif font-medium text-[#3a3a3a]">
              {formattedMonth}
            </span>
            <button
              type="button"
              onClick={() => setSelectedMonth(addMonths(selectedMonth, 1))}
              className="p-1 rounded border border-[#e0dad2] hover:bg-[#f0ede6] text-[#8a847a] cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-[#f8f6f2] rounded-lg border border-[#e0dad2]">
            <span className="text-[11px] text-[#a09a90]">{t.statistics.completedTasks}</span>
            <p className="font-serif text-2xl font-bold text-[#5a5a40] mt-1">{monthly.completed}</p>
          </div>

          <div className="p-3 bg-[#f8f6f2] rounded-lg border border-[#e0dad2]">
            <span className="text-[11px] text-[#a09a90]">{t.statistics.pendingTasks}</span>
            <p className="font-serif text-2xl font-bold text-[#a09a90] mt-1">{monthly.pending}</p>
          </div>

          <div className="p-3 bg-[#f8f6f2] rounded-lg border border-[#e0dad2]">
            <span className="text-[11px] text-[#a09a90]">{t.statistics.completionRate}</span>
            <p className="font-serif text-2xl font-bold text-[#3a3a3a] mt-1">{monthly.rate}%</p>
          </div>

          <div className="p-3 bg-[#f8f6f2] rounded-lg border border-[#e0dad2]">
            <span className="text-[11px] text-[#a09a90]">{t.statistics.journalEntries}</span>
            <p className="font-serif text-2xl font-bold text-[#3a3a3a] mt-1">{monthly.journalCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
