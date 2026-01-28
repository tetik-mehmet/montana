import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Membership from '@/models/Membership';
import Package from '@/models/Package';
import Member from '@/models/Member';
import { calculateEndDate } from '@/lib/utils';

// GET - Tüm üyelikleri listele
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') || '';
    const memberId = searchParams.get('memberId') || '';

    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};
    if (status) {
      query.status = status;
    }
    if (memberId) {
      query.member = memberId;
    }

    const [memberships, total] = await Promise.all([
      Membership.find(query)
        .populate('member', 'firstName lastName email')
        .populate('package', 'name duration price')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Membership.countDocuments(query),
    ]);

    return NextResponse.json({
      memberships,
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

// POST - Yeni üyelik oluştur
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // Get package to calculate end date
    const pkg = await Package.findById(body.package);
    if (!pkg) {
      return NextResponse.json({ error: 'Paket bulunamadı' }, { status: 404 });
    }

    // Get member to update status
    const member = await Member.findById(body.member);
    if (!member) {
      return NextResponse.json({ error: 'Üye bulunamadı' }, { status: 404 });
    }

    // Calculate end date
    const startDate = new Date(body.startDate);
    const endDate = calculateEndDate(startDate, pkg.duration);

    // Use package price if not provided
    const price = body.price || pkg.price;

    // Create membership
    const membership = await Membership.create({
      ...body,
      endDate,
      price,
      status: 'active',
    });

    // Update member status to active
    await Member.findByIdAndUpdate(body.member, { status: 'active' });

    // Populate and return
    const populatedMembership = await Membership.findById(membership._id)
      .populate('member', 'firstName lastName email')
      .populate('package', 'name duration price');

    return NextResponse.json(populatedMembership, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
