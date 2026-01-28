import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Member from '@/models/Member';
import Membership from '@/models/Membership';

// Kullanıcının aktif üyeliğini getir
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Oturum bulunamadı' },
        { status: 401 }
      );
    }

    await connectDB();

    // Kullanıcının email'i ile member kaydını bul
    const member = await Member.findOne({ email: session.user.email });

    if (!member) {
      return NextResponse.json({ membership: null });
    }

    // Aktif veya yakında dolacak üyelikleri bul
    const membership = await Membership.findOne({
      member: member._id,
      status: { $in: ['active', 'expiring'] }
    })
      .populate('package')
      .sort({ endDate: -1 });

    return NextResponse.json({ membership });
  } catch (error) {
    console.error('Üyelik bilgisi getirilirken hata:', error);
    return NextResponse.json(
      { error: 'Üyelik bilgisi getirilemedi' },
      { status: 500 }
    );
  }
}
