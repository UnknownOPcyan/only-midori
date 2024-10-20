import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const userData = await req.json();
    if (!userData || !userData.id) {
      return NextResponse.json({ error: 'Invalid user data' }, { status: 400 });
    }

    const currentTime = new Date();

    let user = await prisma.user.findUnique({
      where: { telegramId: userData.id },
      select: {
        telegramId: true,
        username: true,
        firstName: true,
        lastName: true,
        points: true,
        claimedButton1: true,
        claimedButton2: true,
        claimedButton3: true,
        claimedButton4: true,
        claimedButton5: true,
        claimedButton6: true,
        claimedButton7: true,
        claimedButton8: true,
        invitedUsers: true,
        invitedBy: true,
        startFarming: true,
        isOnline: true,
        currentTime: true
      }
    });

    const inviterId = userData.start_param ? parseInt(userData.start_param) : null;

    if (!user) {
      const newUserData = {
        telegramId: userData.id,
        username: userData.username || '',
        firstName: userData.first_name || '',
        lastName: userData.last_name || '',
        isOnline: true,
        currentTime,
      };

      if (inviterId) {
        const inviterInfo = await prisma.user.findUnique({
          where: { telegramId: inviterId },
          select: { username: true, firstName: true, lastName: true }
        });

        if (inviterInfo) {
          newUserData.invitedBy = `@${inviterInfo.username || inviterId}`;
          
          user = await prisma.user.create({ data: newUserData });

          await prisma.user.update({
            where: { telegramId: inviterId },
            data: {
              invitedUsers: { push: `@${userData.username || userData.id}` },
              points: { increment: 1000 }
            }
          });
        } else {
          user = await prisma.user.create({ data: newUserData });
        }
      } else {
        user = await prisma.user.create({ data: newUserData });
      }
    } else {
      user = await prisma.user.update({
        where: { telegramId: userData.id },
        data: {
          isOnline: true,
          currentTime,
        }
      });
    }

    let inviterInfo = null;
    if (inviterId) {
      inviterInfo = await prisma.user.findUnique({
        where: { telegramId: inviterId },
        select: { username: true, firstName: true, lastName: true }
      });
    }

    let farmingStatus = 'farm';
    if (user.startFarming) {
      const now = new Date();
      const timeDiff = now.getTime() - user.startFarming.getTime();
      if (timeDiff < 30000) { // Less than 30 seconds
        farmingStatus = 'farming';
      } else {
        farmingStatus = 'claim';
      }
    }

    return NextResponse.json({ user, inviterInfo, farmingStatus });
  } catch (error) {
    console.error('Error processing user data:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
