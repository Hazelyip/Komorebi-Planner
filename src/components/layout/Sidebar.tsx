import React from 'react';
import { Calendar, Inbox, BookOpen, BarChart3, Settings, Plus } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export type NavTab = 'calendar' | 'inbox' | 'journal' | 'statistics' | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenQuickAdd: () => void;
  inboxCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onOpenQuickAdd,
  inboxCount,
}) => {
  const { t } = useLanguage();

  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'calendar', label: t.nav.calendar, icon: <Calendar className="w-4 h-4" /> },
    { id: 'inbox', label: t.nav.inbox, icon: <Inbox className="w-4 h-4" />, badge: inboxCount },
    { id: 'journal', label: t.nav.journal, icon: <BookOpen className="w-4 h-4" /> },
    { id: 'statistics', label: t.nav.statistics, icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'settings', label: t.nav.settings, icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <aside className="hidden md:flex flex-col w-[210px] h-screen sticky top-0 bg-white/50 border-r border-[#e0dad2] select-none shrink-0">
      {/* Brand & Logo */}
      <div className="p-6 pb-4">
        <h1 className="font-serif text-2xl font-light tracking-tight text-[#5a5a40]">
          {t.siteName}
        </h1>
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#a09a90] mt-0.5">
          {t.subTitle}
        </p>
      </div>

      {/* Quick Add Button */}
      <div className="px-4 mb-4">
        <button
          type="button"
          onClick={onOpenQuickAdd}
          className="flex w-full items-center justify-center space-x-2 rounded-full bg-[#5a5a40] py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#4a4a34] transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>{t.header.quickAdd}</span>
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[#f0ede6] text-[#5a5a40]'
                  : 'text-[#8a847a] hover:bg-[#f0ede6]/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-[#5a5a40]' : 'text-[#8a847a]'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#e0dad2] text-[#5a5a40]">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

