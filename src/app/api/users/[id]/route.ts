import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/User';

// Kullanıcı rolünü güncelle (sadece admin)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Bu işlem için yetkiniz yok' },
        { status: 403 }
      );
    }

    const { role } = await req.json();

    if (!role || !['admin', 'user'].includes(role)) {
      return NextResponse.json(
        { error: 'Geçersiz rol değeri' },
        { status: 400 }
      );
    }

    await connectDB();

    const { id } = await params;

    // Kendi rolünü değiştirmeye çalışıyorsa engelle
    if (id === session.user.id) {
      return NextResponse.json(
        { error: 'Kendi rolünüzü değiştiremezsiniz' },
        { status: 400 }
      );
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: false }
    ).select('-password');

    if (!user) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Kullanıcı rolü güncellenirken hata:', error);
    return NextResponse.json(
      { error: 'Kullanıcı rolü güncellenemedi' },
      { status: 500 }
    );
  }
}
