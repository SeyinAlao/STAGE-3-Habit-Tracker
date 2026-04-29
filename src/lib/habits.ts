import { storage } from './storage';
import { auth } from './auth';
import { Habit } from '../types/habit';

export const getTodayDateString = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

export const habitsApi = {
  createHabit: (name: string, description: string): Habit | null => {
    const session = auth.getCurrentSession();
    if (!session) return null;

    const newHabit: Habit = {
      id: crypto.randomUUID(),
      userId: session.userId, 
      name, 
      description, 
      frequency: 'daily', 
      createdAt: new Date().toISOString(),
      completions: [] 
    };

    const currentHabits = storage.getHabits();
    storage.setHabits([...currentHabits, newHabit]);
    return newHabit;
  },

  updateHabit: (id: string, name: string, description: string): Habit | null => {
    const currentHabits = storage.getHabits();
    const habitIndex = currentHabits.findIndex(h => h.id === id);
    
    if (habitIndex === -1) return null;

    const updatedHabit = {
      ...currentHabits[habitIndex],
      name,
      description,
      frequency: 'daily' as const, 
    };

    currentHabits[habitIndex] = updatedHabit;
    storage.setHabits(currentHabits);
    return updatedHabit;
  },

  deleteHabit: (id: string): void => {
    const currentHabits = storage.getHabits();
    const filteredHabits = currentHabits.filter(h => h.id !== id);
    storage.setHabits(filteredHabits);
  },

  toggleCompletion: (id: string): Habit | null => {
    const currentHabits = storage.getHabits();
    const habitIndex = currentHabits.findIndex(h => h.id === id);
    
    if (habitIndex === -1) return null;

    const habit = currentHabits[habitIndex];
    const today = getTodayDateString();
    
    const hasCompletedToday = habit.completions.includes(today);
    
    let newCompletions;
    if (hasCompletedToday) {
      newCompletions = habit.completions.filter(date => date !== today);
    } else {
      newCompletions = [...habit.completions, today];
    }

    const updatedHabit = { ...habit, completions: newCompletions };
    currentHabits[habitIndex] = updatedHabit;
    storage.setHabits(currentHabits);
    
    return updatedHabit;
  }
};

export function toggleHabitCompletion(habit: Habit, date: string): Habit {
  const completionsSet = new Set(habit.completions);
  
  if (completionsSet.has(date)) {
    completionsSet.delete(date);
  } else {
    completionsSet.add(date);
  }

  return {
    ...habit,
    completions: Array.from(completionsSet)
  };
}