import React, { useState } from 'react';
import { Smile, Meh, Frown } from 'lucide-react';
import { cn } from '../../utils/cn';

export const MoodTracker = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const moods = [
    { id: 'happy', icon: Smile, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' },
    { id: 'neutral', icon: Meh, color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
    { id: 'sad', icon: Frown, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' }
  ];

  return (
    <div className="glass-card p-6 h-full flex flex-col justify-center">
      <h3 className="text-lg font-serif font-medium text-brown-dark dark:text-cream mb-4">How do you feel today?</h3>
      <div className="flex justify-between gap-4">
        {moods.map((mood) => (
          <button
            key={mood.id}
            onClick={() => setSelectedMood(mood.id)}
            className={cn(
              "flex-1 py-4 rounded-xl flex items-center justify-center transition-all duration-300",
              selectedMood === mood.id ? mood.bg : "bg-beige/30 hover:bg-beige/50 dark:bg-gray-800/50"
            )}
          >
            <mood.icon className={cn("w-6 h-6", selectedMood === mood.id ? mood.color : "text-gray-400")} />
          </button>
        ))}
      </div>
    </div>
  );
};
