import { Card } from '@prisma/client';
import { Request, Response } from 'express';

import { getPrisma } from '../configs/prisma/prismaInjection';
import { CreateCardRequest, CustomRequest, UpdateCardRequest } from '../models';

const prisma = getPrisma();

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
    res.status(200);
    return;
  }

  await prisma.word.update({
    where: { id: card.word.id },
    data: {
      ...req.body,
    },
  });
  res.status(200);
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
