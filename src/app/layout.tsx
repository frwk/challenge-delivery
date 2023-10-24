'use client';
import { ReactNode } from 'react';

import { Inter as FontSans } from 'next/font/google';
import { cn } from '@/lib/utils';
import './globals.css';
import { MainNav } from '@/components/MainNav';
import { UserNav } from '@/components/UserNav';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ThemeToggle } from '@/components/ThemeToggle';

export const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="border-b">
            <div className="flex h-16 items-center px-4">
              <MainNav />
              <div className="ml-auto flex items-center space-x-4">
                <ThemeToggle />
                <UserNav />
              </div>
            </div>
          </div>
          <div className="mx-auto px-4 pt-6">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
