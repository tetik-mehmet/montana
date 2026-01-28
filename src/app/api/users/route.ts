import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/User';

// Tüm kullanıcıları getir (sadece admin)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Bu işlem için yetkiniz yok' },
        { status: 403 }
      );
    }

    await connectDB();

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Kullanıcılar getirilirken hata:', error);
    return NextResponse.json(
      { error: 'Kullanıcılar getirilemedi' },
      { status: 500 }
    );
  }
}
