// /app/page.tsx
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
// /app/page.tsx
// /app/page.tsx
import { useAuth } from '@/hooks/useAuth';
import Spinner from '@/components/common/Spinner';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace('/dashboard');
      } else {
        router.replace('/auth/login');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <Spinner />
    </div>
  );
}