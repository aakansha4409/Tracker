import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type EventCategory = 'birthday' | 'anniversary' | 'holiday' | 'event' | 'deadline' | 'reminder' | 'other';
export type EventColor = 'red' | 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'yellow' | 'gray';

export interface CalendarEvent {
  id: string;
  userId: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm
  endDate?: string;
  category: EventCategory;
  color: EventColor;
  isAllDay: boolean;
  isRepeating: boolean;
  repeatPattern?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  notificationMinutes?: number; // 0, 15, 30, 60, 1440
  location?: string;
  attendees?: string[];
  createdAt: string;
}

export interface DayStats {
  date: string;
  eventsCount: number;
  events: CalendarEvent[];
}

interface CalendarState {
  events: CalendarEvent[];
  
  // Event actions
  addEvent: (event: Omit<CalendarEvent, 'id' | 'createdAt'>) => void;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  
  // Query actions
  getEventsByDate: (date: string) => CalendarEvent[];
  getEventsByMonth: (year: number, month: number) => CalendarEvent[];
  getEventsByUser: (userId: string) => CalendarEvent[];
  getUpcomingEvents: (userId: string, days?: number) => CalendarEvent[];
  getEventsByCategory: (userId: string, category: EventCategory) => CalendarEvent[];
}

export const useCalendarStore = create<CalendarState>()(
  persist(
    (set, get) => ({
      events: [],

      addEvent: (event) => {
        const newEvent: CalendarEvent = {
          ...event,
          id: `event_${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          events: [...state.events, newEvent],
        }));

        // Add recurring events
        if (event.isRepeating && event.repeatPattern) {
          const baseDate = new Date(event.date);
          for (let i = 1; i < 12; i++) {
            let nextDate = new Date(baseDate);
            
            switch (event.repeatPattern) {
              case 'daily':
                nextDate.setDate(nextDate.getDate() + i);
                break;
              case 'weekly':
                nextDate.setDate(nextDate.getDate() + i * 7);
                break;
              case 'monthly':
                nextDate.setMonth(nextDate.getMonth() + i);
                break;
              case 'yearly':
                nextDate.setFullYear(nextDate.getFullYear() + i);
                break;
            }

            const recurringEvent: CalendarEvent = {
              ...event,
              id: `event_${Date.now()}_${i}`,
              date: nextDate.toISOString().split('T')[0],
              createdAt: new Date().toISOString(),
            };
            
            set((state) => ({
              events: [...state.events, recurringEvent],
            }));
          }
        }
      },

      updateEvent: (id, updates) => {
        set((state) => ({
          events: state.events.map((event) =>
            event.id === id ? { ...event, ...updates } : event
          ),
        }));
      },

      deleteEvent: (id) => {
        set((state) => ({
          events: state.events.filter((event) => event.id !== id),
        }));
      },

      getEventsByDate: (date) => {
        return get().events.filter((event) => event.date === date).sort((a, b) => {
          if (event.isAllDay) return -1;
          if (a.time && b.time) return a.time.localeCompare(b.time);
          return 0;
        });
      },

      getEventsByMonth: (year, month) => {
        return get().events.filter((event) => {
          const eventDate = new Date(event.date);
          return eventDate.getFullYear() === year && eventDate.getMonth() === month;
        });
      },

      getEventsByUser: (userId) => {
        return get()
          .events.filter((event) => event.userId === userId)
          .sort((a, b) => a.date.localeCompare(b.date));
      },

      getUpcomingEvents: (userId, days = 30) => {
        const today = new Date();
        const futureDate = new Date(today);
        futureDate.setDate(futureDate.getDate() + days);

        return get()
          .events.filter(
            (event) =>
              event.userId === userId &&
              event.date >= today.toISOString().split('T')[0] &&
              event.date <= futureDate.toISOString().split('T')[0]
          )
          .sort((a, b) => a.date.localeCompare(b.date));
      },

      getEventsByCategory: (userId, category) => {
        return get()
          .events.filter((event) => event.userId === userId && event.category === category)
          .sort((a, b) => a.date.localeCompare(b.date));
      },
    }),
    {
      name: 'aesthetic-tracker-calendar',
    }
  )
);
