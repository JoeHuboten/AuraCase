import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { z } from 'zod';
import { sendNewsletterWelcomeEmail } from '@/lib/email';
import { apiRateLimit } from '@/lib/rate-limit';
import { validateCsrf } from '@/lib/csrf';

const newsletterSchema = z.object({
  email: z.string().email('Невалиден имейл адрес'),
});

export async function POST(request: NextRequest) {
  // Rate limiting
  const rateLimitResult = await apiRateLimit(request);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  // CSRF protection
  const csrfResult = validateCsrf(request);
  if (!csrfResult.valid) {
    return NextResponse.json(
      { error: csrfResult.error || 'Invalid request' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    
    // Validate email
    const result = newsletterSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }
    
    const { email } = result.data;
    
    // Check if already subscribed
    const existingSubscription = await prisma.newsletterSubscription.findUnique({
      where: { email },
    });
    
    if (existingSubscription) {
      if (existingSubscription.active) {
        return NextResponse.json(
          { message: 'Вече сте абонирани за нашия бюлетин!' },
          { status: 200 }
        );
      } else {
        // Reactivate subscription
        await prisma.newsletterSubscription.update({
          where: { email },
          data: { active: true, subscribedAt: new Date() },
        });
        
        // Send welcome email again
        sendNewsletterWelcomeEmail(email, { email, language: 'bg' })
          .catch(err => console.error('Failed to send welcome email:', err));
        
        return NextResponse.json(
          { message: 'Успешно се абонирахте отново!' },
          { status: 200 }
        );
      }
    }
    
    // Create new subscription
    await prisma.newsletterSubscription.create({
      data: { email },
    });
    
    // Send welcome email (don't await to avoid slowing down the response)
    sendNewsletterWelcomeEmail(email, { email, language: 'bg' })
      .catch(err => console.error('Failed to send welcome email:', err));
    
    return NextResponse.json(
      { message: 'Благодарим за абонамента!' },
      { status: 201 }
    );
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Newsletter subscription error:', error);
    }
    return NextResponse.json(
      { error: 'Възникна грешка. Моля, опитайте отново.' },
      { status: 500 }
    );
  }
}

// Unsubscribe endpoint
export async function DELETE(request: NextRequest) {
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
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }
    
    const subscription = await prisma.newsletterSubscription.findUnique({
      where: { email },
    });
    
    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }
    
    await prisma.newsletterSubscription.update({
      where: { email },
      data: { active: false },
    });
    
    return NextResponse.json(
      { message: 'Успешно се отписахте от бюлетина.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    return NextResponse.json(
      { error: 'Възникна грешка. Моля, опитайте отново.' },
      { status: 500 }
    );
  }
}
