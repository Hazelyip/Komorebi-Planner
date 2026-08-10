import React from 'react';
import { MOOD_OPTIONS, type MoodType } from '../../types';

interface MoodSelectorProps {
  selectedMood: MoodType | null;
  onSelectMood: (mood: MoodType | null) => void;
  size?: 'sm' | 'md' | 'lg';
}

export const MoodSelector: React.FC<MoodSelectorProps> = ({
  selectedMood,
  onSelectMood,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'p-1.5 text-base gap-1',
    md: 'p-2 text-xl gap-1.5',
    lg: 'p-2.5 text-2xl gap-2',
  }[size];

  return (
    <div className="flex items-center gap-1.5">
      {MOOD_OPTIONS.map((item) => {
        const isSelected = selectedMood === item.type;
        return (
          <button
            key={item.type}
            type="button"
            onClick={() => onSelectMood(isSelected ? null : item.type)}
            title={item.label}
            className={`flex items-center justify-center rounded-lg border transition-all ${sizeClasses} ${
              isSelected
                ? 'bg-[#f0ede6] border-[#5a5a40] shadow-2xs scale-105'
                : 'bg-white border-[#e0dad2] hover:border-[#a09a90] hover:bg-[#f8f6f2]'
            }`}
          >
            <span>{item.emoji}</span>
          </button>
        );
      })}
    </div>
  );
};
