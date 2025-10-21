import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Fetch all products
export async function GET(request: NextRequest) {
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
}

// POST - Create new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      slug,
      description,
      price,
      oldPrice,
      discount,
      image,
      images,
      categoryId,
      colors,
      sizes,
      rating,
      reviews,
      inStock,
      featured,
      specifications,
    } = body;

    // Validate required fields
    if (!name || !slug || !price || !image || !categoryId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: parseFloat(price),
        oldPrice: oldPrice ? parseFloat(oldPrice) : null,
        discount: discount ? parseInt(discount) : null,
        image,
        images: images || image,
        categoryId,
        colors: colors || '[]',
        sizes: sizes || '[]',
        rating: rating ? parseFloat(rating) : 0,
        reviews: reviews ? parseInt(reviews) : 0,
        inStock: inStock !== undefined ? inStock : true,
        featured: featured !== undefined ? featured : false,
        specifications: specifications || null,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
