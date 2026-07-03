import type { ReactNode } from 'react';
import { AnimatedBackground } from './AnimatedBackground';
import { Navbar } from './Navbar';

interface PageLayoutProps {
  children: ReactNode;
  centered?: boolean;
}

export function PageLayout({ children, centered = true }: PageLayoutProps) {
  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <Navbar />
      <main
        className={`relative px-4 pt-28 pb-16 ${centered ? 'flex min-h-screen items-center justify-center' : ''}`}
      >
        {children}
      </main>
    </div>
  );
}
