import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json(
        { error: 'Discount code is required' },
        { status: 400 }
      );
    }

    // Find the discount code
    const discountCode = await prisma.discountCode.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!discountCode) {
      return NextResponse.json(
        { error: 'Invalid discount code' },
        { status: 404 }
      );
    }

    // Check if code is active
    if (!discountCode.active) {
      return NextResponse.json(
        { error: 'This discount code is not active' },
        { status: 400 }
      );
    }

    // Check if code has expired
    if (discountCode.expiresAt && new Date(discountCode.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: 'This discount code has expired' },
        { status: 400 }
      );
    }

    // Check if code has reached max uses
    if (discountCode.maxUses && discountCode.currentUses >= discountCode.maxUses) {
      return NextResponse.json(
        { error: 'This discount code has reached its usage limit' },
        { status: 400 }
      );
    }

    // Return valid discount code
    return NextResponse.json({
      success: true,
      code: discountCode.code,
      percentage: discountCode.percentage,
      message: `${discountCode.percentage}% discount applied!`,
    });
  } catch (error) {
    console.error('Error validating discount code:', error);
    return NextResponse.json(
      { error: 'Failed to validate discount code' },
      { status: 500 }
    );
  }
}
