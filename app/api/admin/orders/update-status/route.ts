import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { requireAdmin } from '@/lib/auth-utils';
import { orderStatusSchema } from '@/lib/validation';
import { sendOrderStatusUpdateEmail } from '@/lib/email';

export const POST = requireAdmin(async (request: NextRequest, context: any) => {
  try {
    const body = await request.json();
    const { orderId, status, notes, trackingNumber, courierService, estimatedDelivery } = body;

    if (!orderId || !status) {
      return NextResponse.json(
        { error: 'Order ID and status are required' },
        { status: 400 }
      );
    }

    // Validate status
    const statusValidation = orderStatusSchema.safeParse(status);
    if (!statusValidation.success) {
      return NextResponse.json(
        { error: 'Invalid order status' },
        { status: 400 }
      );
    }

    // Update order
    const updateData: any = {
      status,
      updatedAt: new Date(),
    };

    if (trackingNumber !== undefined) {
      updateData.trackingNumber = trackingNumber;
    }
    if (courierService !== undefined) {
      updateData.courierService = courierService;
    }
    if (estimatedDelivery !== undefined) {
      updateData.estimatedDelivery = estimatedDelivery;
    }

    // If status is DELIVERED, set actualDelivery
    if (status === 'DELIVERED') {
      updateData.actualDelivery = new Date();
    }

    // If status is CANCELLED, set cancelledAt
    if (status === 'CANCELLED') {
      updateData.cancelledAt = new Date();
      if (notes) {
        updateData.cancelReason = notes;
      }
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    // Create status history entry
    await prisma.orderStatusHistory.create({
      data: {
        orderId,
        status,
        notes,
        createdBy: context.user.id,
      },
    });

    // Send email notification to customer
    try {
      if (order.user.email) {
        await sendOrderStatusUpdateEmail(order.user.email, {
          orderId: order.id,
          customerName: order.user.name || 'Customer',
          status,
          trackingNumber: order.trackingNumber || undefined,
          courierService: order.courierService || undefined,
          estimatedDelivery: order.estimatedDelivery?.toISOString(),
          language: 'bg',
        });
      }
    } catch (emailError) {
      console.error('Failed to send status update email:', emailError);
      // Don't fail the status update if email fails
    }

    return NextResponse.json({
      success: true,
      order,
      message: `Order status updated to ${status}`,
    });
  } catch (error) {
    console.error('Order status update error:', error);
    return NextResponse.json(
      { error: 'Failed to update order status' },
      { status: 500 }
    );
  }
});

export const GET = requireAdmin(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID required' },
        { status: 400 }
      );
    }

    const statusHistory = await prisma.orderStatusHistory.findMany({
      where: { orderId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ statusHistory });
  } catch (error) {
    console.error('Status history fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch status history' },
      { status: 500 }
    );
  }
});
