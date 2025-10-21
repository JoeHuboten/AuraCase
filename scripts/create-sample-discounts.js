const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createSampleCodes() {
  try {
    // Delete old codes first
    await prisma.discountCode.deleteMany({
      where: {
        code: {
          in: ['WELCOME10', 'SUMMER25', 'FLASH50']
        }
      }
    });

    // Create a few sample discount codes with future dates
    const codes = await Promise.all([
      prisma.discountCode.create({
        data: {
          code: 'WELCOME10',
          percentage: 10,
          active: true,
          expiresAt: new Date('2025-12-31'), // End of 2025
        },
      }),
      prisma.discountCode.create({
        data: {
          code: 'SUMMER25',
          percentage: 25,
          active: true,
          expiresAt: new Date('2026-03-31'), // End of Q1 2026
          maxUses: 100,
        },
      }),
      prisma.discountCode.create({
        data: {
          code: 'FLASH50',
          percentage: 50,
          active: true,
          expiresAt: new Date('2025-11-30'), // End of November 2025
          maxUses: 50,
        },
      }),
    ]);

    console.log('✅ Sample discount codes created!');
    console.log('\nCreated codes:');
    codes.forEach(code => {
      console.log(`- ${code.code}: ${code.percentage}% OFF`);
      console.log(`  Expires: ${code.expiresAt?.toLocaleDateString()}`);
      console.log(`  Max Uses: ${code.maxUses || 'Unlimited'}`);
      console.log('');
    });
  } catch (error) {
    console.error('Error creating sample codes:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSampleCodes();
