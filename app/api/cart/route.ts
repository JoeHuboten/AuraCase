import { NextRequest, NextResponse } from 'next/server';

// This is a placeholder route for cart API
// Since we're using client-side state management with Zustand,
// this route is not actively used but exists to prevent 404 errors

export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    message: 'Cart is managed client-side with Zustand',
    items: []
  });
}
