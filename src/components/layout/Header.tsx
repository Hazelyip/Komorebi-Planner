import React from 'react';
import type { NavTab } from './Sidebar';
import { useLanguage } from '../../i18n/LanguageContext';

interface HeaderProps {
  currentTab: NavTab;
  onOpenQuickAdd?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab }) => {
  const { t, language } = useLanguage();

  const titles: Record<NavTab, string> = {
    calendar: t.nav.calendar,
    inbox: t.nav.inbox,
    journal: t.nav.journal,
    statistics: t.nav.statistics,
    settings: t.nav.settings,
  };

  const localeCode = language === 'zh' ? 'zh-CN' : language === 'ja' ? 'ja-JP' : 'en-US';

  const todayFormatted = new Date().toLocaleDateString(localeCode, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-white/30 backdrop-blur-xs border-b border-[#e0dad2]">
      <div className="flex items-center gap-3">
        {/* Mobile Logo */}
        <div className="md:hidden flex items-center gap-2">
          <h1 className="font-serif text-xl font-light text-[#5a5a40]">
            {t.siteName}
          </h1>
        </div>

        <div className="hidden md:block">
          <h2 className="font-serif text-xl font-light text-[#5a5a40]">
            {titles[currentTab]}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden sm:inline-block text-xs uppercase tracking-widest text-[#a09a90] bg-[#f8f6f2] px-3 py-1.5 rounded-full border border-[#e0dad2]">
          {t.header.today} {todayFormatted}
        </span>
      </div>
    </header>
  );
};

