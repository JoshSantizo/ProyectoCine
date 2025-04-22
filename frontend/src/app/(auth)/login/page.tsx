"use client";

import LoginForm from '@/components/auth/LoginForm';
import { Card } from '@/components/common';
import Link from 'next/link';

const LoginPage = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f0f0f0' }}>
      <Card style={{ width: '400px' }}>
        <LoginForm />
        <p style={{ marginTop: '1rem', textAlign: 'center' }}>
          <Link href="/register">Crear cuenta</Link>
        </p>
      </Card>
    </div>
  );
};

export default LoginPage;