import { CustomError } from '@configs/errors';
import { cardService } from '@services/cardService';
import type {
  CardDto,
  CreateCardDto,
  GetWriteCardDto,
  UpdateCardStatsDto,
  UpdateCardWordDto,
} from '@shared/schemas';
import typia from 'typia';

import { createRouter, Ok, type Params } from './createRouter';

const { router, createRoute } = createRouter('/cards');

createRoute<{ groupId: string }>('get', '/:groupId', async (req) => {
  const { groupId } = req.params;
  const cards = await cardService.getCardsByGroupId(groupId);
  return Ok(cards);
});

createRoute<Params, GetWriteCardDto, CardDto[]>('get', '/study/write', async (req) => {
  const cards = await cardService.getWriteCards(req.body, req.user.id);
  return Ok(cards);
});

createRoute<{ groupId: string }, CreateCardDto>('post', '/:groupId', async (req) => {
  const { groupId } = req.params;

  if (typia.is<CreateCardDto['word']>(req.body.word) === false) {
    throw new CustomError('validationError');
  }

  const card = await cardService.createCard({ ...req.body, groupId });
  return Ok(card);
});

createRoute<Params, UpdateCardStatsDto>('post', '/', async (req) => {
  await cardService.updateCardStats(req.body);
  return Ok();
});

createRoute<Params, UpdateCardWordDto>('put', '/', async (req) => {
  await cardService.updateCard(req.body);
  return Ok();
});

createRoute<{ cardId: string }>('delete', '/:cardId', async (req) => {
  const { cardId } = req.params;
  await cardService.deleteCard(cardId);
  return Ok();
});

export default router;
