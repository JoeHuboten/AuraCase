const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Check if admin already exists
    const existing = await prisma.user.findUnique({
      where: { email: 'admin@auracase.com' }
    });

    if (existing) {
      console.log('Admin user already exists!');
      console.log('Email: admin@auracase.com');
      console.log('Password: admin123');
      return;
    }

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email: 'admin@auracase.com',
        name: 'Admin',
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@auracase.com');
    console.log('Password: admin123');
    console.log('Role:', admin.role);
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
