import React from 'react';
import { Calendar, Inbox, BookOpen, BarChart3, Settings } from 'lucide-react';
import type { NavTab } from './Sidebar';
import { useLanguage } from '../../i18n/LanguageContext';

interface MobileNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  inboxCount: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentTab,
  onSelectTab,
  inboxCount,
}) => {
  const { t } = useLanguage();

  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'calendar', label: t.nav.calendar, icon: <Calendar className="w-5 h-5" /> },
    { id: 'inbox', label: t.nav.inbox, icon: <Inbox className="w-5 h-5" />, badge: inboxCount },
    { id: 'journal', label: t.nav.journal, icon: <BookOpen className="w-5 h-5" /> },
    { id: 'statistics', label: t.nav.statistics, icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'settings', label: t.nav.settings, icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#e0dad2] px-2 py-2 flex items-center justify-around select-none">
      {navItems.map((item) => {
        const isActive = currentTab === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectTab(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-3 min-w-[56px] rounded-lg relative cursor-pointer ${
              isActive ? 'text-[#5a5a40]' : 'text-[#8a847a]'
            }`}
          >
            {item.icon}
            <span className={`text-[10px] mt-1 font-medium ${isActive ? 'text-[#5a5a40]' : 'text-[#8a847a]'}`}>
              {item.label}
            </span>
            {item.badge !== undefined && item.badge > 0 && (
              <span className="absolute top-0 right-2 w-4 h-4 rounded-full bg-[#5a5a40] text-white text-[9px] flex items-center justify-center font-bold">
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};

