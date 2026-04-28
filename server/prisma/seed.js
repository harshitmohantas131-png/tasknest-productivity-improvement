const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.task.deleteMany({});

  // Seed sample tasks — including some marked as important
  await prisma.task.createMany({
    data: [
      { title: 'Finish assignment', completed: false, isImportant: true },
      { title: 'Review lecture notes', completed: true,  isImportant: false },
      { title: 'Complete coding challenge', completed: false, isImportant: true },
      { title: 'Reply to emails', completed: true,  isImportant: false },
    ],
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
