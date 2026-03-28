import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note } from '../types';

const NOTES_STORAGE_KEY = '@talkingquill_notes';

export const loadNotes = async (): Promise<Note[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(NOTES_STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Failed to load notes', e);
    return [];
  }
};

export const saveNotes = async (notes: Note[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(notes);
    await AsyncStorage.setItem(NOTES_STORAGE_KEY, jsonValue);
  } catch (e) {
    console.error('Failed to save notes', e);
  }
};
