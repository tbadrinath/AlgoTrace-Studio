import type { Metadata } from 'next';
import './globals.css';
import { Providers, VisitorTracker } from '@/components/Providers';
import NavBar from '@/components/NavBar';

export const metadata: Metadata = {
  title: 'AlgoTrace Studio',
  description: 'Interactive algorithm visualization and step-by-step code tracing',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gray-950 text-gray-100 min-h-screen antialiased">
        <Providers>
          <VisitorTracker />
          <NavBar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
