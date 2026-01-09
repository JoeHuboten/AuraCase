import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { apiRateLimit } from '@/lib/rate-limit';
import { createLogger, getRequestId } from '@/lib/logger';

export async function GET(request: NextRequest) {
  const requestId = getRequestId(request.headers);
  const logger = createLogger('api:orders').withRequestId(requestId);
  const startTime = Date.now();
  
  logger.debug('GET /api/orders');

  // Rate limiting
  const rateLimitResult = await apiRateLimit(request);
  if (!rateLimitResult.success) {
    logger.warn('Rate limit exceeded');
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.', requestId },
      { status: 429, headers: { 'x-request-id': requestId } }
    );
  }

  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      logger.warn('Unauthorized access attempt');
      return NextResponse.json(
        { error: 'Unauthorized', requestId }, 
        { status: 401, headers: { 'x-request-id': requestId } }
      );
    }

    logger.debug('Fetching orders for user', { userId: user.id });

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const duration = Date.now() - startTime;
    logger.info(`Found ${orders.length} orders`, { userId: user.id, duration: `${duration}ms` });

    return NextResponse.json(orders, { headers: { 'x-request-id': requestId } });
  } catch (error: unknown) {
    const duration = Date.now() - startTime;
    logger.error('Error fetching orders', { error, duration: `${duration}ms` });
    return NextResponse.json(
      { error: 'Failed to fetch orders', requestId },
      { status: 500, headers: { 'x-request-id': requestId } }
    );
  }
}
