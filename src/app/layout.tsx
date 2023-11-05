'use client';
import { ReactNode } from 'react';
import { Header } from '@/components/Header';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AuthProvider } from '@/context/authContext';
import { cn } from '@/lib/utils';
import { Inter as FontSans } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

export const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('flex flex-col min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <Toaster />
            <Header />
            <div className="flex flex-1 justify-center p-4">{children}</div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
