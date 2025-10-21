import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { getUserFromRequest } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    const trackingNumber = searchParams.get('trackingNumber');

    let order;

    if (orderId) {
      order = await prisma.order.findFirst({
        where: {
          id: orderId,
          userId: user.id,
        },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                  slug: true,
                },
              },
            },
          },
          shippingAddress: true,
          statusHistory: {
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      });
    } else if (trackingNumber) {
      order = await prisma.order.findFirst({
        where: {
          trackingNumber: trackingNumber,
          userId: user.id,
        },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                  slug: true,
                },
              },
            },
          },
          shippingAddress: true,
          statusHistory: {
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      });
    } else {
      return NextResponse.json(
        { error: 'Order ID or tracking number required' },
        { status: 400 }
      );
    }

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Order tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}
