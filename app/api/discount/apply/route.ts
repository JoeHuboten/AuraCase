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

    // Find and validate the discount code
    const discountCode = await prisma.discountCode.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!discountCode) {
      return NextResponse.json(
        { error: 'Invalid discount code' },
        { status: 404 }
      );
    }

    if (!discountCode.active) {
      return NextResponse.json(
        { error: 'This discount code is not active' },
        { status: 400 }
      );
    }

    if (discountCode.expiresAt && new Date(discountCode.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: 'This discount code has expired' },
        { status: 400 }
      );
    }

    if (discountCode.maxUses && discountCode.currentUses >= discountCode.maxUses) {
      return NextResponse.json(
        { error: 'This discount code has reached its usage limit' },
        { status: 400 }
      );
    }

    // Increment the usage count
    const updatedCode = await prisma.discountCode.update({
      where: { id: discountCode.id },
      data: {
        currentUses: discountCode.currentUses + 1,
      },
    });

    return NextResponse.json({
      success: true,
      code: updatedCode.code,
      percentage: updatedCode.percentage,
      message: `${updatedCode.percentage}% discount applied successfully!`,
    });
  } catch (error) {
    console.error('Error applying discount code:', error);
    return NextResponse.json(
      { error: 'Failed to apply discount code' },
      { status: 500 }
    );
  }
}
