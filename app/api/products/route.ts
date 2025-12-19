import { NextRequest, NextResponse } from 'next/server';
import { prisma, productSelectFields, getPaginationParams } from '@/lib/prisma';
import { apiRateLimit } from '@/lib/rate-limit';
import { apiCache, cacheKeys, cacheTTL } from '@/lib/cache';

export async function GET(request: NextRequest) {
  // Rate limiting
  const rateLimitResult = await apiRateLimit(request);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '24');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const inStock = searchParams.get('inStock');
    
    // Build cache key from params
    const cacheKey = cacheKeys.products(`${page}-${limit}-${category || ''}-${featured || ''}-${inStock || ''}`);
    
    // Try cache first
    const cached = apiCache.get<{ products: unknown[]; total: number; page: number; totalPages: number }>(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }

    const { take, skip } = getPaginationParams(page, limit);
    
    // Build where clause
    const where: Record<string, unknown> = {};
    if (category) where.category = { slug: category };
    if (featured === 'true') where.featured = true;
    if (inStock === 'true') where.inStock = true;

    // Execute queries in parallel
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        select: productSelectFields,
        take,
        skip,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    const result = {
      products,
      total,
      page,
      totalPages: Math.ceil(total / take),
    };

    // Cache the result
    apiCache.set(cacheKey, result, cacheTTL.products);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
