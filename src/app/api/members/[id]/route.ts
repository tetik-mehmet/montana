import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Member from '@/models/Member';

// GET - Tek üye getir
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const member = await Member.findById(id);

    if (!member) {
      return NextResponse.json({ error: 'Üye bulunamadı' }, { status: 404 });
    }

    return NextResponse.json(member);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Üye güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const body = await request.json();
    const member = await Member.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!member) {
      return NextResponse.json({ error: 'Üye bulunamadı' }, { status: 404 });
    }

    return NextResponse.json(member);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// DELETE - Üye sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const member = await Member.findByIdAndDelete(id);

    if (!member) {
      return NextResponse.json({ error: 'Üye bulunamadı' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Üye silindi' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
