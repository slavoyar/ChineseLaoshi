import { Request, Response } from 'express';

import { getPrisma } from '../configs/prisma/prismaInjection';

const prisma = getPrisma();
export const searchWord = async (req: Request, res: Response) => {
  const { search } = req.query;

  if (typeof search !== 'string') {
    res.status(415);
    return;
  }

  const words = await prisma.word.findMany({
    where: {
      OR: [
        { translation: { contains: search } },
        { translation: { contains: search } },
        { symbols: { contains: search } },
      ],
    },
  });

  res.json(words);
};
