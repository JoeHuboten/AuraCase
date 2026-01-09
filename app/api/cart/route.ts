import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

// GET - Retrieve user's saved cart
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json({ items: [] });
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: user.id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            oldPrice: true,
            discount: true,
            image: true,
          },
        },
      },
    });

    const items = cartItems.map((item) => ({
      id: item.product.id,
      name: item.product.name,
      price: item.product.discount 
        ? item.product.price * (1 - item.product.discount / 100)
        : item.product.price,
      oldPrice: item.product.oldPrice,
      discount: item.product.discount,
      image: item.product.image,
      quantity: item.quantity,
      color: item.color,
      size: item.size,
    }));

    return NextResponse.json({ items });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json({ items: [] });
  }
}

// POST - Sync user's cart (merge or replace)
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { items, merge = false } = await request.json();

    // If not merging, clear existing cart first
    if (!merge) {
      await prisma.cartItem.deleteMany({
        where: { userId: user.id },
      });
    }

    // Upsert each item
    for (const item of items) {
      const existingItem = await prisma.cartItem.findFirst({
        where: {
          userId: user.id,
          productId: item.id,
          color: item.color || null,
          size: item.size || null,
        },
      });

      if (existingItem) {
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { 
            quantity: merge 
              ? existingItem.quantity + item.quantity 
              : item.quantity 
          },
        });
      } else {
        await prisma.cartItem.create({
          data: {
            userId: user.id,
            productId: item.id,
            quantity: item.quantity,
            color: item.color || null,
            size: item.size || null,
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving cart:', error);
    return NextResponse.json(
      { error: 'Failed to save cart' },
      { status: 500 }
    );
  }
}

// DELETE - Clear user's cart
export async function DELETE(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    await prisma.cartItem.deleteMany({
      where: { userId: user.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error clearing cart:', error);
    return NextResponse.json(
      { error: 'Failed to clear cart' },
      { status: 500 }
    );
  }
}

