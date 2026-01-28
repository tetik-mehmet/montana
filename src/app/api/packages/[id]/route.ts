import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Package from '@/models/Package';

// GET - Tek paket getir
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const pkg = await Package.findById(id);

    if (!pkg) {
      return NextResponse.json({ error: 'Paket bulunamadı' }, { status: 404 });
    }

    return NextResponse.json(pkg);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Paket güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const body = await request.json();
    const pkg = await Package.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!pkg) {
      return NextResponse.json({ error: 'Paket bulunamadı' }, { status: 404 });
    }

    return NextResponse.json(pkg);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// DELETE - Paket sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const pkg = await Package.findByIdAndDelete(id);

    if (!pkg) {
      return NextResponse.json({ error: 'Paket bulunamadı' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Paket silindi' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
