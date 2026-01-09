import { NextRequest, NextResponse } from 'next/server';
import { prisma, getPaginationParams } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-utils';
import { productSchema } from '@/lib/validation';
import { Prisma } from '@prisma/client';

// GET - Fetch products with pagination
export const GET = requireAdmin(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));
    const search = searchParams.get('search')?.trim();
    const category = searchParams.get('category');
    const inStock = searchParams.get('inStock');
    const featured = searchParams.get('featured');
    
    const { take, skip } = getPaginationParams(page, limit);
    
    // Build where clause
    const where: Prisma.ProductWhereInput = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (category) {
      where.categoryId = category;
    }
    
    if (inStock === 'true') {
      where.inStock = true;
    } else if (inStock === 'false') {
      where.inStock = false;
    }
    
    if (featured === 'true') {
      where.featured = true;
    }
    
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take,
        skip,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({ 
      products,
      total,
      page,
      limit: take,
      totalPages: Math.ceil(total / take),
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
});

// POST - Create new product
export const POST = requireAdmin(async (request: NextRequest) => {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = productSchema.parse(body);

    // Check if slug already exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: 'Product with this slug already exists' },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: validatedData,
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
});
