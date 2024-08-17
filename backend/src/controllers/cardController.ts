import { prisma } from '@configs/prisma';
import { CreateCardRequest, CustomRequest, UpdateCardRequest, UpdateCardStats } from '@models';
import { Card } from '@prisma/client';
import { Request, Response } from 'express';

export const getAllGroupCards = async (req: Request, res: Response) => {
  const cards = await prisma.card.findMany({
    where: {
      groupId: req.params.groupId,
    },
    include: { word: true },
  });
  res.status(200).json(cards);
};

export const createCard = async (
  req: CustomRequest<Card, CreateCardRequest>,
  res: Response<Card>,
) => {
  let { wordId } = req.body;
  const { symbols, transcription, translation } = req.body;
  if (!wordId && (!translation || !transcription || !symbols)) {
    res.sendStatus(422);
    return;
  }

  if (!wordId) {
    const word = await prisma.word.create({
      data: {
        translation: translation as string,
        transcription: transcription as string,
        symbols: symbols as string,
      },
    });
    wordId = word.id;
  }

  const card = await prisma.card.create({
    data: {
      groupId: req.params.groupId,
      wordId,
    },
    include: { word: true },
  });

  await prisma.group.update({
    data: {
      wordCount: { increment: 1 },
    },
    where: {
      id: req.params.groupId,
    },
  });
  res.json(card);
};

export const updateCard = async (req: CustomRequest<Card, UpdateCardRequest>, res: Response) => {
  const card = await prisma.card.findFirst({
    where: { id: req.params.cardId },
    include: { word: true },
  });
  if (!card) {
    throw new Error(`Card with id=${req.params.cardId} not found`);
  }
  const wordCount = await prisma.card.count({ where: { wordId: card.wordId } });
  if (wordCount > 1) {
    let newWord = { ...card.word, ...req.body };
    newWord = await prisma.word.create({ data: { ...newWord, id: undefined } });
    await prisma.card.update({
      where: {
        id: card.id,
      },
      data: {
        wordId: newWord.id,
      },
    });
    res.sendStatus(200);
    return;
  }

  await prisma.word.update({
    where: { id: card.word.id },
    data: {
      ...req.body,
    },
  });
  res.sendStatus(200);
};

export const deleteCard = async (req: Request, res: Response) => {
  const card = await prisma.card.findFirst({
    where: { id: req.params.cardId },
    include: { word: true },
  });
  if (!card) {
    throw new Error(`Card with id=${req.params.cardId} not found`);
  }

  await prisma.card.delete({ where: { id: card.id } });

  const wordCount = await prisma.card.count({ where: { wordId: card.wordId } });
  if (wordCount === 0) {
    await prisma.word.delete({ where: { id: card.word.id } });
  }
  await prisma.group.update({
    data: {
      wordCount: { decrement: 1 },
    },
    where: {
      id: card.groupId,
    },
  });
  res.json();
};

export const getCardsToStudy = async (req: Request, res: Response) => {
  const { groupId } = req.params;

  const TWO_WEEKS = 14 * 24 * 60 * 60 * 1000;
  const MIN_GUESS_RATIO = 0.9; // Only cards with less ratio will be presented

  const currentDate = new Date();
  const twoWeeksOld = new Date(currentDate.getMilliseconds() - TWO_WEEKS);

  const cards = await prisma.card.findMany({
    where: {
      groupId,
      OR: [
        {
          updatedAt: {
            lt: twoWeeksOld,
          },
        },
        {
          writeRatio: {
            lt: MIN_GUESS_RATIO,
          },
        },
      ],
    },
    include: { word: true },
  });
  res.json(cards);
};

export const updateCardStats = async (req: CustomRequest<Card, UpdateCardStats>, res: Response) => {
  const { cardId } = req.params;
  let card = await prisma.card.findFirst({
    where: {
      id: cardId,
    },
  });

  if (!card) {
    res.sendStatus(404);
    return;
  }
  const { writeCount, writeRatio: ratio } = card;

  const changeValue = writeCount > 20 ? 0.05 : 0.1;
  const writeRatio = req.body.guessed
    ? Math.min(ratio + changeValue, 1)
    : Math.max(ratio - changeValue, 0);
  card = await prisma.card.update({
    where: { id: cardId },
    data: {
      writeRatio,
      writeCount: writeCount + 1,
    },
  });
  res.json(card);
};
