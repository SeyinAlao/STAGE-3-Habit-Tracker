"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const session = auth.getCurrentSession();
      if (!session) {
        router.push('/login');
      } else {
        setIsAuthorized(true);
      }
    };

    checkAuth();
  }, [router]);

  if (!isAuthorized) return null;

  return <>{children}</>;
}