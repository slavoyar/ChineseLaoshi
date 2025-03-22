import type { Word } from '@prisma/client';
import { wordService } from '@services';
import type { Request, Response } from 'express';

type SearchWordRequest = Request<void, Word[], void, { search: string }>;

export const searchWord = async (req: SearchWordRequest, res: Response) => {
  const words = wordService.search(req.query.search);
  res.json(words);
};
