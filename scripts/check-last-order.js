const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkLastOrder() {
  try {
    const lastOrder = await prisma.order.findFirst({
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            email: true,
            name: true,
          },
        },
        statusHistory: true,
      },
    });

    if (!lastOrder) {
      console.log('❌ No orders found in database');
      return;
    }

    console.log('\n✅ Latest Order Found:\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Order ID: ${lastOrder.id}`);
    console.log(`Customer: ${lastOrder.user.name || 'Guest'} (${lastOrder.user.email})`);
    console.log(`Status: ${lastOrder.status}`);
    console.log(`Payment Type: ${lastOrder.paymentType}`);
    console.log(`Payment ID: ${lastOrder.paymentId || 'N/A'}`);
    console.log(`Tracking Number: ${lastOrder.trackingNumber || 'N/A'}`);
    console.log(`Created: ${lastOrder.createdAt.toLocaleString()}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    console.log('\n💰 Order Details:');
    console.log(`Subtotal: $${lastOrder.subtotal.toFixed(2)}`);
    console.log(`Discount: -$${lastOrder.discount.toFixed(2)}`);
    console.log(`Delivery: $${lastOrder.deliveryFee.toFixed(2)}`);
    console.log(`Total: $${lastOrder.total.toFixed(2)}`);
    
    console.log('\n📦 Items:');
    lastOrder.items.forEach((item, i) => {
      console.log(`  ${i + 1}. ${item.product.name}`);
      console.log(`     Qty: ${item.quantity} × $${item.price.toFixed(2)} = $${(item.quantity * item.price).toFixed(2)}`);
    });

    if (lastOrder.statusHistory.length > 0) {
      console.log('\n📋 Status History:');
      lastOrder.statusHistory.forEach((history) => {
        console.log(`  - ${history.status}: ${history.notes || 'No notes'}`);
        console.log(`    ${new Date(history.createdAt).toLocaleString()}`);
      });
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkLastOrder();
