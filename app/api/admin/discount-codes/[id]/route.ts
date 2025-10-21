import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT - Update discount code
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Add authentication check for admin users
    
    const body = await request.json();
    const { code, percentage, expiresAt, maxUses, active } = body;

    // Validate percentage range if provided
    if (percentage !== undefined && (percentage < 1 || percentage > 100)) {
      return NextResponse.json(
        { error: 'Percentage must be between 1 and 100' },
        { status: 400 }
      );
    }

    // If code is being changed, check if it already exists
    if (code) {
      const existing = await prisma.discountCode.findUnique({
        where: { code: code.toUpperCase() },
      });

      if (existing && existing.id !== params.id) {
        return NextResponse.json(
          { error: 'Discount code already exists' },
          { status: 400 }
        );
      }
    }

    // Update discount code
    const discountCode = await prisma.discountCode.update({
      where: { id: params.id },
      data: {
        code: code ? code.toUpperCase() : undefined,
        percentage,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        maxUses: maxUses !== undefined ? maxUses : undefined,
        active,
      },
    });

    return NextResponse.json(discountCode);
  } catch (error) {
    console.error('Error updating discount code:', error);
    return NextResponse.json(
      { error: 'Failed to update discount code' },
      { status: 500 }
    );
  }
}

// DELETE - Delete discount code
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Add authentication check for admin users
    
    await prisma.discountCode.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting discount code:', error);
    return NextResponse.json(
      { error: 'Failed to delete discount code' },
      { status: 500 }
    );
  }
}
