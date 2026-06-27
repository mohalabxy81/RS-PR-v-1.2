const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email: 'admin@reis.com' } });
    if (existing) {
      console.log('User already exists');
      return;
    }

    const passwordHash = await bcrypt.hash('Password123!', 10);
    const tenant = await prisma.tenant.create({
      data: {
        name: 'Reis Inc',
        slug: 'reis-inc-' + Date.now(),
        users: {
          create: {
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@reis.com',
            passwordHash,
            status: 'ACTIVE',
          }
        }
      },
      include: {
        users: true
      }
    });
    console.log('Successfully created tenant and user!', tenant.users[0].email);
  } catch (err) {
    console.error('Error seeding:', err);
  }
}

main().finally(() => prisma.$disconnect());
