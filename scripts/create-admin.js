const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash('123123', 10);
    
    // Check if admin already exists
    const existing = await prisma.user.findUnique({
      where: { email: 'nstoyanov639@gmail.com' }
    });

    if (existing) {
      console.log('Admin user already exists!');
      console.log('Email: nstoyanov639@gmail.com');
      console.log('Password: 123123');
      return;
    }

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email: 'nstoyanov639@gmail.com',
        name: 'Nikolay',
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    console.log('✅ Admin user created successfully!');
    console.log('Email: nstoyanov639@gmail.com');
    console.log('Password: 123123');
    console.log('Role:', admin.role);
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
