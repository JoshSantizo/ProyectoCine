"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

const HomePage = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      router.push('/register'); // Cambia '/register' a la página principal
    }
  }, [isAuthenticated, router]);

  return (
    <div>
      Redirigiendo...
    </div>
  );
};

export default HomePage;