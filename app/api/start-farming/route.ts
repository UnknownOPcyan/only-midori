// app/api/start-farming/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { telegramId } = await req.json();

    if (!telegramId) {
      return NextResponse.json({ error: 'Invalid telegramId' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { telegramId },
      data: { 
        startFarming: new Date(),
        isOnline: true,
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error starting farming:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// app/api/update-online-status/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { telegramId } = await req.json();

    if (!telegramId) {
      return NextResponse.json({ error: 'Invalid telegramId' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { telegramId },
      data: { 
        isOnline: true,
        currentTime: new Date(),
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating online status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
