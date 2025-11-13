import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-utils';
import { productSchema } from '@/lib/validation';

// GET - Fetch single product
export const GET = requireAdmin(async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
});

// PUT - Update product
export const PUT = requireAdmin(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
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

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description !== undefined && { description }),
        ...(price && { price: parseFloat(price) }),
        ...(oldPrice !== undefined && { oldPrice: oldPrice ? parseFloat(oldPrice) : null }),
        ...(discount !== undefined && { discount: discount ? parseInt(discount) : null }),
        ...(image && { image }),
        ...(images && { images }),
        ...(categoryId && { categoryId }),
        ...(colors && { colors }),
        ...(sizes && { sizes }),
        ...(rating !== undefined && { rating: parseFloat(rating) }),
        ...(reviews !== undefined && { reviews: parseInt(reviews) }),
        ...(inStock !== undefined && { inStock }),
        ...(featured !== undefined && { featured }),
        ...(specifications !== undefined && { specifications }),
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
});

// DELETE - Delete product
export const DELETE = requireAdmin(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
});

