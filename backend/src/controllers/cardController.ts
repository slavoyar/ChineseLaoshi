import { CustomError } from '@configs/errors';
import { cardService } from '@services';
import type {
  CardDto,
  CreateCardDto,
  GetWriteCardDto,
  Id,
  UpdateCardStatsDto,
  UpdateCardWordDto,
} from '@shared/types';
import type { NextFunction, Request, Response } from 'express';
import typia from 'typia';

type CreateCardRequest = Request<{ groupId: Id }, CardDto, CreateCardDto>;
type UpdateCardRequest = Request<void, void, UpdateCardWordDto>;
type UpdateCardStatsRequest = Request<void, void, UpdateCardStatsDto>;
type GetWriteCardsRequest = Request<void, CardDto[], void, GetWriteCardDto>;

export const getAllGroupCards = async (req: Request, res: Response) => {
  const { groupId } = req.params;
  const cards = await cardService.getCardsByGroupId(groupId);
  res.status(200).json(cards);
};

export const createCard = async (req: CreateCardRequest, res: Response<CardDto>, next: NextFunction) => {
  const { groupId } = req.params;

  if (typia.is<CreateCardDto['word']>(req.body.word) === false) {
    return next(new CustomError('validationError'));
  }

  const card = await cardService.createCard({ ...req.body, groupId });
  res.json(card);
};

export const updateCard = async (req: UpdateCardRequest, res: Response) => {
  typia.assertGuard<UpdateCardWordDto>(req.body);
  await cardService.updateCard(req.body);
  res.sendStatus(200);
};

export const deleteCard = async (req: Request<{ cardId: string }>, res: Response) => {
  const { cardId } = req.params;
  await cardService.deleteCard(cardId);
  res.sendStatus(200);
};

export const updateCardStats = async (req: UpdateCardStatsRequest, res: Response) => {
  await cardService.updateCardStats(req.body);
  res.sendStatus(200);
};

export const getWriteCards = async (req: GetWriteCardsRequest, res: Response) => {
  const cards = await cardService.getWriteCards(req.query, req.user.id);
  res.json(cards);
};
