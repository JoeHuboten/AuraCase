const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function deleteOrders() {
  try {
    console.log('Starting order deletion process...\n');

    // First, get count of existing orders
    const orderCount = await prisma.order.count();
    console.log(`Found ${orderCount} orders in the database.`);

    if (orderCount === 0) {
      console.log('No orders to delete.');
      return;
    }

    // Delete order status history first (due to foreign key constraints)
    const deletedStatusHistory = await prisma.orderStatusHistory.deleteMany({});
    console.log(`Deleted ${deletedStatusHistory.count} order status history records.`);

    // Delete order items
    const deletedItems = await prisma.orderItem.deleteMany({});
    console.log(`Deleted ${deletedItems.count} order items.`);

    // Delete orders
    const deletedOrders = await prisma.order.deleteMany({});
    console.log(`Deleted ${deletedOrders.count} orders.`);

    console.log('\n✅ All orders successfully deleted from the database!');
  } catch (error) {
    console.error('Error deleting orders:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

deleteOrders()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
