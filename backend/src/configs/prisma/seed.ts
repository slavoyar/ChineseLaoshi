import { PrismaClient } from '@prisma/client';
import type { CreateWordDto } from '@shared/schemas';

const prisma = new PrismaClient();

const numbers = [
  { transcription: 'yī', translation: 'one', symbols: '一' },
  { transcription: 'èr', translation: 'two', symbols: '二' },
  { transcription: 'sān', translation: 'three', symbols: '三' },
  { transcription: 'sì', translation: 'four', symbols: '四' },
  { transcription: 'wǔ', translation: 'five', symbols: '五' },
  { transcription: 'liù', translation: 'six', symbols: '六' },
  { transcription: 'qī', translation: 'seven', symbols: '七' },
  { transcription: 'bā', translation: 'eight', symbols: '八' },
  { transcription: 'jiǔ', translation: 'nine', symbols: '九' },
  { transcription: 'shí', translation: 'ten', symbols: '十' },
];

const pronouns = [
  { transcription: 'wǒ', translation: 'I', symbols: '我' },
  { transcription: 'nǐ', translation: 'you', symbols: '你' },
  { transcription: 'tā', translation: 'he', symbols: '他' },
  { transcription: 'tā', translation: 'she', symbols: '她' },
  { transcription: 'wǒmen', translation: 'we', symbols: '我们' },
  { transcription: 'nǐmen', translation: 'you (plural)', symbols: '你们' },
  { transcription: 'tāmen', translation: 'they', symbols: '他们' },
];

const createGroup = async (user: Express.User, name: string, wordsData: CreateWordDto[]) => {
  const group = await prisma.group.upsert({
    where: {
      name_userId: {
        userId: user.id,
        name,
      },
    },
    update: {},
    create: {
      name,
      userId: user.id,
      wordCount: wordsData.length,
    },
    include: {
      cards: true,
    },
  });

  let words = [];
  if (group.cards.length) {
    await prisma.card.deleteMany({
      where: {
        groupId: group.id,
      },
    });
    words = await prisma.word.findMany({
      where: {
        id: {
          in: group.cards.map((card) => card.wordId),
        },
      },
    });
  } else {
    words = await prisma.word.createManyAndReturn({
      data: wordsData,
    });
  }

  await prisma.card.createMany({
    data: words.map((word) => ({
      wordId: word.id,
      groupId: group.id,
    })),
  });
};

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'demouser@example.com' },
    update: {},
    create: {
      email: 'demouser@example.com',
      username: 'DemoUser',
      password: '',
    },
  });

  await createGroup(user, 'Numbers', numbers);
  await createGroup(user, 'Pronouns', pronouns);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
