import React from 'react';
import HabitCard from './HabitCard';
import { Habit } from '@/types/habit';

type HabitListProps = {
  habits: Habit[];
  onComplete: (id: string) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => void;
};

export default function HabitList({ habits, onComplete, onEdit, onDelete }: HabitListProps) {
  return (
    <div className="space-y-4">
      {habits.map(habit => (
        <HabitCard 
          key={habit.id}
          habit={habit}
          onComplete={onComplete}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}