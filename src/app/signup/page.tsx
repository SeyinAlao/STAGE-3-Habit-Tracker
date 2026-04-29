"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import SignupForm from '@/components/auth/SignupForm';
import { auth } from '@/lib/auth';

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const result = auth.signup(email, password);

    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error || 'An error occurred');
    }
  };

  return (
    <div className="flex min-h-screen" style={{ background: '#f5f3ef' }}>
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-end p-12 pb-16"
        style={{ background: 'linear-gradient(155deg, #022c22 0%, #064e3b 45%, #065f46 100%)' }}
      >
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 600 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <circle cx="520" cy="200" r="260" fill="white" fillOpacity="0.03" />
          <circle cx="520" cy="200" r="180" fill="white" fillOpacity="0.03" />
          <circle cx="-80" cy="700" r="300" fill="white" fillOpacity="0.04" />
          <circle cx="-80" cy="700" r="200" fill="white" fillOpacity="0.04" />
          <circle cx="300" cy="400" r="350" stroke="white" strokeOpacity="0.04" strokeWidth="1" fill="none" />
          <circle cx="440" cy="360" r="3" fill="white" fillOpacity="0.15" />
          <circle cx="420" cy="420" r="2" fill="white" fillOpacity="0.1" />
          <circle cx="460" cy="450" r="2.5" fill="white" fillOpacity="0.12" />
          <circle cx="380" cy="390" r="2" fill="white" fillOpacity="0.1" />
          <path
            d="M 180 360 L 220 400 L 320 280"
            stroke="white"
            strokeOpacity="0.07"
            strokeWidth="22"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>

        <div className="relative z-10">
          <div
            className="mb-5 inline-flex items-center justify-center rounded-xl"
            style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.1)' }}
          >
            <svg className="h-5 w-5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <blockquote
            className="text-white text-2xl leading-snug"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 500 }}
          >
            &quot;Every master was once a beginner. Every expert was once a novice.&quot;
          </blockquote>

          <div className="mt-5 flex items-center gap-2">
            <div className="h-px w-8 rounded-full" style={{ background: 'rgba(110, 231, 183, 0.6)' }} />
            <span
              className="text-xs tracking-widest uppercase"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 300,
                color: 'rgba(167, 243, 208, 0.8)',
                letterSpacing: '0.12em',
              }}
            >
              Habit Tracker
            </span>
          </div>
        </div>
      </div>

      <div className="flex w-full lg:w-1/2 items-center justify-center">
        <div
          className="w-full max-w-md mx-6 rounded-2xl shadow-xl overflow-hidden"
          style={{ background: '#ffffff' }}
        >
          <SignupForm onSubmit={handleSubmit} error={error} />
        </div>
      </div>

    </div>
  );
}