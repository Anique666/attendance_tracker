const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Predefined classes
  const classes = [
    { name: 'Class A' },
    { name: 'Class B' },
    { name: 'Class C' },
  ];

  for (const cls of classes) {
    // Upsert: avoid duplicates on rerun
    await prisma.class.upsert({
      where: { name: cls.name },
      update: {},
      create: {
        name: cls.name,
      },
    });
  }

  console.log('Seeded classes successfully.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
