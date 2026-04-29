import React, { useState } from 'react';

type HabitFormProps = {
  initialData?: { name: string; description: string };
  onSubmit: (data: { name: string; description: string }) => void;
  onCancel: () => void;
};

export default function HabitForm({ initialData, onSubmit, onCancel }: HabitFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Habit name is required');
      return;
    }

    setError(null);
    onSubmit({ name, description });
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.7rem',
    letterSpacing: '0.08em',
    fontWeight: 500,
    textTransform: 'uppercase',
    color: '#64748b',
  };

  const inputStyle: React.CSSProperties = {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.9rem',
    background: '#fafaf8',
    borderColor: '#e2e0db',
    color: '#0f172a',
  };

  return (
    <form data-testid="habit-form" onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div
          className="rounded-lg p-3 text-sm border"
          style={{
            background: '#fef2f2',
            borderColor: '#fecaca',
            color: '#dc2626',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block mb-1.5" style={labelStyle}>
          Name
        </label>
        <input
          id="name"
          type="text"
          required
          data-testid="habit-name-input"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError(null);
          }}
          placeholder="e.g. Morning Meditation"
          className="block w-full rounded-xl border px-4 py-2.5 shadow-sm transition-all
            focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          style={inputStyle}
        />
      </div>

      <div>
        <label htmlFor="description" className="block mb-1.5" style={labelStyle}>
          Description{' '}
          <span style={{ textTransform: 'none', fontWeight: 300, letterSpacing: '0', color: '#94a3b8' }}>
            (optional)
          </span>
        </label>
        <textarea
          id="description"
          data-testid="habit-description-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. 10 minutes of mindfulness each morning"
          rows={3}
          className="block w-full rounded-xl border px-4 py-2.5 shadow-sm transition-all resize-none
            focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          style={inputStyle}
        />
      </div>

      <div>
        <label htmlFor="frequency" className="block mb-1.5" style={labelStyle}>
          Frequency
        </label>
        <select
          id="frequency"
          data-testid="habit-frequency-select"
          disabled
          className="block w-full rounded-xl border px-4 py-2.5 shadow-sm"
          style={{
            ...inputStyle,
            color: '#94a3b8',
            background: '#f8fafc',
            borderColor: '#e2e8f0',
            cursor: 'not-allowed',
          }}
        >
          <option value="daily">Daily</option>
        </select>
        <p
          className="mt-1.5 text-xs text-slate-400"
          style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
        >
          Only daily habits are supported right now.
        </p>
      </div>

      <div className="flex justify-end gap-2.5 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border px-5 py-2.5 text-sm font-medium transition-all hover:bg-slate-50 active:scale-95"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            borderColor: '#e2e0db',
            color: '#475569',
            background: '#ffffff',
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          data-testid="habit-save-button"
          className="flex justify-center rounded-xl px-5 py-2.5 text-sm font-medium text-white shadow-sm
            transition-all hover:opacity-90 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #064e3b 0%, #059669 100%)',
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500,
          }}
        >
          Save Habit
        </button>
      </div>
    </form>
  );
}