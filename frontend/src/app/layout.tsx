import '@/styles/globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '@/hooks/useAuth';

export const metadata: Metadata = {
  title: 'CineApp',
  description: 'Aplicación para reservar boletos de cine',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}