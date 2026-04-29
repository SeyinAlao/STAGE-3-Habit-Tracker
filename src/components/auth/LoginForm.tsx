import React from 'react';
import Link from 'next/link';

type LoginFormProps = {
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  error?: string | null;
};

export default function LoginForm({ onSubmit, error }: LoginFormProps) {
  return (
    <div className="mx-auto w-full max-w-md px-8 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-6">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ background: 'linear-gradient(135deg, #064e3b 0%, #059669 100%)' }}
          >
            <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span
            className="text-sm font-medium text-slate-500 tracking-wide"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Habit Tracker
          </span>
        </div>

        <h1
          className="text-3xl text-slate-900 leading-tight"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 600 }}
        >
          Welcome back.
        </h1>
        <p
          className="mt-1.5 text-sm text-slate-500"
          style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
        >
          Sign in to continue your streak.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
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
          <label
            htmlFor="email"
            className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5"
            style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.08em' }}
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            data-testid="auth-login-email"
            placeholder="you@example.com"
            className="block w-full rounded-xl border px-4 py-3 text-slate-900 shadow-sm transition-all
              focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.9rem',
              background: '#fafaf8',
              borderColor: '#e2e0db',
            }}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5"
            style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.08em' }}
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            data-testid="auth-login-password"
            placeholder="••••••••"
            className="block w-full rounded-xl border px-4 py-3 text-slate-900 shadow-sm transition-all
              focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.9rem',
              background: '#fafaf8',
              borderColor: '#e2e0db',
            }}
          />
        </div>

        <button
          type="submit"
          data-testid="auth-login-submit"
          className="mt-2 flex w-full justify-center rounded-xl px-4 py-3 text-sm font-medium text-white
            shadow-sm transition-all hover:opacity-90 active:scale-[0.99]"
          style={{
            background: 'linear-gradient(135deg, #064e3b 0%, #059669 100%)',
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500,
            letterSpacing: '0.01em',
          }}
        >
          Sign In
        </button>
      </form>

      <p
        className="mt-7 text-center text-sm text-slate-500"
        style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
      >
        Don&#39;t have an account?{' '}
        <Link
          href="/signup"
          className="font-medium text-emerald-700 hover:text-emerald-600 underline underline-offset-2"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}