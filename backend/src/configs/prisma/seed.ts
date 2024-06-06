import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';


const prisma = new PrismaClient();

async function main() {
  // Create users
  const users = [];
  const hashedPassword = await bcrypt.hash('1234', 10);
  for (let i = 0; i < 10; i++) {
    const user = await prisma.user.create({
      data: {
        id: faker.string.uuid(),
        username: faker.internet.userName(),
        password: hashedPassword,
      },
    });
    users.push(user);
  }

  // Create groups
  const groups = [];
  for (let i = 0; i < 5; i++) {
    const group = await prisma.group.create({
      data: {
        id: faker.string.uuid(),
        name: faker.company.name(),
        userId: users[faker.number.int({ min: 0, max: users.length - 1 })].id,
        wordCount: 0, // Initialize with 0, will update later
      },
    });
    groups.push(group);
  }

  // Create words
  const words = [];
  for (let i = 0; i < 50; i++) {
    const word = await prisma.word.create({
      data: {
        id: faker.string.uuid(),
        transcrition: faker.lorem.word(),
        translation: faker.lorem.word(),
        symbols: faker.lorem.word(),
      },
    });
    words.push(word);
  }

  // Create cards and associate them with users, groups, and words
  for (let i = 0; i < 100; i++) {
    const card = await prisma.card.create({
      data: {
        id: faker.string.uuid(),
        groupId: groups[faker.number.int({ min: 0, max: groups.length - 1 })].id,
        wordId: words[faker.number.int({ min: 0, max: words.length - 1 })].id,
        showCount: faker.number.int({ min: 1, max: 10 }),
        writeCount: faker.number.int({ min: 1, max: 10 }),
        guessRatio: faker.number.float({ min: 0, max: 1, precision: 0.01 }),
        writeRatio: faker.number.float({ min: 0, max: 1, precision: 0.01 }),
        updatedAt: faker.date.recent(),
      },
    });

    // Update group word count
    await prisma.group.update({
      where: { id: card.groupId },
      data: { wordCount: { increment: 1 } },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });