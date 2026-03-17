'use client';

import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Visitor {
  id: number;
  ip: string | null;
  userAgent: string | null;
  path: string;
  createdAt: string;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== 'authenticated') return;

    fetch('/api/visitors', {
      headers: { 'x-admin-email': session?.user?.email ?? '' },
    })
      .then((r) => r.json())
      .then((data: { visitors?: Visitor[]; error?: string }) => {
        if (data.error) {
          setError(data.error);
        } else {
          setVisitors(data.visitors ?? []);
        }
      })
      .catch(() => setError('Failed to load visitors.'))
      .finally(() => setLoading(false));
  }, [status, session?.user?.email]);

  if (status === 'loading') {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-gray-400">Loading…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="mt-1 text-gray-400">Visitor tracking for AlgoTrace Studio</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">{session?.user?.email}</span>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="rounded-lg bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-700"
            >
              Sign out
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-800 bg-red-950/50 p-4 text-red-400">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-gray-400">Loading visitor data…</p>
        ) : !error ? (
          <>
            <div className="mb-4 rounded-lg border border-gray-800 bg-gray-900 px-6 py-4">
              <p className="text-2xl font-semibold">{visitors.length}</p>
              <p className="text-sm text-gray-400">Total visits recorded (last 200)</p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-800">
              <table className="w-full text-sm">
                <thead className="bg-gray-900 text-left text-gray-400">
                  <tr>
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">IP Address</th>
                    <th className="px-4 py-3">Path</th>
                    <th className="px-4 py-3">User Agent</th>
                    <th className="px-4 py-3">Visited At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {visitors.map((v) => (
                    <tr key={v.id} className="hover:bg-gray-900/50">
                      <td className="px-4 py-3 text-gray-500">{v.id}</td>
                      <td className="px-4 py-3 font-mono">{v.ip ?? '-'}</td>
                      <td className="px-4 py-3 font-mono text-blue-400">{v.path}</td>
                      <td className="max-w-xs truncate px-4 py-3 text-gray-400">
                        {v.userAgent ?? '-'}
                      </td>
                      <td className="px-4 py-3 text-gray-400">
                        {new Date(v.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  {visitors.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                        No visitors recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : null}
      </div>
    </main>
  );
}
