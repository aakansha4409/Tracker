import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

export const FocusTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(25 * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="glass-card p-6 flex flex-col items-center justify-center h-full">
      <h3 className="text-lg font-serif font-medium text-brown-dark dark:text-cream mb-4">Focus Timer</h3>
      
      <div className="text-5xl font-sans font-light text-brown-dark dark:text-cream mb-6 tracking-wider">
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={toggleTimer}
          className="w-12 h-12 rounded-full bg-pink-dusty text-white flex items-center justify-center hover:bg-pink-dusty/90 transition-colors shadow-sm"
        >
          {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
        </button>
        <button 
          onClick={resetTimer}
          className="w-10 h-10 rounded-full border border-beige flex items-center justify-center text-brown-muted hover:bg-beige/50 transition-colors dark:text-gray-300 dark:border-gray-600"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
