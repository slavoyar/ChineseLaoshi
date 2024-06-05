import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const updateCardCountExtension = Prisma.defineExtension({
  name: 'updateCardCount',
  model: {
    card: {
      async create() {
        // TODO: implement card count update on card create or delete
        // const cardCount = await prisma.card.count();
        // await prisma.group.update()
      }
    }
  },
})

prisma.$extends(updateCardCountExtension);

export default prisma;