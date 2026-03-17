'use client';

import { SessionProvider } from 'next-auth/react';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}

export function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    fetch('/api/visitors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: pathname }),
    }).catch(() => {
      // silently ignore tracking errors
    });
  }, [pathname]);

  return null;
}
