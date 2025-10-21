const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updatePayPalOrders() {
  try {
    // Update all PENDING PayPal orders to PROCESSING
    const result = await prisma.order.updateMany({
      where: {
        status: 'PENDING',
        paymentType: 'PAYPAL',
        paymentId: { not: null } // Only update orders that have been paid
      },
      data: {
        status: 'PROCESSING'
      }
    });

    console.log(`✅ Updated ${result.count} PayPal orders from PENDING to PROCESSING`);

    // Get all updated orders
    const orders = await prisma.order.findMany({
      where: {
        paymentType: 'PAYPAL'
      },
      select: {
        id: true,
        status: true,
        paymentId: true,
        total: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('\n📦 PayPal Orders:');
    orders.forEach(order => {
      console.log(`  - Order ${order.id.slice(-8)}: ${order.status} - $${order.total.toFixed(2)} (PayPal ID: ${order.paymentId})`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updatePayPalOrders();
