import React from 'react';
import { format } from 'date-fns';
import { Moon, Sun } from 'lucide-react';
import { useUserStore } from '../../store/useUserStore';

export const Header = () => {
  const { theme, toggleTheme, level, xp } = useUserStore();
  const today = new Date();

  return (
    <header className="w-full flex justify-between items-center py-6 px-4 md:px-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-serif font-medium text-brown-dark dark:text-cream">
          Good Morning.
        </h2>
        <p className="text-brown-muted dark:text-gray-400 mt-1">
          {format(today, 'EEEE, MMMM do')}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-3 glass-card px-4 py-2">
          <div className="text-sm font-medium dark:text-gray-800">Level {level}</div>
          <div className="w-24 h-2 bg-beige rounded-full overflow-hidden">
            <div 
              className="h-full bg-pink-dusty rounded-full transition-all duration-500"
              style={{ width: `${(xp % 1000) / 10}%` }}
            />
          </div>
        </div>
        
        <button 
          onClick={toggleTheme}
          className="p-3 glass-card rounded-full hover:bg-beige/50 dark:hover:bg-gray-700 transition-colors text-brown-dark dark:text-cream"
        >
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
};
