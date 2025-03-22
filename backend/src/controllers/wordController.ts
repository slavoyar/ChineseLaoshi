import type { Word } from '@prisma/client';
import { wordService } from '@services';
import type { Request, Response } from 'express';

export const searchWord = async (req: Request<void, Word[], void, { search: string }>, res: Response) => {
  const words = wordService.search(req.query.search);
  res.json(words);
};
