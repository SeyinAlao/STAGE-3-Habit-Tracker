"use client";
 
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import HabitForm from '@/components/habits/HabitForm';
import HabitCard from '@/components/habits/HabitCard';
import { auth } from '@/lib/auth';
import { storage } from '@/lib/storage';
import { habitsApi } from '@/lib/habits';
import { Habit } from '@/types/habit';
 
export default function DashboardPage() {
  const router = useRouter();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [habitToEdit, setHabitToEdit] = useState<Habit | null>(null);
 
  const loadHabits = async () => {
    await Promise.resolve();
 
    const session = auth.getCurrentSession();
    if (session) {
      const allHabits = storage.getHabits();
      const userHabits = allHabits.filter((h) => h.userId === session.userId);
      setHabits(userHabits);
    }
  };
 
  useEffect(() => {
    (async () => {
      await loadHabits();
    })();
  }, []);
 
  const handleLogout = () => {
    auth.logout();
    router.push('/login');
  };
 
  const handleSubmitHabit = (data: { name: string; description: string }) => {
    if (habitToEdit) {
      habitsApi.updateHabit(habitToEdit.id, data.name, data.description);
    } else {
      habitsApi.createHabit(data.name, data.description);
    }
    loadHabits();
    setIsFormVisible(false);
    setHabitToEdit(null);
  };
 
  const handleToggleCompletion = (id: string) => {
    habitsApi.toggleCompletion(id);
    loadHabits();
  };
 
  const handleDelete = (id: string) => {
    habitsApi.deleteHabit(id);
    loadHabits();
  };
 
  const openEditForm = (habit: Habit) => {
    setHabitToEdit(habit);
    setIsFormVisible(true);
  };
 
  const closeForm = () => {
    setIsFormVisible(false);
    setHabitToEdit(null);
  };
 
  const todayLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
 
  const completedToday = habits.filter((h) =>
    h.completions.includes(new Date().toISOString().split('T')[0])
  ).length;
 
  return (
    <ProtectedRoute>
      <div
        data-testid="dashboard-page"
        className="min-h-screen pb-24 relative"
        style={{ background: '#f5f3ef' }}
      >
        <header
          className="sticky top-0 z-30 px-5 py-4 flex justify-between items-center"
          style={{
            background: 'rgba(245, 243, 239, 0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(0,0,0,0.06)',
          }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-lg"
              style={{ background: 'linear-gradient(135deg, #064e3b 0%, #059669 100%)' }}
            >
              <svg
                className="h-3.5 w-3.5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1
              className="text-base text-slate-900"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 600 }}
            >
              Habit Tracker
            </h1>
          </div>
 
          <button
            onClick={handleLogout}
            data-testid="auth-logout-button"
            className="text-xs font-medium text-slate-400 hover:text-slate-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-100"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Logout
          </button>
        </header>
 
        <main className="px-4 max-w-lg mx-auto mt-6">
          <div className="mb-6">
            <p
              className="text-xs text-slate-400 uppercase tracking-widest"
              style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, letterSpacing: '0.1em' }}
            >
              {todayLabel}
            </p>
            <h2
              className="text-2xl text-slate-900 mt-1 leading-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 600 }}
            >
              {habits.length === 0
                ? 'Your habits'
                : completedToday === habits.length && habits.length > 0
                ? "All done today 🎉"
                : `${completedToday} of ${habits.length} done`}
            </h2>
            {habits.length > 0 && (
              <div
                className="mt-3 h-1.5 rounded-full overflow-hidden"
                style={{ background: '#e8e5df' }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(completedToday / habits.length) * 100}%`,
                    background: 'linear-gradient(90deg, #059669, #34d399)',
                  }}
                />
              </div>
            )}
          </div>
          {habits.length > 0 && (
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setIsFormVisible(true)}
                data-testid="create-habit-button"
                className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium text-white
                  shadow-sm transition-all hover:opacity-90 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #064e3b 0%, #059669 100%)',
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 500,
                }}
              >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16M4 12h16" />
                </svg>
                Add Habit
              </button>
            </div>
          )}
          {habits.length === 0 ? (
            <div
              data-testid="empty-state"
              className="text-center py-16 px-6 rounded-2xl mt-4"
              style={{
                background: '#ffffff',
                border: '1.5px dashed #d6d3cc',
              }}
            >
              <div
                className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{ background: '#ecfdf5' }}
              >
                <svg className="h-7 w-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
 
              <h3
                className="text-lg text-slate-800 mb-1"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 600 }}
              >
                No habits yet
              </h3>
              <p
                className="text-sm text-slate-400 mb-7 leading-relaxed max-w-xs mx-auto"
                style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
              >
                Small consistent actions become transformative over time. Add your first habit.
              </p>
 
              <button
                onClick={() => setIsFormVisible(true)}
                data-testid="create-habit-button"
                className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium text-white
                  shadow-sm transition-all hover:opacity-90 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #064e3b 0%, #059669 100%)',
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 500,
                }}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16M4 12h16" />
                </svg>
                Create Your First Habit
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {habits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onComplete={handleToggleCompletion}
                  onEdit={openEditForm}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </main>
        {isFormVisible && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(15, 23, 42, 0.45)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
          >
            <div
              className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
              style={{ background: '#ffffff' }}
            >
              <div
                className="px-6 pt-6 pb-4 flex justify-between items-center"
                style={{ borderBottom: '1px solid #f1ede8' }}
              >
                <h2
                  className="text-lg text-slate-900"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 600 }}
                >
                  {habitToEdit ? 'Edit Habit' : 'New Habit'}
                </h2>
                <button
                  onClick={closeForm}
                  className="text-slate-300 hover:text-slate-600 transition-colors rounded-lg p-1 hover:bg-slate-100"
                  aria-label="Close"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="px-6 py-5">
                <HabitForm
                  initialData={habitToEdit || undefined}
                  onSubmit={handleSubmitHabit}
                  onCancel={closeForm}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}