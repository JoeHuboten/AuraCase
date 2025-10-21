import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Fetch all discount codes
export async function GET(request: NextRequest) {
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
}

// POST - Create new discount code
export async function POST(request: NextRequest) {
  try {
    // TODO: Add authentication check for admin users
    
    const body = await request.json();
    const { code, percentage, expiresAt, maxUses, active } = body;

    // Validate required fields
    if (!code || !percentage) {
      return NextResponse.json(
        { error: 'Code and percentage are required' },
        { status: 400 }
      );
    }

    // Validate percentage range
    if (percentage < 1 || percentage > 100) {
      return NextResponse.json(
        { error: 'Percentage must be between 1 and 100' },
        { status: 400 }
      );
    }

    // Check if code already exists
    const existing = await prisma.discountCode.findUnique({
      where: { code: code.toUpperCase() },
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
        code: code.toUpperCase(),
        percentage,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        maxUses: maxUses || null,
        active: active !== undefined ? active : true,
      },
    });

    return NextResponse.json(discountCode, { status: 201 });
  } catch (error) {
    console.error('Error creating discount code:', error);
    return NextResponse.json(
      { error: 'Failed to create discount code' },
      { status: 500 }
    );
  }
}
