import React from 'react';

export default function SplashScreen() {
  return (
    <div
      data-testid="splash-screen"
      className="flex min-h-screen flex-col items-center justify-center px-4 relative overflow-hidden"
      style={{ background: '#f5f3ef' }}
    >
      <div
        className="absolute rounded-full opacity-20 pointer-events-none"
        style={{
          width: 480,
          height: 480,
          background: 'radial-gradient(circle, #6ee7b7 0%, transparent 70%)',
          top: '-80px',
          right: '-100px',
        }}
      />
      <div
        className="absolute rounded-full opacity-10 pointer-events-none"
        style={{
          width: 360,
          height: 360,
          background: 'radial-gradient(circle, #34d399 0%, transparent 70%)',
          bottom: '-60px',
          left: '-80px',
        }}
      />
      <div
        className="mb-6 flex items-center justify-center rounded-2xl shadow-md"
        style={{
          width: 80,
          height: 80,
          background: 'linear-gradient(135deg, #064e3b 0%, #059669 100%)',
        }}
      >
        <svg
          className="h-8 w-8 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
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
        className="text-3xl tracking-tight text-slate-900 mt-1"
        style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 600 }}
      >
        Habit Tracker
      </h1>

      <p
        className="mt-2 text-sm tracking-widest uppercase text-slate-400"
        style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.12em', fontWeight: 300 }}
      >
        Discipline, Redefined.
      </p>
      <div
        className="mt-10 overflow-hidden rounded-full"
        style={{ width: 120, height: 3, background: '#e2e8f0' }}
      >
        <div
          className="h-full rounded-full animate-pulse"
          style={{
            width: '55%',
            background: 'linear-gradient(90deg, #059669, #34d399)',
          }}
        />
      </div>
    </div>
  );
}