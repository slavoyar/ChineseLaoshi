import { CustomError } from '@configs/errors';
import { CardDto, CreateCardDto, GetWriteCardDto, UpdateCardDto, UpdateCardStatsDto } from '@dtos';
import { Card } from '@prisma/client';
import { cardService } from '@services';
import { NextFunction, Request, Response } from 'express';

export const getAllGroupCards = async (req: Request, res: Response) => {
  const { groupId } = req.params;
  const cards = await cardService.getCardsByGroupId(groupId);
  res.status(200).json(cards);
};

export const createCard = async (
  req: Request<{ groupId: string }, Card, CreateCardDto>,
  res: Response<Card>,
  next: NextFunction,
) => {
  const { groupId } = req.params;
  const { id: wordId, symbols, transcription, translation } = req.body;
  if (!wordId && (!translation || !transcription || !symbols)) {
    return next(new CustomError('entityCreateError'));
  }

  try {
    const card = await cardService.createCard({
      id: wordId,
      symbols,
      translation,
      transcription,
      groupId,
    });

    res.json(card);
  } catch (error) {
    next(error);
  }
};

export const updateCard = async (
  req: Request<void, void, UpdateCardDto>,
  res: Response,
  next: NextFunction,
) => {
  try {
    await cardService.updateCard(req.body);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

export const deleteCard = async (
  req: Request<{ cardId: string }>,
  res: Response,
  next: NextFunction,
) => {
  const { cardId } = req.params;
  try {
    await cardService.deleteCard(cardId);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

export const updateCardStats = async (
  req: Request<void, void, UpdateCardStatsDto>,
  res: Response,
) => {
  await cardService.updateCardStats(req.body);
  res.sendStatus(200);
};

export const getWriteCards = async (req: Request<GetWriteCardDto, CardDto[]>, res: Response) => {
  const cards = await cardService.getWriteCards(req.params, req.user.id);
  res.json(cards);
};
