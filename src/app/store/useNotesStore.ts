import { create } from 'zustand';
import { Note } from '../../features/notes/types';
import { loadNotes, saveNotes } from '../../features/notes/services/storageService';

interface NotesState {
  notes: Note[];
  isLoading: boolean;
  error: string | null;
  fetchNotes: () => Promise<void>;
  addNote: (note: Note) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  updateNoteSummary: (id: string, summary: string) => Promise<void>;
}

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  isLoading: false,
  error: null,
  fetchNotes: async () => {
    set({ isLoading: true, error: null });
    try {
      const notes = await loadNotes();
      set({ notes, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load notes', isLoading: false });
    }
  },
  addNote: async (note) => {
    const updatedNotes = [note, ...get().notes];
    set({ notes: updatedNotes });
    await saveNotes(updatedNotes);
  },
  deleteNote: async (id) => {
    const updatedNotes = get().notes.filter(n => n.id !== id);
    set({ notes: updatedNotes });
    await saveNotes(updatedNotes);
  },
  updateNoteSummary: async (id, summary) => {
    const updatedNotes = get().notes.map(n => 
      n.id === id ? { ...n, summary } : n
    );
    set({ notes: updatedNotes });
    await saveNotes(updatedNotes);
  }
}));
