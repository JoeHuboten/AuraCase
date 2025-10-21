import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { items, discountCode } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Calculate total
    const subtotal = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
    let discount = 0;

    // Apply discount if provided
    if (discountCode) {
      // Discount calculation will be handled by cart store
    }

    const total = (subtotal - discount).toFixed(2);

    // Create PayPal order
    const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
    const PAYPAL_API = process.env.PAYPAL_MODE === 'live' 
      ? 'https://api-m.paypal.com' 
      : 'https://api-m.sandbox.paypal.com';

    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET || 
        PAYPAL_CLIENT_ID === 'your_paypal_client_id' ||
        PAYPAL_CLIENT_SECRET === 'your_paypal_client_secret') {
      return NextResponse.json({
        error: 'Payment system not configured',
        message: 'PayPal credentials are not set up. Please configure PayPal in your environment settings.',
        configured: false,
      }, { status: 503 });
    }

    // Get PayPal access token
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
    const tokenResponse = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    const { access_token } = await tokenResponse.json();

    // Create order
    const orderResponse = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: total,
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: subtotal.toFixed(2),
              },
              discount: discount > 0 ? {
                currency_code: 'USD',
                value: discount.toFixed(2),
              } : undefined,
            },
          },
          items: items.map((item: any) => ({
            name: item.name,
            unit_amount: {
              currency_code: 'USD',
              value: item.price.toFixed(2),
            },
            quantity: item.quantity.toString(),
          })),
          custom_id: user.id,
        }],
        application_context: {
          brand_name: 'AuraCase',
          shipping_preference: 'NO_SHIPPING',
          user_action: 'PAY_NOW',
          return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment/success`,
          cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout`,
        },
      }),
    });

    const orderData = await orderResponse.json();

    if (!orderResponse.ok) {
      console.error('PayPal order creation failed:', orderData);
      return NextResponse.json({
        error: 'Failed to create PayPal order',
        message: orderData.message || 'An error occurred',
      }, { status: 500 });
    }

    return NextResponse.json({
      orderId: orderData.id,
      configured: true,
    });
  } catch (error: any) {
    console.error('PayPal order creation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create order',
        message: error.message || 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}
