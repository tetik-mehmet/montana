import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Membership from '@/models/Membership';
import Package from '@/models/Package';
import { calculateEndDate } from '@/lib/utils';

// GET - Tek üyelik getir
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const membership = await Membership.findById(id)
      .populate('member', 'firstName lastName email phone')
      .populate('package', 'name duration price');

    if (!membership) {
      return NextResponse.json({ error: 'Üyelik bulunamadı' }, { status: 404 });
    }

    return NextResponse.json(membership);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Üyelik güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const body = await request.json();

    // If package changed, recalculate end date
    if (body.package || body.startDate) {
      const membership = await Membership.findById(id);
      if (!membership) {
        return NextResponse.json({ error: 'Üyelik bulunamadı' }, { status: 404 });
      }

      const packageId = body.package || membership.package;
      const pkg = await Package.findById(packageId);
      if (!pkg) {
        return NextResponse.json({ error: 'Paket bulunamadı' }, { status: 404 });
      }

      const startDate = body.startDate ? new Date(body.startDate) : membership.startDate;
      body.endDate = calculateEndDate(startDate, pkg.duration);
    }

    const membership = await Membership.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    })
      .populate('member', 'firstName lastName email')
      .populate('package', 'name duration price');

    if (!membership) {
      return NextResponse.json({ error: 'Üyelik bulunamadı' }, { status: 404 });
    }

    return NextResponse.json(membership);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// DELETE - Üyelik sil (iptal et)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const membership = await Membership.findByIdAndUpdate(
      id,
      { status: 'cancelled' },
      { new: true }
    );

    if (!membership) {
      return NextResponse.json({ error: 'Üyelik bulunamadı' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Üyelik iptal edildi' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
