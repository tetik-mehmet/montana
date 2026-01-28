import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Package from '@/models/Package';

// GET - Tüm paketleri listele
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const isActive = searchParams.get('isActive');

    const query: any = {};
    if (isActive !== null && isActive !== '') {
      query.isActive = isActive === 'true';
    }

    const packages = await Package.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ packages });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Yeni paket ekle
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const pkg = await Package.create(body);

    return NextResponse.json(pkg, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
