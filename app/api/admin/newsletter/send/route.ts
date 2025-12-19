import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth-utils';
import { sendEmail } from '@/lib/email';
import crypto from 'crypto';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

function generatePromoCode(prefix = 'HALKI'): string {
  return `${prefix}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
}

async function createUniqueDiscountCode(percentage: number, maxRetries = 5) {
  for (let i = 0; i < maxRetries; i++) {
    const code = generatePromoCode();
    try {
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
      const discount = await prisma.discountCode.create({
        data: {
          code,
          percentage,
          active: true,
          expiresAt,
          maxUses: 1,
        },
      });
      return discount;
    } catch (error: any) {
      if (error.code === 'P2002') {
        // Unique constraint violation, try again
        continue;
      }
      throw error;
    }
  }
  throw new Error('Failed to generate unique discount code');
}

function createEmailTemplate(data: {
  subject: string;
  message: string;
  email: string;
  promoCode?: string;
  discountPercent?: number;
  expiresAt?: Date;
}) {
  const { subject, message, email, promoCode, discountPercent, expiresAt } = data;

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body { font-family: Arial, Helvetica, sans-serif; background: #f4f6fb; margin: 0; padding: 0; }
    .container { max-width: 680px; margin: 24px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 6px 30px rgba(20,30,60,0.08); }
    .header { background: linear-gradient(90deg,#667eea,#764ba2); color: white; padding: 32px; text-align: center; }
    .content { padding: 28px; color: #1f2937; line-height: 1.6; }
    .message { font-size: 18px; margin: 16px 0; white-space: pre-wrap; }
    .code-box { display:inline-block; background:#f3f4f6; border:2px dashed #667eea; padding:16px 20px; border-radius:8px; font-weight:700; letter-spacing:1px; margin:20px 0; font-size:20px; color:#667eea; }
    .cta { display:inline-block; margin-top:18px; background:#667eea; color:#fff; padding:12px 20px; border-radius:8px; text-decoration:none; font-weight:600; }
    .footer { background:#f8fafc; padding:18px; font-size:13px; color:#6b7280; text-align:center; }
    .small { font-size:12px; color:#9ca3af; margin-top:20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin:0; font-size:28px;">AURACASE</h1>
      <div style="opacity:.95; margin-top:6px;">${subject}</div>
    </div>
    <div class="content">
      <p>Здравейте,</p>
      <div class="message">${message}</div>
      ${promoCode ? `
        <div style="text-align:center; margin:24px 0;">
          <p style="margin-bottom:12px;">Вашият персонален промо код за <strong>${discountPercent}% намаление</strong>:</p>
          <div class="code-box">${promoCode}</div>
          <p style="font-size:14px; color:#6b7280; margin-top:12px;">
            Валиден еднократно до <strong>${expiresAt ? new Date(expiresAt).toLocaleDateString('bg-BG') : ''}</strong>
          </p>
        </div>
      ` : ''}
      <div style="text-align:center;">
        <a class="cta" href="${SITE_URL}/shop">Разгледай магазина</a>
      </div>
      <p class="small">
        Ако искате да се отпишете, посетете 
        <a href="${SITE_URL}/newsletter/unsubscribe?email=${encodeURIComponent(email)}" style="color:#667eea;">
          страницата за отписване
        </a>.
      </p>
    </div>
    <div class="footer">
      AURACASE — Премиум мобилни аксесоари
    </div>
  </div>
</body>
</html>`;

  const text = `${subject}\n\n${message}${promoCode ? `\n\nВашият код: ${promoCode}\n${discountPercent}% намаление — валиден до ${expiresAt ? new Date(expiresAt).toLocaleDateString('bg-BG') : ''}` : ''}\n\nЗа отписване: ${SITE_URL}/newsletter/unsubscribe?email=${encodeURIComponent(email)}`;

  return { subject, html, text };
}

export async function POST(req: NextRequest) {
  try {
    // Verify admin authentication
    const user = await getUserFromRequest(req);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { subject, message, type = 'custom', discountPercent = 0 } = body;

    if (!subject?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'Subject and message are required' }, { status: 400 });
    }

    // Get active subscribers
    const subscribers = await prisma.newsletterSubscription.findMany({
      where: { active: true },
    });

    if (subscribers.length === 0) {
      return NextResponse.json({ error: 'No active subscribers found' }, { status: 400 });
    }

    const results: Array<{ email: string; success: boolean; error?: string }> = [];

    for (const subscriber of subscribers) {
      try {
        let emailData: { subject: string; html: string; text: string };
        let promoCode: string | undefined;

        if (type === 'promo' && discountPercent > 0) {
          // Create unique discount code
          const discount = await createUniqueDiscountCode(discountPercent);
          promoCode = discount.code;

          emailData = createEmailTemplate({
            subject,
            message,
            email: subscriber.email,
            promoCode: discount.code,
            discountPercent,
            expiresAt: discount.expiresAt || undefined,
          });
        } else {
          emailData = createEmailTemplate({
            subject,
            message,
            email: subscriber.email,
          });
        }

        const result = await sendEmail(subscriber.email, emailData);

        results.push({
          email: subscriber.email,
          success: result.success,
          error: result.success ? undefined : String(result.error),
        });
      } catch (error) {
        console.error(`Failed to send to ${subscriber.email}:`, error);
        results.push({
          email: subscriber.email,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    const sent = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    return NextResponse.json({
      success: true,
      sent,
      failed,
      message: `Изпратено до ${sent} абонати${failed > 0 ? `, ${failed} неуспешни` : ''}`,
      details: results,
    });
  } catch (error) {
    console.error('Error sending newsletter:', error);
    return NextResponse.json(
      { error: 'Failed to send newsletter' },
      { status: 500 }
    );
  }
}
