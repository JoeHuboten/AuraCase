const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

async function testPasswordReset() {
  try {
    const email = 'nstoyanov639@gmail.com';
    
    console.log('\n🔐 Password Reset Test Script\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log('❌ User not found with email:', email);
      return;
    }

    console.log('✅ User found:', user.name || 'No name');
    console.log('📧 Email:', user.email);
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Delete any existing tokens for this user
    await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    });

    // Create new token
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: hashedToken,
        expires,
      },
    });

    console.log('\n✅ Reset token created!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📋 Copy this URL to reset password:\n');
    console.log(`http://localhost:3000/auth/reset-password?token=${resetToken}`);
    console.log('\n⏰ Token expires in 1 hour');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testPasswordReset();
