import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      username: 'seed',
      name: 'Seed User',
      passwordHash: '$2a$10$Wg6fqI9i9g0wZ5m3eQZkOeYt7mQk2e9P8G6mJmVf5N8qgY1lgF/3e' // 'p12345' (adjust to your hash function)
    }
  });
}

main().finally(async () => prisma.$disconnect());
