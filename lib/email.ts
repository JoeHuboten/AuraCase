import { Resend } from 'resend';
import nodemailer from 'nodemailer';

// Email provider configuration
const EMAIL_PROVIDER = process.env.EMAIL_PROVIDER || 'nodemailer'; // 'resend' or 'nodemailer'

// Initialize Resend
const RESEND_CONFIGURED = process.env.RESEND_API_KEY && 
  process.env.RESEND_API_KEY !== 'your_resend_api_key' &&
  process.env.RESEND_API_KEY.startsWith('re_');

const resend = RESEND_CONFIGURED ? new Resend(process.env.RESEND_API_KEY!) : null;

// Initialize Nodemailer (works with Gmail, Outlook, etc.)
const NODEMAILER_CONFIGURED = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;

const transporter = NODEMAILER_CONFIGURED ? nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
}) : null;

const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@auracase.bg';
const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

// Email templates
export const emailTemplates = {
  // Order Confirmation Email
  orderConfirmation: (data: {
    orderId: string;
    customerName: string;
    total: number;
    items: Array<{ name: string; quantity: number; price: number }>;
    trackingNumber?: string;
    language?: 'bg' | 'en';
  }): EmailTemplate => {
    const isBulgarian = data.language === 'bg';
    const currency = 'лв';
    
    const subject = isBulgarian 
      ? `Потвърждение на поръчка #${data.orderId}` 
      : `Order Confirmation #${data.orderId}`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 20px auto; background: #fff; border-radius: 8px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff; padding: 30px; text-align: center; }
    .content { padding: 30px; }
    .order-details { background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .item { border-bottom: 1px solid #e9ecef; padding: 15px 0; }
    .item:last-child { border-bottom: none; }
    .total { font-size: 20px; font-weight: bold; color: #667eea; margin-top: 20px; text-align: right; }
    .button { display: inline-block; background: #667eea; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${isBulgarian ? '✅ Поръчката е потвърдена!' : '✅ Order Confirmed!'}</h1>
      <p>${isBulgarian ? 'Благодарим Ви за поръчката!' : 'Thank you for your order!'}</p>
    </div>
    
    <div class="content">
      <p>${isBulgarian ? 'Здравейте' : 'Hello'} ${data.customerName},</p>
      
      <p>${isBulgarian 
        ? 'Вашата поръчка беше успешно приета и се обработва.' 
        : 'Your order has been successfully received and is being processed.'}</p>
      
      <div class="order-details">
        <h2>${isBulgarian ? 'Детайли на поръчката' : 'Order Details'}</h2>
        <p><strong>${isBulgarian ? 'Номер на поръчка:' : 'Order Number:'}</strong> #${data.orderId}</p>
        ${data.trackingNumber ? `<p><strong>${isBulgarian ? 'Номер за проследяване:' : 'Tracking Number:'}</strong> ${data.trackingNumber}</p>` : ''}
        
        <h3 style="margin-top: 20px;">${isBulgarian ? 'Продукти' : 'Items'}</h3>
        ${data.items.map(item => `
          <div class="item">
            <strong>${item.name}</strong><br>
            ${isBulgarian ? 'Количество:' : 'Quantity:'} ${item.quantity} × ${item.price.toFixed(2)} ${currency}
          </div>
        `).join('')}
        
        <div class="total">
          ${isBulgarian ? 'Обща сума:' : 'Total:'} ${data.total.toFixed(2)} ${currency}
        </div>
      </div>
      
      <center>
        <a href="${SITE_URL}/orders" class="button">
          ${isBulgarian ? 'Виж поръчката' : 'View Order'}
        </a>
      </center>
      
      <p style="margin-top: 30px; color: #666; font-size: 14px;">
        ${isBulgarian 
          ? 'Ще получите ново имейл уведомление, когато поръчката Ви бъде изпратена.' 
          : 'You will receive another email notification when your order is shipped.'}
      </p>
    </div>
    
    <div class="footer">
      <p>AURACASE - ${isBulgarian ? 'Премиум мобилни аксесоари' : 'Premium Mobile Accessories'}</p>
      <p><a href="${SITE_URL}" style="color: #667eea;">www.auracase.bg</a></p>
    </div>
  </div>
</body>
</html>
    `;

    const text = `
${isBulgarian ? 'Здравейте' : 'Hello'} ${data.customerName},

${isBulgarian ? 'Поръчката Ви е потвърдена!' : 'Your order has been confirmed!'}

${isBulgarian ? 'Номер на поръчка:' : 'Order Number:'} #${data.orderId}
${data.trackingNumber ? `${isBulgarian ? 'Номер за проследяване:' : 'Tracking Number:'} ${data.trackingNumber}` : ''}

${isBulgarian ? 'Продукти:' : 'Items:'}
${data.items.map(item => `- ${item.name} (${item.quantity} × ${item.price.toFixed(2)} ${currency})`).join('\n')}

${isBulgarian ? 'Обща сума:' : 'Total:'} ${data.total.toFixed(2)} ${currency}

${isBulgarian ? 'Виж поръчката:' : 'View your order:'} ${SITE_URL}/orders

${isBulgarian ? 'Благодарим Ви!' : 'Thank you!'}
AURACASE
    `.trim();

    return { subject, html, text };
  },

  // Order Status Update Email
  orderStatusUpdate: (data: {
    orderId: string;
    customerName: string;
    status: string;
    trackingNumber?: string;
    courierService?: string;
    estimatedDelivery?: string;
    language?: 'bg' | 'en';
  }): EmailTemplate => {
    const isBulgarian = data.language === 'bg';
    
    const statusLabels: Record<string, { bg: string; en: string; emoji: string }> = {
      PENDING: { bg: 'В очакване', en: 'Pending', emoji: '⏳' },
      PROCESSING: { bg: 'В обработка', en: 'Processing', emoji: '📦' },
      SHIPPED: { bg: 'Изпратена', en: 'Shipped', emoji: '🚚' },
      DELIVERED: { bg: 'Доставена', en: 'Delivered', emoji: '✅' },
      CANCELLED: { bg: 'Отказана', en: 'Cancelled', emoji: '❌' },
    };

    const statusInfo = statusLabels[data.status] || statusLabels.PENDING;
    const statusText = isBulgarian ? statusInfo.bg : statusInfo.en;
    
    const subject = isBulgarian 
      ? `${statusInfo.emoji} Актуализация на поръчка #${data.orderId}` 
      : `${statusInfo.emoji} Order Update #${data.orderId}`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 20px auto; background: #fff; border-radius: 8px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff; padding: 30px; text-align: center; }
    .content { padding: 30px; }
    .status-box { background: #f0f4ff; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 4px; }
    .button { display: inline-block; background: #667eea; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${statusInfo.emoji} ${isBulgarian ? 'Актуализация на поръчката' : 'Order Update'}</h1>
    </div>
    
    <div class="content">
      <p>${isBulgarian ? 'Здравейте' : 'Hello'} ${data.customerName},</p>
      
      <p>${isBulgarian ? 'Има нова актуализация за поръчка #' : 'There is a new update for order #'}${data.orderId}</p>
      
      <div class="status-box">
        <h2 style="margin-top: 0;">${isBulgarian ? 'Нов статус:' : 'New Status:'} ${statusText}</h2>
        ${data.trackingNumber ? `<p><strong>${isBulgarian ? 'Номер за проследяване:' : 'Tracking Number:'}</strong> ${data.trackingNumber}</p>` : ''}
        ${data.courierService ? `<p><strong>${isBulgarian ? 'Куриер:' : 'Courier:'}</strong> ${data.courierService}</p>` : ''}
        ${data.estimatedDelivery ? `<p><strong>${isBulgarian ? 'Очаквана доставка:' : 'Estimated Delivery:'}</strong> ${new Date(data.estimatedDelivery).toLocaleDateString(isBulgarian ? 'bg-BG' : 'en-US')}</p>` : ''}
      </div>
      
      <center>
        <a href="${SITE_URL}/orders/track?trackingNumber=${data.trackingNumber || data.orderId}" class="button">
          ${isBulgarian ? 'Проследи поръчката' : 'Track Order'}
        </a>
      </center>
    </div>
    
    <div class="footer">
      <p>AURACASE - ${isBulgarian ? 'Премиум мобилни аксесоари' : 'Premium Mobile Accessories'}</p>
      <p><a href="${SITE_URL}" style="color: #667eea;">www.auracase.bg</a></p>
    </div>
  </div>
</body>
</html>
    `;

    const text = `
${isBulgarian ? 'Здравейте' : 'Hello'} ${data.customerName},

${isBulgarian ? 'Актуализация на поръчка #' : 'Order update #'}${data.orderId}

${isBulgarian ? 'Нов статус:' : 'New Status:'} ${statusText}
${data.trackingNumber ? `${isBulgarian ? 'Номер за проследяване:' : 'Tracking Number:'} ${data.trackingNumber}` : ''}
${data.courierService ? `${isBulgarian ? 'Куриер:' : 'Courier:'} ${data.courierService}` : ''}

${isBulgarian ? 'Проследи поръчката:' : 'Track your order:'} ${SITE_URL}/orders/track?trackingNumber=${data.trackingNumber || data.orderId}

AURACASE
    `.trim();

    return { subject, html, text };
  },

  // Password Reset Email
  passwordReset: (data: {
    name: string;
    resetToken: string;
    language?: 'bg' | 'en';
  }): EmailTemplate => {
    const isBulgarian = data.language === 'bg';
    const resetUrl = `${SITE_URL}/auth/reset-password?token=${data.resetToken}`;
    
    const subject = isBulgarian 
      ? 'Нулиране на парола - AURACASE' 
      : 'Reset Your Password - AURACASE';

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 20px auto; background: #fff; border-radius: 8px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff; padding: 30px; text-align: center; }
    .content { padding: 30px; }
    .button { display: inline-block; background: #667eea; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px; }
    .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔐 ${isBulgarian ? 'Нулиране на парола' : 'Reset Password'}</h1>
    </div>
    
    <div class="content">
      <p>${isBulgarian ? 'Здравейте' : 'Hello'} ${data.name},</p>
      
      <p>${isBulgarian 
        ? 'Получихме заявка за нулиране на паролата за Вашия акаунт в AURACASE.' 
        : 'We received a request to reset the password for your AURACASE account.'}</p>
      
      <center>
        <a href="${resetUrl}" class="button">
          ${isBulgarian ? 'Нулирай паролата' : 'Reset Password'}
        </a>
      </center>
      
      <p style="font-size: 14px; color: #666;">
        ${isBulgarian ? 'Или копирайте този линк:' : 'Or copy this link:'}<br>
        <a href="${resetUrl}" style="word-break: break-all; color: #667eea;">${resetUrl}</a>
      </p>
      
      <div class="warning">
        <strong>⚠️ ${isBulgarian ? 'Важно:' : 'Important:'}</strong><br>
        ${isBulgarian 
          ? 'Този линк е валиден само 1 час. Ако не сте заявили тази промяна, моля игнорирайте този имейл.' 
          : 'This link is valid for 1 hour only. If you did not request this change, please ignore this email.'}
      </div>
    </div>
    
    <div class="footer">
      <p>AURACASE - ${isBulgarian ? 'Премиум мобилни аксесоари' : 'Premium Mobile Accessories'}</p>
      <p><a href="${SITE_URL}" style="color: #667eea;">www.auracase.bg</a></p>
    </div>
  </div>
</body>
</html>
    `;

    const text = `
${isBulgarian ? 'Здравейте' : 'Hello'} ${data.name},

${isBulgarian 
  ? 'Получихме заявка за нулиране на паролата за Вашия акаунт.' 
  : 'We received a request to reset your password.'}

${isBulgarian ? 'Натиснете тук за да нулирате паролата:' : 'Click here to reset your password:'}
${resetUrl}

${isBulgarian 
  ? 'Този линк е валиден само 1 час.' 
  : 'This link is valid for 1 hour only.'}

AURACASE
    `.trim();

    return { subject, html, text };
  },

  // Discount Code Email
  discountCode: (data: {
    name: string;
    code: string;
    percentage: number;
    expiresAt?: string;
    language?: 'bg' | 'en';
  }): EmailTemplate => {
    const isBulgarian = data.language === 'bg';
    
    const subject = isBulgarian 
      ? `🎉 Вашият ${data.percentage}% код за отстъпка` 
      : `🎉 Your ${data.percentage}% Discount Code`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 20px auto; background: #fff; border-radius: 8px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff; padding: 30px; text-align: center; }
    .content { padding: 30px; }
    .code-box { background: #f0f4ff; border: 2px dashed #667eea; padding: 30px; margin: 20px 0; border-radius: 8px; text-align: center; }
    .code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 2px; }
    .button { display: inline-block; background: #667eea; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 ${isBulgarian ? 'Специална отстъпка за Вас!' : 'Special Discount for You!'}</h1>
    </div>
    
    <div class="content">
      <p>${isBulgarian ? 'Здравейте' : 'Hello'} ${data.name},</p>
      
      <p>${isBulgarian 
        ? `Радваме се да Ви предложим <strong>${data.percentage}% отстъпка</strong> за следващата Ви поръчка!` 
        : `We're excited to offer you a <strong>${data.percentage}% discount</strong> on your next purchase!`}</p>
      
      <div class="code-box">
        <p style="margin: 0 0 10px 0; color: #666;">${isBulgarian ? 'Вашият код:' : 'Your code:'}</p>
        <div class="code">${data.code}</div>
      </div>
      
      ${data.expiresAt ? `
        <p style="text-align: center; color: #666;">
          ⏰ ${isBulgarian ? 'Валиден до:' : 'Valid until:'} ${new Date(data.expiresAt).toLocaleDateString(isBulgarian ? 'bg-BG' : 'en-US')}
        </p>
      ` : ''}
      
      <center>
        <a href="${SITE_URL}/shop" class="button">
          ${isBulgarian ? 'Пазарувай сега' : 'Shop Now'}
        </a>
      </center>
    </div>
    
    <div class="footer">
      <p>AURACASE - ${isBulgarian ? 'Премиум мобилни аксесоари' : 'Premium Mobile Accessories'}</p>
      <p><a href="${SITE_URL}" style="color: #667eea;">www.auracase.bg</a></p>
    </div>
  </div>
</body>
</html>
    `;

    const text = `
${isBulgarian ? 'Здравейте' : 'Hello'} ${data.name},

🎉 ${isBulgarian ? 'Специална отстъпка!' : 'Special Discount!'}

${isBulgarian ? 'Вашият код за' : 'Your'} ${data.percentage}% ${isBulgarian ? 'отстъпка:' : 'discount code:'}

${data.code}

${data.expiresAt ? `${isBulgarian ? 'Валиден до:' : 'Valid until:'} ${new Date(data.expiresAt).toLocaleDateString(isBulgarian ? 'bg-BG' : 'en-US')}` : ''}

${isBulgarian ? 'Пазарувай сега:' : 'Shop now:'} ${SITE_URL}/shop

AURACASE
    `.trim();

    return { subject, html, text };
  },
};

// Send email function
export async function sendEmail(to: string, template: EmailTemplate) {
  // Try Nodemailer first if configured
  if (EMAIL_PROVIDER === 'nodemailer' && transporter && NODEMAILER_CONFIGURED) {
    try {
      const result = await transporter.sendMail({
        from: FROM_EMAIL,
        to,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });

      console.log('✅ Email sent via Nodemailer:', result.messageId);
      return { success: true, data: result };
    } catch (error) {
      console.error('❌ Error sending email via Nodemailer:', error);
      return { success: false, error };
    }
  }

  // Fallback to Resend
  if (resend && RESEND_CONFIGURED) {
    try {
      const result = await resend.emails.send({
        from: FROM_EMAIL,
        to,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });

      console.log('✅ Email sent via Resend:', result);
      return { success: true, data: result };
    } catch (error) {
      console.error('❌ Error sending email via Resend:', error);
      return { success: false, error };
    }
  }

  // No email service configured
  console.warn('⚠️ No email service configured. Email would have been sent to:', to);
  console.log('Subject:', template.subject);
  console.log('Preview URL would be available in production');
  return { success: false, error: 'Email service not configured' };
}

// Helper functions for common email scenarios
export async function sendOrderConfirmationEmail(
  email: string,
  orderData: Parameters<typeof emailTemplates.orderConfirmation>[0]
) {
  const template = emailTemplates.orderConfirmation(orderData);
  return sendEmail(email, template);
}

export async function sendOrderStatusUpdateEmail(
  email: string,
  statusData: Parameters<typeof emailTemplates.orderStatusUpdate>[0]
) {
  const template = emailTemplates.orderStatusUpdate(statusData);
  return sendEmail(email, template);
}

export async function sendPasswordResetEmail(
  email: string,
  resetData: Parameters<typeof emailTemplates.passwordReset>[0]
) {
  const template = emailTemplates.passwordReset(resetData);
  return sendEmail(email, template);
}

export async function sendDiscountCodeEmail(
  email: string,
  discountData: Parameters<typeof emailTemplates.discountCode>[0]
) {
  const template = emailTemplates.discountCode(discountData);
  return sendEmail(email, template);
}
