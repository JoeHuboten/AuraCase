import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-utils';
import { categorySchema } from '@/lib/validation';

// GET - Fetch all categories
export const GET = requireAdmin(async (request: NextRequest) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
});

// POST - Create new category
export const POST = requireAdmin(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const validatedData = categorySchema.parse(body);
    const { name, slug, description, image } = body;

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        image,
      },
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
});
