import React from 'react';
import { motion } from 'framer-motion';
import { Check, Droplets, BookOpen, Wind, Dumbbell, Code, Brain } from 'lucide-react';
import { cn } from '../../utils/cn';
import { type Habit } from '../../store/useHabitStore';
import confetti from 'canvas-confetti';
import { useUserStore } from '../../store/useUserStore';

const iconMap: Record<string, any> = {
  Droplets, BookOpen, Wind, Dumbbell, Code, Brain
};

interface HabitCardProps {
  habit: Habit;
  isCompleted: boolean;
  onToggle: () => void;
}

export const HabitCard = ({ habit, isCompleted, onToggle }: HabitCardProps) => {
  const Icon = iconMap[habit.icon] || Check;
  const addXP = useUserStore(state => state.addXP);

  const handleToggle = () => {
    onToggle();
    if (!isCompleted) {
      addXP(50); // Give 50 XP for completing a habit
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F3E1E0', '#E2C7C5', '#8C7A6B']
      });
    }
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleToggle}
      className={cn(
        "p-4 glass-card cursor-pointer flex items-center justify-between group",
        isCompleted ? "opacity-75" : ""
      )}
    >
      <div className="flex items-center gap-4">
        <div className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors duration-300",
          isCompleted 
            ? "bg-pink-dusty text-white" 
            : "bg-beige/50 text-brown-muted group-hover:bg-beige"
        )}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h3 className={cn(
            "font-medium transition-colors duration-300 dark:text-gray-200",
            isCompleted ? "text-brown-muted line-through" : "text-brown-dark"
          )}>
            {habit.title}
          </h3>
          <p className="text-sm text-gray-500 capitalize">{habit.category}</p>
        </div>
      </div>

      <div className={cn(
        "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300",
        isCompleted 
          ? "border-pink-dusty bg-pink-dusty text-white" 
          : "border-beige text-transparent"
      )}>
        <Check className="w-5 h-5" />
      </div>
    </motion.div>
  );
};
