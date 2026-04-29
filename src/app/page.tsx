"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SplashScreen from '@/components/shared/SplashScreen';
import { auth } from '@/lib/auth';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      const session = auth.getCurrentSession();
      
      if (session) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [router]);
  return <SplashScreen />;
}