#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(__dirname, 'backups');
  fs.mkdirSync(backupDir, { recursive: true });
  const backupPath = path.join(backupDir, `newsletter-backup-${timestamp}.json`);

  console.log('Fetching current newsletter subscriptions...');
  const all = await prisma.newsletterSubscription.findMany();
  fs.writeFileSync(backupPath, JSON.stringify(all, null, 2), 'utf8');
  console.log(`Backed up ${all.length} subscriptions to ${backupPath}`);

  console.log('Updating all subscriptions to active = false...');
  const res = await prisma.newsletterSubscription.updateMany({
    data: { active: false },
  });

  console.log(`Updated ${res.count} subscription records.`);
  console.log('Sample (first 5) after update:');
  const sample = await prisma.newsletterSubscription.findMany({ take: 5 });
  console.log(sample);
  console.log('Done.');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
