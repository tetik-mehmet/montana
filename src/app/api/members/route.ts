import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Member from '@/models/Member';

// GET - Liste tüm üyeleri
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }
    if (status) {
      query.status = status;
    }

    const [members, total] = await Promise.all([
      Member.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Member.countDocuments(query),
    ]);

    return NextResponse.json({
      members,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Yeni üye ekle
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const member = await Member.create(body);

    return NextResponse.json(member, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
