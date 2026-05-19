import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type JournalMood = 'amazing' | 'good' | 'neutral' | 'sad' | 'stressed';
export type JournalCategory = 'reflection' | 'gratitude' | 'goals' | 'lessons' | 'memories' | 'dreams' | 'challenges' | 'ideas';

export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  content: string;
  mood: JournalMood;
  category: JournalCategory;
  date: string;
  tags: string[];
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GratitudeEntry {
  id: string;
  userId: string;
  items: string[]; // 3-5 things grateful for
  date: string;
  createdAt: string;
}

interface JournalState {
  entries: JournalEntry[];
  gratitudeEntries: GratitudeEntry[];
  
  // Journal entries
  addEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEntry: (id: string, updates: Partial<JournalEntry>) => void;
  deleteEntry: (id: string) => void;
  getEntriesByUser: (userId: string) => JournalEntry[];
  getEntriesByDate: (userId: string, date: string) => JournalEntry[];
  togglePin: (id: string) => void;
  
  // Gratitude
  addGratitudeEntry: (entry: Omit<GratitudeEntry, 'id' | 'createdAt'>) => void;
  getGratitudeByDate: (userId: string, date: string) => GratitudeEntry | undefined;
  
  // Search & Filter
  searchEntries: (userId: string, query: string) => JournalEntry[];
  getEntriesByCategory: (userId: string, category: JournalCategory) => JournalEntry[];
  getEntriesByMood: (userId: string, mood: JournalMood) => JournalEntry[];
}

export const useJournalStore = create<JournalState>()(
  persist(
    (set, get) => ({
      entries: [],
      gratitudeEntries: [],

      addEntry: (entry) => {
        const newEntry: JournalEntry = {
          ...entry,
          id: `entry_${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          entries: [...state.entries, newEntry],
        }));
      },

      updateEntry: (id, updates) => {
        set((state) => ({
          entries: state.entries.map((entry) =>
            entry.id === id ? { ...entry, ...updates, updatedAt: new Date().toISOString() } : entry
          ),
        }));
      },

      deleteEntry: (id) => {
        set((state) => ({
          entries: state.entries.filter((entry) => entry.id !== id),
        }));
      },

      getEntriesByUser: (userId) => {
        return get()
          .entries.filter((entry) => entry.userId === userId)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      },

      getEntriesByDate: (userId, date) => {
        return get().entries.filter((entry) => entry.userId === userId && entry.date === date);
      },

      togglePin: (id) => {
        set((state) => ({
          entries: state.entries.map((entry) =>
            entry.id === id ? { ...entry, isPinned: !entry.isPinned } : entry
          ),
        }));
      },

      addGratitudeEntry: (entry) => {
        const newEntry: GratitudeEntry = {
          ...entry,
          id: `gratitude_${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          gratitudeEntries: [...state.gratitudeEntries, newEntry],
        }));
      },

      getGratitudeByDate: (userId, date) => {
        return get().gratitudeEntries.find((entry) => entry.userId === userId && entry.date === date);
      },

      searchEntries: (userId, query) => {
        const lowerQuery = query.toLowerCase();
        return get()
          .entries.filter(
            (entry) =>
              entry.userId === userId &&
              (entry.title.toLowerCase().includes(lowerQuery) ||
                entry.content.toLowerCase().includes(lowerQuery) ||
                entry.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)))
          )
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      },

      getEntriesByCategory: (userId, category) => {
        return get()
          .entries.filter((entry) => entry.userId === userId && entry.category === category)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      },

      getEntriesByMood: (userId, mood) => {
        return get()
          .entries.filter((entry) => entry.userId === userId && entry.mood === mood)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      },
    }),
    {
      name: 'aesthetic-tracker-journal',
    }
  )
);
