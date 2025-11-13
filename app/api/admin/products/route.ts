import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-utils';
import { productSchema } from '@/lib/validation';

// GET - Fetch all products
export const GET = requireAdmin(async (request: NextRequest) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ products });
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
