import { cardService } from '@services';
import {
  type CardDto,
  type CreateCardDto,
  CreateCardSchema,
  type GetWriteCardDto,
  GetWriteCardSchema,
  type UpdateCardStatsDto,
  UpdateCardStatsSchema,
  type UpdateCardWordDto,
  UpdateCardWordSchema,
} from '@shared/schemas';

import { createRouter, Ok, type Params } from './createRouter';

const { router, createRoute } = createRouter('/cards');

createRoute<{ groupId: string }>(
  async (req) => {
    const { groupId } = req.params;
    const cards = await cardService.getCardsByGroupId(groupId);
    return Ok(cards);
  },
  {
    endpoint: '/:groupId',
  }
);

createRoute<Params, GetWriteCardDto, CardDto[]>(
  async (req) => {
    const cards = await cardService.getWriteCards(req.body, req.user.id);
    return Ok(cards);
  },
  {
    method: 'post',
    endpoint: '/study/write',
    schema: GetWriteCardSchema,
  }
);

createRoute<{ groupId: string }, CreateCardDto>(
  async (req) => {
    const { groupId } = req.params;

    const card = await cardService.createCard({ ...req.body, groupId });
    return Ok(card);
  },
  {
    method: 'post',
    endpoint: '/:groupId',
    schema: CreateCardSchema,
  }
);

createRoute<Params, UpdateCardStatsDto>(
  async (req) => {
    await cardService.updateCardStats(req.body);
    return Ok();
  },
  { method: 'post', schema: UpdateCardStatsSchema }
);

createRoute<Params, UpdateCardWordDto>(
  async (req) => {
    await cardService.updateCard(req.body);
    return Ok();
  },
  { method: 'put', schema: UpdateCardWordSchema }
);

createRoute<{ cardId: string }>(
  async (req) => {
    const { cardId } = req.params;
    await cardService.deleteCard(cardId);
    return Ok();
  },
  {
    method: 'delete',
    endpoint: '/:cardId',
  }
);

export default router;
