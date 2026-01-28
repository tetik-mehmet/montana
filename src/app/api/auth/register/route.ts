import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, confirmPassword } = body;

    // Validasyon
    if (!email || !password || !name || !confirmPassword) {
      return NextResponse.json(
        { error: 'Tüm alanlar zorunludur' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Şifreler eşleşmiyor' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Şifre en az 6 karakter olmalıdır' },
        { status: 400 }
      );
    }

    // Email validasyon
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Geçerli bir email adresi girin' },
        { status: 400 }
      );
    }

    await connectDB();

    // Email zaten var mı kontrol et
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Bu email adresi zaten kayıtlı' },
        { status: 409 }
      );
    }

    // Şifreyi hash'le
    const hashedPassword = await bcrypt.hash(password, 10);

    // Yeni kullanıcı oluştur (varsayılan olarak 'user' rolü ile)
    const newUser = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      name: name.trim(),
      role: 'user', // Tüm yeni kullanıcılar 'user' rolü ile başlar
    });

    return NextResponse.json(
      {
        message: 'Kullanıcı başarıyla oluşturuldu',
        user: {
          id: newUser._id,
          email: newUser.email,
          name: newUser.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Kayıt hatası:', error);
    return NextResponse.json(
      { error: 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.' },
      { status: 500 }
    );
  }
}
