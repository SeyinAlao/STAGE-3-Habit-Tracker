import React, { useState } from 'react';
import { Habit } from '@/types/habit';
import { getHabitSlug } from '@/lib/slug';
import { calculateCurrentStreak } from '@/lib/streaks';

type HabitCardProps = {
  habit: Habit;
  onComplete: (id: string) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => void;
};

export default function HabitCard({ habit, onComplete, onEdit, onDelete }: HabitCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const slug = getHabitSlug(habit.name);
  const streak = calculateCurrentStreak(habit.completions);

  const today = new Date().toISOString().split('T')[0];
  const isCompletedToday = habit.completions.includes(today);

  return (
    <div
      data-testid={`habit-card-${slug}`}
      className="relative overflow-hidden rounded-2xl transition-shadow hover:shadow-md"
      style={{
        background: '#ffffff',
        border: '1px solid #ece9e3',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
        style={{
          background: isCompletedToday
            ? 'linear-gradient(180deg, #059669, #34d399)'
            : 'linear-gradient(180deg, #cbd5e1, #e2e8f0)',
        }}
      />

      <div className="pl-5 pr-4 py-4">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1 min-w-0">
            <h3
              className="text-base text-slate-900 truncate leading-snug"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 600 }}
            >
              {habit.name}
            </h3>

            {habit.description && (
              <p
                className="text-sm text-slate-400 mt-0.5 leading-snug"
                style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
              >
                {habit.description}
              </p>
            )}
            <div
              data-testid={`habit-streak-${slug}`}
              className="mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1"
              style={{
                background: streak > 0 ? '#ecfdf5' : '#f8fafc',
                border: `1px solid ${streak > 0 ? '#6ee7b7' : '#e2e8f0'}`,
              }}
            >
              <span className="text-base leading-none">{streak > 0 ? '🔥' : '—'}</span>
              <span
                className="text-xs font-medium"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  color: streak > 0 ? '#065f46' : '#94a3b8',
                }}
              >
                {streak === 1 ? '1 day streak' : `${streak} days streak`}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3 shrink-0">
            <button
              data-testid={`habit-complete-${slug}`}
              onClick={() => onComplete(habit.id)}
              className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-medium transition-all active:scale-95"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                background: isCompletedToday ? '#ecfdf5' : '#f8fafc',
                color: isCompletedToday ? '#065f46' : '#475569',
                border: `1.5px solid ${isCompletedToday ? '#6ee7b7' : '#e2e8f0'}`,
                letterSpacing: '0.01em',
              }}
            >
              {isCompletedToday ? (
                <>
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  Done
                </>
              ) : (
                <>
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="9" strokeWidth="1.5" />
                  </svg>
                  Mark Done
                </>
              )}
            </button>
            <div
              className="flex items-center gap-3"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <button
                data-testid={`habit-edit-${slug}`}
                onClick={() => onEdit(habit)}
                className="text-xs text-slate-400 hover:text-slate-700 transition-colors"
              >
                Edit
              </button>

              {!showDeleteConfirm ? (
                <button
                  data-testid={`habit-delete-${slug}`}
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-xs text-slate-300 hover:text-red-500 transition-colors"
                >
                  Delete
                </button>
              ) : (
                <button
                  data-testid="confirm-delete-button"
                  onClick={() => onDelete(habit.id)}
                  className="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors"
                >
                  Confirm
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}