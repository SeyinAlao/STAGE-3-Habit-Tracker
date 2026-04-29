import { User, Session } from '../types/auth';
import { Habit } from '../types/habit';
import { STORAGE_KEYS } from './constants'; 
const isBrowser = typeof window !== 'undefined';

export const storage = {
  getUsers: (): User[] => {
    if (!isBrowser) return [];
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : [];
  },
  setUsers: (users: User[]): void => {
    if (!isBrowser) return;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  getSession: (): Session | null => {
    if (!isBrowser) return null;
    const data = localStorage.getItem(STORAGE_KEYS.SESSION);
    return data ? JSON.parse(data) : null;
  },
  setSession: (session: Session | null): void => {
    if (!isBrowser) return;
    if (session) {
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
    } else {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    }
  },

  getHabits: (): Habit[] => {
    if (!isBrowser) return [];
    const data = localStorage.getItem(STORAGE_KEYS.HABITS);
    return data ? JSON.parse(data) : [];
  },
  setHabits: (habits: Habit[]): void => {
    if (!isBrowser) return;
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
  }
};