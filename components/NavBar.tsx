'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

export default function NavBar() {
  const { data: session, status } = useSession();

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-950">
      <Link href="/" className="font-bold text-lg bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        AlgoTrace Studio
      </Link>

      <div className="flex items-center gap-4 text-sm">
        <Link href="/playground" className="text-gray-400 hover:text-white transition">Playground</Link>
        <Link href="/visualizer" className="text-gray-400 hover:text-white transition">Visualizer</Link>
        <Link href="/examples" className="text-gray-400 hover:text-white transition">Examples</Link>
        {session && (
          <Link href="/admin" className="text-gray-400 hover:text-white transition">Admin</Link>
        )}

        {status === 'loading' ? null : session ? (
          <div className="flex items-center gap-3">
            {session.user?.image && (
              <Image
                src={session.user.image}
                alt={session.user.name ?? 'User avatar'}
                width={28}
                height={28}
                className="rounded-full"
              />
            )}
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="rounded-lg bg-gray-800 px-3 py-1.5 text-gray-300 hover:bg-gray-700 transition"
            >
              Sign out
            </button>
          </div>
        ) : (
          <button
            onClick={() => signIn()}
            className="rounded-lg bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-500 transition"
          >
            Sign in
          </button>
        )}
      </div>
    </nav>
  );
}
