import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { path } = (await req.json()) as { path: string };
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      req.headers.get('x-real-ip') ??
      'unknown';
    const userAgent = req.headers.get('user-agent') ?? 'unknown';

    await prisma.visitor.create({
      data: { ip, userAgent, path: path ?? '/' },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const reqEmail = req.headers.get('x-admin-email');

    if (!adminEmail || reqEmail !== adminEmail) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const visitors = await prisma.visitor.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200,
    });

    return NextResponse.json({ visitors });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
