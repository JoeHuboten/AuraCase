import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-utils';
import { discountCodeSchema } from '@/lib/validation';

// GET - Fetch all discount codes
export const GET = requireAdmin(async (request: NextRequest) => {
  try {
    // TODO: Add authentication check for admin users
    
    const codes = await prisma.discountCode.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(codes);
  } catch (error) {
    console.error('Error fetching discount codes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch discount codes' },
      { status: 500 }
    );
  }
});

// POST - Create new discount code
export const POST = requireAdmin(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const validatedData = discountCodeSchema.parse(body);

    // Check if code already exists
    const existing = await prisma.discountCode.findUnique({
      where: { code: validatedData.code.toUpperCase() },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Discount code already exists' },
        { status: 400 }
      );
    }

    // Create discount code
    const discountCode = await prisma.discountCode.create({
      data: {
        code: validatedData.code.toUpperCase(),
        percentage: validatedData.percentage,
        expiresAt: validatedData.expiresAt ? new Date(validatedData.expiresAt) : null,
        maxUses: validatedData.maxUses || null,
        active: validatedData.active !== undefined ? validatedData.active : true,
      },
    });

    return NextResponse.json(discountCode, { status: 201 });
  } catch (error: any) {
    console.error('Error creating discount code:', error);
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create discount code' },
      { status: 500 }
    );
  }
});
