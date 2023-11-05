'use client';
import { ReactNode } from 'react';
import { Header } from '@/components/Header';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AuthProvider } from '@/context/authContext';
import { cn } from '@/lib/utils';
import { Inter as FontSans } from 'next/font/google';
import './globals.css';

export const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <Header />
            <div className="mx-auto px-4 pt-6">{children}</div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
