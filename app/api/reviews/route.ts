import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiRateLimit } from '@/lib/rate-limit';

// GET - Fetch product reviews
export async function GET(request: NextRequest) {
  // Rate limiting - 60 requests per minute
  const rateLimitResult = await apiRateLimit(request);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const reviews = await prisma.review.findMany({
      where: {
        productId,
        verified: true, // Only show verified reviews
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// POST - Create a new review
export async function POST(request: NextRequest) {
  // Rate limiting - 60 requests per minute
  const rateLimitResult = await apiRateLimit(request);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { productId, userId, rating, comment, title } = body;

    // Validate required fields
    if (!productId || !rating || !userId) {
      return NextResponse.json(
        { error: 'Product ID, user ID, and rating are required' },
        { status: 400 }
      );
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Create review (not verified by default)
    const review = await prisma.review.create({
      data: {
        productId,
        userId,
        rating: parseInt(rating),
        comment: comment || null,
        title: title || null,
        verified: false, // Require admin verification
      },
    });

    return NextResponse.json(
      { 
        success: true, 
        review,
        message: 'Review submitted and pending verification'
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating review:', error);
    
    // Handle unique constraint violation (user already reviewed this product)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}
