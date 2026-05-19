import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type NoteCategory = 'general' | 'study' | 'work' | 'personal' | 'ideas' | 'reminders';
export type NoteColor = 'cream' | 'rose' | 'sky' | 'mint' | 'amber' | 'lavender';

export interface NoteItem {
  id: string;
  userId: string;
  title: string;
  content: string;
  category: NoteCategory;
  color: NoteColor;
  tags: string[];
  isPinned: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

interface NotesState {
  notes: NoteItem[];
  addNote: (note: Omit<NoteItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, data: Partial<Omit<NoteItem, 'id' | 'createdAt'>>) => void;
  deleteNote: (id: string) => void;
  togglePin: (id: string) => void;
  toggleArchive: (id: string) => void;
  searchNotes: (userId: string, query: string) => NoteItem[];
  getNotesByUser: (userId: string) => NoteItem[];
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      notes: [],

      addNote: (noteData) => {
        const now = new Date().toISOString();
        set((state) => ({
          notes: [
            {
              ...noteData,
              id: Math.random().toString(36).substring(2, 10),
              createdAt: now,
              updatedAt: now,
            },
            ...state.notes,
          ],
        }));
      },

      updateNote: (id, data) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id ? { ...note, ...data, updatedAt: new Date().toISOString() } : note
          ),
        }));
      },

      deleteNote: (id) => {
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id),
        }));
      },

      togglePin: (id) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? { ...note, isPinned: !note.isPinned, updatedAt: new Date().toISOString() }
              : note
          ),
        }));
      },

      toggleArchive: (id) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? { ...note, isArchived: !note.isArchived, updatedAt: new Date().toISOString() }
              : note
          ),
        }));
      },

      searchNotes: (userId, query) => {
        const q = query.trim().toLowerCase();
        if (!q) return get().getNotesByUser(userId);

        return get()
          .getNotesByUser(userId)
          .filter(
            (note) =>
              note.title.toLowerCase().includes(q) ||
              note.content.toLowerCase().includes(q) ||
              note.tags.some((tag) => tag.toLowerCase().includes(q))
          );
      },

      getNotesByUser: (userId) => {
        return get()
          .notes
          .filter((note) => note.userId === userId)
          .sort((a, b) => {
            if (a.isPinned !== b.isPinned) {
              return a.isPinned ? -1 : 1;
            }
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
          });
      },
    }),
    {
      name: 'aesthetic-tracker-notes',
    }
  )
);
