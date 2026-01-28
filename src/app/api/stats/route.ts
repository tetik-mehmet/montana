import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Member from '@/models/Member';
import Membership from '@/models/Membership';
import Package from '@/models/Package';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Parallel queries for better performance
    const [
      totalMembers,
      activeMembers,
      newMembersThisMonth,
      activeMemberships,
      expiringMemberships,
      totalRevenueThisMonth,
      recentMembers,
      packageStats,
    ] = await Promise.all([
      // Total members
      Member.countDocuments(),

      // Active members
      Member.countDocuments({ status: 'active' }),

      // New members this month
      Member.countDocuments({
        createdAt: { $gte: startOfMonth, $lte: endOfMonth },
      }),

      // Active memberships
      Membership.countDocuments({ status: 'active' }),

      // Memberships expiring in next 7 days
      Membership.find({
        status: 'active',
        endDate: { $gte: now, $lte: sevenDaysFromNow },
      })
        .populate('member', 'firstName lastName email')
        .populate('package', 'name')
        .limit(10),

      // Total revenue this month
      Membership.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfMonth, $lte: endOfMonth },
            status: { $ne: 'cancelled' },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$price' },
          },
        },
      ]),

      // Recent members (last 5)
      Member.find().sort({ createdAt: -1 }).limit(5),

      // Package usage statistics
      Membership.aggregate([
        {
          $match: {
            status: { $ne: 'cancelled' },
          },
        },
        {
          $group: {
            _id: '$package',
            count: { $sum: 1 },
            revenue: { $sum: '$price' },
          },
        },
        {
          $lookup: {
            from: 'packages',
            localField: '_id',
            foreignField: '_id',
            as: 'packageInfo',
          },
        },
        {
          $unwind: '$packageInfo',
        },
        {
          $project: {
            _id: 1,
            count: 1,
            revenue: 1,
            name: '$packageInfo.name',
          },
        },
        {
          $sort: { count: -1 },
        },
      ]),
    ]);

    const revenue = totalRevenueThisMonth[0]?.total || 0;

    return NextResponse.json({
      overview: {
        totalMembers,
        activeMembers,
        newMembersThisMonth,
        activeMemberships,
        revenueThisMonth: revenue,
      },
      expiringMemberships,
      recentMembers,
      packageStats,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
